var processor = require('../../processors/compute-path');
var _ = require('lodash');
var Config = require('dgeni/lib/utils/config').Config;
var config;

describe("compute-path doc processor", function() {

  beforeEach(function() {
    config = _.extend(Config);
    config.set('rendering.contentsFolder', 'partials');
    processor.init(config);
  });

  it("should compute the path of the document from its file name", function() {
    var doc1 = {
      file: 'a/b/c/foo.ngdoc',
      fileName: 'foo'
    };
    var doc2 = {
      file: 'x/y/z/index.html',
      fileName: 'index'
    };

    processor.process([doc1, doc2]);

    expect(doc1.path).toEqual('a/b/c/foo');
    expect(doc1.outputPath).toEqual('partials/a/b/c/foo.html');
    expect(doc2.path).toEqual('x/y/z');
    expect(doc2.outputPath).toEqual('partials/x/y/z.html');
  });

  it("should not change the path if one is already present", function() {
    var doc = {
      file: 'x/y/z/index.html',
      fileName: 'index',
      path: 'a/b/c'
    };

    processor.process([doc]);
    
    expect(doc.path).toEqual('a/b/c');
    expect(doc.outputPath).toEqual('partials/a/b/c.html');
  });


  it("should not change the outputPath if one is already present", function() {
    var doc = {
      file: 'x/y/z/index.html',
      fileName: 'index',
      outputPath: 'a/b/c/foo.bar'
    };

    processor.process([doc]);

    expect(doc.path).toEqual('x/y/z');
    expect(doc.outputPath).toEqual('a/b/c/foo.bar');
  });

});