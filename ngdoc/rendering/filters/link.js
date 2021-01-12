var _ = require('lodash');

module.exports = function() {
  return {
    name: 'link',
    process(url, title, doc) {
      return _.template('{@link ${url} ${title} }')({ url: url, title: title });
    }
  };
};