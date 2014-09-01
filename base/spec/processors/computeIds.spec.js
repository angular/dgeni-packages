var mockPackage = require('dgeni-packages/base/spec/mockPackage');
var Dgeni = require('dgeni');

describe("computeIdsProcessor", function() {
  var processor, mockLog;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('computeIdsProcessor');
    mockLog = injector.get('log');
  });

  it("should do nothing but log a debug message if there is no id template for the given docType", function() {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        getId: jasmine.createSpy('getId').and.returnValue('index'),
        getPartialIds: jasmine.createSpy('getPartialIds').and.returnValue(['a','b']),
        idTemplate: '${ docType }'
      }
    ];

    var doc = { docType: 'b' };
    processor.$process([doc]);
    expect(processor.idTemplates[0].getId).not.toHaveBeenCalled();
    expect(processor.idTemplates[0].getPartialIds).not.toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'b' });
    expect(mockLog.debug).toHaveBeenCalled();
  });


  it("should compute id and partial ids using the getId and getPartialIds functions", function() {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        getId: jasmine.createSpy('getId').and.returnValue('index'),
        getPartialIds: jasmine.createSpy('getPartialIds').and.returnValue(['a','b']),
        idTemplate: '${ docType }'
      }
    ];
    var doc = { docType: 'a' };
    processor.$process([doc]);
    expect(processor.idTemplates[0].getId).toHaveBeenCalled();
    expect(processor.idTemplates[0].getPartialIds).toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', id: 'index', partialIds: ['a','b'] });
  });


  it("should compute the id using the template strings if no getId/getPartialIds functions are specified", function() {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        idTemplate: '${ docType }'
      }
    ];
    var doc = { docType: 'a' };
    processor.$process([doc]);
    expect(doc).toEqual({ docType: 'a', id: 'a' });
  });


  it("should use the template that matches the given docType", function() {
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

    var docA = { docType: 'a' };
    var docB = { docType: 'b' };

    processor.$process([docA, docB]);

    expect(docA).toEqual({ docType: 'a', id: 'A' });
    expect(docB).toEqual({ docType: 'b', id: 'B' });
  });


  it("should use the id if present (and not compute a new one)", function() {
    processor.idTemplates = [
      {
        docTypes: ['a'],
        getId: jasmine.createSpy('getId').and.returnValue('index'),
        getPartialIds: jasmine.createSpy('getPartialIds').and.returnValue(['a','b']),
        idTemplate: '${ docType }'
      }
    ];
    var doc = { docType: 'a', id: 'already/here', partialIds: ['x','y','z'] };
    processor.$process([doc]);
    expect(processor.idTemplates[0].getId).not.toHaveBeenCalled();
    expect(processor.idTemplates[0].getPartialIds).not.toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', id: 'already/here', partialIds: ['x','y','z'] });
  });
});