const path = require('canonical-path');
const fs = require('fs');
const glob = require('glob');
var Minimatch = require("minimatch").Minimatch;

/**
 * @dgProcessor readFilesProcessor
 *
 * @description Read documents from files and add them to the docs collection
 *
 * @property {string} basePath The path against which all paths to files are resolved
 *
 * @property {Array.<String|Object>} sourceFiles A collection of info about what files to read.
 *      If the item is a string then it is treated as a glob pattern. If the item is an object then
 *      it can have the following properties:
 *
 *      * `basePath` {string} the `relativeFile` property of the generated docs will be relative
 *        to this path. This path is relative to `readFileProcessor.basePath`.  Defaults to `.`.
 *      * `include` {string|Array<string>} glob pattern(s) of files to include (relative to `readFileProcessor.basePath`)
 *      * `exclude` {string|Array<string>} glob pattern(s) of files to exclude (relative to `readFileProcessor.basePath`)
 *      * `fileReader` {string} name of a file reader to use for these files
 *
 * @property {Array.<Function>} fileReaders A collection of file readers. A file reader is an object
 *                                          that has the following properties/methods:
 *      * `name` - the name of the file reader so that sourceFiles can reference it
 *      * `getDocs(fileInfo)` - this method is called to read the content of the file specified
 *         by the `fileInfo` object and return an array of documents.
 *      * `defaultPattern {Regex}` - a regular expression used to match to source files if no fileReader
 *         is specified in the sourceInfo item.
 *
 */
module.exports = function readFilesProcessor(log) {
  return {
    $validate: {
      basePath: { presence: true },
      sourceFiles: { presence: true },
      fileReaders: { presence: true },
    },
    $runAfter: ['reading-files'],
    $runBefore: ['files-read'],
    $process() {
      const fileReaders = this.fileReaders;
      const fileReaderMap = getFileReaderMap(fileReaders);
      const basePath = this.basePath;

      const sourcePromises = this.sourceFiles.map(sourceInfo => {

        sourceInfo = normalizeSourceInfo(basePath, sourceInfo);

        log.debug('Source Info:\n', sourceInfo);

        return getSourceFiles(sourceInfo).then(files => {

          const docsPromises = [];

          log.debug('Found ' + files.length + ' files:\n', files);

          files.forEach(file => {

            // Load up each file and extract documents using the appropriate fileReader
            const docsPromise = readFile(file).then(content => {

              // Choose a file reader for this file
              const fileReader = sourceInfo.fileReader ? fileReaderMap.get(sourceInfo.fileReader) : matchFileReader(fileReaders, file);

              log.debug('Reading File Content\nFile Path:', file, '\nFile Reader:', fileReader.name);

              const fileInfo = createFileInfo(file, content, sourceInfo, fileReader, basePath);

              const docs = fileReader.getDocs(fileInfo);

              // Attach the fileInfo object to each doc
              docs.forEach(doc => {
                doc.fileInfo = fileInfo;
              });

              return docs;
            });

            docsPromises.push(docsPromise);

          });
          return Promise.all(docsPromises).then(results => results.flat());
        });

      });
      return Promise.all(sourcePromises).then(results => results.flat());
    }
  };
};

function createFileInfo(file, content, sourceInfo, fileReader, basePath) {
  return {
    fileReader: fileReader.name,
    filePath: file,
    baseName: path.basename(file, path.extname(file)),
    extension: path.extname(file).replace(/^\./, ''),
    basePath: sourceInfo.basePath,
    relativePath: path.relative(sourceInfo.basePath, file),
    projectRelativePath: path.relative(basePath, file),
    content: content
  };
}


function getFileReaderMap(fileReaders) {
  const fileReaderMap = new Map();
  fileReaders.forEach(fileReader => {

    if ( !fileReader.name ) {
      throw new Error('Invalid File Reader: It must have a name property');
    }
    if ( typeof fileReader.getDocs !== 'function' ) {
      throw new Error('Invalid File Reader: "' + fileReader.name + '": It must have a getDocs property');
    }

    fileReaderMap.set(fileReader.name, fileReader);
  });
  return fileReaderMap;
}


function matchFileReader(fileReaders, file) {
  const found = fileReaders.find(fileReader => {
    // If no defaultPattern is defined then match everything
    return !fileReader.defaultPattern || fileReader.defaultPattern.test(file);
  });
  if ( !found ) { throw new Error('No file reader found for ' + file); }
  return found;
}

/**
 * Resolve the relative include/exclude paths in the sourceInfo object,
 */
function normalizeSourceInfo(basePath, sourceInfo) {

  if ( typeof sourceInfo === 'string' ) {
    sourceInfo = { include: [sourceInfo] };
  } else if (!('include' in sourceInfo)) {
    throw new Error('Invalid sourceFiles parameter. ' +
      'You must pass an array of items, each of which is either a string or an object of the form ' +
      '{ include: "...", basePath: "...", exclude: "...", fileReader: "..." }');
  }

  if ( !Array.isArray(sourceInfo.include) ) {
    sourceInfo.include = [sourceInfo.include];
  }
  sourceInfo.exclude = sourceInfo.exclude || [];
  if ( !Array.isArray(sourceInfo.exclude) ) {
    sourceInfo.exclude = [sourceInfo.exclude];
  }

  sourceInfo.basePath = path.resolve(basePath, sourceInfo.basePath || '.');
  sourceInfo.include = sourceInfo.include.map(include => path.resolve(basePath, include));
  sourceInfo.exclude = sourceInfo.exclude.map(exclude => path.resolve(basePath, exclude));

  return sourceInfo;
}


function getSourceFiles(sourceInfo) {

  // Compute matchers for each of the exclusion patterns
  const excludeMatchers = sourceInfo.exclude.map(exclude => new Minimatch(exclude));

  // Get a list of files to include
  // Each call to glob will produce an array of file paths
  const filesPromises = sourceInfo.include.map(include => matchFiles(include));

  // Once we have all the file path arrays, flatten them into a single array
  return Promise.all(filesPromises)
      .then(filesCollections => filesCollections.flat())
      .then(files => {

    // Filter the files on whether they match the `exclude` property and whether they are files
    const filteredFilePromises = files.map(file => {

      if ( excludeMatchers.some(excludeMatcher => excludeMatcher.match(file)) ) {
        // Return a promise for `null` if the path is excluded
        // Doing this first - it is synchronous - saves us even making the isFile call if not needed
        return Promise.resolve(null);
      } else {
        // Return a promise for the file if path is a file, otherwise return a promise for `null`
        return isFile(file).then(isFile => { return isFile ? file : null; });
      }
    });

    // Return a promise to a filtered list of files, those that are files and not excluded
    // (i.e. those that are not `null` from the previous block of code)
    return Promise.all(filteredFilePromises).then(filteredFiles => {
      return filteredFiles.filter(filteredFile => filteredFile);
    });
  });
}


function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  });
}

function isFile(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stat) => {
      if (err) { reject(err); }
      resolve(stat.isFile());
    });
  });
}


function matchFiles(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  });
}
