var _ = require('lodash');

module.exports = {
  name: 'link',
  process: function(url, title, doc) {
    return _.template('{@link ${url} ${title} }', { url: url, title: title });
  }
};