var _ = require('lodash');
var catharsis = require('catharsis');
var TYPE_EXPRESSION_START = /\{[^@]/;

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
    tag.typeExpression = description.slice(start+1, position).trim();

    tag.type = catharsis.parse(tag.typeExpression, {jsdoc: true});
    tag.typeList = getTypeStrings(tag.type);
  }
}


/**
 * Process the type information in the tags
 * @param  {TagCollection} tags The collection of tags to process
 */
module.exports = function(tags) {
  _.forEach(tags.tags, function(tag) {
    if ( tag.tagDef.canHaveType ) {
      extractTypeExpression(tag);
    }
  });
};


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