var jsdocPackage = require('../index');
var Dgeni = require('dgeni');
var mockLog = require('dgeni/lib/mocks/log');

describe('jsdoc package', function() {
  it("should be instance of Package", function() {
      expect(jsdocPackage instanceof Dgeni.Package).toBeTruthy();
  });

  describe("computePathsProcessor", function() {

    function runDgeni(docs) {
      var testPackage = new Dgeni.Package('testPackage', [jsdocPackage])
        .factory('templateEngine', function() {})
        .factory('log', function() { return mockLog(false); })
        .processor('provideTestDocs', function() {
          return {
            $runBefore: ['computePathsProcessor'],
            $process: function() {
              return docs;
            }
          };
        })

        .config(function(readFilesProcessor, writeFilesProcessor, renderDocsProcessor, unescapeCommentsProcessor) {
          readFilesProcessor.$enabled = false;
          writeFilesProcessor.$enabled = false;
          renderDocsProcessor.$enabled = false;
          unescapeCommentsProcessor.$enabled = false;
        });

      return new Dgeni([testPackage]).generate();
    }


    it("should compute the path of the document from its name or codeName", function(done) {
      var doc1 = { fileInfo: { relativePath: 'a/b/c/foo.ngdoc', baseName: 'foo' }, name: 'fooName', codeName: 'fooCodeName' };
      var doc2 = { fileInfo: { relativePath: 'x/y/z/index.html', baseName: 'index' }, codeName: 'xyz' };

        runDgeni([doc1,doc2]).then(function(docs) {
          expect(doc1.path).toEqual('fooName');
          expect(doc1.outputPath).toEqual('fooName.html');
          expect(doc2.path).toEqual('xyz');
          expect(doc2.outputPath).toEqual('xyz/index.html');
          done();
        });
    });


    it("should compute the path of the document from its file name", function(done) {
      var doc1 = { fileInfo: { relativePath: 'a/b/c/foo.ngdoc', baseName: 'foo' } };
      var doc2 = { fileInfo: { relativePath: 'x/y/z/index.html', baseName: 'index' } };

        runDgeni([doc1,doc2]).then(function(docs) {
          expect(doc1.path).toEqual('a/b/c/foo');
          expect(doc1.outputPath).toEqual('a/b/c/foo.html');
          expect(doc2.path).toEqual('x/y/z');
          expect(doc2.outputPath).toEqual('x/y/z/index.html');
          done();
        });
    });
  });
});