module.exports = function(extractTypeTransform, extractAccessTransform) {
  extractAccessTransform.allowedTags.set('private');
  return {
    name: 'private',
    transforms: [extractTypeTransform, extractAccessTransform]
  };
};