module.exports = function checkAccessTagsProcessor(createDocMessage) {
  return {
    $runAfter: ['tags-extracted'],
    $runBefore: ['processing-docs'],
    $validate: { accessTypes: { presence: true } },
    accessTypes: ['private', 'protected', 'public'],
    $process: function(docs) {
      var accessTypes = this.accessTypes;

      docs.forEach(function(doc) {

        // Check for invalid access type
        if (doc.access && accessTypes.indexOf(doc.access) === -1) {
          throw new Error(createDocMessage('"' + doc.access + '" is not an allowed access type for the "@access" tag. Try adding it to the checkAccessTagsProcessor.accessTypes array', doc));
        }

        // Check for multiple tags
        var accessTypesFound = [];
        accessTypes.forEach(function(accessType) {
          if (doc[accessType]) {
            accessTypesFound.push('@' + accessType);
          }
        });
        if (doc.access) {
          accessTypesFound.push('@access ' + doc.access);
        }
        if (accessTypesFound.length > 1) {
          var tagList = accessTypesFound.map(function(tag) {
            return '* ' + tag + '\n';
          }).join('');
          throw new Error(createDocMessage(
            'Only one access type tag is allowed per document. Tags found were:\n' + tagList, doc));
        }

        // Convert "access" properties to explicit properties
        if (doc.access) {
          doc[doc.access] = true;
        }
      });

      return docs;
    }
  };
};
