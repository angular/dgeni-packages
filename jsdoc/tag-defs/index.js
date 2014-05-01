var path = require('canonical-path');
var _ = require('lodash');
var extractName = require('./transforms/extract-name');
var extractType = require('./transforms/extract-type');
var wholeTag = require('./transforms/whole-tag');

module.exports = [
  {
    name: 'name'
  },


  {
    name: 'memberof',
    defaultFn: function(doc) {
      if ( doc.docType === 'event' || doc.docType === 'property' || doc.docType === 'method' ) {
        throw new Error('Missing tag "@memberof" for doc of type "'+ doc.docType + '" in file "' + doc.file + '" at line ' + doc.startingLine);
      }
    },
    transforms: function(doc, tag, value) {
      if ( !(doc.docType === 'event' || doc.docType === 'property' || doc.docType === 'method') ) {
        throw new Error('"@'+ tag.name +'" tag found on non-'+ doc.docType +' document in file "' + doc.file + '" at line ' + doc.startingLine);
      }
      return value;
    }
  },


  {
    name: 'param',
    multi: true,
    docProperty: 'params',
    transforms: [ extractType, extractName, wholeTag ]
  },


  {
    name: 'property',
    multi: true,
    docProperty: 'properties',
    transforms: [ extractType, extractName, wholeTag ]
  },


  {
    name: 'returns',
    aliases: ['return'],
    transforms: [ extractType, wholeTag ]
  },

  {
    name: 'type',
    transforms: [ extractType, wholeTag ]
  },

  {
    name: 'requires',
    multi: true
  },

  { name: 'module' },
  { name: 'description' },
  { name: 'deprecated' },
  { name: 'private' },
  { name: 'see', multi: true },
  { name: 'usage' },
  { name: 'animations' },
  { name: 'constructor' },
  { name: 'class' },
  { name: 'classdesc' },
  { name: 'global' },
  { name: 'namespace' },
  { name: 'kind' },
  { name: 'function' },
  { name: 'method' }
];
