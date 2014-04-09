var code = require('../../../utils/code');
module.exports = {
  name: 'code',
  process: function(str, lang) {
    return code(str, true, lang);
  }
};