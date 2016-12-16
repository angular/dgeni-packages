var mkdirp = require('mkdirp-promise');
var fs = require('fs');
var path = require('canonical-path');
/**
 * @dgService writeFile
 * @description
 * Write the given contents to a file, ensuring the path to the file exists
 */
module.exports = function writeFile() {
  return function(file, content) {
    return mkdirp(path.dirname(file)).then(function() {
      return new Promise(function(resolve, reject) {
        fs.writeFile(file, content, function(err) {
          if (err) { reject(err); }
          resolve();
        });
      });
    });
  };
};