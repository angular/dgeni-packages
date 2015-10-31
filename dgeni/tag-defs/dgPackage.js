module.exports = function() {
  return {
    name: 'dgPackage',
    docProperty: 'name',
    transforms: function(doc, tag, value) {
      doc.docType = 'dgPackage';
      return value;
    }
  };
};