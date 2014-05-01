var _ = require('lodash');

module.exports = {
  name: 'defaultTagTransforms',
  exports: {
    defaultTagTransforms: ['factory', function(config) {
      return config.get('processing.defaultTagTransforms', []);
    }]
  }
};