
// TODO: remove eyes
var eyes = require('eyes');
var inspect = require('eyes').inspector({ stream: null });

module.exports = function readDgeniDocs() {
  return {
    $runAfter: ['processorsData'],
    $runBefore: ['extra-docs-added'],
    $process: function (docs) {
      var indexPage = {
        docType: 'index',
        template: 'index.template.html',
        outputPath: 'index.html',
        path: 'index.html'
      };

      indexPage.docs = docs.filter(function (doc) {
        return hasTagPrefix(doc, 'dg');
      });

      docs.push(indexPage);

      return docs.filter(function (doc) {
        return (doc.docType === 'index' || doc.docType === 'json');
      });
    }
  };
}

function hasTagPrefix(doc, prefix) {
  if (!doc.tags || !doc.tags.tags) return false;

  return doc.tags.tags.some(function (tag) {
    return tag.tagName.indexOf(prefix) === 0;
  });
}
