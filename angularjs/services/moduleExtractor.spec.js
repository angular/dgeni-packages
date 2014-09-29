var mockPackage = require('../mocks/mockPackage');
var esprima = require('esprima');
var Dgeni = require('dgeni');

describe("moduleExtractor", function() {

  function getAST(content) {
    return esprima.parse(content, {
      loc: true,
      range: true,
      comment: true,
      attachComment: true
    });
  }

  var moduleExtractor, moduleInfo;

  beforeEach(function() {

    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    moduleExtractor = injector.get('moduleExtractor');

    var ast = getAST(
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
        '  .directive("directiveOne")\n' +
        '  /**\n' +
        '   * ControllerOne docs (overridden)\n' +
        '   */\n' +
        '  .controller("ControllerOne", function($scope) {});\n' +
        '  \n' +
        '/**\n' +
        ' * mod1 docs\n' +
        ' */\n' +
        'var mod1Var = angular.module("mod1", ["ext"]),\n' +
        '   /**\n' +
        '    * mod2 docs\n' +
        '    */\n' +
        '   mod2Var = angular.module("mod2", []);\n' +
        'angular.module("ext");\n'
    );

    moduleInfo = moduleExtractor(ast);

  });

  it("should collect up all calls to angular.module", function() {

    expect(moduleInfo).toEqual([
      jasmine.objectContaining({
        name: 'app',
        dependencies: ['mod1', 'mod2'],
        content: 'app docs',
        startingLine: 1,
        endingLine: 3
      }),
      jasmine.objectContaining({
        name: 'mod1',
        variable: 'mod1Var',
        dependencies: ['ext'],
        content: 'mod1 docs',
        startingLine: 19,
        endingLine: 21
      }),
      jasmine.objectContaining({
        name: 'mod2',
        variable: 'mod2Var',
        dependencies: [],
        content: 'mod2 docs',
        startingLine: 23,
        endingLine: 25
      }),
      jasmine.objectContaining({
        name: 'ext',
        content: '',
        startingLine: 27
      })
    ]);

  });

  it("should extract the calls to register components on each module", function() {
    var appModule = moduleInfo[0];
    expect(appModule.name).toEqual('app');
    expect(appModule.components.controller).toEqual([
      {
        type: 'controller',
        name: 'ControllerOne',
        content: 'ControllerOne docs',
        startingLine: 5,
        endingLine: 7
      },
      {
        type: 'controller',
        name: 'ControllerOne',
        content: 'ControllerOne docs (overridden)',
        startingLine: 14,
        endingLine: 16
      }
    ]);

    expect(appModule.components.directive).toEqual([
      {
        type: 'directive',
        name: 'directiveOne',
        content: 'directiveOne docs',
        startingLine: 10,
        endingLine: 12
      }
    ]);

    expect(appModule.components.filter).toEqual([]);
    expect(appModule.components.service).toEqual([]);
    expect(appModule.components.factory).toEqual([]);
    expect(appModule.components.provider).toEqual([]);
    expect(appModule.components.value).toEqual([]);
    expect(appModule.components.constant).toEqual([]);
  });
});



