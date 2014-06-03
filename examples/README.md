# Examples Dgeni Package

This package is a mix-in that contains processors and templates for parsing and generating
runnable examples from the source code.

## Usage
In your own Dgeni config you can add its functionality by simply requiring it and calling it,
passing in your own config object.  You can combine this with some other base package such as
ngdoc too:

```js
var basePackage = require('dgeni-packages/ngdoc');
var examplesPackage = require('dgeni-packages/examples');

module.exports = function(config) {
  config = basePackage(config);
  config = examplesPackage(config);

  // Optional config for output locations
  config.set('processing.examples.outputFolder', 'docs/examples');
  config.set('processing.examples.outputFolderPath', '/docs/examples');

  // Add your own configuration here
};
```

Then inside your docs you can markup inline-examples such as:

```
Some text before the example

<example name="example-name">
  <file name="index.html">
    <div>The main HTML for the example</div>
  </file>
  <file name="app.js">
    // Some JavaScript code to be included in the example
  </file>
</example>

Some text after the example
```