module.exports = function() {
  return {
    name: 'dgProcessor',
    docProperty: 'name',
    transforms: function(doc, tag, value) {
      doc.docType = 'dgProcessor';
      return value;
    }
  };
};