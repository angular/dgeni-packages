# Dgeni Packages Documentation


## examples package

Processors to support the runnable examples feature in the AngularJS docs site.

### Dependencies


This package depends upon:


* <a href="jsdoc.md"><code>jsdoc</code></a>


### Processors


Processors that are defined in this package:


* **<a href="examples/processors/parseExamplesProcessor.md"><code>parseExamplesProcessor</code></a>**
Search the documentation for examples that need to be extracted

* **<a href="examples/processors/generateExamplesProcessor.md"><code>generateExamplesProcessor</code></a>**
Create doc objects of the various things that need to be rendered for an example.
This includes the files that will be run in an iframe, the code that will be injected
into the HTML pages and the protractor test files.

* **<a href="examples/processors/generateProtractorTestsProcessor.md"><code>generateProtractorTestsProcessor</code></a>**
Generate a protractor test files from the e2e tests in the examples


### Services


Services that are defined in this package:


* **<a href="examples/services/exampleMap.md"><code>exampleMap</code></a>**
A map of examples parsed out of the doc content, keyed on


### Pipeline

The full pipeline of processors for this package:


* <a href="base/processors/reading-files.md">reading-files</a>
  (<a href="base.md">base</a>)
* **<a href="base/processors/readFilesProcessor.md">readFilesProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/files-read.md">files-read</a>
  (<a href="base.md">base</a>)
* **<a href="examples/processors/parseExamplesProcessor.md">parseExamplesProcessor</a>**
  (<a href="examples.md">examples</a>)
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
* **<a href="examples/processors/generateExamplesProcessor.md">generateExamplesProcessor</a>**
  (<a href="examples.md">examples</a>)
* **<a href="examples/processors/generateProtractorTestsProcessor.md">generateProtractorTestsProcessor</a>**
  (<a href="examples.md">examples</a>)
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

