const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('canonical-path');
/**
 * @dgService writeFile
 * @description
 * Write the given contents to a file, ensuring the path to the file exists
 */
module.exports = function writeFile() {
  return (file, content) =>
    mkdirp(path.dirname(file))
      .then(() => new Promise((resolve, reject) => {
        return fs.writeFile(file, content, err => {
          if (err) { reject(err); }
          resolve();
        });
      }));
};