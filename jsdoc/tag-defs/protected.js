module.exports = function(extractTypeTransform, extractAccessTransform) {
  extractAccessTransform.allowedTags.set('protected');
  return {
    name: 'protected',
    transforms: [extractTypeTransform, extractAccessTransform]
  };
};