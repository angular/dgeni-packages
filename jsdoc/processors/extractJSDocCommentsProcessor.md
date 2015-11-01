# Dgeni Packages Documentation


## extractJSDocCommentsProcessor processor 
**from <a href="../../jsdoc.md"><code>jsdoc</code></a> package**

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

## Properties


### Run After


* <a href="../../base/processors/files-read.md"><code>files-read</code></a>




### Run Before


* <a href="parsing-tags.md"><code>parsing-tags</code></a>




### Validation


* removeJsFileDocs - {
  "presence": true
}


