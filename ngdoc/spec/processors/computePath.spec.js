var computePathProcessorFactory = require('../../processors/computePath');
var _ = require('lodash');

describe("computePathProcessor", function() {
  var processor;

  beforeEach(function() {
    var mockApiDocsProcessor = {
      apiDocsPath: 'partials'
    };
    processor = computePathProcessorFactory(mockApiDocsProcessor);
  });

  it("should compute the path of the document from its file name", function() {
    var doc1 = {
      fileInfo: {
        filePath: 'a/b/c/foo.ngdoc',
        baseName: 'foo'
      }
    };
    var doc2 = {
      fileInfo: {
        filePath: 'x/y/z/index.html',
        baseName: 'index'
      }
    };

    processor.$process([doc1, doc2]);

    expect(doc1.path).toEqual('a/b/c/foo');
    expect(doc1.outputPath).toEqual('partials/a/b/c/foo.html');
    expect(doc2.path).toEqual('x/y/z');
    expect(doc2.outputPath).toEqual('partials/x/y/z.html');
  });

  it("should not change the path if one is already present", function() {
    var doc = {
      fileInfo: {
        filePath: 'x/y/z/index.html',
        baseName: 'index'
      },
      path: 'a/b/c'
    };

    processor.$process([doc]);

    expect(doc.path).toEqual('a/b/c');
    expect(doc.outputPath).toEqual('partials/a/b/c.html');
  });


  it("should not change the outputPath if one is already present", function() {
    var doc = {
      fileInfo: {
        filePath: 'x/y/z/index.html',
        baseName: 'index'
      },
      outputPath: 'a/b/c/foo.bar'
    };

    processor.$process([doc]);

    expect(doc.path).toEqual('x/y/z');
    expect(doc.outputPath).toEqual('a/b/c/foo.bar');
  });

});