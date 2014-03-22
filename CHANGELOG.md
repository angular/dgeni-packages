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
