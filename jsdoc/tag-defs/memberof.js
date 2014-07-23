module.exports = function() {
  return {
    name: 'memberof',
    defaultFn: function(doc) {
      if ( doc.docType === 'event' || doc.docType === 'property' || doc.docType === 'method' ) {
        throw new Error('Missing tag "@memberof" for doc of type "'+ doc.docType + '" in file "' + doc.fileInfo.filePath + '" at line ' + doc.startingLine);
      }
    },
    transforms: function(doc, tag, value) {
      if ( !(doc.docType === 'event' || doc.docType === 'property' || doc.docType === 'method') ) {
        throw new Error('"@'+ tag.name +'" tag found on non-'+ doc.docType +' document in file "' + doc.fileInfo.filePath + '" at line ' + doc.startingLine);
      }
      return value;
    }
  };
};