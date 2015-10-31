module.exports = function() {
  return {
    name: 'dgService',
    docProperty: 'name',
    transforms: function(doc, tag, value) {
      doc.docType = 'dgService';
      return value;
    }
  };
};