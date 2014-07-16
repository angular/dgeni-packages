module.exports = function() {
  return {
    name: 'returns',
    aliases: ['return'],
    transforms: [ extractTypeTransform, wholeTagTransform ]
  };
};