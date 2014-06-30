var Q = require('q');
var path = require('canonical-path');
var readFilesFactory = require('../../processors/read-files');
var _ = require('lodash');

function tidyUp(promise, done) {
  return promise.then(function() {
    done();
  },function(err) {
    console.log('ERROR', err.stack);
    done(err);
  });
}

var mockLog = jasmine.createSpyObj('mockLog', ['silly', 'debug', 'info', 'warn', 'error']);
// Uncomment this line if you are debugging and want to see the log messages
//mockLog.debug.and.callFake(console.log);

var mockInjector = {
  invoke: function(fn) { return fn(); }
};



describe('read-files doc processor', function() {

  var processor;
  beforeEach(function() {
    processor = readFilesFactory(mockLog, mockInjector);
  });


  it('should iterate over matching files, providing fileInfo to the reader', function(done) {

    function mockFileReader() {
      return {
        getDocs: function(fileInfo) { return [{ fileInfo2: fileInfo }]; }
      };
    }


    processor.basePath = path.resolve(__dirname, '../fixtures');
    processor.fileReaders = [mockFileReader];
    processor.sourceFiles = ['docs/*'];

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

    function mockNgDocFileReader() {
      return {
        defaultPattern: /\.ngdoc$/,
        getDocs: function(fileInfo) { return [{}]; }
      };
    }

    function mockJsFileReader() {
      return {
        defaultPattern: /\.js$/,
        getDocs: function(fileInfo) { return [{}]; }
      };
    }

    it("should use the first file reader that matches if none is specified for a sourceInfo", function(done) {

      processor.basePath = path.resolve(__dirname, '../fixtures');
      processor.fileReaders = [mockNgDocFileReader, mockJsFileReader];
      processor.sourceFiles = ['docs/*'];

      var promise = processor.$process().then(function(docs) {
        expect(docs[0].fileInfo.extension).toEqual('js');
        expect(docs[0].fileInfo.fileReader).toEqual('mockJsFileReader');
        expect(docs[1].fileInfo.extension).toEqual('ngdoc');
        expect(docs[1].fileInfo.fileReader).toEqual('mockNgDocFileReader');
      });

      tidyUp(promise, done);
    });

    it("should use the fileReader named in the sourceInfo, rather than try to match one", function(done) {
      processor.basePath = path.resolve(__dirname, '../fixtures');
      processor.fileReaders = [mockNgDocFileReader, mockJsFileReader];
      processor.sourceFiles = [{ include: 'docs/*', fileReader: 'mockJsFileReader' }];

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

      function mockFileReader() {
        return {
          getDocs: function(fileInfo) { return [{ }]; }
        };
      }

      processor.basePath = path.resolve(__dirname, '../fixtures');
      processor.fileReaders = [mockFileReader];
      processor.sourceFiles = [{ include: 'docs/*', exclude:'**/*.ngdoc' }];

      var promise = processor.$process().then(function(docs) {
        expect(docs.length).toEqual(1);
        expect(docs[0].fileInfo.extension).toEqual('js');
      });
      tidyUp(promise, done);
    });
  });

  describe("relative paths", function() {
    it("should set the relativePath on the doc.fileInfo property correctly", function(done) {

      function mockFileReader() {
        return {
          getDocs: function(fileInfo) { return [{ }]; }
        };
      }

      processor.basePath = path.resolve(__dirname, '../fixtures');
      processor.fileReaders = [mockFileReader];
      processor.sourceFiles = [{ include: 'src/**/*', basePath:'src' }];

      var promise = processor.$process().then(function(docs) {
        expect(docs.length).toEqual(2);
        expect(docs[0].fileInfo.relativePath).toEqual('f1/a.js');
        expect(docs[1].fileInfo.relativePath).toEqual('f2/b.js');
      });

      tidyUp(promise, done);
    });
  });
});