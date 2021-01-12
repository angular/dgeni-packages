module.exports = function() {
  return {
    name: 'description',
    transforms(doc, tag, value) {
      if ( doc.tags.description ) {
        value = doc.tags.description + '\n' + value;
      }
      return value;
    },
    defaultFn(doc) {
      return doc.tags.description;
    }
  };
};