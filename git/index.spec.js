var gitPackage = require('./');
var Dgeni = require('dgeni');
var mocks = require('./mocks/mocks.js');

describe('git package', function() {
  it("should be instance of Package", function() {
    expect(gitPackage instanceof Dgeni.Package).toBeTruthy();
  });

  it("should set extraData.git to gitData", function() {
    var renderSpy = jasmine.createSpy('extraData');
    var extraData = {};
    var gitData = {};

    gitPackage
      .factory('gitData', function() { return gitData })

      .factory('renderDocsProcessor', function dummyRenderDocsProcessor() {
        return {
          extraData: extraData 
        };
      });

    new Dgeni([gitPackage]).generate();
    expect(extraData.git).toBe(gitData);
  });
});
