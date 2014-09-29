var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var DOCS1, DOCS2, DOCS3;

describe("ngFileReader", function() {

  var fileReader, moduleDefs;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    fileReader = injector.get('ngFileReader');
    moduleDefs = injector.get('moduleDefs');
  });

  it("should place the module definitions into the moduleDefs service", function() {

    fileReader.getDocs(DOCS1);

    expect(moduleDefs).toEqual({
      app: jasmine.objectContaining({}),
      mod1: jasmine.objectContaining({}),
      mod2: jasmine.objectContaining({})
    });

    expect(moduleDefs.app).toEqual(jasmine.objectContaining(
    {
      name: 'app',
      content: 'app docs',
      dependencies: ['mod1', 'mod2']
    }));

    expect(moduleDefs.app.components.controller).toEqual([jasmine.objectContaining({
      name: 'ControllerOne', content: 'ControllerOne docs'
    })]);

  });

  it("should overwrite the moduleDefs with newly defined modules", function() {
    fileReader.getDocs(DOCS1);
    fileReader.getDocs(DOCS2);

    expect(moduleDefs.app).toEqual(jasmine.objectContaining(
    {
      name: 'app',
      content: 'new app docs',
      dependencies: ['mod1']
    }));

    expect(moduleDefs.app.components.controller).toEqual([jasmine.objectContaining({
      name: 'ControllerTwo', content: 'ControllerTwo docs'
    })]);

    expect(moduleDefs.app.components.filter).toEqual([jasmine.objectContaining({
      name: 'filterA', content: 'filter A docs'
    })]);

  });

  it("should merge in the components of a reopened module", function() {
    fileReader.getDocs(DOCS1);
    fileReader.getDocs(DOCS3);

    expect(moduleDefs.app).toEqual(jasmine.objectContaining(
    {
      name: 'app',
      content: 'app docs',
      dependencies: ['mod1', 'mod2']
    }));

    expect(moduleDefs.app.components.controller).toEqual([
      jasmine.objectContaining({
        name: 'ControllerOne', content: 'ControllerOne docs'
      }),
      jasmine.objectContaining({
        name: 'ControllerOne', content: 'ControllerOne docs (overridden)'
      })
    ]);

  });

});


DOCS1 = {
  content:
    '/**\n' +
    ' * app docs\n' +
    ' */\n' +
    'angular.module("app", ["mod1", "mod2"])\n' +
    '  /**\n' +
    '   * ControllerOne docs\n' +
    '   */\n' +
    '  .controller("ControllerOne", function($scope) {})\n' +
    '  \n' +
    '  /**\n' +
    '   * directiveOne docs\n' +
    '   */\n' +
    '  .directive("directiveOne", function() {})\n' +
    '  \n' +
    '/**\n' +
    ' * mod1 docs\n' +
    ' */\n' +
    'var mod1Var = angular.module("mod1", ["ext"]),\n' +
    '   /**\n' +
    '    * mod2 docs\n' +
    '    */\n' +
    '   mod2Var = angular.module("mod2", []);\n'
};

DOCS2 = {
  content:
    '/**\n' +
    ' * new app docs\n' +
    ' */\n' +
    'angular.module("app", ["mod1"])\n' +
    '  /**\n' +
    '   * ControllerTwo docs\n' +
    '   */\n' +
    '  .controller("ControllerTwo", function($scope) {})\n' +
    '  \n' +
    '  /**\n' +
    '   * filter A docs\n' +
    '   */\n' +
    '  .filter("filterA", function() {})\n'
};


DOCS3 = {
  content:
    'angular.module("app")\n' +
    '  /**\n' +
    '   * ControllerOne docs (overridden)\n' +
    '   */\n' +
    '  .controller("ControllerOne", function($scope) {});\n'
};