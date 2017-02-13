'use strict';


module.exports = function angularComponents() {
  var definitions = {};

  return {
    add: add,
    get: get
  };

  function add(name, definition) {
    if (!definition.ngdoc) {
      definition.ngdoc = name;
    }
    if (isNaN(definition.argumentCount)) {
      definition.argumentCount = 2;
    }
    definitions[name] = definition;
  }

  function get(name) {
    return definitions[name];
  }
};
