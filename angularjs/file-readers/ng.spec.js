var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

var ngFileReader = require('./ng');

describe("ngFileReader", function() {

  var fileReader, codeDB;

  beforeEach(function() {

    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    fileReader = injector.get('ngFileReader');
    codeDB = injector.get('codeDB');
  });

  it("should collect up all module definitions", function() {
    var fileInfo = {
      content:

        "/**\n" +
        " * app docs\n" +
        " */\n" +
        "angular.module('app', ['mod1', 'mod2'])\n" +
        "    /**\n" +
        "     * C docs\n" +
        "     */\n" +
        "  .controller('C', function($scope) {})\n" +
        "  \n" +
        "  .directive();\n" +
        "  \n" +
        "/**\n" +
        " * mod1 docs\n" +
        " */\n" +
        "angular.module('mod1', ['ext']);\n" +
        "/**\n" +
        " * mod2 docs\n" +
        " */\n" +
        "angular.module('mod2', []);\n" +
        "angular.module('ext');\n"

    };


    codeDB.moduleRefs = ['modX'];

    fileReader.getDocs(fileInfo);
    expect(codeDB.moduleDefs).toEqual({
      app: {
        name: 'app',
        dependencies: ['mod1', 'mod2'],
        content: 'app docs'
      },
      mod1: {
        name: 'mod1',
        dependencies: ['ext'],
        content: 'mod1 docs'
      },
      mod2: {
        name: 'mod2',
        dependencies: [],
        content: 'mod2 docs'
      }
    });
    expect(codeDB.moduleRefs).toEqual(['modX', 'app', 'mod1', 'mod2', 'ext']);
  });
});