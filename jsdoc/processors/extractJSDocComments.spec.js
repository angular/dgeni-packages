var path = require('canonical-path');
var Dgeni = require('dgeni');
var mockPackage = require('../mocks/mockPackage');

var srcJsContent = require('../mocks/_test-data/srcJsFile.js');
var docsFromJsContent = require('../mocks/_test-data/docsFromJsFile');


describe("extractJSDocCommentsProcessor", () => {

  var processor, jsParser;

  function createFileInfo(file, content, basePath) {
    return {
      filePath: file,
      baseName: path.basename(file, path.extname(file)),
      extension: path.extname(file).replace(/^\./, ''),
      basePath: basePath,
      relativePath: path.relative(basePath, file),
      content: content,
      ast: jsParser(content),
    };
  }

  function createDocsCollection(fileInfo) {
    return [{
      fileInfo: fileInfo,
      docType: 'jsFile'
    }];
  }

  beforeEach(() => {
    dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    jsParser = injector.get('jsParser');
    processor = injector.get('extractJSDocCommentsProcessor');
  });


  describe("$process", () => {

    it('should return a collection of documents extracted from the file', () => {
      var docs = createDocsCollection(createFileInfo('some/file.js', srcJsContent, '.'));

      docs = processor.$process(docs);
      expect(docs.length).toEqual(3);
      expect(docs[0]).toEqual(jasmine.objectContaining(docsFromJsContent[0]));
      expect(docs[1]).toEqual(jasmine.objectContaining(docsFromJsContent[1]));
      expect(docs[2]).toEqual(jasmine.objectContaining(docsFromJsContent[2]));
    });

    it("should set the docType to js", () => {
      var docs = createDocsCollection(createFileInfo('some/file.js', '/** @some jsdoc comment */', '.'));
      docs = processor.$process(docs);
      expect(docs[0].docType).toEqual('js');
    });


    it("should strip off the leading whitespace/stars from each line of the comments", () => {
      var docs = createDocsCollection(createFileInfo('some/file.js', '/** abc  \n  * other stuff  \n\t\t*last line.\n*/\n', '.'));
      docs = processor.$process(docs);
      expect(docs[0].content).toEqual('abc  \nother stuff  \nlast line.');
    });


    it("should ignore non-jsdoc comments", () => {
      var docs = createDocsCollection(createFileInfo('some/file.js', '/** Some jsdoc comment */\n// A line comment\n\/* A non-jsdoc block comment*/', '.'));
      docs = processor.$process(docs);
      expect(docs.length).toEqual(1);
    });


    it("should find the next code item following the comment and attach it to the doc", () => {
      var docs = createDocsCollection(createFileInfo('some/file.js', srcJsContent, '.'));
      docs = processor.$process(docs);
      expect(docs.length).toEqual(3);
      expect(docs[0].codeNode.type).toEqual('FunctionDeclaration');
      expect(docs[1].codeNode.type).toEqual('ExpressionStatement');
      expect(docs[2].codeNode.type).toEqual('ReturnStatement');
    });


    it("should not break if the comment has no code", () => {
      var docs = createDocsCollection(createFileInfo('some/file.js', 'function main() { } /** @some jsdoc comment */', '.'));
      expect(() => {
        docs = processor.$process(docs);
        expect(docs.length).toEqual(1);
      }).not.toThrow();
    });


    it("should not remove windows new line characters when stripping stars from comments", () => {
      var docs = createDocsCollection(createFileInfo('some/file.js', '/** Some jsdoc comment\r\n* over multiple\r\n* lines\r\n**/', '.'));
      docs = processor.$process(docs);
      expect(docs[0].content).toEqual('Some jsdoc comment\r\nover multiple\r\nlines');
    });
  });
});