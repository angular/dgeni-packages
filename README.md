# Dgeni Packages

This repository contains a collection of dgeni packages that can be used by the dgeni documentation
generator to create documentation from source code.


Out of the box there are the following packages:

* base - The minimal set of processors to get started with Dgeni
* jsdoc - Tag parsing and extracting
* nunjucks - The nunjucks template rendering engine. No longer in jsdoc - you must add this
  explicitly to your config or you will get
  `Error: No provider for "templateEngine"! (Resolving: templateEngine)`
* ngdoc - The angular.js specific tag-defs, processors and templates.  This loads the jsdoc and
  nunjucks packages for you.
* examples - Processors to support the runnable examples feature in the angular.js docs site.

## `base` Package

### Processors

* `debugDumpProcessor` - dump the current state of the docs array to a file (disabled by default)
* `readFilesProcessor` - used to load up documents from files.  This processor can be configured to use a
set of **file readers**. There are file readers in the `jsdoc` and `ngdoc` packages.
* `renderDocsProcessor` - render the documents into a property (`doc.renderedContent`) using a
`templateEngine`, which must be provided separately - see `nunjucks` package.
* `unescapeCommentsProcessor` - unescape comment markers that would break the jsdoc comment style,
e.g. `*/`
* `writeFilesProcessor` - write the docs to disk

### Services

* `createDocMessage` - a helper for creating nice messages about documents (useful in logging and
errors)
* `encodeDocBlock` - convert a block of code into HTML
* `templateFinder` - search folders using patterns to find a template that matches a given document.
* `trimIndentation` - "intelligently" trim whitespace indentation from the start of each line of a block
of text.


The template used to render the doc is computed by the `templateFinder`, which uses the first match
from a set of patterns in a set of folders, provided in the configuration. This allows a lot of control to provide
generic templates for most situations and specific templates for exceptional cases.

Here is an example of some standard template patterns:

```js
templateFinder.templatePatterns = [
  '${ doc.template }',
  '${doc.area}/${ doc.id }.${ doc.docType }.template.html',
  '${doc.area}/${ doc.id }.template.html',
  '${doc.area}/${ doc.docType }.template.html',
  '${ doc.id }.${ doc.docType }.template.html',
  '${ doc.id }.template.html',
  '${ doc.docType }.template.html'
]
```


## `nunjucks` Package

This package provides a nunjucks driven implementation of the `templateEngine` required by the
`base` package `renderDocsPocessor`. The "nunjucks" JavaScript template tool-kit to generates HTML
based on the data in each document. We have nunjucks templates, tags and filters that
can render links and text as markdown and will highlight code.

### Services

* `nunjucks-template-engine` - provide a `templateEngine` that uses the Nunjucks template library
to render the documents into text, such as HTML or JS, based on templates.

## `jsdoc` Package

### File Readers:

* `jsdoc` - can read documents from jsdoc style comments in source code files.

### Processors

* `codeNameProcessor` - infer the name of the document from the code following the document in the source
file.
* `computePathProcessor` - infer the path to the document, used for writing the file and for navigation
to the document in a web app.
* `parseTagsProcessor` - use a `tagParser` to parses the jsdoc tags in the document content.
* `extractTagsProcessor` - use a `tagExtractor` to extract information from the parsed tags.
* `inlineTagsProcessor` - Search the docs for inline tags that need to have content injected

### Tag Definitions

The `jsdoc` package contains definitions for a number of standard jsdoc tags including: `name`,
`memberof`, `param`, `property`, `returns`, `module`, `description`, `usage`,
`animations`, `constructor`, `class`, `classdesc`, `global`, `namespace`, `method`, `type` and
`kind`.

### Services

This package provides a number of tagTransform services that are used in tag Definitions to transform
the value of the tag from the string in the comment to something more meaningful in the doc.

* `extractNameTransform` - extract a name from a tag
* `extractTypeTransform` - extract a type from a tag
* `trimWhitespaceTransform` - trim whitespace from before and after the tag value
* `unknownTagTransform` - add an error to the tag if it is unknown
* `wholeTagTransform` - Use the whole tag as the value rather than using a tag property

### Templates

**This package does not provide any templates nor a `templateEngine` to render templates (use the
`nunjucks` package to add this).**

## `ngdoc` Package

The `ngdoc` Package depends upon the `jsdoc` and `nunjucks` packages.

## File Readers

* `ngdoc` - can pull a single document from an ngdoc content file.

### Processors

* `apiDocsProcessor` -

This processor runs computations that are specifically related to docs for API components. It does the following:

  - Computes the package name for the module (eg angular or angular-sanitize)
  - Collects up all documents that belong to the module
  - Attaches them to the module doc in the `components` property
  - Computes the URL path to the document in the docs app and the outputPath to the final output file
  - It relates documents about angular services to their corresponding provider document.

apiDocsProcessor has the following configuration options available (listed with the default values set):

  ```js
  apiDocsProcessor.apiDocsPath = undefined; // This is a required property that you must set
  apiDocsProcessor.outputPathTemplate = '${area}/${module}/${docType}/${name}.html';
  apiDocsProcessor.apiPathTemplate = '${area}/${module}/${docType}/${name}';
  apiDocsProcessor.moduleOutputPathTemplate = '${area}/${name}/index.html';
  apiDocsProcessor.modulePathTemplate = '${area}/${name}';
  });
  ```

* `generateComponentGroupsProcessor` -
Generate documents for each group of components (by type) within a module

* `computeIdProcessor` -
Compute the id property of the doc based on the tags and other meta-data

* `computePathProcessor` -
Compute the path and outputPath for docs that do not already have them

* `filterNgdocsProcessor` -
For AngularJS we are only interested in documents that contain the @ngdoc tag.  This processor
removes docs that do not contain this tag.

* `collectPartialNames` -
Add all the docs to the partialNameMap


### Services

* `getLinkInfo()`
* `getPartialNames()`
* `gettypeClass()`
* `moduleMap`
* `parseCodeName()`
* `patialNameMap`


### Templates

This package provides a set of templates for generating an HTML file for each document: api,
directive, error, filter function, input, module, object, overview, provider, service, type and a
number to support rendering of the runnable examples.

You should be aware that because of the overlap in syntax between Nunjucks bindings and AngularJS
bindings, the ngdoc package changes the default Nunjucks binding tags:

```js
templateEngine.config.tags = {
  variableStart: '{$',
  variableEnd: '$}'
};
```

## `examples` Package

This package is a mix-in that provides functionality for working with examples in the docs.

### Processors

* `parseExamplesProcessor` -
Parse the `<example>` tags from the content and add them to the `examples` service
* `generateExamplesProcessor` -
Add new docs to the docs collection for each example in the `examples` service that will be rendered
as files that can be run in the browser, for example as live in-place demos of the examples or for
e2e testing.

### Services

* examples - a hash map holding each example by name

