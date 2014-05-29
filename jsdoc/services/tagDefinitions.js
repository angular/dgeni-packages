module.exports = function tagDefinitionsFactory(config) {

  var tagDefinitions = config.get('processing.tagDefinitions');
  if ( !tagDefinitions ) {
    throw new Error('Invalid config.\n'+
    'You must provide an array of tag definitions, at config.processing.tagDefinitions');
  }

  return tagDefinitions;
};