var plugin = require('../../processors/examples-generate');
var Config = require('dgeni').Config;
var _ = require('lodash');

describe("examples-generate processor", function() {
  var docs, examples, config;

  beforeEach(function() {
    config = new Config({
      processing: {
        examples: {
          templateFolder: 'examples'
        }
      },
      deployment: {
        environments: [
          {
            name: 'default',
            examples: {
              commonFiles: [],
              dependencyPath: '.'
            },
          },

          {
            name: 'other',
            examples: {
              commonFiles: {
                scripts: [ 'someFile.js', 'someOtherFile.js' ],
              },
              dependencyPath: '..'
            }
          }
        ]
      }
    });

    docs = [
      { file: 'a.b.js' }
    ];
    examples = { 'a.b.c':
      {
        id: 'a.b.c',
        doc: docs[0],
        outputFolder: 'examples',
        outputFolderPath: 'examples',
        deps: 'dep1.js;dep2.js',
        files: {
          'index.html': { type: 'html', name: 'index.html', fileContents: 'index.html content' },
          'app.js': { type: 'js', name: 'app.js', fileContents: 'app.js content' },
          'app.css': { type: 'css', name: 'app.css', fileContents: 'app.css content' },
          'app.spec.js': { type: 'spec', name: 'app.spec.js', fileContents: 'app.spec.js content' }
        }
      }
    };

    plugin.process(docs, examples, config);

  });
  it("should add an exampleDoc for each example deployment", function() {
    var exampleDocs = _.filter(docs, { docType: 'example' });
    expect(exampleDocs.length).toBe(2);

    expect(exampleDocs[0]).toEqual(
      jasmine.objectContaining({ docType: 'example', id:'a.b.c', template: 'examples/index.template.html'})
    );
    expect(exampleDocs[1]).toEqual(
      jasmine.objectContaining({ docType: 'example', id:'a.b.c-other', template: 'examples/index.template.html'})
    );

    expect(exampleDocs[0].fileContents).toEqual('index.html content');
    expect(exampleDocs[1].fileContents).toEqual('index.html content');
  });

  it("should add a fileDoc for each of the example's files", function() {
    expect(_.find(docs, { id: 'a.b.c/app.js' })).toEqual(
      jasmine.objectContaining({ docType: 'example-js', template: 'examples/template.js' })
    );
    expect(_.find(docs, { id: 'a.b.c/app.css' })).toEqual(
      jasmine.objectContaining({ docType: 'example-css', template: 'examples/template.css' })
    );
    expect(_.find(docs, { id: 'a.b.c/app.spec.js' })).toEqual(
      jasmine.objectContaining({ docType: 'example-spec', template: 'examples/template.spec' })
    );
  });

  it("should add the dependencies to the exampleDoc scripts", function() {
    expect(_.find(docs, { id: 'a.b.c' }).scripts).toEqual([
      { path : 'dep1.js' },
      { path : 'dep2.js' },
      jasmine.objectContaining({ path: 'examples/app.js'})
    ]);

    expect(_.find(docs, { id: 'a.b.c-other' }).scripts).toEqual([
      { path: 'someFile.js' },
      { path: 'someOtherFile.js' },
      { path : '../dep1.js' },
      { path : '../dep2.js' },
      jasmine.objectContaining({ path: 'examples/app.js'})
    ]);
  });

  it("should add a runnableExampleDoc for each example", function() {
    var runnableExampleDocs = _.filter(docs, { docType: 'runnableExample' });
    expect(runnableExampleDocs.length).toEqual(1);
  });

  it("should add a manifest doc for each example", function() {
    var manifestDocs = _.filter(docs, { docType: 'example-manifest' });
    expect(manifestDocs.length).toEqual(1);

  });
});
