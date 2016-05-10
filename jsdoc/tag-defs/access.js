module.exports = function(extractAccessTransform) {
  extractAccessTransform.accessProperty = 'access';
  extractAccessTransform.accessTagName = 'access';
  return {
    name: 'access',
    transforms: extractAccessTransform
  };
};