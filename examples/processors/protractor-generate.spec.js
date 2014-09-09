var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

var _ = require('lodash');

describe("generateExamplesProcessor", function() {

  it("should add a protractor doc for each deployment in the example", function() {

    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    var processor = injector.get('generateProtractorTestsProcessor');
    processor.templateFolder = 'examples';
    processor.deployments = [
      {
        name: 'default',
        examples: { commonFiles: [], dependencyPath: '.' },
      },
      {
        name: 'other',
        examples: { commonFiles: { scripts: [ 'someFile.js', 'someOtherFile.js' ], }, dependencyPath: '..' }
      }
    ];


    docs = [{ file: 'a.b.js' }];

    files = {};

    files['index.html'] = { type: 'html', name: 'index.html', fileContents: 'index.html content' };
    files['app.js'] = { type: 'js', name: 'app.js', fileContents: 'app.js content' };
    files['app.css'] = { type: 'css', name: 'app.css', fileContents: 'app.css content' };
    files['app.scenario.js'] = { type: 'protractor', name: 'app.scenario.js', fileContents: 'app.scenario.js content' };

    var exampleMap = injector.get('exampleMap');
    exampleMap.set('a.b.c', {
      id: 'a.b.c',
      doc: docs[0],
      outputFolder: 'examples',
      deps: 'dep1.js;dep2.js',
      files: files,
      deployments: {}
    });


    processor.$process(docs);

    expect(_.filter(docs, { docType: 'e2e-test' })).toEqual([
      jasmine.objectContaining({
        docType: 'e2e-test',
        id: 'protractorTest-a.b.c-' + processor.deployments[0].name,
        example: exampleMap.get('a.b.c'),
        deployment: processor.deployments[0],
        template: 'protractorTests.template.js',
        innerTest: 'app.scenario.js content'
      }),
      jasmine.objectContaining({
        docType: 'e2e-test',
        id: 'protractorTest-a.b.c-' + processor.deployments[1].name,
        example: exampleMap.get('a.b.c'),
        deployment: processor.deployments[1],
        template: 'protractorTests.template.js',
        innerTest: 'app.scenario.js content'
      }),
    ]);
  });

});
