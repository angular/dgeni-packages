var code = require('dgeni/lib/utils/code');
module.exports = {
  name: 'code',
  process: function(str, lang) {
    return code(str, true, lang);
  }
};