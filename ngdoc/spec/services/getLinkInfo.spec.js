var getPartialNamesFactory = require('../../services/getPartialNames');
var parseCodeNameFactory = require('../../services/parseCodeName');
var partialNameMapFactory = require('../../services/partialNameMap');
var getLinkInfoFactory = require('../../services/getLinkInfo');

var getLinkInfo, partialNameMap, mockCode;

describe("getLinkInfo", function() {
  beforeEach(function() {
    partialNameMap = partialNameMapFactory(getPartialNamesFactory(), parseCodeNameFactory());
    mockCode = jasmine.createSpy('code').and.callFake(function(value) { return '<code>' + value + '</code>'; });
    getLinkInfo = getLinkInfoFactory(partialNameMap, mockCode);
  });

  it("should lookup urls against the docs", function() {
    var doc = { id: 'module:ng.directive:ngClick', name: 'ngClick', path: 'api/ng/directive/ngClick' };
    partialNameMap.addDoc(doc);

    expect(getLinkInfo('ngClick')).toEqual({
      type: 'doc',
      valid: true,
      url: 'api/ng/directive/ngClick',
      title: '<code>ngClick</code>'
    });

    expect(getLinkInfo('ngClick', 'Click Event')).toEqual({
      type: 'doc',
      valid: true,
      url: 'api/ng/directive/ngClick',
      title: 'Click Event'
    });

    expect(getLinkInfo('ngClick#some-header', 'Click Event')).toEqual({
      type: 'doc',
      valid: true,
      url: 'api/ng/directive/ngClick#some-header',
      title: 'Click Event'
    });

  });

  it("should error if there are multiple docs with the same name", function() {
    var doc1 = { id: 'module:ng.directive:ngClick', name: 'ngClick', path: 'api/ng/directive/ngClick' };
    var doc2 = { id: 'module:ngTouch.directive:ngClick', name: 'ngClick', path: 'api/ngTouch/directive/ngClick' };
    partialNameMap.addDoc(doc1);
    partialNameMap.addDoc(doc2);
    expect(getLinkInfo('ngClick').error).toMatch(/Ambiguous link:/);
  });

  it("should filter ambiguous documents by area before failing", function() {
    var doc1 = { id: 'module:ng.directive:ngClick', name: 'ngClick', path: 'api/ng/directive/ngClick', area: 'api' };
    var doc2 = { id: 'ngClick', name: 'ngClick', path: 'guide/ngClick', area: 'guide' };
    partialNameMap.addDoc(doc1);
    partialNameMap.addDoc(doc2);
    expect(getLinkInfo('ngClick', 'ngClick Guide', doc2)).toEqual({
      type: 'doc',
      valid: true,
      url: 'guide/ngClick',
      title: 'ngClick Guide'
    });
  });
});