module.exports = function(extractTypeTransform, extractAccessTransform) {
  extractAccessTransform.allowedTags.set('public');
  return {
    name: 'public',
    transforms: [extractTypeTransform, extractAccessTransform]
  };
};