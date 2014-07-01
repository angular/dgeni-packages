var _ = require('lodash');
var path = require('canonical-path');
var fs = require('q-io/fs');
var Q = require('q');

/**
 * @dgProcessor writeFilesProcessor
 * @param {Object} log A service that provides logging
 * @description Write the value of `doc.renderedContent` to a file a  `doc.outputPath`.
 * @property {String} outputFolder The base path to the folder where files are outputted
 * @property {String} contentsFolder The path relative to the outputFolder where normal documents
 *                                   are outputted.  This is compared to auxiliary files that may be
 *                                   output elsewhere.
 */
module.exports = function writeFilesProcessor(log) {
  return {
    outputFolder: null,
    contentsFolder: null,
    $validate: {
      outputFolder: { presence: true },
      contentsFolder: { presence: true }
    },
    $runAfter:['writing-files'],
    $runBefore: ['files-written'],
    $process: function(docs) {
      var outputFolder = this.outputFolder;
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
};

function writeFile(file, content) {
  return fs.makeTree(fs.directory(file)).then(function() {
    return fs.write(file, content, 'wb');
  });
}