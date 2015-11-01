# Dgeni Packages Documentation


## inlineTagProcessor processor 
**from <a href="../../jsdoc.md"><code>jsdoc</code></a> package**

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

## Properties


### Run After


* <a href="../../base/processors/docs-rendered.md"><code>docs-rendered</code></a>




### Run Before


* <a href="../../base/processors/writing-files.md"><code>writing-files</code></a>




