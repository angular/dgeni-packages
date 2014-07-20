module.exports = function() {
  return {
    name: 'restrict',
    defaultFn: function(doc) {
      if ( doc.docType === 'directive' || doc.docType === 'input' ) {
        return { element: false, attribute: true, cssClass: false, comment: false };
      }
    },
    transforms: function(doc, tag, value) {
      return {
        element: _.contains(value, 'E'),
        attribute: _.contains(value, 'A'),
        cssClass: _.contains(value, 'C'),
        comment: _.contains(value, 'M')
      };
    }
  };
};