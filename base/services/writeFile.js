const fs = require('fs');
const path = require('canonical-path');
/**
 * @dgService writeFile
 * @description
 * Write the given contents to a file, ensuring the path to the file exists
 */
module.exports = function writeFile() {
  return async (file, content) => {
    await fs.promises.mkdir(path.dirname(file), {recursive: true});
    await fs.promises.writeFile(file, content);
  };
};
