var htmlparser = require("htmlparser2");

/**
 * @dgService linkExtractor
 * @description
 * A url extractor
 */
module.exports = function linkExtractor() {
  return {
    /**
     * Extracts the links and references from a given html
     * @param {String} html The html
     */
    extractLinks: function(html) {
      var result = {hrefs: [], names: []};
      var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
          if (name === 'a') {
            if (attribs.href) {
              result.hrefs.push(attribs.href);
            }
            if (attribs.name) {
              result.names.push(attribs.name);
            }
          }
        }
      }, {
        decodeEntities: true
      });
      parser.write(html);
      parser.end();
      return result;
    }
  };

};
