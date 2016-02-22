module.exports = function(accessTagTransform) {
  var name = 'public';

  accessTagTransform.addTag(name);
  accessTagTransform.addValue(name);

  function getValue() {
    return name;
  }

  return {
    name: name,
    docProperty: 'access',
    transforms: [getValue, accessTagTransform]
  };
};