var processorFactory = require('../../processors/computeId');

describe("computeId doc processor", function() {
  var processor;

  beforeEach(function() {
    processor = processorFactory();
  });

  it("should compute the id of api modules", function() {
    var doc = { area: 'api', docType: 'module', name: 'ng' };
    processor.$process([doc]);
    expect(doc.id).toEqual('module:ng');
  });

  it("should compute the id of api components", function() {
    var doc = { area: 'api', docType: 'service', module: 'ngRoute', name: '$route' };
    processor.$process([doc]);
    expect(doc.id).toEqual('module:ngRoute.service:$route');
  });

  it("should compute the id of error docs from the name", function() {
    var doc = { area: 'error', docType: 'error', name: '$compile:ctreq' };
    processor.$process([doc]);
    expect(doc.id).toEqual('$compile:ctreq');
  });

  it("should compute the id of other docs from the file", function() {
    var doc = { area: 'guide', docType: 'overview', name: 'Some Doc', fileInfo: { filePath: 'a/b/foo.ngdoc', baseName: 'foo' } };
    processor.$process([doc]);
    expect(doc.id).toEqual('foo');
  });

  it("should not touch the id if it is already defined", function() {
    var doc = { id: 'already-here', area: 'api', docType: 'service', module: 'ngRoute', name: '$route' };
    processor.$process([doc]);
    expect(doc.id).toEqual('already-here');
  });
});



