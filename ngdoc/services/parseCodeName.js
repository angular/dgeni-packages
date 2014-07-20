/**
 * @dgService parseCodeName
 * @kind function
 * Parse the code name into parts
 * @param  {String} codeName The full code name that will be parsed
 * @return {Array}          An array of parts that have been parsed from the code name
 */
module.exports = function parseCodeName() {
  return function(codeName) {
    var parts = [];
    var currentPart;

    codeName.split('.').forEach(function(part) {
      var subParts = part.split(':');

      var name = subParts.pop();
      var modifier = subParts.pop();

      if ( !modifier && currentPart  ) {
        currentPart.name += '.' + name;
      } else {
        currentPart = {
          name: name,
          modifier: modifier
        };
        parts.push(currentPart);
      }
    });
    return parts;
  };
};