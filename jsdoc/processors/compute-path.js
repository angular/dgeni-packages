var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var contentsFolder;

module.exports = {
  name: 'compute-path',
  description: 'Compute the path and outputPath for docs that do not already have them',
  runAfter: ['tags-extracted'],
  init: function(config) {
    contentsFolder = config.get('rendering.contentsFolder');
    if ( !contentsFolder ) {
      throw new Error('Invalid configuration. You must provide config.rendering.contentsFolder');
    }
  },
  process: function(docs) {

    _.forEach(docs, function(doc) {
      if ( !doc.path ) {
        doc.path = path.join(path.dirname(doc.file));
        if ( doc.fileName !== 'index' ) {
          doc.path += '/' + doc.fileName;
        }
      }

      if ( !doc.outputPath ) {
        doc.outputPath = contentsFolder + '/' + doc.path + '.html';
      }
    });
  }
};
