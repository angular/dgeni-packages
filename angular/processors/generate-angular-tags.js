'use strict';

var _ = require('lodash');
var Tag = require('dgeni-packages/jsdoc/lib/Tag');


module.exports = function generateAngularTagsProcessor(parseTagsProcessor) {
  return {
    $runAfter: ['parseTagsProcessor'],
    $runBefore: ['filterNgDocsProcessor'],
    $process: $process
  };

  function $process(docs) {
    var tagDefMap = {};
    parseTagsProcessor.tagDefinitions.forEach(function(tagDef) {
      tagDefMap[tagDef.name] = tagDef;
    });

    docs
      .filter(doc => doc.autoTags)
      .forEach(parseAutoTags);

    function parseAutoTags(doc) {
      _.forEach(doc.autoTags, function(descriptions, tagName) {
        descriptions.forEach(function(description) {
          doc.tags.addTag(new Tag(tagDefMap[tagName], tagName, description));
        });
      });
    }
  }
};
