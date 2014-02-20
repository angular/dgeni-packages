var plugin = require('../../processors/examples-generate');
var configurer = require('dgeni/lib/utils/config');

describe("examples-generate processor", function() {
  beforeEach(function() {
    var config = configurer.load();
    config.set('processing.examples.templateFolder', 'examples');
    config.set('deployment.environments', {

      default: {
        examples: {
          commonFiles: [],
          dependencyPath: '.'
        },
      },

      other: {
        examples: {
          commonFiles: {
            scripts: [ 'someFile.js', 'someOtherFile.js' ],
          },
          dependencyPath: '..'
        }
      }
    });
    plugin.init(config, { value: function() { }});
  });
  it("should add new documents that represent the examples", function() {
    var docs = [ { file: 'a.b.js' }];
    var examples = [
      {
        id: 'a.b.c',
        doc: docs[0],
        outputFolder: 'examples',
        deps: 'dep1.js;dep2.js',
        files: [
          { type: 'js', name: 'app.js' },
          { type: 'css', name: 'app.css' },
          { type: 'spec', name: 'app.spec.js' }
        ]
      }
    ];

    plugin.process(docs, examples);

    expect(docs[1]).toEqual(
      jasmine.objectContaining({ docType: 'example-js', template: 'examples/template.js' })
    );
    expect(docs[2]).toEqual(
      jasmine.objectContaining({ docType: 'example-css', template: 'examples/template.css' })
    );
    expect(docs[3]).toEqual(
      jasmine.objectContaining({ docType: 'example-spec', template: 'examples/template.spec' })
    );
    expect(docs[4]).toEqual(
      jasmine.objectContaining({ docType: 'example', template: 'examples/index.template.html' })
    );

    expect(docs[4].scripts).toEqual([
      { path : 'dep1.js' },
      { path : 'dep2.js' },
      jasmine.objectContaining({ path: 'app.js'})
    ]);

    expect(docs[5].scripts).toEqual([
      { path: 'someFile.js' },
      { path: 'someOtherFile.js' },
      { path : '../dep1.js' },
      { path : '../dep2.js' },
      jasmine.objectContaining({ path: 'app.js'})
    ]);
  });
});
