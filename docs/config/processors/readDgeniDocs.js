
var eyes = require('eyes');
var inspect = require('eyes').inspector({ stream: null });

module.exports = function readDgeniDocs() {
  return {
    $runAfter: ['adding-extra-docs'],
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

      // console.log(inspect(docs[0]));

      return [indexPage];
    }
  };
}

function hasTagPrefix(doc, prefix) {
  return doc.tags.tags.some(function (tag) {
    return tag.tagName.indexOf(prefix) === 0;
  });
}
