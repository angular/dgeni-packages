const cloneDeep = require('clonedeep');

/**
 * @dgProcessor
 * @description
 * Extract the information from the tags that were parsed
 */
module.exports = function extractTagsProcessor(log, parseTagsProcessor, createDocMessage) {
  return {
    defaultTagTransforms: [],
    $validate: {
      defaultTagTransforms: { presence: true }
    },
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process(docs) {
      const tagExtractor = createTagExtractor(parseTagsProcessor.tagDefinitions, this.defaultTagTransforms);
      docs.forEach(doc => {
        log.debug(createDocMessage('extracting tags', doc));
        tagExtractor(doc);
      });
    }
  };

  /**
   * Create a function that will extract information, to properties on the tag or doc, from the tags
   * that were parsed from the doc.
   *
   * @param  {Array} tagDefinitions
   *           A collection of tagDefinitions to extract from the parsed tags.
   * @param  {function(doc, tag, value)|Array.<function(doc, tag, value)>} [defaultTagTransforms]
   *           A single transformation function (or collection of transformation functions) to apply
   *           to every tag that is extracted.
   */
  function createTagExtractor(tagDefinitions, defaultTagTransforms) {

    // Compute a default transformation function
    const defaultTransformFn = getTransformationFn(defaultTagTransforms);

    // Add some useful methods to the tagDefs
    const tagDefs = tagDefinitions.map(tagDef => {

      // Make a copy of the tagDef as we are going to modify it
      tagDef = cloneDeep(tagDef);

      // Compute this tagDefs specific transformation function
      const transformFn = getTransformationFn(tagDef.transforms);

      // Attach a transformation function to the cloned tagDef
      // running the specific transforms followed by the default transforms
      const tagProperty = tagDef.tagProperty || 'description';
      tagDef.getProperty = (doc, tag) => {
        let value = tag[tagProperty];
        value = transformFn(doc, tag, value);
        value = defaultTransformFn(doc, tag, value);
        return value;
      };

      return tagDef;
    });

    return function tagExtractor(doc) {

      // Try to extract each of the tags defined in the tagDefs collection
      tagDefs.forEach(tagDef => {

        log.silly('extracting tags for: ' + tagDef.name);

        const docProperty = tagDef.docProperty || tagDef.name;
        log.silly(' - to be attached to doc.' + docProperty);

        // Collect the tags for this tag def
        const tags = doc.tags.getTags(tagDef.name);

        // No tags found for this tag def
        if ( tags.length === 0 ) {

          // This tag is required so throw an error
          if ( tagDef.required ) {
            throw new Error(createDocMessage('Missing tag "' + tagDef.name, doc));
          }

          applyDefault(doc, docProperty, tagDef);

        } else {
          readTags(doc, docProperty, tagDef, tags);
        }

      });

      if ( doc.tags.badTags.length > 0 ) {
        log.warn(formatBadTagErrorMessage(doc));
      }
    };
  }

  function applyDefault(doc, docProperty, tagDef) {
    log.silly(' - tag not found');
    // Apply the default function if there is one
    if ( tagDef.defaultFn ) {
      log.silly('   - applying default value function');
      const defaultValue = tagDef.defaultFn(doc);
      log.silly('     - default value: ', defaultValue);
      if (tagDef.multi) {
        doc[docProperty] = Array.isArray(doc[docProperty]) ? doc[docProperty] : [];
      }
      if ( defaultValue !== undefined ) {
        // If the defaultFn returns a value then use this as the document property
        if ( tagDef.multi ) {
          doc[docProperty].push(defaultValue);
        } else {
          doc[docProperty] = defaultValue;
        }
      }
    }
  }

  function readTags(doc, docProperty, tagDef, tags) {
    // Does this tagDef expect multiple instances of the tag?
    if ( tagDef.multi ) {
      // We may have multiple tags for this tag def, so we put them into an array
      doc[docProperty] = Array.isArray(doc[docProperty]) ? doc[docProperty] : [];
      tags.forEach(tag => {
        // Transform and add the tag to the array
        const value = tagDef.getProperty(doc, tag);
        if ( value !== undefined ) {
          doc[docProperty].push(value);
        }
      });
    } else {
      // We only expect one tag for this tag def
      if ( tags.length > 1 ) {
        throw new Error(createDocMessage('Only one of "' + tagDef.name + '" (or its aliases) allowed. There were ' + tags.length, doc));
      }

      // Transform and apply the tag to the document
      const value = tagDef.getProperty(doc, tags[0]);
      if ( value !== undefined ) {
        doc[docProperty] = value;
      }
    }
    log.silly('   - tag extracted: ', doc[docProperty]);
  }

  /**
   * Create a function to transform from the tag to doc property
   * @param  {function(doc, tag, value)|Array.<function(doc, tag, value)>} transform
   *         The transformation to apply to the tag
   * @return {function(doc, tag, value)} A single function that will do the transformation
   */
  function getTransformationFn(transforms, tagDefName) {

    if (typeof transforms === 'function') {

      // transform is a single function so just use that
      return transforms;
    }

    if ( Array.isArray(transforms) ) {

      // transform is an array then we will apply each in turn like a pipe-line
      return (doc, tag, value) => {
        transforms.forEach(transform => value = transform(doc, tag, value));
        return value;
      };
    }

    if ( !transforms ) {

      // No transform is specified so we just provide a default
      return (doc, tag, value) => value;

    }

    if (tagDefName) {
      throw new Error('Invalid transformFn in tag definition, ' + tagDefName +
        ' - you must provide a function or an array of functions.');
    } else {
      throw new Error('Invalid default transformFn - you must provide a function or an array of functions.');
    }
  }

  function formatBadTagErrorMessage(doc) {
    let id = (doc.id || doc.name);
    id = id ? '"' + id + '" ' : '';
    let message = createDocMessage('Invalid tags found', doc) + '\n';

    doc.tags.badTags.forEach(badTag => {
      let description = typeof badTag.description === 'string' ? badTag.description.substr(0, 20) + '...' : '';
      if ( badTag.name ) {
        description = badTag.name + ' ' + description;
      }
      if ( badTag.typeExpression ) {
        description = '{' + badTag.typeExpression + '} ' + description;
      }

      message += 'Line: ' + badTag.startingLine + ': @' + badTag.tagName + ' ' + description + '\n';

      // An object of type `Tag` in the `badTags` list does not necessarily have an `errors`
      // field attached. This can happen when the tag does not have a tag definition at all.
      // We only append more specific error messages if such concrete errors are available.
      if (badTag.errors !== undefined) {
        badTag.errors.forEach(error => message += '    * ' + error + '\n');
      }
    });

    return message + '\n';
  }

};
