var _ = require('lodash');

module.exports = {
  name: 'tagDefinitions',
  exports: {

    tagDefinitions: ['factory', function(config) {

      var tagDefinitions = config.get('processing.tagDefinitions');
      if ( !tagDefinitions ) {
        throw new Error('Invalid config.\n'+
        'You must provide an array of tag definitions, at config.processing.tagDefinitions');
      }

      return tagDefinitions;
    }],

    tagDefMap: ['factory', function(tagDefinitions) {
      // Create a map of the tagDefinitions so that we can look up tagDefs based on name or alias
      var tagDefMap = Object.create(null);
      _.forEach(tagDefinitions, function(tagDefinition) {
        tagDefMap[tagDefinition.name] = tagDefinition;
        _.forEach(tagDefinition.aliases, function(alias) {
          tagDefMap[alias] = tagDefinition;
        });
      });
      return tagDefMap;
    }]
  }
};