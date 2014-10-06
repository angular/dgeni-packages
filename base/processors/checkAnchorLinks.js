var _ = require('lodash');

/**
 * @dgProcessor checkAnchorLinksProcessor
 * @param {Object} log A service that provides logging
 * @description Checks that the generated documents do not have any dangling anchor links.
 */
module.exports = function checkAnchorLinksProcessor(log, urlExtractor, linkExtractor) {
  return {
    ignoredLinks: [/^http(?:s)?:\/\//, /^mailto:/],
    base: null,
    $validate: {
      ignoredLinks: { presence: true }
    },
    $runAfter:['writing-files'],
    $runBefore: ['files-written'],
    $process: function(docs) {
      var ignoredLinks = this.ignoredLinks;
      var base = this.base;
      var allDocs = {};
      var allValidReferences = {};

      _.forEach(docs, function(doc) {
        if (endsWith(doc.outputPath, '.html')) {
          allDocs[doc.outputPath] = linkExtractor.extractLinks(doc.renderedContent);
          _.forEach(variations(doc.outputPath), function(variation) {
            allValidReferences[variation] = true;
            allValidReferences[variation + '#'] = true;
            _.forEach(allDocs[doc.outputPath].names, function(name) {
              allValidReferences[variation + '#' + name] = true;
            });
          })
        }
      });

      _.forEach(allDocs, function(links, outputPath) {
        var hrefs;

        log.silly('checking file', outputPath);
        hrefs = links.hrefs;
        _.forEach(ignoredLinks, function(rule) {
          hrefs = _.filter(hrefs, function (link) {
            return !rule.test(link);
          });
        });
          
        _.forEach(hrefs, function(link) {
          var normalizedLink = urlExtractor.calculatePath(outputPath, link, base)
          if (!allValidReferences[normalizedLink]) {
            log.warn('Link found at', outputPath, 'pointing to dangling reference', link);
          }
        });
      });
    }
  };

  function endsWith(input, sufix) {
    if (input == null) return false;
    if (input.length < sufix.length) return false;
    return input.indexOf(sufix, input.length - sufix.length) != -1;
  }

  function variations(input) {
    return [input, input.substring(0, input.length - '.html'.length)];
  }
};
