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
"angular.module('mod1', []);\n" +

"/**\n" +
" * mod2 docs\n" +
" */\n" +
"angular.module('mod2', []);\n" +

"angular.module('ext');\n"

    };

    var modules = ngFileReader().getDocs(fileInfo);
    // expect(modules.length).toEqual(3);
    // console.log(modules);
    // expect(modules.get('app')).toEqual(jasmine.objectContaining({
    //   name: 'app',
    //   dependencies: ['mod1', 'mod2']
    // }));
  });
});