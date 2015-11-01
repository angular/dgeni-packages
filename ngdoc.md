# Dgeni Packages Documentation


## ngdoc package

AngularJS specific tag-defs, processors and templates. This loads the jsdoc and nunjucks packages for you.

### Dependencies


This package depends upon:


* <a href="jsdoc.md"><code>jsdoc</code></a>

* <a href="nunjucks.md"><code>nunjucks</code></a>

* <a href="links.md"><code>links</code></a>


### Processors


Processors that are defined in this package:


* **<a href="ngdoc/processors/filterNgDocsProcessor.md"><code>filterNgDocsProcessor</code></a>**
Remove docs that do not contain the ngdoc tag

* **<a href="ngdoc/processors/generateComponentGroupsProcessor.md"><code>generateComponentGroupsProcessor</code></a>**
Generate documents for each group of components (by type) within a module

* **<a href="ngdoc/processors/memberDocsProcessor.md"><code>memberDocsProcessor</code></a>**
Merge the member docs into their container doc, and remove them from the main docs collection

* **<a href="ngdoc/processors/moduleDocsProcessor.md"><code>moduleDocsProcessor</code></a>**
Compute the various fields for modules

* **<a href="ngdoc/processors/providerDocsProcessor.md"><code>providerDocsProcessor</code></a>**
Connect docs for services to docs for their providers


### Services


Services that are defined in this package:


* **<a href="ngdoc/services/getTypeClass.md"><code>getTypeClass</code></a>**
Get a CSS class string for the given type string

* **<a href="ngdoc/services/moduleMap.md"><code>moduleMap</code></a>**
A collection of modules keyed on the module name

* **<a href="ngdoc/services/ngdocFileReader.md"><code>ngdocFileReader</code></a>**
This file reader will pull the contents from a text file (by default .ngdoc)

The doc will initially have the form:
```
{
  content: 'the content of the file',
  startingLine: 1
}
```


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
* **<a href="ngdoc/processors/filterNgDocsProcessor.md">filterNgDocsProcessor</a>**
  (<a href="ngdoc.md">ngdoc</a>)
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
* **<a href="ngdoc/processors/memberDocsProcessor.md">memberDocsProcessor</a>**
  (<a href="ngdoc.md">ngdoc</a>)
* **<a href="ngdoc/processors/moduleDocsProcessor.md">moduleDocsProcessor</a>**
  (<a href="ngdoc.md">ngdoc</a>)
* **<a href="ngdoc/processors/generateComponentGroupsProcessor.md">generateComponentGroupsProcessor</a>**
  (<a href="ngdoc.md">ngdoc</a>)
* **<a href="ngdoc/processors/providerDocsProcessor.md">providerDocsProcessor</a>**
  (<a href="ngdoc.md">ngdoc</a>)
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

