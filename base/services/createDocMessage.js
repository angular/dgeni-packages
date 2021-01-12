module.exports = function createDocMessage() {
  return (message, doc, error) => {
    message = message || '';
    if ( doc ) {
      message += ' - doc';
      const docIdentifier = doc.id || doc.name || doc.path;
      if ( docIdentifier ) {
        message += ' "' + docIdentifier + '"';
      }
      if ( doc.docType ) {
        message += ' (' + doc.docType + ') ';
      }
      const filePath = doc.fileInfo && doc.fileInfo.relativePath;
      if ( filePath ) {
        message += ' - from file "' + filePath + '"';
        if ( doc.startingLine ) {
          message += ' - starting at line ' + doc.startingLine;
        }
        if ( doc.endingLine ) {
         message += ', ending at line ' + doc.endingLine;
        }
      }
    }
    if ( error ) {
      message += '\n\nOriginal Error: \n\n' + error.stack;
    }
    return message;
  };
};