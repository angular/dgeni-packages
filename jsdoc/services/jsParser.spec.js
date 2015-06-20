var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

var srcJsContent = require('../mocks/_test-data/srcJsFile.js');

describe("jsParser service", function() {
  var jsParser;
  beforeEach(function() {
    dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    jsParser = injector.get('jsParser');
  });

  it("should parse JS code", function() {
    expect(jsParser.parse(srcJsContent)).toEqual(jasmine.objectContaining({
      type: 'Program',
      range: [ 0, 3135 ]
    }));
  });

  it("should fail if the file has invalid syntax", function() {
    expect(function() {
      jsParser.parse("var _parameters={\n" +
        "  QueryTemplate:'ArlaPS_CheckIn/UpdateStaffUsersCMD',\n" +
        "  'Param.1':$('staff_no').value,\n" +
        "  'Param.2':$('init').value,\n" +
        "  'Param.3':$('firstname').value,\n" +
        "  'Param.4':$('surname').value,\n" +
        "  'Param.5':$('tlf').value,\n" +
        "  'Param.6':$('titel').value,\n" +
        "  'Param.7':$('desc').value ,\n" +
        "  'Param.8':$('pass').value ,\n" +
        "  'Param.9':$('old_staff_no').value ,\n" +
        "  'Param.10':$('evac').checked   // <--- Missing comma\n" +
        "  sync:true\n");
    }).toThrowError('Line 13: Unexpected identifier');
  });

  it("should cope with ES6 constructs", function() {
    expect(jsParser.parse(
      'export function times(x, y) { return x*y; }\n' +
      'import X from "some/module"\n' +
      'class MyClass {\n' +
      '  constructor(a) {\n' +
      '    a.fn();\n' +
      '  }\n' +
      '}\n')
    ).toEqual(jasmine.objectContaining({
      type: 'Program',
      range: [0, 124]
    }));
  });
});