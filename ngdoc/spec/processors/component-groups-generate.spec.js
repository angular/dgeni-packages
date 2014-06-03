var _ = require('lodash');
var processor = require('../../processors/component-groups-generate');
var Config = require('dgeni').Config;

describe("component-groups processor", function() {

  it("should create a new doc for each group of components (by docType) in each module", function() {
    var docs = [];
    var modules = [{
      id: 'mod1',
      components: [
        { docType: 'a', id: 'a1' },
        { docType: 'a', id: 'a2' },
        { docType: 'a', id: 'a3' },
        { docType: 'a', id: 'a4' },
        { docType: 'b', id: 'b1' },
        { docType: 'b', id: 'b2' },
        { docType: 'b', id: 'a3' }
      ]
    }];

    config = new Config();
    config.set('rendering.contentsFolder', 'partials');
    config.set('processing.api-docs', {
      outputPath: '${area}/${module}/${docType}/${name}.html',
      path: '${area}/${module}/${docType}/${name}'
    });

    processor.process(docs, config, modules);

    expect(docs.length).toEqual(2);

  });


  it("should use the outputPath and path specified in processing.api-docs", function() {
    var docs = [];
    var modules = [{
      id: 'mod1',
      name: 'test',
      area: 'api-docs',
      components: [
        { docType: 'a', id: 'a1' },
        { docType: 'a', id: 'a2' },
        { docType: 'a', id: 'a3' },
        { docType: 'a', id: 'a4' },
        { docType: 'b', id: 'b1' },
        { docType: 'b', id: 'b2' },
        { docType: 'b', id: 'a3' }
      ]
    }];

    config = new Config();
    config.set('rendering.contentsFolder', 'partials');
    config.set('processing.api-docs', {
      outputPath: '${area}/${module}/${docType}/${name}.html',
      path: '${area}/${module}/${docType}/${name}'
    });

    processor.process(docs, config, modules);

    expect(docs[0].path).toBe('api-docs/test/a/index');
    expect(docs[0].outputPath).toBe('partials/api-docs/test/a/index.html');

  });


});