var Q = require('q');
var path = require('canonical-path');
var readFilesFactory = require('../../processors/read-files');
var _ = require('lodash');
var mockLog = require('dgeni/lib/mocks/log')(/* true */);

function tidyUp(promise, done) {
  return promise.then(function() {
    done();
  },function(err) {
    console.log('ERROR', err.stack);
    done(err);
  });
}

function createReadFilesProcessor(fileReaders, sourceFiles, basePath) {
  var processor = readFilesFactory(mockLog);
  processor.fileReaders = fileReaders;
  processor.sourceFiles = sourceFiles;
  processor.basePath = path.resolve(__dirname, basePath);
  return processor;
}



describe('read-files doc processor', function() {

  it("should complain if a file reader is not valid", function() {
    expect(function() {
      var processor = createReadFilesProcessor([ {} ], ['docs/*'], '../fixtures');
      processor.$process();
    }).toThrowError('Invalid File Reader: It must have a name property');


    expect(function() {
      var processor = createReadFilesProcessor([ { name: 'badFileReader' } ], ['docs/*'], '../fixtures');
      processor.$process();
    }).toThrowError('Invalid File Reader: "badFileReader": It must have a getDocs property');
  });

  it('should iterate over matching files, providing fileInfo to the reader', function(done) {

    var mockFileReader = {
      name: 'mockFileReader',
      getDocs: function(fileInfo) { return [{ fileInfo2: fileInfo }]; }
    };

    processor = createReadFilesProcessor([mockFileReader], ['docs/*'], '../fixtures');

    var promise = processor.$process().then(function(docs) {
      expect(docs.length).toEqual(2);
      expect(docs[0].fileInfo).toEqual({
        fileReader: 'mockFileReader',
        filePath: path.resolve(processor.basePath, 'docs/a.js'),
        baseName: 'a',
        extension: 'js',
        basePath: processor.basePath,
        relativePath: 'docs/a.js',
        content: '// Mock code file'
      });
      expect(docs[0].fileInfo2).toBe(docs[0].fileInfo);
      expect(docs[1].fileInfo).toEqual({
        fileReader: 'mockFileReader',
        filePath: path.resolve(processor.basePath, 'docs/b.ngdoc'),
        baseName: 'b',
        extension: 'ngdoc',
        basePath: processor.basePath,
        relativePath: 'docs/b.ngdoc',
        content: 'mock documentation file'
      });
      expect(docs[1].fileInfo2).toBe(docs[1].fileInfo);
    });

    tidyUp(promise, done);
  });

  describe('fileReaders', function() {

    var mockNgDocFileReader = {
      name: 'mockNgDocFileReader',
      defaultPattern: /\.ngdoc$/,
      getDocs: function(fileInfo) { return [{}]; }
    };

    var mockJsFileReader = {
      name: 'mockJsFileReader',
      defaultPattern: /\.js$/,
      getDocs: function(fileInfo) { return [{}]; }
    };

    it("should use the first file reader that matches if none is specified for a sourceInfo", function(done) {

      processor = createReadFilesProcessor([mockNgDocFileReader, mockJsFileReader], ['docs/*'], '../fixtures');

      var promise = processor.$process().then(function(docs) {
        expect(docs[0].fileInfo.extension).toEqual('js');
        expect(docs[0].fileInfo.fileReader).toEqual('mockJsFileReader');
        expect(docs[1].fileInfo.extension).toEqual('ngdoc');
        expect(docs[1].fileInfo.fileReader).toEqual('mockNgDocFileReader');
      });

      tidyUp(promise, done);
    });

    it("should use the fileReader named in the sourceInfo, rather than try to match one", function(done) {
      processor = createReadFilesProcessor([mockNgDocFileReader, mockJsFileReader], [{ include: 'docs/*', fileReader: 'mockJsFileReader' }], '../fixtures');

      var promise = processor.$process().then(function(docs) {
        expect(docs[0].fileInfo.extension).toEqual('js');
        expect(docs[0].fileInfo.fileReader).toEqual('mockJsFileReader');
        expect(docs[1].fileInfo.extension).toEqual('ngdoc');
        expect(docs[1].fileInfo.fileReader).toEqual('mockJsFileReader');
      });

      tidyUp(promise, done);
    });
  });

  describe('exclusions', function() {
    it("should exclude files that match the exclude property of a sourceInfo", function(done) {

      var mockFileReader = {
        name: 'mockFileReader',
        getDocs: function(fileInfo) { return [{ }]; }
      };

      processor = createReadFilesProcessor([mockFileReader], [{ include: 'docs/*', exclude:'**/*.ngdoc' }], '../fixtures');

      var promise = processor.$process().then(function(docs) {
        expect(docs.length).toEqual(1);
        expect(docs[0].fileInfo.extension).toEqual('js');
      });
      tidyUp(promise, done);
    });
  });

  describe("relative paths", function() {
    it("should set the relativePath on the doc.fileInfo property correctly", function(done) {

      var mockFileReader = {
        name: 'mockFileReader',
        getDocs: function(fileInfo) { return [{ }]; }
      };

      processor = createReadFilesProcessor([mockFileReader], [{ include: 'src/**/*', basePath:'src' }], '../fixtures');

      var promise = processor.$process().then(function(docs) {
        expect(docs.length).toEqual(2);
        expect(docs[0].fileInfo.relativePath).toEqual('f1/a.js');
        expect(docs[1].fileInfo.relativePath).toEqual('f2/b.js');
      });

      tidyUp(promise, done);
    });
  });
});