var _ = require('lodash');
var path = require('canonical-path');
var glob = require('glob');

/**
 * @dgService templateFinder
 * @description
 * Search a configured set of folders and patterns for templates that match a document.
 */
module.exports = function templateFinder(log) {

  return {

    /**
     * Set the list of glob that will be searched for matching templates
     * @param {string[]} templateFolders A collection of folders to search for templates. The templateFinder
     *                                   will also search all subfolders.
     */
    setTemplateFolders: function(templateFolders) {

      if ( !templateFolders || !templateFolders.length ) {
        throw new Error('You must provide at least one template folder');
      }

      // Traverse each templateFolder and store an index of the files found for later
      this.templateSets = _.map(templateFolders, function(templateFolder) {
        return {
          templateFolder: templateFolder,
          templates: _.indexBy(glob.sync('**/*', { cwd: templateFolder }))
        };
      });
    },

    /**
     * Set the list of patterns that will be used to match documents to templates
     * @param {string[]} templatePatterns A collection of patterns to use to match templates against
     *                                    documents. The patterns are expanded using lodash template
     *                                    interpolation, by passing in the document to match as `doc`.
     */
    setTemplatePatterns: function(templatePatterns) {

      if ( !templatePatterns || !templatePatterns.length ) {
        throw new Error('You must provide at least one template pattern');
      }

      // Compile each of the patterns and store them for later
      this.patternMatchers = _.map(templatePatterns, function(pattern) {

        // Here we use the lodash micro templating.
        // The document will be available to the micro template as a `doc` variable
        return _.template(pattern, null, { variable: 'doc' });
      });

    },


    /**
     * Find the path to a template for the specified documents
     * @param  {Object} doc The document for which to find a template
     * @return {string}     The path to the matched template
     */
    findTemplate: function(doc) {
      var templatePath;

      // Search the template sets for a matching pattern for the given doc
      _.any(this.templateSets, function(templateSet) {
        return _.any(this.patternMatchers, function(patternMatcher) {
          log.silly('looking for ', patternMatcher(doc));
          templatePath = templateSet.templates[patternMatcher(doc)];
          if ( templatePath ) {
            log.debug('template found', path.resolve(templateSet.templateFolder, templatePath));
            return true;
          }
        }, this);
      }, this);

      if ( !templatePath ) {
        throw new Error(
          'No template found for "' + (doc.id || doc.name || doc.docType) + '" document.\n' +
          'The following template patterns were tried:\n' +
          _.reduce(this.patternMatchers, function(str, pattern) {
            return str + '  "' + pattern(doc) + '"\n';
          }, '') +
          'The following folders were searched:\n' +
          _.reduce(this.templateSets, function(str, templateSet) {
            return str + '  "' + templateSet.templateFolder + '"\n';
          }, '')
        );
      }

      return templatePath;
    }
  };
};