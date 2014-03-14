# Dgeni Packages

This repository contains a collection of dgeni packages that can be used by the dgeni documentation
generator to create documentation from source code.


Out of the box there are the following packages:

* `jsdoc` - a standard set of processors that can extract jsdoc documents and render them as HTML.
* `ngdoc` - *(depends upon the `jsdoc` package)* an extra set of processors and templates that
are specific to angularjs projects.


#### `jsdoc` Package

This package contains the following processors:

* `doc-extractor` - used to load up documents from files.  This processor can be configured to use a
set of **extractors**.  The `jsdoc` package has a single `js` extractor, which can extract documents
from jsdoc style comments in files.
* `tag-parser` - parses the jsdoc tags in the extracted documents.
* `tag-extractor` - extracts the tags information and converts it to specific properties on
the documents, based on a set of tag-definitions.  The `jsdoc` package contains definitions for the
following tags: `name`, `memberof`, `param`, `property`, `returns`, `module`, `description`, `usage`,
`animations`, `constructor`, `class`, `classdesc`, `global`, `namespace` and `kind`.
* `nunjucks-renderer` - uses the Nunjucks template library to render the documents into files, such
as HTML or JS, based on templates.

This package does not provide any templates.

### `ngdoc` Package

There is one new document extractor in this package, `ngdoc`, which can pull a single document from
an ngdoc content file.

On top of the processors provided by the `jsdoc` package, this packages adds the following processors:

* `filter-ngdocs` -
For AngularJS we are only interested in documents that contain the @ngdoc tag.  This processor
removes docs that do not contain this tag.

* `memberof` -
All docs that have a `@memberof` tag are attached to their parent document and removed from the top
level list of docs.

* `links` -
Parse all `{@link ... }` inline tags in the docs and replace with real anchors.  This processor is
able to compute URLs for code references.

* `examples` -
Parse the `<example>` tags from the content, generating new docs that will be converted to extra
files that can be loaded by the application and used, for example, in live in-place demos of the
examples and e2e testing.

* `api-docs` -
This processor runs a bunch of computations that are specifically related to docs for API components.
In particular, it will compute the package name for the module (e.g.
angular or angular-sanitize, it collects up all documents that belong to the module and
attaches them to the module doc in the `components` property, it computes the URL path to the document
in the docs app and the outputPath to the final output file, it relates documents about angular
services to their corresponding angular service provider document.

This package also provides a set of templates for generating an HTML file for each document: api,
directive, error, filter function, input, module, object, overview, provider, service, type and a
number to support rendering of the runnable examples.


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
