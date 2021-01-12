module.exports = function() {
  return {
    name: 'element',
    defaultFn(doc) {
      if ( doc.docType === 'directive' || doc.docType === 'input') {
        return'ANY';
      }
    }
  };
};