var Dgeni = require('dgeni');
var mockPackage = require('../mocks/mockPackage');

describe('code-name doc service', function() {
  
  var codeNameService, codeNameMap, mockLog;
  
  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    codeNameService = injector.get('codeNameService');
    codeNameMap = injector.get('codeNameMap');
    mockLog = injector.get('log');
  });
  
  it("should register matcher", function() {
    var testMatcher = function test () {};

    codeNameService.matchers = [testMatcher];

    expect(codeNameMap.get('test')).toEqual(testMatcher);
  });

  it("should strip suffix from matcher name", function() {
    var testMatcher = function TestNodeMatcher () {};

    codeNameService.matchers = [testMatcher];
    
    expect(codeNameMap.get('Test')).toEqual(testMatcher);
  });

  it("should log anonymous matcher and refuse registration", function() {
    var testMatcher = function () {};

    codeNameService.matchers = [testMatcher];
    
    expect(codeNameMap.get('Test')).toBeUndefined();
  });

  it("should return null for missing node", function() {
    expect(codeNameService.find()).toBeNull();
    expect(codeNameService.find(null)).toBeNull();
  });

  it("should process matcher for node", function() {
    var testMatcher = function TestNodeMatcher () { return 'test'}

    codeNameService.matchers = [testMatcher];

    expect(codeNameService.find({type: 'Test'})).toEqual('test');
  });

  it("should warn unknown nodes", function() {
    expect(codeNameService.find({type: 'Other'})).toBeNull();
    expect(mockLog.warn).toHaveBeenCalledWith('HELP! Unrecognised node type: %s', 'Other');
  });
});
