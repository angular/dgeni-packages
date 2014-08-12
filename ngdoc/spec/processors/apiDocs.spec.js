var processorFactory = require('../../processors/apiDocs');
var getPartialNamesFactory = require('../../services/getPartialNames');
var parseCodeNameFactory = require('../../services/parseCodeName');
var partialNameMapFactory = require('../../services/partialNameMap');
var mockLog = require('dgeni/lib/mocks/log')(false);
var createDocMessageFactory = require('../../../base/services/createDocMessage');
var StringMap = require('stringmap');

var _ = require('lodash');


describe("api-docs processor", function() {
  var processor, moduleMap, partialNameMap;

  beforeEach(function() {
    moduleMap = new StringMap();
    partialNameMap = partialNameMapFactory(getPartialNamesFactory(), parseCodeNameFactory());
    processor = processorFactory(mockLog, partialNameMap, moduleMap, createDocMessageFactory());
    processor.apiDocsPath = 'partials';
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
    processor.$process([doc1,doc2]);
    expect(moduleMap.items()).toEqual([
      ['ng', doc1],
      ['ngMock', doc2]
    ]);
  });

  it("should compute the packageName and packageFile if not already provided", function() {
    var doc1 = { area: 'api', docType: 'module', name: 'ng' };
    var doc2 = { area: 'api', docType: 'module', name: 'ngResource' };
    var doc3 = { area: 'api', docType: 'module', name: 'ngMock', packageName: 'angular-mocks' };
    processor.$process([doc1,doc2, doc3]);
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

    processor.$process([doc]);

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
    moduleMap.set('ng', { components: [] });
    processor.$process([doc]);

    expect(moduleMap.get('ng').components[0]).toBe(doc);
  });

});
