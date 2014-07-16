module.exports = function(extractNameTransform, extractTypeTransform, wholeTagTransform) {
  return {
    name: 'property',
    multi: true,
    docProperty: 'properties',
    transforms: [ extractTypeTransform, extractNameTransform, wholeTagTransform ]
  };
};