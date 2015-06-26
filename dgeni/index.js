var Package = require('dgeni').Package;

/**
 * @dgPackage dgeni
 * @description Support for documenting Dgeni packages (incomplete)
 */
module.exports = new Package('dgeni', ['jsdoc'])

.config(function(parseTagsProcessor, getInjectables) {
  parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(
    getInjectables([
      require('./tag-defs/dgPackage'),
      require('./tag-defs/dgService'),
      require('./tag-defs/dgProcessor')
    ]));
});
