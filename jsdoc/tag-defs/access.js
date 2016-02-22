module.exports = function(accessTagTransform, trimWhitespaceTransform) {
  var name = 'access'
  accessTagTransform.addTag(name);
  accessTagTransform.addValue('private');
  accessTagTransform.addValue('protected');
  accessTagTransform.addValue('public');

  return {
    name: name,
    docProperty: 'access',
    transforms: [trimWhitespaceTransform, accessTagTransform]
  };
};