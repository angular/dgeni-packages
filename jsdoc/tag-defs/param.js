module.exports = function(extractNameTransform, extractTypeTransform, wholeTagTransform) {
  return {
    name: 'param',
    multi: true,
    docProperty: 'params',
    transforms: [ extractTypeTransform, extractNameTransform, wholeTagTransform ]
  };
};