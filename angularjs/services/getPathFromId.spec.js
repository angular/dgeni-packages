var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("getPathFromId", function() {

  var getPathFromId;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    getPathFromId = injector.get('getPathFromId');
  });


  it("should strip off the qualifiers and join the parts into path segments", function() {

    expect(getPathFromId({ id: 'module:app.service:$http.method:get' })).toEqual('modules/app/services/$http/methods/get/');
  });
});