var renderDocsFactory = require('../../processors/render-docs');

var mockLog, mockTemplateFinder, mockTemplateEngine;
var mockLog = require('dgeni/lib/mocks/log')(/* true */);

beforeEach(function() {
  mockTemplateFinder = jasmine.createSpy('templateFinder').and.returnValue('SOME TEMPLATE');
  mockTemplateEngine = jasmine.createSpyObj('templateEngine', ['render']);
});

describe("render-docs", function() {

  it("should call the templateFinder for each doc", function() {
    var doc1 = {}, doc2 = {}, docs = [ doc1, doc2 ];
    var processor = renderDocsFactory(mockLog, mockTemplateFinder, mockTemplateEngine);
    processor.$process(docs);
    expect(mockTemplateFinder.calls.count()).toEqual(2);
    expect(mockTemplateFinder.calls.argsFor(0)).toEqual([doc1]);
    expect(mockTemplateFinder.calls.argsFor(1)).toEqual([doc2]);
  });

  it("should call the templateEngine.render with the template and data", function() {
    var doc1 = { id: 1 }, doc2 = { id: 2 }, docs = [ doc1, doc2 ];
    var someProp = {}, someMethod = function() {};
    var processor = renderDocsFactory(mockLog, mockTemplateFinder, mockTemplateEngine);

    processor.extraData.someProp = someProp;
    processor.helpers.someMethod = someMethod;

    processor.$process(docs);

    expect(mockTemplateEngine.render.calls.count()).toEqual(2);
    expect(mockTemplateEngine.render.calls.argsFor(0)).toEqual(['SOME TEMPLATE',
      { doc: doc1, docs: docs, someProp: someProp, someMethod: someMethod }]);
    expect(mockTemplateEngine.render.calls.argsFor(1)).toEqual(['SOME TEMPLATE',
      { doc: doc2, docs: docs, someProp: someProp, someMethod: someMethod }]);
  });

  it("should place the result of calling templateEngine.render into doc.renderedContent", function() {
    var doc1 = { id: 1 }, doc2 = { id: 2 }, docs = [ doc1, doc2 ];

    mockTemplateEngine.render.and.returnValue('RENDERED CONTENT');

    var processor = renderDocsFactory(mockLog, mockTemplateFinder, mockTemplateEngine);

    processor.$process(docs);
    expect(doc1.renderedContent).toEqual('RENDERED CONTENT');
    expect(doc2.renderedContent).toEqual('RENDERED CONTENT');
  });

});
