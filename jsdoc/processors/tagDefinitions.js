var _ = require('lodash');

module.exports = {
  name: 'tagDefinitions',
  exports: {

    tagDefinitions: ['factory', function(config) {
      return config.get('processing.tagDefinitions');
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