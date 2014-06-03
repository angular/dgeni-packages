var path = require('canonical-path');
var Q = require('q');
var gfs = require('graceful-fs');
var qfs = require('q-io/fs');
var _ = require('lodash');
var glob = require('glob');

/**
 * @dgPackage readFilesProcessor
 * @description Read documents from files and add them to the docs collection
 */
module.exports = function readFilesProcessor(log) {
  return {
    $validate: {
      basePath: { presence: true },
      projectPath: { presence: true },
      fileReaders: { presence: true },
      sourceFiles: { presence: true }
    },
    $runAfter: ['reading-files'],
    $runBefore: ['files-read'],
    $process: function(docs) {

      return Q.all(_.map(this.sourceFiles, function(fileInfo) {
        var pattern, files;

        // These fileinfo patterns and basePaths should be relative to the basePath but if we don't have
        // a basepath specified then we just use the config:basePath or current working directory
        if ( _.isString(fileInfo) ) {
          fileInfo = { pattern: fileInfo, basePath: this.basePath };
        } else if ( _.isObject(fileInfo) ) {
          fileInfo.basePath = fileInfo.basePath || this.basePath;
        } else {
          throw new Error('Invalid sourceFiles parameter. ' +
            'You must pass an array of items, each of which is either a string or an object of the form ' +
            '{ pattern: "...", basePath: "..." }');
        }

        // Ensure that the pattern is relative
        fileInfo.pattern = path.relative(fileInfo.basePath, path.resolve(fileInfo.basePath, fileInfo.pattern));

        log.debug('reading files: ', fileInfo);

        files = glob.sync(fileInfo.pattern, { cwd: fileInfo.basePath });

        log.debug('Found ' + files.length + ' files');

        var docPromises = [];
        _.forEach(files, function(file) {
          _.any(this.fileReaders, function(extractor) {
            if ( extractor.pattern.test(file) ) {
              docPromises.push(qfs.read(path.resolve(fileInfo.basePath, file)).then(function(content) {
                var docs = extractor.processFile(file, content, fileInfo.basePath);

                _.forEach(docs, function(doc) {
                  doc.fileName = path.basename(doc.file, '.'+doc.fileType);
                  doc.relativePath = path.relative(this.projectPath, path.resolve(doc.basePath, doc.file));
                });

                return docs;
              }));
              return true;
            }
          });
        });

        return Q.all(docPromises).then(_.flatten);
      }))

      .then(_.flatten);
    }
  };
};