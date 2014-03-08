var checkProperty = require('dgeni/lib/utils/check-property');
var path = require('canonical-path');
var _ = require('lodash');

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
    transformFn: function(doc, tag) {
      if ( !(doc.docType === 'event' || doc.docType === 'property' || doc.docType === 'method') ) {
        throw new Error('"@'+ tag.name +'" tag found on non-'+ doc.docTyep +' document in file "' + doc.file + '" at line ' + doc.startingLine);
      }
    }
  },


  {
    name: 'param',
    multi: true,
    docProperty: 'params',
    canHaveName: true,
    canHaveType: true,
    transformFn: function(doc, tag) {
      return tag;
    }
  },


  {
    name: 'property',
    multi: true,
    docProperty: 'properties',
    canHaveName: true,
    canHaveType: true,
    transformFn: function(doc, tag) {
      return tag;
    }
  },


  {
    name: 'returns',
    aliases: ['return'],
    canHaveType: true,
    transformFn: function(doc, tag) {
      return tag;
    }
  },

  {
    name: 'requires',
    multi: true
  },

  { name: 'module' },
  { name: 'description' },
  { name: 'deprecated' },
  { name: 'private' },
  { name: 'see'},
  { name: 'usage' },
  { name: 'animations' },
  { name: 'constructor' },
  { name: 'class' },
  { name: 'classdesc' },
  { name: 'global' },
  { name: 'namespace' },
  { name: 'kind' },
  { name: 'function' }
];
