var url = require('url');
var canonicalPath = require('canonical-path');

/**
 * @dgService urlExtractor
 * @description
 * A url extractor
 */
module.exports = function urlExtractor() {
  return {
    /**
     * Calculates the absolute path of the url from the current path,
     * the relative path and the base
     * @param {String} currentPath The current path
     * @param {String} newPath The new path
     * @param {String} base The base path
     */
    calculatePath: function(currentPath, newPath, base) {
      if (newPath[0] === '/') return normalize(newPath);
      if (base) return normalize(normalize(base) + '/' + newPath);
      return normalize(url.resolve(currentPath || '', newPath));
    }
  };

  function normalize(path) {
    path = canonicalPath.normalize(path);
    if (path[0] == '/') {
      path = path.substring(1);
    }
    if (!/[\/\?#]/.test(path)) return path;
    var parsedUrl = url.parse(path);
    if (parsedUrl.pathname[parsedUrl.pathname.length - 1] === '/') {
      parsedUrl.pathname = parsedUrl.pathname.substring(0, parsedUrl.pathname.length - 1);
    }
    return parsedUrl.pathname + (parsedUrl.hash || '');
  }

};
