## 0.3.0 02/28/2014

* feat(tagParser): ignore tags inside fenced code blocks   09fb7d64
* feat(trimProcessor): add tag processor to trim off whitespace  a81f6231
* feat(nameProcessor): add support for param aliases   5720bfed

* fix(typeProcessor): handle escaped braces  786f1ab5
* fix(ngdoc templates): ensure type hints are escaped  4ace02b8
* fix(escaped-comments): re-code HTML escaped comment markers  020fde5c
* fix(examples-parse): ensure that code blocks are rendered correctly  10ae5e21
* fix(api-docs processor): don't contaminate the global context  2fa8acf6
* fix(typeProcessor): add better error message   6becbd46
* fix(tag-parser): add better error message  458b26f5
* fix(tagParser): cope with tags that have no following whitespace   04cf4f02
* fix(typeProcessor): attach optional property to tag if type is optional  0188305f


## 0.2.4 02/25/2014

* fix(doctrine-tag-parser): don't rethrow error if tag type is bad  7ac46af6

## 0.2.3 02/25/2014

* fix(doctrine-tag-parser): support jsdoc3 tags and improve error messages  c8ca67a2

## v0.2.2  02/21/2014

* fix(examples-generate): ensure each index file gets content c4918e05
* fix(ngdoc/members): render member docs correctly  c7b98a67

## 0.2.1 02/20/2014

* fix(example-generation): commonFiles should get scripts from the 'scripts' object  3b41c91a

## 0.2.0 02/20/2014

* feat(example-generation): generate examples for multiple deployments  82ba9054

## 0.1.0 02/20/2014

* fix(doc-extractor): give decent error if projectPath is missing 0e326692
