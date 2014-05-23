var _ = require('lodash');
var path = require('canonical-path');
var code = require('../../utils/code.js');
var log = require('winston');

/**
 * Parse the code name into parts
 * @param  {String} codeName The full code name that will be parsed
 * @return {Array}          An array of parts that have been parsed from the code name
 */
function _parseCodeName(codeName) {
  var parts = [];
  var currentPart;

  _.forEach(codeName.split('.'), function(part) {
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
}

/**
 * Get a list of all the partial code names that can be made from the provided set of parts
 * @param  {Array} codeNameParts A collection of parts for a code name
 * @return {Array}               A collection of partial names
 */
function _getPartialNames(codeNameParts) {

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
  _.forEachRight(codeNameParts, function(part) {

    // Add this part to each of the partials we have so far
    _.forEach(partialNames, function(name) {

      // Add the part name and modifier, if provided
      partialNames.push(part.name + '.' + name);
      if ( part.modifier ) {
        partialNames.push(part.modifier + ':' + part.name + '.' + name);
      }
    });

  });

  if ( methodName ) {
    partialNames.push(methodName);
  }

  return partialNames;
}

/**
 * A map of partial names to docs
 */
function PartialNames(docs) {
  this.map = Object.create(null);
  that = this;
  _.forEach(docs, function(doc) {
    that.addDoc(doc);
  });
}

/**
 * Add a new document to the map associating it with each of its potential partial names
 * @param {Object} doc The document to add to the map
 */
PartialNames.prototype.addDoc = function(doc) {

  var map = this.map;

  doc.partialNames = _getPartialNames(_parseCodeName(doc.id));

  // We now store references to this doc under all its partial names in the partialNames map
  // This map will be used to match relative links later on
  _.forEach(doc.partialNames, function(partialName) {

    if ( !map[partialName] ) {
      // This partial name is not yet used - create a new map
      map[partialName] = [];
    }

    // Add doc to the partial list
    map[partialName].push(doc);
  });

};


PartialNames.prototype.removeDoc = function(doc) {

  var map = this.map;

  _.forEach(doc.partialNames, function(partialName) {

    var matchedDocs = map[partialName];

    if ( matchedDocs === doc ) {
      // There is only one doc and it is the one we want to remove
      delete map[partialName];
    } else if ( _.isArray(matchedDocs) ) {
      // We have an array of docs so we need to remove the culprit
      var index = matchedDocs.indexOf(doc);
      if ( index !== -1 ) {
        matchedDocs.splice(index, 1);
      }
      if ( matchedDocs.length === 1 ) {
        map[partialName] = matchedDocs[0];
      }
    }

  });
};


PartialNames.prototype.getDoc = function(partialName) {
  return this.map[partialName];
};

/**
 * Get link information to a document that matches the given url
 * @param  {String} url   The url to match
 * @param  {String} title An optional title to return in the link information
 * @return {Object}       The link information
 */
PartialNames.prototype.getLink = function(url, title, currentDoc) {
  var linkInfo = {
    url: url,
    type: 'url',
    valid: true,
    title: title || url
  };

  if ( !url ) {
    throw new Error('Invalid url');
  }

  var doc = this.map[url];

  if ( _.isArray(doc) && currentDoc ) {
    // If there is more than one item with this name then first
    // try to filter them by the currentDoc's area
    doc = _.filter(doc, function(doc) {
      return doc.area === currentDoc.area;
    });
    if ( doc.length === 1 ) {
      doc = doc[0];
    }
  }

  if ( _.isArray(doc) ) {

    linkInfo.valid = false;
    linkInfo.error = 'Ambiguous link: "' + url + '".\n' +
      _.reduce(doc, function(msg, doc) { return msg + '\n  "' + doc.id + '"'; }, 'Matching docs: ');

  } else if ( doc ) {

    linkInfo.url = doc.path;
    linkInfo.title = title || code(doc.name, true);
    linkInfo.type = 'doc';

  } else if ( url.indexOf('#') > 0 ) {
    var pathAndHash = url.split('#');
    linkInfo = this.getLink(pathAndHash[0], title);
    linkInfo.url = linkInfo.url + '#' + pathAndHash[1];
    return linkInfo;

  } else if ( url.indexOf('/') === -1 && url.indexOf('#') !== 0 ) {

    linkInfo.valid = false;
    linkInfo.error = 'Invalid link (does not match any doc): "' + url + '"';

  } else {

    linkInfo.title = title || (( url.indexOf('#') === 0 ) ? url.substring(1) : path.basename(url, '.html'));

  }

  return linkInfo;
};

module.exports = {
  PartialNames: PartialNames
};
