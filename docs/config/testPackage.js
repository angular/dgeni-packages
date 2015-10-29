
var path = require('canonical-path');
var Package = require('dgeni').Package;

var projectPath = path.resolve(__dirname, '../..');

module.exports = new Package('testPackage', [
  require(path.resolve(projectPath, 'base')),
  require(path.resolve(projectPath, 'nunjucks')),
  require(path.resolve(projectPath, 'jsdoc')),
  require(path.resolve(projectPath, 'ngdoc')),
  require(path.resolve(projectPath, 'examples'))
])

;
