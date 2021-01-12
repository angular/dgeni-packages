const Dgeni = require('dgeni');
const mockPackage = require('../mocks/mockPackage');

describe('code-name doc service', () => {

  let codeNameService, codeNameMap, mockLog;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    codeNameService = injector.get('codeNameService');
    codeNameMap = injector.get('codeNameMap');
    mockLog = injector.get('log');
  });

  it("should register matcher", () => {
    const testMatcher = function test () {};

    codeNameService.matchers = [testMatcher];

    expect(codeNameMap.get('test')).toEqual(testMatcher);
  });

  it("should strip suffix from matcher name", () => {
    const testMatcher = function TestNodeMatcher () {};

    codeNameService.matchers = [testMatcher];

    expect(codeNameMap.get('Test')).toEqual(testMatcher);
  });

  it("should log anonymous matcher and refuse registration", () => {
    const testMatcher = () => {};

    codeNameService.matchers = [testMatcher];

    expect(codeNameMap.get('Test')).toBeUndefined();
  });

  it("should return null for missing node", () => {
    expect(codeNameService.find()).toBeNull();
    expect(codeNameService.find(null)).toBeNull();
  });

  it("should process matcher for node", () => {
    const testMatcher = function TestNodeMatcher () { return 'test';};

    codeNameService.matchers = [testMatcher];

    expect(codeNameService.find({type: 'Test'})).toEqual('test');
  });

  it("should warn unknown nodes", () => {
    expect(codeNameService.find({type: 'Other'})).toBeNull();
    expect(mockLog.warn).toHaveBeenCalledWith('HELP! Unrecognised node type: %s', 'Other');
  });
});
