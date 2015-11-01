# Dgeni Packages Documentation


## base package

Defines minimal set of processors to get started with Dgeni

### Dependencies


This package has no dependencies.



### Processors


Processors that are defined in this package:


* **<a href="base/processors/reading-files.md"><code>reading-files</code></a>**
A marker that files are about to be read

* **<a href="base/processors/files-read.md"><code>files-read</code></a>**
A marker that files have just been read

* **<a href="base/processors/processing-docs.md"><code>processing-docs</code></a>**
A marker that we are about to start processing the docs

* **<a href="base/processors/docs-processed.md"><code>docs-processed</code></a>**
A marker that the docs have just been processed

* **<a href="base/processors/adding-extra-docs.md"><code>adding-extra-docs</code></a>**
A marker that we are about to start adding extra docs

* **<a href="base/processors/extra-docs-added.md"><code>extra-docs-added</code></a>**
A marker that any extra docs have been added

* **<a href="base/processors/computing-ids.md"><code>computing-ids</code></a>**
A marker that we are about to start computing the ids of the docs

* **<a href="base/processors/ids-computed.md"><code>ids-computed</code></a>**
A marker that the doc ids have just been computed

* **<a href="base/processors/computing-paths.md"><code>computing-paths</code></a>**
A marker that we are about to start computing the paths of the docs

* **<a href="base/processors/paths-computed.md"><code>paths-computed</code></a>**
A marker that the doc paths have just been computed

* **<a href="base/processors/rendering-docs.md"><code>rendering-docs</code></a>**
A marker that we are about to start generating the rendered content
for the docs

* **<a href="base/processors/docs-rendered.md"><code>docs-rendered</code></a>**
A marker that the rendered content has been generated

* **<a href="base/processors/writing-files.md"><code>writing-files</code></a>**
A marker that we are about to start writing the docs to files

* **<a href="base/processors/files-written.md"><code>files-written</code></a>**
A marker that the docs have been written to files

* **<a href="base/processors/readFilesProcessor.md"><code>readFilesProcessor</code></a>**
Read documents from files and add them to the docs collection

* **<a href="base/processors/renderDocsProcessor.md"><code>renderDocsProcessor</code></a>**
Render the set of documents using the provided `templateEngine`, to `doc.renderedContent`
using the `extraData`, `helpers` and the templates found by `templateFinder`.

* **<a href="base/processors/unescapeCommentsProcessor.md"><code>unescapeCommentsProcessor</code></a>**
Some files (like CSS) use the same comment markers as the jsdoc comments, such as /*.
To get around this we HTML encode them in the source.
This processor unescapes them back to normal comment markers

* **<a href="base/processors/writeFilesProcessor.md"><code>writeFilesProcessor</code></a>**
Write the value of `doc.renderedContent` to a file a  `doc.outputPath`.

* **<a href="base/processors/debugDumpProcessor.md"><code>debugDumpProcessor</code></a>**
This processor dumps docs that match a filter to a file

* **<a href="base/processors/computeIdsProcessor.md"><code>computeIdsProcessor</code></a>**
Compute the id property of each doc based on the tags and other meta-data from a set of templates

* **<a href="base/processors/computePathsProcessor.md"><code>computePathsProcessor</code></a>**
Compute the path and outputPath for docs that do not already have them from a set of templates

* **<a href="base/processors/checkAnchorLinksProcessor.md"><code>checkAnchorLinksProcessor</code></a>**
Checks that the generated documents do not have any dangling anchor links.


### Services


Services that are defined in this package:


* **<a href="base/services/aliasMap.md"><code>aliasMap</code></a>**
A map of id aliases to docs

* **<a href="base/services/extractLinks.md"><code>extractLinks</code></a>**
Extracts the links and references from a given html

* **<a href="base/services/resolveUrl.md"><code>resolveUrl</code></a>**
Calculates the absolute path of the url from the current path,
the relative path and the base

* **<a href="base/services/templateFinder.md"><code>templateFinder</code></a>**
Search a configured set of folders and patterns for templates that match a document.

* **<a href="base/services/writeFile.md"><code>writeFile</code></a>**
Write the given contents to a file, ensuring the path to the file exists


### Pipeline

The full pipeline of processors for this package:


* <a href="base/processors/reading-files.md">reading-files</a>
  (<a href="base.md">base</a>)
* **<a href="base/processors/readFilesProcessor.md">readFilesProcessor</a>**
  (<a href="base.md">base</a>)
* <a href="base/processors/files-read.md">files-read</a>
  (<a href="base.md">base</a>)
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

