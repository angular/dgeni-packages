module.exports = function(extractTypeTransform, extractNameTransform, wholeTagTransform) {
  return {
    name: 'constant',
    aliases: ['const'],
    transforms: [ extractTypeTransform, extractNameTransform, wholeTagTransform ]
  };
};
