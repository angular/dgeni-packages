var partialIdMapFactory = require('../../services/partialIdMap');

var partialIdMap;

describe("partialIdMap", function() {
  beforeEach(function() {
    partialIdMap = partialIdMapFactory();
  });

  describe("addDoc", function() {
    it("should add the doc to an array for each partial id", function() {
      var doc = { partialIds: ['a', 'b', 'c'] };
      partialIdMap.addDoc(doc);
      expect(partialIdMap.getDocs('a')).toEqual([doc]);
      expect(partialIdMap.getDocs('b')).toEqual([doc]);
      expect(partialIdMap.getDocs('c')).toEqual([doc]);
    });

    it("should not add the doc if it has no partialIds", function() {
      var doc = { };
      partialIdMap.addDoc(doc);
      expect(partialIdMap.getDocs('a')).toEqual([]);
      expect(partialIdMap.getDocs('b')).toEqual([]);
      expect(partialIdMap.getDocs('c')).toEqual([]);
    });
  });

  describe("getDocs", function() {
    it("should return an empty array if no doc matches the partialId", function() {
      var doc = { partialIds: ['a', 'b', 'c'] };
      expect(partialIdMap.getDocs('d')).toEqual([]);
    });
  });

  describe("removeDoc", function() {
    it("should remove the doc from any parts of the partialIdMap", function() {
      var doc1 = { partialIds: ['a','b1'] };
      var doc2 = { partialIds: ['a','b2'] };
      partialIdMap.addDoc(doc1);
      partialIdMap.addDoc(doc2);

      expect(partialIdMap.getDocs('a')).toEqual([doc1, doc2]);
      expect(partialIdMap.getDocs('b1')).toEqual([doc1]);
      expect(partialIdMap.getDocs('b2')).toEqual([doc2]);

      partialIdMap.removeDoc(doc1);

      expect(partialIdMap.getDocs('a')).toEqual([doc2]);
      expect(partialIdMap.getDocs('b1')).toEqual([]);
      expect(partialIdMap.getDocs('b2')).toEqual([doc2]);

    });
  });
});