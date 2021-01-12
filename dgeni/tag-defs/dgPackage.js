module.exports = function() {
  return {
    name: 'dgPackage',
    docProperty: 'name',
    transforms(doc, tag, value) {
      doc.docType = 'dgPackage';
      return value;
    }
  };
};