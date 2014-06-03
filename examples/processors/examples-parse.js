var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var trimIndentation = require('../../utils/trim-indentation');
var marked = require('marked');

var EXAMPLE_REGEX = /<example([^>]*)>([\S\s]+?)<\/example>/g;
var ATTRIBUTE_REGEX = /\s*([^=]+)\s*=\s*(?:(?:"([^"]+)")|(?:'([^']+)'))/g;
var FILE_REGEX = /<file([^>]*)>([\S\s]+?)<\/file>/g;


function extractAttributes(attributeText) {
  var attributes = Object.create(null);
  attributeText.replace(ATTRIBUTE_REGEX, function(match, prop, val1, val2){
    attributes[prop] = val1 || val2;
  });
  return attributes;
}

function extractFiles(exampleText) {
  var files = Object.create(null);
  exampleText.replace(FILE_REGEX, function(match, attributesText, contents) {
    var file = extractAttributes(attributesText);
    if ( !file.name ) {
      throw new Error('Missing name attribute in file: ' + match);
    }

    // Extract the contents of the file
    file.fileContents = trimIndentation(contents);
    file.language = path.extname(file.name).substr(1);
    file.type = file.type || file.language || 'file';
    file.attributes = _.omit(file, ['fileContents']);

    // Store this file information
    files[file.name] = file;
  });
  return files;
}

var uniqueName = function(container, name) {
  if ( container[name] ) {
    var index = 1;
    while(container[name + index]) {
      index += 1;
    }
    name = name + index;
  }
  return name;
};

module.exports = {
  name: 'examples-parse',
  description: 'Search the documentation for examples that need to be extracted',
  runAfter: ['files-read'],
  runBefore: ['parsing-tags'],
  exports: {
    examples: ['value', Object.create(null) ]
  },
  process: function(docs, examples, config) {

    var outputFolder = config.get('processing.examples.outputFolder', 'examples'); // folder to output files in
    var outputFolderPath = config.get('processing.examples.outputFolderPath', 'examples'); // url to output files

    _.forEach(docs, function(doc) {
      doc.content = doc.content.replace(EXAMPLE_REGEX, function processExample(match, attributeText, exampleText) {
        var example = extractAttributes(attributeText);
        example.attributes = _.omit(example, ['files', 'doc']);
        var id = uniqueName(examples, 'example-' + (example.name || 'example'));
        example.files = extractFiles(exampleText);
        example.id = id;
        example.doc = doc;
        example.outputFolder = path.join(outputFolder, example.id);
        example.outputFolderPath = path.join(outputFolderPath, example.id);

        // store the example information for later
        log.debug('Storing example', id);
        examples[id] = example;

        return '{@runnableExample ' + id + '}';
      });
    });

  }
};