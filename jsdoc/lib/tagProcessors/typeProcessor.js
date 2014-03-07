// Much of this code was inspired by or simply copied from the JSDOC project.
// See https://github.com/jsdoc3/jsdoc/blob/c9b0237c12144cfa48abe5fccd73ba2a1d46553a/lib/jsdoc/tag/type.js

var catharsis = require('catharsis');
var TYPE_EXPRESSION_START = /\{[^@]/;


/**
 * Process the type information in the tags
 * @param  {TagCollection} tags The collection of tags to process
 */
module.exports = function(tag) {
  try {
    if ( tag.tagDef && tag.tagDef.canHaveType ) {
      extractTypeExpression(tag);
    }
  } catch(e) {
    tag.errors = tag.errors || [];
    tag.errors.push(e);
  }
};


/**
 * Extract a type expression from the tag text.
 *
 * @private
 * @param {Tag} tag The tag whose type should be extracted
 */
 function extractTypeExpression(tag) {
  var description, start, position, count, length, expression;
  
  description = tag.description;
  start = description.search(TYPE_EXPRESSION_START);
  length = description.length;
  if (start !== -1) {
    // advance to the first character in the type expression
    position = start + 1;
    count = 1;

    while (position < length) {
      switch (description[position]) {
        case '\\':
          // backslash is an escape character, so skip the next character
          position++;
          break;
        case '{':
          count++;
          break;
        case '}':
          count--;
          break;
        default:
          // do nothing
      }

      if (count === 0) {
        break;
      }
      position++;
    }

    tag.description = (description.substring(0, start) + description.substring(position+1)).trim();
    tag.typeExpression = description.slice(start+1, position).trim().replace('\\}', '}').replace('\\{', '{');

    tag.type = catharsis.parse(tag.typeExpression, {jsdoc: true});
    tag.typeList = getTypeStrings(tag.type);
    if ( tag.type.optional ) {
      tag.optional = true;
    }
  }
}

/** @private */
function getTypeStrings(parsedType) {
  var types = [];

  var TYPES = catharsis.Types;
  var util = require('util');

  switch(parsedType.type) {
    case TYPES.AllLiteral:
      types.push('*');
      break;
    case TYPES.FunctionType:
      types.push(catharsis.stringify(parsedType));
      break;
    case TYPES.NameExpression:
      types.push(parsedType.name);
      break;
    case TYPES.NullLiteral:
      types.push('null');
      break;
    case TYPES.RecordType:
      types.push('Object');
      break;
    case TYPES.TypeApplication:
      types.push( catharsis.stringify(parsedType) );
      break;
    case TYPES.TypeUnion:
      parsedType.elements.forEach(function(element) {
        types = types.concat( getTypeStrings(element) );
      });
      break;
    case TYPES.UndefinedLiteral:
      types.push('undefined');
      break;
    case TYPES.UnknownLiteral:
      types.push('?');
      break;
    default:
      // this shouldn't happen
      throw new Error( util.format('unrecognized type %s in parsed type: %j', parsedType.type,
        parsedType) );
  }

  return types;
}