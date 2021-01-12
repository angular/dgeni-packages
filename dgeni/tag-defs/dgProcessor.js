module.exports = function() {
  return {
    name: 'dgProcessor',
    docProperty: 'name',
    transforms(doc, tag, value) {
      doc.docType = 'dgProcessor';
      return value;
    }
  };
};