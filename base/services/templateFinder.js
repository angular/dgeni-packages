const _ = require('lodash');
const path = require('canonical-path');
const glob = require('glob');

/**
 * @dgService templateFinder
 * @description
 * Search a configured set of folders and patterns for templates that match a document.
 */
module.exports = function templateFinder(log, createDocMessage) {

  return {

    /**
     * A collection of folders to search for templates. The templateFinder will also search all
     * subfolders.
     */
    templateFolders: [],

    /**
     * A collection of patterns to use to match templates against documents. The patterns are
     * expanded using lodash template interpolation, by passing in the document to match as `doc`.
     */
    templatePatterns: [],


    getFinder() {

      // Traverse each templateFolder and store an index of the files found for later
      const templateSets = _.map(this.templateFolders, templateFolder => ({
        templateFolder: templateFolder,
        templates: _.keyBy(glob.sync('**/*', { cwd: templateFolder }))
      }));

      // Compile each of the patterns and store them for later
      const patternMatchers = _.map(this.templatePatterns, pattern =>
        // Here we use the lodash micro templating.
        // The document will be available to the micro template as a `doc` variable
        _.template(pattern, { variable: 'doc' })
      );

      /**
       * Find the path to a template for the specified documents
       * @param  {Object} doc The document for which to find a template
       * @return {string}     The path to the matched template
       */
      return function findTemplate(doc) {
        let templatePath;

        // Search the template sets for a matching pattern for the given doc
        _.some(templateSets, templateSet =>
          _.some(patternMatchers, patternMatcher => {
            log.silly('looking for ', patternMatcher(doc));
            templatePath = templateSet.templates[patternMatcher(doc)];
            if ( templatePath ) {
              log.debug('template found', path.resolve(templateSet.templateFolder, templatePath));
              return true;
            }
          })
        );

        if ( !templatePath ) {
          throw new Error(createDocMessage(
            'No template found./n' +
            'The following template patterns were tried:\n' +
            _.reduce(patternMatchers, (str, pattern) => str + '  "' + pattern(doc) + '"\n', '') +
            'The following folders were searched:\n' +
            _.reduce(templateSets, (str, templateSet) => str + '  "' + templateSet.templateFolder + '"\n', ''),
          doc));
        }

        return templatePath;
      };
    }
  };
};