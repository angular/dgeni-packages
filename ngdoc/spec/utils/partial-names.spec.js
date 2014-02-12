var util = require('../../utils/partial-names');

describe("partial-name", function() {

  describe("PartialNames", function() {
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

});