var factory = require('../../processors/computePaths');
var mockLog = require('dgeni/lib/mocks/log')(false);
var createDocMessage = require('../../services/createDocMessage');

describe("computePathsProcessor", function() {
  var processor;

  beforeEach(function() {
    processor = factory(mockLog, createDocMessage());
  });


  it("should compute path and outputPath using the getPath and getOutputPath functions", function() {
    processor.pathTemplates = [
      {
        getPath: jasmine.createSpy('getPath').and.returnValue('index'),
        getOutputPath: jasmine.createSpy('getOutputPath').and.returnValue('index.html'),
        pathTemplate: '${ docType }',
        outputPathTemplate: '${ docType }.html'
      }
    ];
    var doc = { docType: 'a' };
    processor.$process([doc]);
    expect(processor.pathTemplates[0].getPath).toHaveBeenCalled();
    expect(processor.pathTemplates[0].getOutputPath).toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', path: 'index', outputPath: 'index.html' });
  });


  it("should compute the path using the template strings if no getPath/getOutputPath functions are specified", function() {
    processor.pathTemplates = [
      {
        pathTemplate: '${ docType }',
        outputPathTemplate: '${ docType }.html'
      }
    ];
    var doc = { docType: 'a' };
    processor.$process([doc]);
    expect(doc).toEqual({ docType: 'a', path: 'a', outputPath: 'a.html' });
  });


  it("should use the template that matches the given docType", function() {
    processor.pathTemplates = [
      {
        docTypes: ['a'],
        pathTemplate: 'A',
        outputPathTemplate: 'A.html'
      },
      {
        docTypes: ['b'],
        pathTemplate: 'B',
        outputPathTemplate: 'B.html'
      }
    ];

    var docA = { docType: 'a' };
    var docB = { docType: 'b' };

    processor.$process([docA, docB]);

    expect(docA).toEqual({ docType: 'a', path: 'A', outputPath: 'A.html' });
    expect(docB).toEqual({ docType: 'b', path: 'B', outputPath: 'B.html' });
  });


  it("should default to using the template with no docType", function() {
    processor.pathTemplates = [
      {
        docTypes: ['a'],
        pathTemplate: 'A',
        outputPathTemplate: 'A.html'
      },
      {
        pathTemplate: 'default',
        outputPathTemplate: 'default.html'
      }
    ];

    var docA = { docType: 'a' };
    var docB = { docType: 'b' };

    processor.$process([docA, docB]);

    expect(docA).toEqual({ docType: 'a', path: 'A', outputPath: 'A.html' });
    expect(docB).toEqual({ docType: 'b', path: 'default', outputPath: 'default.html' });
  });


  it("should use the path if present (and not compute a new one)", function() {
    processor.pathTemplates = [
      {
        getPath: jasmine.createSpy('getPath').and.returnValue('index'),
        getOutputPath: jasmine.createSpy('getOutputPath').and.returnValue('index.html'),
        pathTemplate: '${ docType }',
        outputPathTemplate: '${ docType }.html'
      }
    ];
    var doc = { docType: 'a', path: 'already/here', outputPath: 'already/here/file.html' };
    processor.$process([doc]);
    expect(processor.pathTemplates[0].getPath).not.toHaveBeenCalled();
    expect(processor.pathTemplates[0].getOutputPath).not.toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', path: 'already/here', outputPath: 'already/here/file.html' });
  });
});