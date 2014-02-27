var checkProperty = require('dgeni/lib/utils/check-property');
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
    transformFn: function(doc, tag) {
      var INPUT_TYPE = /input\[(.+)\]/;
      var name = tag['description'];
      if ( doc.docType === 'input' ) {
        var match = INPUT_TYPE.exec(name);
        if ( !match ) {
          throw new Error('Invalid input directive name.  It should be of the form: "input[inputType]" but was "' + doc.name + '"');
        }
        doc.inputType = match[1];
      }
      return name;
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
        checkProperty(doc, 'file');
        // Calculate the module from the second segment of the file path
        // (the first being the area)
        return path.dirname(doc.file).split('/')[1];
      }
    }
  },


  {
    name: 'id',
    defaultFn: function(doc) {
      var parts, partialFolder = 'partials';
      if ( doc.area === 'api' && doc.docType !== 'overview' ) {
        if ( doc.docType === 'module' ) {
          doc.id = _.template('module:${name}', doc);
          doc.outputPath = _.template('${area}/${name}/index.html', doc);
          doc.path = _.template('${area}/${name}', doc);

        } else if ( doc.name.indexOf('#' ) === -1 ) {
          doc.id = _.template('module:${module}.${docType}:${name}', doc);
          doc.outputPath = _.template('${area}/${module}/${docType}/${name}.html', doc);
          doc.path = _.template('${area}/${module}/${docType}/${name}', doc);

        } else {
          doc.id = doc.name;
          doc.isMember = true;
          parts = doc.id.split('#');
          doc.memberof = parts[0];
          doc.name = parts[1];
          // This is a member of another doc so it doesn't need an output path
        }
      } else {
        doc.id = doc.fileName;

        if ( doc.docType === 'error' ) {
          // Parse out the error info from the id
          doc.id = doc.name;
          parts = doc.id.split(':');
          doc.namespace = parts[0];
          doc.name = parts[1];
        }

        doc.path = path.join(path.dirname(doc.file));
        if ( doc.fileName !== 'index' ) {
          doc.path += '/' + doc.fileName;
        }
        doc.outputPath = doc.path + '.html';
      }

      if ( doc.outputPath ) {
        doc.outputPath = partialFolder + '/' + doc.outputPath;
      }
      
      return doc.id;
    }
  },


  {
    name: 'restrict',
    defaultFn: function(doc) {
      if ( doc.docType === 'directive' || doc.docType === 'input' ) {
        return { element: false, attribute: true, cssClass: false, comment: false };
      }
    },
    transformFn: function(doc, tag) {
      return {
        element: _.contains(tag.description, 'E'),
        attribute: _.contains(tag.description, 'A'),
        cssClass: _.contains(tag.description, 'C'),
        comment: _.contains(tag.description, 'M')
      };
    }
  },


  {
    name: 'eventType',
    transformFn: function(doc, tag) {
      var EVENTTYPE_REGEX = /^([^\s]*)\s+on\s+([\S\s]*)/;
      var match = EVENTTYPE_REGEX.exec(tag.description);
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
    transformFn: function(doc, tag) { return true; }
  },

  {
    name: 'priority',
    defaultFn: function(doc) { return 0; }
  },
  
  { name: 'title' },
  { name: 'parent' },

];
