var marked = require('marked');
module.exports = {
  name: 'marked',
  process: function(str) {
    var output = str && marked(str);
    return output;
  }
};