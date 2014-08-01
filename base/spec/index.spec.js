var basePackage = require('../index');
var Dgeni = require('dgeni');
var mockLog = require('dgeni/lib/mocks/log');

describe('base package', function() {
  it("should be instance of Package", function() {
      expect(basePackage instanceof Dgeni.Package).toBeTruthy();
  });

  describe("computePathsProcessor", function() {

    function runDgeni(docs) {
      var testPackage = new Dgeni.Package('testPackage', [basePackage])
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

    it("should use default path templates", function(done) {
      var doc1 = { docType: 'service', fileInfo: { relativePath: 'a/b/c/d.js', baseName: 'd' } };
      var doc2 = { docType: 'guide', fileInfo: { relativePath: 'x/y/z/index', baseName: 'index' } };


      runDgeni([doc1,doc2]).then(function(docs) {
        expect(doc1.path).toEqual('a/b/c/d');
        expect(doc1.outputPath).toEqual('a/b/c/d.html');
        expect(doc2.path).toEqual('x/y/z');
        expect(doc2.outputPath).toEqual('x/y/z/index.html');
        done();
      });
    });
  });
});