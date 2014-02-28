var _ = require('lodash');

/**
 * Trim whitespace off the description
 * @param  {TagCollection} tags The collection of tags to process
 */
module.exports = function(tags) {
  _.forEach(tags.tags, function(tag) {
    tag.description = tag.description.trim();
  });
};