var changeCase = require('change-case');

var _ = require('lodash');

var changers = [
  'lower',
  'pascal',
  'upper',
  'swap',
  'path',
  'snake',
  'constant',
  'param',
  'dot',
  'camel',
  'title',
  'sentence'
];

module.exports = _.map(changers, function(changer) {
  return {
    name: changer + 'Case',
    process: function(str) {
      var output = changeCase[changer](str);
      return output;
    }
  };
});