const path = require('canonical-path');
const encode = require('urlencode');

/**
 * @dgProcessor checkAnchorLinksProcessor
 * @param {Object} log A service that provides logging
 * @description Checks that the generated documents do not have any dangling anchor links.
 */
module.exports = function checkAnchorLinksProcessor(log, resolveUrl, extractLinks, createDocMessage) {
  return {
    ignoredLinks: [/^http(?:s)?:\/\//, /^mailto:/, /^chrome:/],
    pathVariants: ['', '/', '.html', '/index.html'],
    checkDoc(doc) { return doc.path && doc.outputPath && path.extname(doc.outputPath) === '.html'; },
    base: null,
    webRoot: '/',
    errorOnUnmatchedLinks: false,
    $validate: {
      ignoredLinks: { presence: true },
      pathVariants: { presence: true },
      webRoot: { presence: true }
    },
    $runAfter:['writing-files'],
    $runBefore: ['files-written'],
    $process(docs) {
      const allDocs = [];
      const allValidReferences = {};

      // Extract and store all the possible valid anchor reference that can be found
      // in each doc to the allValidReferences hash for checking later
      docs.forEach(doc => {


        // Only check specified output files
        if ( this.checkDoc(doc) ) {

          // Make the path to the doc relative to the webRoot
          const docPath = path.join(this.webRoot, resolveUrl(this.base, doc.path, this.base));

          // Parse out all link hrefs, names and ids
          const linkInfo = extractLinks(doc.renderedContent);
          linkInfo.path = docPath;
          linkInfo.outputPath = doc.outputPath;
          linkInfo.doc = doc;
          allDocs.push(linkInfo);

          this.pathVariants.forEach(pathVariant => {
            const docPathVariant = docPath + pathVariant;

            // The straight doc path is a valid reference
            allValidReferences[docPathVariant] = true;
            // The path with a trailing hash is valid
            allValidReferences[docPathVariant + '#'] = true;
            // The path referencing each name/id in the doc is valid
            linkInfo.names.forEach(name => {
              allValidReferences[docPathVariant + '#' + name] = true;
            });
          });
        }
      });

      let unmatchedLinkCount = 0;
      const messages = [];

      // Check that all anchor links in each doc point to valid
      // references within the docs collection
      allDocs.forEach(linkInfo => {
        log.silly('checking file', linkInfo);

        const unmatchedLinks = [];

        // Filter out links that should be ignored
        linkInfo.hrefs
          .filter(href => this.ignoredLinks.every(rule => !rule.test(href)))
          .forEach(link => {
            const normalizedLink = path.join(this.webRoot, resolveUrl(linkInfo.path, encode.decode(link), this.base));
            if (!this.pathVariants.some(pathVariant => allValidReferences[normalizedLink + pathVariant])) {
              unmatchedLinks.push(link);
            }
          });

        if (unmatchedLinks.length) {
          unmatchedLinkCount += unmatchedLinks.length;
          messages.push(
              createDocMessage('      ', linkInfo.doc) +
              '\n' +
              unmatchedLinks.map(link => '         - ' + link).join('\n'));
        }
      });

      if ( unmatchedLinkCount ) {
        const plural = unmatchedLinkCount > 0 ? 's' : '';
        const errorMessage =
            `Dangling links: ${unmatchedLinkCount} unmatched link${plural}. The following docs have links to URLs that do not exist\n` +
            messages.join('\n');
        if (this.errorOnUnmatchedLinks) {
          throw new Error(errorMessage);
        } else {
          log.warn(errorMessage);
        }
      }
    }
  };
};
