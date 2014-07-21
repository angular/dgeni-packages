var rewire = require('rewire');
var processor = rewire('../../processors/api-docs');
var PartialNames = require('../../utils/partial-names').PartialNames;
var Config = require('dgeni').Config;
var di = require('di');
var _ = require('lodash');


describe("api-docs processor", function() {
  var config;

  beforeEach(function() {
    config = new Config();
    config.set('rendering.contentsFolder', 'partials');
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
    processor.process([doc1,doc2], config, new PartialNames(), moduleMap);
    expect(moduleMap).toEqual({
      'ng': doc1,
      'ngMock': doc2
    });
  });

  it("should compute the packageName and packageFile if not already provided", function() {
    var doc1 = { area: 'api', docType: 'module', name: 'ng' };
    var doc2 = { area: 'api', docType: 'module', name: 'ngResource' };
    var doc3 = { area: 'api', docType: 'module', name: 'ngMock', packageName: 'angular-mocks' };
    var moduleMap = {};
    processor.process([doc1,doc2, doc3], config, new PartialNames(), moduleMap);
    expect(doc1.packageName).toEqual('angular');
    expect(doc1.packageFile).toEqual('angular.js');
    expect(doc2.packageName).toEqual('angular-resource');
    expect(doc2.packageFile).toEqual('angular-resource.js');
    expect(doc3.packageName).toEqual('angular-mocks');
    expect(doc3.packageFile).toEqual('angular-mocks.js');
  });

  it("should extract the container and member from the name if it is a memberOf type", function() {
    var doc = {
      docType: 'method',
      name: '$http#get',
      id: '$http#get',
      area: 'api',
      module: 'ng'
    };

    processor.process([doc], config, new PartialNames());

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
    processor.process([doc], config, new PartialNames(), moduleMap);

    expect(moduleMap['ng'].components[0]).toBe(doc);
  });

});
