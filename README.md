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

#### `base` Package

This package contains the following processors:

* `read-files` - used to load up documents from files.  This processor can be configured to use a
set of **file readers**. There are file readers in the `jsdoc` and `ngdoc` packages.
* `render-docs` - render the documents into a property (`doc.renderedContent`) using a
`templateEngine`, which must be provided separately - see `nunjucks` package.
* `templateFinder` - search folders using patterns to find a template that matches a given document.
* `unescape-comments` - unescape comment markers that would break the jsdoc comment style,
e.g. `*/`
* `write-files` - write the docs to disk

#### `nunjucks` Package

This package provides a nunjucks driven implementation of the `templateEngine` required by the
`base` package `render-docs` processor.

* `nunjucks-template-engine` - provide a `templateEngine` that uses the Nunjucks template library
to render the documents into text, such as HTML or JS, based on templates.

#### `jsdoc` Package

This package contains the following file-readers:

* `jsdoc` - can read documents from jsdoc style comments in source code files.

This package contains the following processors:

* `code-name` - infer the name of the document from the code following the document in the source
file.
* `compute-path` - infer the path to the document, used for writing the file and for navigation
to the document in a web app.
* `defaultTagTransforms` - provide a collection of tag transform functions to apply to every tag.
See the transforms in the `tagExtractor` processor.
* `parse-tags` - use a `tagParser` to parses the jsdoc tags in the document content.
* `extract-tags` - use a `tagExtractor` to extract information from the parsed tags.
* `inline-tags` - Search the docs for inline tags that need to have content injected
* `tagDefinitions` - provides a collection of tag definitions, and a map of the same, to be used by
the `tagParser` and `tagExtractor`.
* `tagExtractor` - provides a service to extract tags information and convert it to specific
properties on the document, based on a set of tag-definitions.
The `jsdoc` package contains definitions for a number of standard jsdoc tags including: `name`,
`memberof`, `param`, `property`, `returns`, `module`, `description`, `usage`,
`animations`, `constructor`, `class`, `classdesc`, `global`, `namespace`, `method`, `type` and
`kind`.
* `tagParser` - provides a service to parse the content of a document to get all the jsdoc style
tags out.

**This package does not provide any templates nor a `templateEngine` to render templates (use the
`nunjucks` package to add this).**

### `ngdoc` Package

The `ngdoc` Package also loads up the `jsdoc` and `nunjucks` packages automatically.

This package contains the following file readers, in addition to those provided by the `jsdocs`
package:

* `ngdoc` - can pull a single document from an ngdoc content file.

On top of the processors provided by the `jsdoc` package, this packages adds the following processors:

* `api-docs` -

This processor runs computations that are specifically related to docs for API components. It does the following:

  - Computes the package name for the module (eg angular or angular-sanitize)
  - Collects up all documents that belong to the module
  - Attaches them to the module doc in the `components` property
  - Computes the URL path to the document in the docs app and the outputPath to the final output file
  - It relates documents about angular services to their corresponding provider document.

api-docs has the following configuration options available (listed with the default values set):

  ```js
  config.set('processing.api-docs', {
    outputPath: '${area}/${module}/${docType}/${name}.html', // The path to write an api document's page to.
    path: '${area}/${module}/${docType}/${name}', // The url for a document's page.
    moduleOutputPath: '${area}/${name}/index.html', // The path to write an api module's page to.
    modulePath: '${area}/${name}' // The url for a module's page.
  });
  ```

* `component-groups-generate` -

* `compute-id` -

* `filter-ngdocs` -
For AngularJS we are only interested in documents that contain the @ngdoc tag.  This processor
removes docs that do not contain this tag.

* `partial-names` -


This package also provides a set of templates for generating an HTML file for each document: api,
directive, error, filter function, input, module, object, overview, provider, service, type and a
number to support rendering of the runnable examples.

You should be aware that because of the overlap in syntax between Nunjucks bindings and AngularJS
bindings, the ngdoc package changes the default Nunjucks binding tags:

```
config.merge('rendering.nunjucks.config.tags', {
    variableStart: '{$',
    variableEnd: '$}'
  });
```

### `examples` Package

This package is a mix in that provides additional processors for working with examples in the docs:

* `examples-parse` -
Parse the `<example>` tags from the content, generating new docs that will be converted to extra
files that can be loaded by the application and used, for example, in live in-place demos of the
examples and e2e testing.
* `examples-generate` -



## HTML Rendering

We render each of these documents as an HTML page. We use the "nunjucks" JavaScript template
tool-kit to generate HTML based on the data in each document. We have nunjucks tags and filters that
can render links and text as markdown and will highlight code.

The template used to render the doc is computed by a `templateFinder`, which uses the first match
from a set of patterns in a set of folders, provided in the configuration. This allows a lot of control to provide
generic templates for most situations and specific templates for exceptional cases.

Here is an example of the angularjs patterns:

```
rendering: {

      ...

      templatePatterns: [
        '${ doc.template }',
        '${ doc.id }.${ doc.docType }.template.html',
        '${ doc.id }.template.html',
        '${ doc.docType }.template.html'
      ],

      ...

      templateFolders: [
        'templates'
      ]

    },
```
