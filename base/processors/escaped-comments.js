var _ = require('lodash');

module.exports = {
  name: 'escaped-comments',
  description:
    'Some files (like CSS) use the same comment markers as the ngdoc comments.\n'+
    'To get around this we HTML encode them in the source.\n'+
    'This processor decodes them back to normal comment markers',
  runAfter: ['docs-rendered'],
  runBefore: ['writing-files'],
  process: function(docs) {

    _.forEach(docs, function(doc) {
      doc.renderedContent = doc.renderedContent.replace(/\/&amp;#42;/g, '/*').replace(/&amp;#42;\//g, '*/');
    });
  }
};