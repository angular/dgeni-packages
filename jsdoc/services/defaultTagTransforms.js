var _ = require('lodash');

module.exports = function defaultTagTransformsFactory(config) {
  return config.get('processing.defaultTagTransforms', []);
};