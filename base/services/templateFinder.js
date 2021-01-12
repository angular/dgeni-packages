const path = require('canonical-path');
const glob = require('glob');
const templateFn = require('lodash.template');

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
      const templateSets = this.templateFolders.map(templateFolder => {
        const templates = {};
        for(const template of glob.sync('**/*', { cwd: templateFolder })) {
          templates[template] = template;
        }
        return { templateFolder, templates };
      });

      // Compile each of the patterns and store them for later
      const patternMatchers = this.templatePatterns.map(pattern => templateFn(pattern, { variable: 'doc' }));

      /**
       * Find the path to a template for the specified documents
       * @param  {Object} doc The document for which to find a template
       * @return {string}     The path to the matched template
       */
      return function findTemplate(doc) {
        let templatePath;

        // Search the template sets for a matching pattern for the given doc
        templateSets.some(templateSet =>
          patternMatchers.some(patternMatcher => {
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
            patternMatchers.reduce((str, pattern) => `${str}  "${pattern(doc)}"\n`, '') +
            'The following folders were searched:\n' +
            templateSets.reduce((str, templateSet) => `${str}  "${templateSet.templateFolder}"\n`, ''),
          doc));
        }

        return templatePath;
      };
    }
  };
};
