var marked = require('marked');

/**
 * @dgRenderFilter marked
 * @description Convert the value, as markdown, into HTML using the marked library
 */
module.exports = {
  name: 'marked',
  process: function(str) {
    var output = str && marked(str);
    return output;
  }
};