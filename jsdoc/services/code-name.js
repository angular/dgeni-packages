/**
 * @dgProcessor codeNameService
 * @description  Infer the name of the document from name of the following code
 */
module.exports = function codeNameService(log, codeNameMap, getInjectables) {
  var REMOVE_SUFFIX_REGEX = /NodeMatcher$/;

  /**
   * Registers code name mappers
   * @param {Function|Function[]}
   */
  function registerCodeNameMatcher (list) {
    list.forEach(function(v) {
      if (v && v.name) {
        codeNameMap.set(v.name.replace(REMOVE_SUFFIX_REGEX, ''), v);
      } else {
        log.warn('Anonymous matchers are not supported', v);
      }
    });
  }

  /**
   * Recurse down the code AST node that is associated with this doc for a name
   * @param  {Object} node The JS AST node information for the code to find the name of
   * @return {String}      The name of the code or null if none found.
   */
  function findCodeName(node) {
    var res = null;
    if (node) {
      var matcher = codeNameMap.get(node.type);
      if (matcher) {
        res = matcher(node);
      } else {
        log.warn('HELP! Unrecognised node type: %s', node.type);
        log.warn(node);
      }
    }
    return res;
  }

  var api = {
    find: findCodeName
  }

  /**
   * @property {Function[]} matchers AST node matchers
   * @propertyof codeNameService
   */
  Object.defineProperty(api, 'matchers', {
    set: registerCodeNameMatcher
  });

  return api;
};
