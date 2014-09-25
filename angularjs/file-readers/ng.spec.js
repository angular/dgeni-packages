var ngFileReader = require('./ng');

describe("ngFileReader", function() {
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


    var mockCodeDb = {
      moduleRefs: ['modX']
    };


    ngFileReader(mockCodeDb).getDocs(fileInfo);
    expect(mockCodeDb.moduleDefs).toEqual([
      {
        name: 'app',
        dependencies: ['mod1', 'mod2'],
        content: 'app docs'
      },
      {
        name: 'mod1',
        dependencies: ['ext'],
        content: 'mod1 docs'
      },
      {
        name: 'mod2',
        dependencies: [],
        content: 'mod2 docs'
      }
    ]);
    expect(mockCodeDb.moduleRefs).toEqual(['modX', 'app', 'mod1', 'mod2', 'ext']);
  });
});