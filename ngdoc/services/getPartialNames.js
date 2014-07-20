/**
 * @dgService getPartialNames
 * @description
 * Get a list of all the partial code names that can be made from the provided set of parts
 * @param  {Array} codeNameParts A collection of parts for a code name
 * @return {Array}               A collection of partial names
 */
module.exports = function getPartialNames() {
  return function(codeNameParts) {

    var methodName;
    var partialNames = [];
    // Add the last part to the list of partials
    var part = codeNameParts.pop();

    // If the name contains a # then it is a member and that should be included in the partial names
    if ( part.name.indexOf('#') !== -1 ) {
      methodName = part.name.split('#')[1];
    }
    // Add the part name and modifier, if provided
    partialNames.push(part.name);
    if (part.modifier) {
      partialNames.push(part.modifier + ':' + part.name);
    }

    // Continue popping off the parts of the codeName and work forward collecting up each partial
    partialNames = codeNameParts.reduceRight(function(partialNames, part) {

      // Add this part to each of the partials we have so far
      partialNames.forEach(function(name) {
        // Add the part name and modifier, if provided
        partialNames.push(part.name + '.' + name);
        if ( part.modifier ) {
          partialNames.push(part.modifier + ':' + part.name + '.' + name);
        }
      });

      return partialNames;
    }, partialNames);

    if ( methodName ) {
      partialNames.push(methodName);
    }

    return partialNames;
  };
};