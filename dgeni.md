# Dgeni Packages Documentation


## dgeni package

Support for documenting Dgeni packages (incomplete)

### Dependencies


This package depends upon:


* <a href="jsdoc.md"><code>jsdoc</code></a>

* <a href="nunjucks.md"><code>nunjucks</code></a>

* <a href="links.md"><code>links</code></a>


### Processors


Processors that are defined in this package:


* **<a href="dgeni/processors/readPackageInfo.md"><code>readPackageInfo</code></a>**


* **<a href="dgeni/processors/filterJSFileDocs.md"><code>filterJSFileDocs</code></a>**


* **<a href="dgeni/processors/checkDocsHavePackage.md"><code>checkDocsHavePackage</code></a>**


* **<a href="dgeni/processors/wireUpServicesToPackages.md"><code>wireUpServicesToPackages</code></a>**


* **<a href="dgeni/processors/generateIndex.md"><code>generateIndex</code></a>**


* **<a href="dgeni/processors/computeProcessorPipeline.md"><code>computeProcessorPipeline</code></a>**



### Services


There are no services defined in this package.



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
* **<a href="dgeni/processors/readPackageInfo.md">readPackageInfo</a>**
  (<a href="dgeni.md">dgeni</a>)
* **<a href="dgeni/processors/filterJSFileDocs.md">filterJSFileDocs</a>**
  (<a href="dgeni.md">dgeni</a>)
* **<a href="dgeni/processors/computeProcessorPipeline.md">computeProcessorPipeline</a>**
  (<a href="dgeni.md">dgeni</a>)
* **<a href="dgeni/processors/wireUpServicesToPackages.md">wireUpServicesToPackages</a>**
  (<a href="dgeni.md">dgeni</a>)
* **<a href="dgeni/processors/checkDocsHavePackage.md">checkDocsHavePackage</a>**
  (<a href="dgeni.md">dgeni</a>)
* **<a href="jsdoc/processors/codeNameProcessor.md">codeNameProcessor</a>**
  (<a href="jsdoc.md">jsdoc</a>)
* <a href="base/processors/processing-docs.md">processing-docs</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/docs-processed.md">docs-processed</a>
  (<a href="base.md">base</a>)
* <a href="base/processors/adding-extra-docs.md">adding-extra-docs</a>
  (<a href="base.md">base</a>)
* **<a href="dgeni/processors/generateIndex.md">generateIndex</a>**
  (<a href="dgeni.md">dgeni</a>)
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

