var mockPackage = require('../mocks/mockPackage');
var esprima = require('esprima');
var Dgeni = require('dgeni');
var _ = require('lodash');

describe("getModuleInfo", function() {

  function getAST(content) {
    return esprima.parse(content, {
      loc: true,
      range: true,
      comment: true,
      attachComment: true
    });
  }

  var getModuleInfo, moduleInfo, registrationTypes;

  beforeEach(function() {

    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    getModuleInfo = injector.get('getModuleInfo');
    registrationTypes = injector.get('moduleRegistrationTypes');

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
        '  .controller("ControllerOne", [\'$scope\', \'$http\', function(s, h) {}]);\n' +
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
        'mod1Var.controller("ControllerTwo", function($scope) {});\n' +
        'mod1Var.config(function($locationProvider) {});\n' +
        'mod1Var.run(function($rootScope) {\n' +
        '  angular.element("<div></div>");' +
        '});\n'
    );

    moduleInfo = getModuleInfo(ast);

  });

  it("should collect up all calls to angular.module", function() {

    expect(moduleInfo.length).toEqual(4);
    expect(moduleInfo[0].name).toEqual('app');
    expect(moduleInfo[1].name).toEqual('mod1');
    expect(moduleInfo[2].name).toEqual('mod2');
    expect(moduleInfo[3].name).toEqual('ext');

    expect(moduleInfo[0].dependencies).toEqual(['mod1', 'mod2']);

    expect(moduleInfo[0]).toEqual(
      jasmine.objectContaining({
        name: 'app',
        dependencies: ['mod1', 'mod2'],
        content: 'app docs',
        startingLine: 1,
        endingLine: 3
      }));
    expect(moduleInfo[1]).toEqual(
      jasmine.objectContaining({
        name: 'mod1',
        variable: 'mod1Var',
        dependencies: ['ext'],
        content: 'mod1 docs',
        startingLine: 19,
        endingLine: 21
      }));
    expect(moduleInfo[2]).toEqual(
      jasmine.objectContaining({
        name: 'mod2',
        variable: 'mod2Var',
        dependencies: [],
        content: 'mod2 docs',
        startingLine: 23,
        endingLine: 25
      }));
    expect(moduleInfo[3]).toEqual(
      jasmine.objectContaining({
        name: 'ext',
        content: '',
        startingLine: 28
      }));

  });

  it("should extract the calls to registrations on each module", function() {
    var appModule = moduleInfo[0];
    expect(appModule.name).toEqual('app');
    expect(appModule.registrations.controller).toEqual([
      jasmine.objectContaining({
        type: _.find(registrationTypes, { name: 'controller' }),
        name: 'ControllerOne',
        content: 'ControllerOne docs',
        startingLine: 5,
        endingLine: 7,
        range: [62, 95]
      }),
      jasmine.objectContaining({
        type: _.find(registrationTypes, { name: 'controller' }),
        name: 'ControllerOne',
        content: 'ControllerOne docs (overridden)',
        startingLine: 14,
        endingLine: 16,
        range: [217, 263]
      })
    ]);

    expect(appModule.registrations.directive).toEqual([
      jasmine.objectContaining({
        type: _.find(registrationTypes, { name: 'directive' }),
        name: 'directiveOne',
        content: 'directiveOne docs',
        startingLine: 10,
        endingLine: 12,
        range: [153, 185]
      })
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
    expect(mod2.registrations.filter).toEqual([jasmine.objectContaining({
      type: _.find(registrationTypes, { name: 'filter' }),
      name : 'mod2Filter'
    })]);
    expect(mod2.registrations.service).toEqual([]);
    expect(mod2.registrations.factory).toEqual([]);
    expect(mod2.registrations.provider).toEqual([]);
    expect(mod2.registrations.value).toEqual([]);
    expect(mod2.registrations.constant).toEqual([]);
  });

  it("should extract registrations on module variable references as well module defitions", function() {
    var mod1 = moduleInfo[1];
    expect(mod1.name).toEqual('mod1');
    expect(mod1.registrations.controller).toEqual([jasmine.objectContaining({
      type: _.find(registrationTypes, { name: 'controller' }),
      name: 'ControllerTwo'
    })]);
    expect(mod1.registrations.filter).toEqual([]);
    expect(mod1.registrations.service).toEqual([]);
    expect(mod1.registrations.factory).toEqual([]);
    expect(mod1.registrations.provider).toEqual([]);
    expect(mod1.registrations.value).toEqual([]);
    expect(mod1.registrations.constant).toEqual([]);
  });

  it("should extract dependencies from factory functions", function() {
    var app = moduleInfo[0];
    var mod1 = moduleInfo[1];
    var mod2 = moduleInfo[2];

    expect(app.registrations.controller[0].dependencies).toEqual(['$scope']);
    expect(app.registrations.controller[1].dependencies).toEqual(['$scope', '$http']);
    expect(mod1.registrations.controller[0].dependencies).toEqual(['$scope']);
    expect(mod2.registrations.filter[0].dependencies).toEqual([]);
  });
});



