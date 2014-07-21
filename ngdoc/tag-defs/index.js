var path = require('canonical-path');
var _ = require('lodash');

module.exports = [
  {
    name: 'ngdoc',
    required: true,
    docProperty: 'docType'
  },


  {
    name: 'name',
    required: true,
    transforms: function(doc, tag, value) {
      var INPUT_TYPE = /input\[(.+)\]/;
      if ( doc.docType === 'input' ) {
        var match = INPUT_TYPE.exec(value);
        if ( !match ) {
          throw new Error('Invalid input directive name.  It should be of the form: "input[inputType]" but was "' + value + '"');
        }
        doc.inputType = match[1];
      }
      return value;
    }
  },


  {
    name: 'area',
    defaultFn: function(doc) {
      // Code files are put in the 'api' area
      // Other files compute their area from the first path segment
      return (doc.fileType === 'js') ? 'api' : doc.file.split('/')[0];
    }
  },


  {
    name: 'module',
    defaultFn: function(doc) {
      if ( doc.area === 'api' ) {
        // Calculate the module from the second segment of the file path
        // (the first being the area)
        return path.dirname(doc.file).split('/')[1];
      }
    }
  },


  { name: 'id' },


  {
    name: 'restrict',
    defaultFn: function(doc) {
      if ( doc.docType === 'directive' || doc.docType === 'input' ) {
        return { element: false, attribute: true, cssClass: false, comment: false };
      }
    },
    transforms: function(doc, tag, value) {
      return {
        element: _.contains(value, 'E'),
        attribute: _.contains(value, 'A'),
        cssClass: _.contains(value, 'C'),
        comment: _.contains(value, 'M')
      };
    }
  },


  {
    name: 'eventType',
    transforms: function(doc, tag, value) {
      var EVENTTYPE_REGEX = /^([^\s]*)\s+on\s+([\S\s]*)/;
      var match = EVENTTYPE_REGEX.exec(value);
      // Attach the target to the doc
      doc.eventTarget = match[2];
      // And return the type
      return match[1];
    }
  },


  {
    name: 'example',
    multi: true,
    docProperty: 'examples'
  },


  {
    name: 'element',
    defaultFn: function(doc) {
      if ( doc.docType === 'directive' || doc.docType === 'input') {
        return'ANY';
      }
    }
  },

  {
    name: 'fullName'
  },

  {
    name: 'scope',
    transforms: function(doc, tag) { return true; }
  },

  {
    name: 'priority',
    defaultFn: function(doc) { return 0; }
  },

  { name: 'title' },
  { name: 'parent' },
  { name: 'packageName' }

];
