var rewire = require('rewire');
var processor = rewire('../../processors/api-docs');
var PartialNames = require('../../utils/partial-names').PartialNames;
var Config = require('dgeni/lib/utils/config').Config;
var di = require('di');
var _ = require('lodash');

describe("api-docs config", function() {
  it("should provide defaults for its options", function() {
    
    var config = _.extend(Config);
    config.set('rendering.contentsFolder', 'partials');
    processor.init(config, new di.Module());

    expect(processor.__get__('options')).toEqual({
      outputPath: '${area}/${module}/${docType}/${name}.html',
      path: '${area}/${module}/${docType}/${name}',
      moduleOutputPath: '${area}/${name}/index.html',
      modulePath: '${area}/${name}'
    });
  });

  it("should let us override the options", function() {
    var config = _.extend(Config);
    config.set('rendering.contentsFolder', 'partials');
    
    config.set('processing.api-docs.path', 'XXX');
    processor.init(config, new di.Module());
    
    expect(processor.__get__('options.path')).toEqual('XXX');
    expect(processor.__get__('options.moduleOutputPath')).toEqual('${area}/${name}/index.html');
  });
});

describe("api-docs processor", function() {
  var config;

  beforeEach(function() {
    config = _.extend(Config);
    config.set('rendering.contentsFolder', 'partials');
    processor.init(config, new di.Module());
  });

  it("should add module docs to the module map", function() {
    var doc1 = {
      area: 'api',
      docType: 'module',
      name: 'ng'
    };
    var doc2 = {
      area: 'api',
      docType: 'module',
      name: 'ngMock'
    };
    var moduleMap = {};
    processor.process([doc1,doc2], new PartialNames(), moduleMap);
    expect(moduleMap).toEqual({
      'ng': doc1,
      'ngMock': doc2
    });
  });
  
  it("should extract the container and member from the name if it is a memberOf type", function() {
    var doc = {
      docType: 'method',
      name: '$http#get',
      id: '$http#get',
      area: 'api',
      module: 'ng'
    };

    processor.process([doc], new PartialNames());

    expect(doc.name).toEqual('get');
    expect(doc.memberof).toEqual('$http');
    expect(doc.isMember).toEqual(true);
  });

  it("should attach each doc to its module", function() {
    var doc = {
      docType: 'service',
      id: 'module:ng.service:$http',
      module: 'ng'
    };
    var moduleMap = {
      'ng': {
        components: []
      }
    };
    processor.process([doc], new PartialNames(), moduleMap);

    expect(moduleMap['ng'].components[0]).toBe(doc);
  });

});
