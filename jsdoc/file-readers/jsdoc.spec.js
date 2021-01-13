const path = require('canonical-path');
const Dgeni = require('dgeni');
const mockPackage = require('../mocks/mockPackage');

const srcJsContent = require('../mocks/_test-data/srcJsFile.js');
const docsFromJsContent = require('../mocks/_test-data/docsFromJsFile');


describe("jsdoc fileReader", () => {

  let fileReader, jsDocParser;

  function createFileInfo(file, content, basePath) {
    return {
      fileReader: fileReader.name,
      filePath: file,
      baseName: path.basename(file, path.extname(file)),
      extension: path.extname(file).replace(/^\./, ''),
      basePath: basePath,
      relativePath: path.relative(basePath, file),
      content: content
    };
  }

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    fileReader = injector.get('jsdocFileReader');
  });

  describe("defaultPattern", () => {

    it("should only match js files", () => {
      expect(fileReader.defaultPattern.test('abc.js')).toBeTruthy();
      expect(fileReader.defaultPattern.test('abc.ngdoc')).toBeFalsy();
    });

  });


  describe("getDocs", () => {

    it('should return a single doc representing the file', () => {
      const fileInfo = createFileInfo('some/file.js', srcJsContent, '.');
      const docs = fileReader.getDocs(fileInfo);
      expect(docs.length).toEqual(1);
      expect(docs[0]).toEqual(jasmine.objectContaining({ docType: 'jsFile' }));
    });


    it("should attach the AST to the fileInfo", () => {
      const fileInfo = createFileInfo('some/file.js', srcJsContent, '.');
      const docs = fileReader.getDocs(fileInfo);
      expect(fileInfo.ast).toEqual(jasmine.objectContaining({
        type: 'Program',
        range: [ 0, 3135 ]
      }));
    });


    it('should understand ES6 features', () => {
      const fileInfo = createFileInfo(
        'some/file.js',
        "function *someGenerator() { yield 10; }",
        '.');
      const docs = fileReader.getDocs(fileInfo);
      expect(fileInfo.ast.body[0]).toEqual(jasmine.objectContaining({
        type: 'FunctionDeclaration',
        generator: true
      }));
    });

    it("should cope with invalid JavaScript", () => {
      const fileInfo = createFileInfo(
        'some/file.js',
        "var _parameters={\n" +
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
        "  sync:true\n" +
        "}\n",
        '.');
      expect(() => fileReader.getDocs(fileInfo)).toThrowError('JavaScript error in file "some/file.js" [line 13, column 3]');
    });

  });
});