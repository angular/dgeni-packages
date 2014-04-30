var _ = require('lodash');
var path = require('canonical-path');
var log = require('winston');
var fs = require('q-io/fs');
var Q = require('q');

/**
 * @dgProcessor write-files
 * @description Write the value of `doc.renderedContent` to a file a  `doc.outputPath`.
 */
module.exports = {
  name: 'write-files',
  runAfter:['writing-files'],
  runBefore: ['files-written'],
  process: function(docs, config) {
    var outputFolder = path.resolve(config.basePath, config.rendering.outputFolder);
    return Q.all(_.map(docs, function(doc) {

      if ( !doc.outputPath ) {
        log.debug('Document "' + doc.id + ', ' + doc.docType + '" has no outputPath.');
      } else {

        var outputFile = path.resolve(outputFolder, doc.outputPath);

        log.silly('writing file', outputFile);
        return writeFile(outputFile, doc.renderedContent).then(function() {
          log.debug('written file', outputFile);
          return outputFile;
        });

      }
    })).then(function() {
      return docs;
    });
  }
};

function writeFile(file, content) {
  return fs.makeTree(fs.directory(file)).then(function() {
    return fs.write(file, content, 'wb');
  });
}