
var _ = require('lodash');
var path = require('canonical-path');
var inspect = require('eyes').inspector({ stream: null });

module.exports = function packagesData() {
  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function (docs) {
      // Get packages
      var packages = docs.filter(function (doc) {
        return doc.hasOwnProperty('dgPackage') && (!doc.dgType || !doc.dgType === 'processor');
      })
      .map(function(p) {
        p.name = p.dgPackage;
        p.abbr = p.name.substr(0, 2).toUpperCase();
        return _.pick(p, ['name', 'abbr', 'dgPackage', 'path', 'area', 'codeName', 'description', 'docType']);
      });

      docs.push({
        docType: 'json',
        id: 'packages-data',
        name: 'PACKAGES',
        template: 'constant-data.template.js',
        outputPath: 'js/packages-data.js',
        items: packages
      });
    }
  };
}
