const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("computeIdsProcessor", () => {
  let processor, mockLog;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('computeIdsProcessor');
    mockLog = injector.get('log');
  });

  it("should do nothing but log a debug message if there is no id template for the given docType", () => {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        getId: jasmine.createSpy('getId').and.returnValue('index'),
        getAliases: jasmine.createSpy('getAliases').and.returnValue(['a','b']),
        idTemplate: '${ docType }'
      }
    ];

    const doc = { docType: 'b' };
    processor.$process([doc]);
    expect(processor.idTemplates[0].getId).not.toHaveBeenCalled();
    expect(processor.idTemplates[0].getAliases).not.toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'b' });
    expect(mockLog.debug).toHaveBeenCalled();
  });


  it("should compute id and partial ids using the getId and getAliases functions", () => {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        getId: jasmine.createSpy('getId').and.returnValue('index'),
        getAliases: jasmine.createSpy('getAliases').and.returnValue(['a','b']),
        idTemplate: '${ docType }'
      }
    ];
    const doc = { docType: 'a' };
    processor.$process([doc]);
    expect(processor.idTemplates[0].getId).toHaveBeenCalled();
    expect(processor.idTemplates[0].getAliases).toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', id: 'index', aliases: ['a','b'] });
  });


  it("should compute the id using the template strings if no getId/getAliases functions are specified", () => {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        idTemplate: '${ docType }'
      }
    ];
    const doc = { docType: 'a' };
    processor.$process([doc]);
    expect(doc).toEqual({ docType: 'a', id: 'a' });
  });


  it("should use the template that matches the given docType", () => {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        idTemplate: 'A'
      },
      {
        docTypes: ['b'],
        idTemplate: 'B'
      }
    ];

    const docA = { docType: 'a' };
    const docB = { docType: 'b' };

    processor.$process([docA, docB]);

    expect(docA).toEqual({ docType: 'a', id: 'A' });
    expect(docB).toEqual({ docType: 'b', id: 'B' });
  });


  it("should use the id if present (and not compute a new one)", () => {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        getId: jasmine.createSpy('getId').and.returnValue('index'),
        getAliases: jasmine.createSpy('getAliases').and.returnValue(['a','b']),
        idTemplate: '${ docType }'
      }
    ];
    const doc = { docType: 'a', id: 'already/here', aliases: ['x','y','z'] };
    processor.$process([doc]);
    expect(processor.idTemplates[0].getId).not.toHaveBeenCalled();
    expect(processor.idTemplates[0].getAliases).not.toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', id: 'already/here', aliases: ['x','y','z'] });
  });
});