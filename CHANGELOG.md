## v0.9.8 3rd September 2014

* fix(generateComponentGroup processor): ensure doc has a name     076634d0


## v0.9.7 10th August 2014

* fix(ngdoc/macro.html): default param values are in `doc.defaultValue` property    f709d9da


## v0.9.6 07/21/2014

* feat(api-docs): allow packageName to be specified as a tag   211a4cb4


## v0.9.5 07/17/2014

* fix(ng-doc/component-groups-generate): allow path/outputPath to be configurable    48d105bc
* Revert "fix(ng-doc/component-groups-generate processor): use path/outputPath specified in process...     71ced7dd


## v0.9.4 07/17/2014

** WARNING - this release had an invalid breaking change. Don't use it **

* fix(utils/code): encode HTML entities   5091e1c1
* fix(ng-doc/component-groups-generate processor): use path/outputPath specified in processing.api-...  f2c3776f

## v0.9.3 05/22/2014

* fix(extract-type): cope with missing type   4584a423

## v0.9.2 05/09/2014

* fix(jsdoc package): trim whitespace from tags   afa5c8c6

## v0.9.1 05/02/2014

* fix(ngdoc/compute-path): use ngdoc specific version of this processor  3e17d31b
* fix(code-name): cope with additional code situations   8b456b08
* fix(jsdoc/trim-whitespace transform): only trim strings   5aa2376d
* fix(jsdoc/jsdoc file-reader): cope with comments that have no code node   4e3857db
* fix(code-name): recognise CallExpression nodes   14c5c103

## v0.9.0 05/01/2014

This is a major refactoring release which is compatible with Dgeni v0.3.x. There
are many breaking changes.

### New Packages

The packages have been refactored into smaller more focussed sets of processors.

* base - The minimal set of processors to get started with Dgeni
* jsdoc - Tag parsing and extracting
* nunjucks - The nunjucks template rendering engine. No longer in jsdoc - you must add this
  explicitly to your config or you will get
  `Error: No provider for "templateEngine"! (Resolving: templateEngine)`
* ngdoc - The angular.js specific tag-defs, processors and templates.  This loads the jsdoc and
  nunjucks packages for you.
* examples - Processors to support the runnable examples feature in the angular.js docs site.

### New Processor Exports

With Dgeni 0.3.0 processors can declaratively export services to be injected into processors'
`process()` method. This release take full advantage of this, refactoring the structure of the
dependencies of various processors to simplify and enable more flexibility.

### New Tag Definition Transforms

Previously processing of tags was somewhat distributed between the tagParser and the tagExtractor,
with various features rather hard-coded, such as `canHaveType` and `canHaveName`.  This has all been
moved into **tag definition transforms**, which provide a much more flexible and powerful way to
define how to transform the simple text "parsed" from the tag into a rich object that can be
attached to the document.

### Detailed List of Changes

**Features**

* feat(jsdoc/tag-defs): add `@type` tag       904aa00b
* feat(jsdoc/tag-defs): add `@method` tag       6fc99313
* feat(jsdoc file-reader): add more code metadata        7820317a
* feat(jsdoc/name-from-code): extract the name of the doc from the code        1115c431

**Refactorings**

* refact(ngdoc/tag-defs): use new tagExtractor syntax       b0848557
* refact(jsdoc/tag-defs): use new tagExtractor syntax       0048547e
* refact(extract-tags processor): rename and use tagExtractor       d2ef2237
* refact(tagExtractor): major reworking to use 'transformFns'       a90734ae
* refact(parse-tags): simplify using tagParser        02cc093d
* refact(tagParser): move into its own processor        1d2e689e
* refact(tagDefinitions): move into its own processor       d2d916ef
* refact(defaultTagTransforms): move into its own processor       354a9489
* refact(tag-def/transforms): convert "tagProcessors" into tag "transforms"        d4ca4e94
* refact(nunjucks): move basic filters and tags to nunjucks package        5547409c
* refact(dash-case): change name to change-case        39ab9be1
* refact(walk): remove unused code         66f86a50
* refact(marked): remove unused code         4591bd90
* refact(doc-writer): remove unused code         41c0cd12
* refact(dash-case): remove unused code        8f9dd805
* refact(check-property): remove unused code         6e39ba70
* refact(code-name): move to jsdoc package         4061e64f
* refact(packages): align with renames and moves of processors         a21f804e
* refact(doc-extractor): complete rename to read-files         8bc760bf
* refact(escaped-comments): rename to unescape-comments        d030ca95
* refact(rendering): move nunjucks stuff out         0b36e95a
* refact(code-name): rename        6e312504
* refact(doc-extractor): rename to read-files        60ac908c
* refact(partial-names processor): remove `init` and provide `exports`         0de2680a
* refact(component-groups-generate processor): remove `init` and provide `exports`         61ba9cb1
* refact(api-docs processor): remove `init` and provide `exports`        34d05b1f
* refact(jsdoc processors): remove `init` and provide `exports`        3188ff14
* refact(examples-parse): remove `init` and provide `exports`        5cbcbab6
* refact(examples-generate): remove `init` and provide `exports`         0c006bb4
* refact(nunjucks-renderer): remove `init` and provide `exports`         f4b42dd6
* refact(doc-extractor): remove `init` and provide `exports`         fce833c9
* refact(*): update due to utils move        0245eb22
* refact(utils): moved here from dgeni         1f04843d
* refact(jsdoc): moved stuff to base package         5f2ec6be

**Bug Fixes**

* fix(tagExtractor): invalid injectable parameter name        6c8790f3
* fix(jsdoc): add defaultTagTransforms and tagExtractor processors        12ac7aa0
* fix(jsdoc): tag-extractor processor was renamed       1931f4d4
* fix(tagExtractor): accidental global vars       5de56780
* fix(extract-type transform): ensure tag.description gets updated        0f911d8a
* fix(extract-name transform): ensure tag.description gets updated        e347c847
* fix(tagDefinitions): throw error if tag definitions are missing from the config       4777ec79
* fix(nunjucks): correctly load up the template engine processor         071e52c7
* fix(base processors): minor fixes to get the tests working         efd3e35f
* fix(link inline tag): parse newlines in link's title       b2ebb415
* fix(ngdoc): don't show first param in filter syntax        4f2ccf52
* fix(walk): hack ancestor to kind of do what I want         f19b6940
* fix(compute-path): ensure it runs early enough         fe1e0bd7
* fix(jsdoc package): actually append processors to config         f2020d47
* fix(marked tag): fix path to trim-indentation module         1206f8fe
* fix(nunjucks-renderer): `env` changed to `templateEngine`        e4a756e0
* fix(base package): load change-case filter locally         a74f2ee4
* fix(compute-paths): ensure it is run before rendering        b50baa99
* fix(jsdoc/tag-defs): Allow multiple `@see` tags        d73a842f
* fix(tag-parser): don't overwrite default tag processors collection         9fc7f58e
* fix(code): fix path to utilities         26c26e70
* fix(examples-parse): fix path to utilities         1f9d1488
* fix(jsdoc/tag-defs): missing comma         293ffde2
* fix(jsdoc): fix typo in error message       b1e7dd08


## v0.8.3 04/23/2014

**Bug Fixes**

* fix(ngdoc): don't show first param in filter syntax   9c5a7f26
* fix(jsdoc): fix typo in error message   b1e7dd08


## v0.8.2 03/22/2014

**Bug Fixes**

* fix(jsdoc/jsdoc-extractor): ensure Windows newlines are respected    7f1e1627
* fix(jsdoc/jsdoc-extractor): fix off-by-one error    fedcf6b1
* fix(jsdoc/lib/walk): also walk the keys of properties   4a8ae60d
* fix(jsdoc/nunjucks-renderer): improve error message   554c7afd


## v0.8.1 03/18/2014

**Bug Fixes**

* fix(examples/index.template): nunjucks uses `not` not `!`   e0070e3f


## v0.8.0 03/18/2014

**New Features**

* feat(examples/index.template): allow ng-app to be defined in the example    9b760c08
* feat(jsdoc package): use `jsdoc` rather than `js` doc-extractor   72866263


## v0.7.1 03/11/2014

**Minor Features**

* feat(api-docs): add configuration for paths  8ddcf647
* feat(runnableExample template): provide the path to the example  353eef6e


## v0.7.0 03/11/2014

**New Features**

* feat(TagCollection): add an array of Tags via the constructor 7c1cca1a
* feat(jsdoc/tag-defs): add deprecated tag  0f3a1949
* feat(examples-generate): create manifest.json file for Plunker  1849ec49

## v0.6.0 03/07/2014

**New Features**

* feat(tagParser): only ignore tags that are defined with ignore property 59492bea
* feat(jsdoc tags): improve jsdoc tag coverage  d8eb2b43
* feat(PartialNames): getLink disambiguates docs by area  6da98dd5
* feat(jsdoc/compute-paths): add new processor  23cc829a
* feat(partial-names): add removeDoc method 746a0bc7
* test(link handler): fix test, since the handler now throws on error a15053ab

**Bug Fixes**

* fix(compute-paths): ensure contentsFolder is applied correctly  301877fc
* fix(filter-ngdocs processor): run before tags are extracted a090cf49

**Refactorings**

* refact(ngdoc/id tag def): move functionality to its own doc processor 268ac3bd
* refact(partial-name processor): move adding docs to own processor 8684226b

**BREAKING CHANGE**

* If you relied on undefined tags being quietly ignored
your processing will now fail.  You should add new tag defintions for
all tags that you wish to ignore of the form:

```
{ name: 'tag-to-ignore', ignore: true }
```


## v0.5.0 03/07/2014

**New Features**

* feat(jsdoc extractor): add next code node to the doc  22a59651

**Bug Fixes**

* fix(jsdoc extractor): ignore non-jsdoc comments  50ad83d8
* fix(inline link tag): throw error if link is invalid   07af2f42

## v0.4.0 03/06/2014

**New Features**

* feat(examples): move injected example into a template  cc658f31
* feat(jsdoc): add `rendering.nunjucks.config` field to config  eb805097
* feat(link inline handler): replace old link processor with new inline handle  723e0e56
* feat(inline-tag processor): add new generic inline tag processor  39083631
* feat(firstParagraph filter): add new filter  4dcabba1
* feat(jsdoc extractor): add esprima powered jsdoc extractor  e96da1ea

**Bug Fixes**

* fix(ngdoc/templates) : improve "View Source" and "Improve Doc" links  049ee59f
* fix(write-files): ignore docs that have no output path  c666e5e3
* fix(ngdoc templates): show first paragraph not first line  7335fd91

**BREAKING CHANGE**

* The `examples` injectable object has changed from being
a flat array to a hash indexed on the id of the example.  If you only
iterated over the examples then things like `forEach` should still just
work.  But you can no longer access the examples by index, e.g.
`examples[0]` will return undefined rather than the first example.

## v0.3.1 03/02/2014

**Bug Fixes**

* fix(tagParser): don't break on bad-tags  560eff7b


## v0.3.0 02/28/2014

**New Features**

* feat(tagParser): ignore tags inside fenced code blocks   09fb7d64
* feat(trimProcessor): add tag processor to trim off whitespace  a81f6231
* feat(nameProcessor): add support for param aliases   5720bfed

**Bug Fixes**

* fix(typeProcessor): handle escaped braces  786f1ab5
* fix(ngdoc templates): ensure type hints are escaped  4ace02b8
* fix(escaped-comments): re-code HTML escaped comment markers  020fde5c
* fix(examples-parse): ensure that code blocks are rendered correctly  10ae5e21
* fix(api-docs processor): don't contaminate the global context  2fa8acf6
* fix(typeProcessor): add better error message   6becbd46
* fix(tag-parser): add better error message  458b26f5
* fix(tagParser): cope with tags that have no following whitespace   04cf4f02
* fix(typeProcessor): attach optional property to tag if type is optional  0188305f


## v0.2.4 02/25/2014

**Bug Fixes**

* fix(doctrine-tag-parser): don't rethrow error if tag type is bad  7ac46af6

## v0.2.3 02/25/2014

**Bug Fixes**

* fix(doctrine-tag-parser): support jsdoc3 tags and improve error messages  c8ca67a2

## v0.2.2  02/21/2014

**Bug Fixes**

* fix(examples-generate): ensure each index file gets content c4918e05
* fix(ngdoc/members): render member docs correctly  c7b98a67

## v0.2.1 02/20/2014

**Bug Fixes**

* fix(example-generation): commonFiles should get scripts from the 'scripts' object  3b41c91a

## v0.2.0 02/20/2014

**New Features**

* feat(example-generation): generate examples for multiple deployments  82ba9054

## v0.1.0 02/20/2014

**Bug Fixes**

* fix(doc-extractor): give decent error if projectPath is missing 0e326692
