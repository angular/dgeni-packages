var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var glob = require('glob');

/**
 * @dgService templateFinder
 * @kind function
 * @param {string[]} templateFolders A collection of folders to search for templates. The templateFinder
 *                                   will also search all subfolders.
 * @param {string[]} templatePatterns A collection of patterns to use to match templates against
 *                                    documents. The patterns are expanded using lodash template
 *                                    interpolation, by passing in the document to match as `doc`.
 * @description
 * Search a configured set of folders and patterns for templates that match a document.
 *
 */
module.exports = function templateFinder(templateFolders, templatePatterns) {

  if ( !templateFolders || !templateFolders.length ) {
    throw new Error('You must provide at least one template folder');
  }
  if ( !templatePatterns || !templatePatterns.length ) {
    throw new Error('You must provide at least one template pattern');
  }

  // Compile each of the patterns and store them for later
  var patterns = _.map(templatePatterns, function(pattern) {

    // Here we use the lodash micro templating.
    // The document will be available to the micro template as a `doc` variable
    return _.template(pattern, null, { variable: 'doc' });
  });

  // Traverse each templateFolder and store an index of the files found for later
  var templateSets = _.map(templateFolders, function(templateFolder) {
    return {
      templateFolder: templateFolder,
      templates: _.indexBy(glob.sync('**/*', { cwd: templateFolder }))
    };
  });


  // The function that will find a template for a given doc
  return function findTemplate(doc) {
    var templatePath;

    // Search the template sets for a matching pattern for the given doc
    _.any(templateSets, function(templateSet) {
      return _.any(patterns, function(pattern) {
        log.silly('looking for ', pattern(doc));
        templatePath = templateSet.templates[pattern(doc)];
        if ( templatePath ) {
          log.debug('template found', path.resolve(templateSet.templateFolder, templatePath));
          return true;
        }
      });
    });

    if ( !templatePath ) {
      throw new Error(
        'No template found for "' + (doc.id || doc.name || doc.docType) + '" document.\n' +
        'The following template patterns were tried:\n' +
        _.reduce(patterns, function(str, pattern) {
          return str + '  "' + pattern(doc) + '"\n';
        }, '') +
        'The following folders were searched:\n' +
        _.reduce(templateSets, function(str, templateSet) {
          return str + '  "' + templateSet.templateFolder + '"\n';
        }, '')
      );
    }


    // return an array of promises to templates that have been found for this doc and set of patterns
    return templatePath;
  };
};