var getPartialNamesFactory = require('../../services/getPartialNames');
var parseCodeNameFactory = require('../../services/parseCodeName');
var partialNameMapFactory = require('../../services/partialNameMap');

var partialNameMap;

describe("PartialNameMap", function() {
  beforeEach(function() {
    partialNameMap = partialNameMapFactory(getPartialNamesFactory(), parseCodeNameFactory());
  });

  describe("addDoc", function() {
    it("should return an array of partial names for a full code name", function() {
      var doc = { id: 'module:ng.service:$http#get' };
      partialNameMap.addDoc(doc);
      expect(partialNameMap.getDocs('$http#get')).toEqual([doc]);
      expect(partialNameMap.getDocs('service:$http#get')).toEqual([doc]);
      expect(partialNameMap.getDocs('ng.$http#get')).toEqual([doc]);
      expect(partialNameMap.getDocs('module:ng.$http#get')).toEqual([doc]);
      expect(partialNameMap.getDocs('ng.service:$http#get')).toEqual([doc]);
      expect(partialNameMap.getDocs('module:ng.service:$http#get')).toEqual([doc]);
      expect(partialNameMap.getDocs('get')).toEqual([doc]);
    });
  });

  describe("removeDoc", function() {
    it("should remove the doc from any parts of the partial name map", function() {
      var doc1 = { id: 'module:ng.service:$log' };
      var doc2 = { id: 'module:ngMock.service:$log' };
      partialNameMap.addDoc(doc1);
      partialNameMap.addDoc(doc2);

      expect(partialNameMap.getDocs('$log')).toEqual([doc1, doc2]);
      expect(partialNameMap.getDocs('service:$log')).toEqual([doc1, doc2]);
      expect(partialNameMap.getDocs('ng.$log')).toEqual([doc1]);
      expect(partialNameMap.getDocs('ngMock.$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('module:ng.$log')).toEqual([doc1]);
      expect(partialNameMap.getDocs('module:ngMock.$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('ng.service:$log')).toEqual([doc1]);
      expect(partialNameMap.getDocs('ngMock.service:$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('module:ng.service:$log')).toEqual([doc1]);
      expect(partialNameMap.getDocs('module:ngMock.service:$log')).toEqual([doc2]);

      partialNameMap.removeDoc(doc1);

      expect(partialNameMap.getDocs('$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('service:$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('ng.$log')).toEqual([]);
      expect(partialNameMap.getDocs('ngMock.$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('module:ng.$log')).toEqual([]);
      expect(partialNameMap.getDocs('module:ngMock.$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('ng.service:$log')).toEqual([]);
      expect(partialNameMap.getDocs('ngMock.service:$log')).toEqual([doc2]);
      expect(partialNameMap.getDocs('module:ng.service:$log')).toEqual([]);
      expect(partialNameMap.getDocs('module:ngMock.service:$log')).toEqual([doc2]);

    });
  });
});