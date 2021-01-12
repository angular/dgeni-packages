const path = require('canonical-path');

const EXAMPLE_REGEX = /<example([^>]*)>([\S\s]+?)<\/example>/g;
const ATTRIBUTE_REGEX = /\s*([^=]+)\s*=\s*(?:(?:"([^"]+)")|(?:'([^']+)'))/g;
const FILE_REGEX = /<file([^>]*)>([\S\s]+?)<\/file>/g;


/**
 * @dgProcessor parseExamplesProcessor
 * @description
 * Search the documentation for examples that need to be extracted
 */
module.exports = function parseExamplesProcessor(log, exampleMap, trimIndentation, createDocMessage) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $process(docs) {

      docs.forEach(doc => {
        try {
          if (!doc.content) { return; }
          doc.content = doc.content.replace(EXAMPLE_REGEX, function processExample(match, attributeText, exampleText) {

            const example = extractAttributes(attributeText);
            const id = uniqueName(exampleMap, 'example-' + (example.name || 'example'));
            const {files: _files, doc: _doc, ...attributes} = example;
            Object.assign(example, {
              attributes,
              files: extractFiles(exampleText),
              id,
              doc,
              deployments: {}
            });

            // store the example information for later
            log.debug('Storing example', id);
            exampleMap.set(id, example);

            return '{@runnableExample ' + id + '}';
          });
        } catch(error) {
          throw new Error(createDocMessage('Failed to parse examples', doc, error));
        }
      });

    }
  };

  function extractAttributes(attributeText) {
    const attributes = {};
    attributeText.replace(ATTRIBUTE_REGEX, (match, prop, val1, val2) => {
      attributes[prop] = val1 || val2;
    });
    return attributes;
  }

  function extractFiles(exampleText) {
    const files = {};
    exampleText.replace(FILE_REGEX, (match, attributesText, contents) => {
      const file = extractAttributes(attributesText);
      if ( !file.name ) {
        throw new Error('Missing name attribute in file: ' + match);
      }

      // Extract the contents of the file
      file.fileContents = trimIndentation(contents);
      file.language = path.extname(file.name).substr(1);
      file.type = file.type || file.language || 'file';
      const {fileContents, ...attributes} = file;
      file.attributes = attributes;

      // Store this file information
      files[file.name] = file;
    });
    return files;
  }

  function uniqueName(containerMap, name) {
    if ( containerMap.has(name) ) {
      let index = 1;
      while(containerMap.has(name + index)) {
        index += 1;
      }
      name = name + index;
    }
    return name;
  }
};
