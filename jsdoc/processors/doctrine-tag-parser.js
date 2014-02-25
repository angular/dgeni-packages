var _ = require('lodash');
var doctrine = require('doctrine');
var log = require('winston');

// A simple container of parsed tags with helpers
var Tags = function(content, tags) {
  // Sloppy implies support for jsdoc3 and closure compiler style types
  // Recoverable allows us to collect up information about the bad tags
  var parsed = doctrine.parse(content, { sloppy: true, recoverable: true, tags: tags });
  

  // Filter out the bad tags into a separate collection
  var badTags = this.badTags = [];
  this.tags = _.filter(parsed.tags, function(tag) {
    if ( tag.errors ) {
      badTags.push(tag);
    }
    return !tag.errors;
  });


  // Extract the description if necessary
  if ( parsed.description ) {
    var descriptionTag = this.getTag('description');
    if ( descriptionTag ) {
      descriptionTag.description = parsed.description + '\n' + descriptionTag.description;
    } else {
      this.tags.push({
        title: 'description',
        description: parsed.description
      });
    }
  }
};

Tags.prototype = {
  getTag: function(name, aliases) {
    var names = (aliases || []).concat(name);
    return _.find(this.tags, function(tag) { return _.contains(names, tag.title); });
  },

  getTags: function(name, aliases) {
    var names = (aliases || []).concat(name);
    return _.where(this.tags, function(tag) { return _.contains(names, tag.title); });
  },

  getType: function(tag) {
    try {
    var isOptional = tag.type.type === 'OptionalType';
    var mainType = isOptional ? tag.type.expression : tag.type;
    var mainTypeString = doctrine.type.stringify(mainType);
    var isUnion = mainType.type === 'UnionType';
    var typeList;
    if ( isUnion ) {
      typeList = _.map(mainType.elements, function(element) {
        return doctrine.type.stringify(element);
      });
    } else {
      typeList = [mainTypeString];
    }

    return {
      description: mainTypeString,
      optional: isOptional,
      typeList: typeList
    };
    } catch(e) {
      console.log(e);
      console.log(tag);
      throw e;
    }
  }
};

function formatBadTagErrorMessage(doc) {
  var message = 'Bad tags found in doc "' + doc.id + '" from file "' + doc.file + '" line ' + doc.startingLine + '\n';

  _.forEach(doc.tags.badTags, function(badTag) {
    var title = badTag.title || '<missing>';
    var description =
      badTag.name ||
      (_.isString(badTag.description) ? (badTag.description.substr(0, 20) + '...') : '<missing>');

    message += '  - Bad tag: "' + title + '" - "' + description + '"\n';
    _.forEach(badTag.errors, function(error) {
      message += '    * ' + error + '\n';
    });
  });

  return message + '\n';
}

var tags;
var plugin = module.exports = {
  name: 'doctrine-tag-parser',
  description: 'Parse the doc for tags using doctrine.',
  runAfter: ['parsing-tags'],
  runBefore: ['tags-parsed'],
  init: function(config) {
    tags = _.pluck(config.get('processing.tagDefinitions'), 'name');
    log.debug('Tags to parse:', tags);
  },
  process: function parseDocsWithDoctrine(docs) {
    _.forEach(docs, function(doc) {
      doc.tags = new Tags(doc.content, tags);
      if ( doc.tags.badTags.length > 0 ) {
        log.warn(formatBadTagErrorMessage(doc));
      }
    });
  }
};