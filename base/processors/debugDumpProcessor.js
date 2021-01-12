const path = require('canonical-path');
var util = require("util");

/**
 * @dgProcessor debugDumpProcessor
 * @description
 * This processor dumps docs that match a filter to a file
 */
module.exports = function debugDumpProcessor(log, readFilesProcessor, writeFile) {
  return {
    filterFn(docs) { return docs; },
    outputPath: 'debug-dump.txt',
    depth: 2,

    $enabled: false,

    $validate: {
      filterFn: { presence: true },
      outputPath: { presence: true },
      depth: { presence: true }
    },

    $runBefore: ['writing-files'],

    $process(docs) {
      log.info('Dumping docs:', this.filterFn, this.outputPath);
      const filteredDocs = this.filterFn(docs);
      const dumpedDocs = util.inspect(filteredDocs, this.depth);
      const outputPath = path.resolve(readFilesProcessor.basePath, this.outputPath);
      return writeFile(outputPath, dumpedDocs).then(() => docs);
    }
  };

};