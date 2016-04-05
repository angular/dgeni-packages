module.exports = function(createDocMessage) {
  var STANDARD_VALUES = ['private', 'protected', 'public'];
  return {
    name: 'access',
    transforms: function(doc, tag, value) {
      var value = value.trim();
      if (STANDARD_VALUES.indexOf(value) !== -1) {
        if (doc.tags.getTags(value).length > 0) {
          throw new Error(createDocMessage('"@access ' + value + '" tag cannot be used with "@' + value + '" tag on the same document', doc));
        }
        doc[value] = true;
      }
      return value;
    }
  };
};