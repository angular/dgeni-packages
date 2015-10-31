var path = require('canonical-path');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("readPackageInfo processor", function() {

  var processor;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    processor = injector.get('readPackageInfo');
  });

  it('should wire up documented and pseudo processors', function() {
    var docs = [
    {
      docType: 'dgPackage',
      name: 'testPackage',
      description: 'This is a test package',
      fileInfo: {
        filePath: path.resolve(__dirname, '../mocks/testPackage')
      }
    },
    {
      docType: 'dgProcessor',
      name: 'testProcessor',
      description: 'This is the test processor',
      fileInfo: {
        filePath: path.resolve(__dirname, '../mocks/testProcessor')
      }
    }];

    processor.$process(docs);

    expect(docs[0]).toEqual(jasmine.objectContaining({
      docType: 'dgPackage',
      name: 'testPackage',
      description: 'This is a test package',
      processors: [
        docs[1],
        docs[2]
      ]
    }));
  });


  it('should wire up documented and undocumented package dependencies', function() {
    var docs = [
    {
      docType: 'dgPackage',
      name: 'testPackage',
      description: 'This is a test package',
      fileInfo: {
        filePath: path.resolve(__dirname, '../mocks/testPackage')
      }
    },
    {
      docType: 'dgPackage',
      name: 'testPackage2',
      description: 'This is another test package',
      fileInfo: {
        filePath: path.resolve(__dirname, '../mocks/testPackage2')
      }
    }];

    processor.$process(docs);

    expect(docs[0].dependencies).toEqual([
      docs[1],
      jasmine.objectContaining({
        name: 'somePackage'
      })
    ]);
  });
});