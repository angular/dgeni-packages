var typescriptPackage = require('./mocks/mockPackage');
var Dgeni = require('dgeni');

describe('typescript package', function() {
  var extraData, dgeni;
  beforeEach(function() {
    dgeni = new Dgeni([typescriptPackage()]);
  });

  it("should be instance of Package", function() {
    expect(require('./') instanceof Dgeni.Package).toBeTruthy();
  });

  it("should provide services", function() {
    var injector = dgeni.configureInjector();

    expect(injector.get('modules')).toBeDefined();
    expect(injector.get('tsParser')).toBeDefined();
    expect(injector.get('createCompilerHost')).toBeDefined();
    expect(injector.get('getFileInfo')).toBeDefined();
    expect(injector.get('getExportDocType')).toBeDefined();
    expect(injector.get('getExportAccessibility')).toBeDefined();
    expect(injector.get('getContent')).toBeDefined();
    expect(injector.get('typescriptSymbolMap')).toBeDefined();
    expect(injector.get('convertPrivateClassesToInterfaces')).toBeDefined();
    expect(injector.get('EXPORT_DOC_TYPES')).toBeDefined();
    expect(injector.get('ignoreTypeScriptNamespaces')).toBeDefined();
  });
});
