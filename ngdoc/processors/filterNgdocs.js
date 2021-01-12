const _ = require('lodash');

/**
 * @dgProcessor filterNgDocsProcessor
 * @description
 * Remove docs that do not contain the ngdoc tag
 */
module.exports = function filterNgDocsProcessor(log) {
  return {
    $runAfter: ['tags-parsed'],
    $runBefore: ['extracting-tags'],
    $process(docs) {
      const docCount = docs.length;
      docs = _.filter(docs, doc => doc.tags.getTag('ngdoc'));
      log.debug('filtered ' + (docCount - docs.length) + ' docs');
      return docs;
    }
  };
};