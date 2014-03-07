var util = require('../../utils/partial-names');

describe("PartialNames", function() {

  describe("addDoc", function() {
    it("should return an array of partial names for a full code name", function() {
      var partialNames = new util.PartialNames();
      var doc = { id: 'module:ng.service:$http#get' };
      partialNames.addDoc(doc);
      expect(partialNames.map).toEqual({
        '$http#get': doc,
        'service:$http#get': doc,
        'ng.$http#get': doc,
        'module:ng.$http#get': doc,
        'ng.service:$http#get': doc,
        'module:ng.service:$http#get': doc,
        'get': doc
      });
    });
  });

  describe("removeDoc", function() {
    it("should remove the doc from any parts of the partial name map", function() {
      var partialNames = new util.PartialNames();
      var doc1 = { id: 'module:ng.service:$log' };
      var doc2 = { id: 'module:ngMock.service:$log' };
      partialNames.addDoc(doc1);
      partialNames.addDoc(doc2);

      expect(partialNames.map).toEqual({
        '$log': [doc1, doc2],
        'service:$log': [doc1, doc2],
        'ng.$log': doc1,
        'ngMock.$log': doc2,
        'module:ng.$log': doc1,
        'module:ngMock.$log': doc2,
        'ng.service:$log': doc1,
        'ngMock.service:$log': doc2,
        'module:ng.service:$log': doc1,
        'module:ngMock.service:$log': doc2,
      });

      partialNames.removeDoc(doc1);

      expect(partialNames.map).toEqual({
        '$log': doc2,
        'service:$log': doc2,
        'ngMock.$log': doc2,
        'module:ngMock.$log': doc2,
        'ngMock.service:$log': doc2,
        'module:ngMock.service:$log': doc2,
      });
    });
  });


  describe("getLink", function() {
    it("should lookup urls against the docs", function() {
      var partialNames = new util.PartialNames();
      var doc = { id: 'module:ng.directive:ngClick', name: 'ngClick', path: 'api/ng/directive/ngClick' };
      partialNames.addDoc(doc);

      expect(partialNames.getLink('ngClick')).toEqual({
        type: 'doc',
        valid: true,
        url: 'api/ng/directive/ngClick',
        title: '<code>ngClick</code>'
      });

      expect(partialNames.getLink('ngClick', 'Click Event')).toEqual({
        type: 'doc',
        valid: true,
        url: 'api/ng/directive/ngClick',
        title: 'Click Event'
      });

      expect(partialNames.getLink('ngClick#some-header', 'Click Event')).toEqual({
        type: 'doc',
        valid: true,
        url: 'api/ng/directive/ngClick#some-header',
        title: 'Click Event'
      });

    });
  });
});