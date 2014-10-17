var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

var getLinkInfo, aliasMap, getAliases;

describe("getLinkInfo", function() {
  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    aliasMap = injector.get('aliasMap');
    getAliases = injector.get('getAliases');
    getLinkInfo = injector.get('getLinkInfo');
  });

  it("should lookup urls against the docs", function() {
    var doc = { id: 'module:ng.directive:ngClick', name: 'ngClick', path: 'api/ng/directive/ngClick' };
    doc.aliases = getAliases(doc);
    aliasMap.addDoc(doc);

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
    doc1.aliases = getAliases(doc1);
    aliasMap.addDoc(doc1);

    var doc2 = { id: 'module:ngTouch.directive:ngClick', name: 'ngClick', path: 'api/ngTouch/directive/ngClick' };
    doc2.aliases = getAliases(doc2);
    aliasMap.addDoc(doc2);

    expect(getLinkInfo('ngClick').error).toMatch(/Ambiguous link:/);
  });

  it("should error if no docs match the link", function() {
    expect(getLinkInfo('ngClick').error).toEqual('Invalid link (does not match any doc): "ngClick"');
  });

  it("should not error if the link is a URL or starts with a hash", function() {
    expect(getLinkInfo('some/path').error).toBeUndefined();
    expect(getLinkInfo('some/path').title).toEqual('path');
    expect(getLinkInfo('#fragment').error).toBeUndefined();
    expect(getLinkInfo('#fragment').title).toEqual('fragment');
  });

  it("should filter ambiguous documents by module before failing", function() {
    var doc1 = { id: 'module:ng.directive:ngClick', name: 'ngClick', path: 'api/ng/directive/ngClick', module: 'ng' };
    doc1.aliases = getAliases(doc1);
    aliasMap.addDoc(doc1);

    var doc2 = { id: 'module:ngTouch.directive:ngClick', name: 'ngClick', path: 'api/ngTouch/directive/ngClick', module: 'ngTouch' };
    doc2.aliases = getAliases(doc2);
    aliasMap.addDoc(doc2);

    var doc3 = { id: 'module:ngTouch', name: 'ngTouch', path: 'api/ngTouch', module: 'ngTouch' };

    expect(getLinkInfo('ngClick', 'ngClick (ngTouch)', doc3)).toEqual({
      type: 'doc',
      valid: true,
      url: 'api/ngTouch/directive/ngClick',
      title: 'ngClick (ngTouch)'
    });
  });


  it("should make the urls relative to the currentDoc if the relativeLinks property is true", function() {
    var doc1 = { id: 'module:ng.directive:ngClick', name: 'ngClick', path: 'api/ng/directive/ngClick'};
    var doc2 = { id: 'module:ng.directive:ngRepeat', name: 'ngRepeat', path: 'api/ng/directive/ngRepeat'};
    var doc3 = { id: 'module:ng', name: 'ng', path: 'api/ng'};

    doc1.aliases = getAliases(doc1);
    aliasMap.addDoc(doc1);


    getLinkInfo.relativeLinks = false;
    expect(getLinkInfo('ngClick', 'ngClick', doc1).url).toEqual('api/ng/directive/ngClick');
    expect(getLinkInfo('ngClick', 'ngClick', doc2).url).toEqual('api/ng/directive/ngClick');
    expect(getLinkInfo('ngClick', 'ngClick', doc3).url).toEqual('api/ng/directive/ngClick');

    getLinkInfo.relativeLinks = true;
    expect(getLinkInfo('ngClick', 'ngClick', doc1).url).toEqual('');
    expect(getLinkInfo('ngClick', 'ngClick', doc2).url).toEqual('../ngClick');
    expect(getLinkInfo('ngClick', 'ngClick', doc3).url).toEqual('directive/ngClick');

  });
});