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

  // Add your own configuration here
};
```