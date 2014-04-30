var Q = require('q');
var MockFS = require('q-io/fs-mock');
var rewire = require('rewire');
var plugin = rewire('../../processors/read-files');
var _ = require('lodash');
var Config = require('dgeni').Config;

var mockFiles = {
  "docs": {
    "a.js": "// Mock code file",
    "b.ngdoc": "mock documentation file"
  },
  "src": {
    "a.js": "// Mock code file",
    "b.js": "// Other mock code file"
  }
};

plugin.__set__('fs', MockFS(mockFiles));
plugin.__set__('glob.sync', function(pattern) {
  // Strip off the "./" from the start of the pattern
  pattern = pattern.replace(/^\.\//,'');
  return _.keys(mockFiles[pattern]);
});

var mockNgDocFileReader = {
  pattern: /\.ngdoc$/,
  processFile: function(file, content) {
    return [{ content: content, file: file, fileType: 'ngdoc' }];
  }
};

var mockJsFileReader = {
  pattern: /\.js$/,
  processFile: function(file, content) {
    return [{ content: content, file: file, fileType: 'js' }];
  }
};

describe('read-files doc processor', function() {
  var config;

  beforeEach(function() {
    config = new Config();
  });

  it("should throw an error if the projectPath has not been set", function() {
    expect(function() {
      plugin.process({ source: { files: [] }});
    }).toThrow();
  });

  it('should traverse the specified folder tree, reading each matching file', function() {

    config = new Config({
      source: {
        projectPath: '.',
        fileReaders: [mockNgDocFileReader, mockJsFileReader],
        files: ['./docs', './src']
      }
    });

    var injectables = {
      value: function() {}
    };

    plugin.process([], config).then(function(docs) {
      expect(docs.length).toEqual(4);
      expect(docs[0]).toEqual({
        file: "docs/a.js",
        content: "// Mock code file",
        fileType: 'js',
        fileName: "a"
      });
      expect(docs[1]).toEqual({
        file: "docs/b.ngdoc",
        content: "mock documentation file",
        fileType: 'ngdoc',
        fileName: 'b'
      });
      expect(docs[2]).toEqual({
        file: "src/a.js",
        content: "// Mock code file",
        fileType: 'js',
        fileName: 'a'
      });
      expect(docs[3]).toEqual({
        file: "src/b.js",
        content: "// Other mock code file",
        fileType: 'js',
        fileName: 'a'
      }).done();
    });

  });
});