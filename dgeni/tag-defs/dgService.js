module.exports = function() {
  return {
    name: 'dgService',
    docProperty: 'name',
    transforms(doc, tag, value) {
      doc.docType = 'dgService';
      return value;
    }
  };
};