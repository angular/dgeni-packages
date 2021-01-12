const examplesPackage = require('./index');
const ngdocPackage = require('../ngdoc/index');

const Dgeni = require('dgeni');
const mockLog = require('dgeni/lib/mocks/log');



describe('examples package', () => {
  it("should be instance of Package", () => {
      expect(examplesPackage instanceof Dgeni.Package).toBeTruthy();
  });


  function runDgeni(docs) {
    const testPackage = new Dgeni.Package('testPackage', [examplesPackage, ngdocPackage])
      .factory('log', function log() { return mockLog(false); })
      .processor('provideTestDocs', function provideTestDocs() {
        return {
          $runBefore: ['parseExamplesProcessor'],
          $process() {
            return docs;
          }
        };
      })

      .config(function(readFilesProcessor, writeFilesProcessor, renderDocsProcessor, unescapeCommentsProcessor, generateProtractorTestsProcessor) {
        readFilesProcessor.$enabled = false;
        writeFilesProcessor.$enabled = false;
        renderDocsProcessor.$enabled = false;
        unescapeCommentsProcessor.$enabled = false;
        generateProtractorTestsProcessor.$enabled = false;
      })

      .config(function(generateExamplesProcessor) {
        generateExamplesProcessor.deployments = [ {
          name: 'testDeployment',
          examples: {
            commonFiles: {
              scripts: [ '../../../dep1.js' ]
            },
            dependencyPath: '../../../'
          },
          scripts: [
            '../dep1.js',
            '../dep2.js'
          ],
          stylesheets: [
            'style1.css',
            'style2.css'
          ]
        }];
      });

    return new Dgeni([testPackage]).generate();
  }

  function processExample() {
    const doc = {
      content:
        '/** @ngdoc service\n' +
        ' * @description\n' +
        ' * <example name="testExample">\n' +
        ' *   <file name="app.js">some code</file>\n' +
        ' * </example>\n' +
        ' */',
      fileInfo: { relativePath: 'a.js', baseName: 'a' }
    };

    return runDgeni([doc]).then(null, err => console.log("ERROR:", err));
  }


  it("should compute the path of examples from their attributes", done => {
    processExample().then(docs => {

      expect(docs.length).toEqual(4);

      expect(docs[0].id).toEqual('example-testExample/app.js');
      expect(docs[0].path).toEqual('app.js');
      expect(docs[0].outputPath).toEqual('examples/example-testExample/app.js');

      expect(docs[1].id).toEqual('example-testExample-testDeployment');
      expect(docs[1].path).toEqual('examples/example-testExample');
      expect(docs[1].outputPath).toEqual('examples/example-testExample/index-testDeployment.html');

      expect(docs[2].id).toEqual('example-testExample-runnableExample');
      expect(docs[2].path).toEqual('examples/example-testExample');
      expect(docs[2].outputPath).toBeUndefined();

      expect(docs[3].id).toEqual('example-testExample/manifest.json');
      expect(docs[3].path).toBeUndefined();
      expect(docs[3].outputPath).toEqual('examples/example-testExample/manifest.json');

      done();
    });
  });
});
