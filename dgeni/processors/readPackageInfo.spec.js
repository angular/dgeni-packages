const path = require('canonical-path');
const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("readPackageInfo processor", () => {

  let processor;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();

    processor = injector.get('readPackageInfo');
  });

  it('should wire up documented and pseudo processors', () => {
    const docs = [
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


  it('should wire up documented and undocumented package dependencies', () => {
    const docs = [
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