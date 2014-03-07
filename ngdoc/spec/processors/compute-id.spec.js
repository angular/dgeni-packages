var processor = require('../../processors/compute-id');

describe("compute-id doc processor", function() {
  it("should compute the id of api modules", function() {
    var doc = { area: 'api', docType: 'module', name: 'ng' };
    processor.process([doc]);
    expect(doc.id).toEqual('module:ng');
  });

  it("should compute the id of api components", function() {
    var doc = { area: 'api', docType: 'service', module: 'ngRoute', name: '$route' };
    processor.process([doc]);
    expect(doc.id).toEqual('module:ngRoute.service:$route');
  });

  it("should compute the id of error docs from the name", function() {
    var doc = { area: 'error', docType: 'error', name: '$compile:ctreq' };
    processor.process([doc]);
    expect(doc.id).toEqual('$compile:ctreq');
  });

  it("should compute the id of other docs from the file", function() {
    var doc = { area: 'guide', docType: 'overview', name: 'Some Doc', file: 'a/b/foo.ngdoc', fileName: 'foo' };
    processor.process([doc]);
    expect(doc.id).toEqual('foo');
  });
});



