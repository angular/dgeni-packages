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
        '   mod2Var = angular.module("mod2", [])\n' +
        '     .filter("mod2Filter", function() {});\n' +
        'angular.module("ext");\n' +
        '\n' +
        '/**\n' +
        ' * docs for ControllerTwo (registered via a module variable)\n' +
        ' */\n' +
        'mod1Var.controller("ControllerTwo", function($scope) {});\n'
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
        startingLine: 28
      })
    ]);

  });

  it("should extract the calls to registrations on each module", function() {
    var appModule = moduleInfo[0];
    expect(appModule.name).toEqual('app');
    expect(appModule.registrations.controller).toEqual([
      {
        type: 'controller',
        name: 'ControllerOne',
        content: 'ControllerOne docs',
        startingLine: 5,
        endingLine: 7,
        range: [62, 95]
      },
      {
        type: 'controller',
        name: 'ControllerOne',
        content: 'ControllerOne docs (overridden)',
        startingLine: 14,
        endingLine: 16,
        range: [217, 263]
      }
    ]);

    expect(appModule.registrations.directive).toEqual([
      {
        type: 'directive',
        name: 'directiveOne',
        content: 'directiveOne docs',
        startingLine: 10,
        endingLine: 12,
        range: [153, 185]
      }
    ]);

    expect(appModule.registrations.filter).toEqual([]);
    expect(appModule.registrations.service).toEqual([]);
    expect(appModule.registrations.factory).toEqual([]);
    expect(appModule.registrations.provider).toEqual([]);
    expect(appModule.registrations.value).toEqual([]);
    expect(appModule.registrations.constant).toEqual([]);
  });

  it("should extract registrations from modules defined in a variable declaration", function() {
    var mod2 = moduleInfo[2];
    expect(mod2.name).toEqual('mod2');
    expect(mod2.registrations.controller).toEqual([]);
    expect(mod2.registrations.filter).toEqual([{ type : 'filter', name : 'mod2Filter' }]);
    expect(mod2.registrations.service).toEqual([]);
    expect(mod2.registrations.factory).toEqual([]);
    expect(mod2.registrations.provider).toEqual([]);
    expect(mod2.registrations.value).toEqual([]);
    expect(mod2.registrations.constant).toEqual([]);
  });

  it("should extract registrations on module variable references as well module defitions", function() {
    var mod1 = moduleInfo[1];
    expect(mod1.name).toEqual('mod1');
    expect(mod1.registrations.controller).toEqual([{ type: 'controller', name: 'ControllerTwo' }]);
    expect(mod1.registrations.filter).toEqual([]);
    expect(mod1.registrations.service).toEqual([]);
    expect(mod1.registrations.factory).toEqual([]);
    expect(mod1.registrations.provider).toEqual([]);
    expect(mod1.registrations.value).toEqual([]);
    expect(mod1.registrations.constant).toEqual([]);
  });
});



