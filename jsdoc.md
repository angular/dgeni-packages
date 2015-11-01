# Dgeni Packages Documentation


## jsdoc package

Tag parsing and extracting for JSDoc-based documentation

### Dependencies


This package depends upon:


* <a href="base.md"><code>base</code></a>


### Processors


Processors that are defined in this package:


* **<a href="jsdoc/processors/parsing-tags.md"><code>parsing-tags</code></a>**


* **<a href="jsdoc/processors/tags-parsed.md"><code>tags-parsed</code></a>**


* **<a href="jsdoc/processors/extracting-tags.md"><code>extracting-tags</code></a>**


* **<a href="jsdoc/processors/tags-extracted.md"><code>tags-extracted</code></a>**


* **<a href="jsdoc/processors/extractJSDocCommentsProcessor.md"><code>extractJSDocCommentsProcessor</code></a>**
This processor will create an doc for each jsdoc style comment in each jsFile
doc in the docs collection.

It will optionaly remove those jsFile docs from the collection by setting the
`removeJsFileDocs` property.

The doc will initially have the form:
```
{
  fileInfo: { ... },
  content: 'the content of the comment',
  startingLine: xxx,
  endingLine: xxx,
  codeNode: someASTNode
  codeAncestors: arrayOfASTNodes
}
```

* **<a href="jsdoc/processors/codeNameProcessor.md"><code>codeNameProcessor</code></a>**
Infer the name of the document from name of the following code

* **<a href="jsdoc/processors/parseTagsProcessor.md"><code>parseTagsProcessor</code></a>**
Parse the doc for jsdoc style tags

* **<a href="jsdoc/processors/extractTagsProcessor.md"><code>extractTagsProcessor</code></a>**
Extract the information from the tags that were parsed

* **<a href="jsdoc/processors/inlineTagProcessor.md"><code>inlineTagProcessor</code></a>**
Search the docs for inline tags that need to have content injected.

Inline tags are defined by a collection of inline tag definitions.  Each definition is an injectable function,
which should create an object containing, as minimum, a `name` property and a `handler` method, but also,
optionally, `description` and `aliases` properties.

* The `name` should be the canonical tag name that should be handled.
* The `aliases` should be an array of additional tag names that should be handled.
* The `handler` should be a method of the form: `function(doc, tagName, tagDescription, docs) { ... }`
The
For example:

```
function(partialNames) {
  return {
    name: 'link',
    handler: function(doc, tagName, tagDescription, docs) { ... }},
    description: 'Handle inline link tags',
    aliases: ['codeLink']
  };
}
```


### Services


Services that are defined in this package:


* **<a href="jsdoc/services/jsdocFileReader.md"><code>jsdocFileReader</code></a>**
This file reader will create a simple doc for each js
file including a code AST of the JavaScript in the file.


### Pipeline

The full pipeline of processors for this package:


* <a href="base/processors/reading-files.md">reading-files</a>
  (<a href="base.md">base</a>)
* **<a href="base/processors/readFilesProcessor.md">readFilesProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/files-read.md">files-read</a>
  (<a href="base.md">base</a>)
* **<a href="jsdoc/processors/extractJSDocCommentsProcessor.md">extractJSDocCommentsProcessor</a>**
  (<a href="jsdoc.md">jsdoc</a>)
* <a href="jsdoc/processors/parsing-tags.md">parsing-tags</a>
  (<a href="jsdoc.md">jsdoc</a>)
* **<a href="jsdoc/processors/parseTagsProcessor.md">parseTagsProcessor</a>**
  (<a href="jsdoc.md">jsdoc</a>)
* <a href="jsdoc/processors/tags-parsed.md">tags-parsed</a>
  (<a href="jsdoc.md">jsdoc</a>)
* <a href="jsdoc/processors/extracting-tags.md">extracting-tags</a>
  (<a href="jsdoc.md">jsdoc</a>)
* **<a href="jsdoc/processors/extractTagsProcessor.md">extractTagsProcessor</a>**
  (<a href="jsdoc.md">jsdoc</a>)
* <a href="jsdoc/processors/tags-extracted.md">tags-extracted</a>
  (<a href="jsdoc.md">jsdoc</a>)
* **<a href="jsdoc/processors/codeNameProcessor.md">codeNameProcessor</a>**
  (<a href="jsdoc.md">jsdoc</a>)
* <a href="base/processors/processing-docs.md">processing-docs</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/docs-processed.md">docs-processed</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/adding-extra-docs.md">adding-extra-docs</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/extra-docs-added.md">extra-docs-added</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/computing-ids.md">computing-ids</a>
  (<a href="base.md">base</a>)
* **<a href="base/processors/computeIdsProcessor.md">computeIdsProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/ids-computed.md">ids-computed</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/computing-paths.md">computing-paths</a>
  (<a href="base.md">base</a>)
* **<a href="base/processors/computePathsProcessor.md">computePathsProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/paths-computed.md">paths-computed</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/rendering-docs.md">rendering-docs</a>
  (<a href="base.md">base</a>)
* **<a href="base/processors/renderDocsProcessor.md">renderDocsProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/docs-rendered.md">docs-rendered</a>
  (<a href="base.md">base</a>)
* **<a href="jsdoc/processors/inlineTagProcessor.md">inlineTagProcessor</a>**
  (<a href="jsdoc.md">jsdoc</a>)
* **<a href="base/processors/unescapeCommentsProcessor.md">unescapeCommentsProcessor</a>**
  (<a href="base.md">base</a>)
* **<a href="base/processors/debugDumpProcessor.md">debugDumpProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/writing-files.md">writing-files</a>
  (<a href="base.md">base</a>)
* **<a href="base/processors/writeFilesProcessor.md">writeFilesProcessor</a>**
  (<a href="base.md">base</a>)
* **<a href="base/processors/checkAnchorLinksProcessor.md">checkAnchorLinksProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/files-written.md">files-written</a>
  (<a href="base.md">base</a>)

