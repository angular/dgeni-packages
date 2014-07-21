var renderDocsFactory = require('../../processors/render-docs');

var mockLog, mockTemplateFinder, mockTemplateEngine, renderSpy, findTemplateSpy;
var mockLog = require('dgeni/lib/mocks/log')(/* true */);

beforeEach(function() {
  findTemplateSpy = createSpy('findTemplate').and.returnValue('SOME TEMPLATE');
  renderSpy = jasmine.createSpy('render');
  mockTemplateFinder = {
    getFinder: function() { return findTemplateSpy; }
  };
  mockTemplateEngine = {
    getRenderer: function() { return renderSpy; }
  };
});

describe("render-docs", function() {

  it("should call the templateFinder for each doc", function() {
    var doc1 = {}, doc2 = {}, docs = [ doc1, doc2 ];
    var processor = renderDocsFactory(mockLog, mockTemplateFinder, mockTemplateEngine);
    processor.$process(docs);
    expect(findTemplateSpy.calls.count()).toEqual(2);
    expect(findTemplateSpy.calls.argsFor(0)).toEqual([doc1]);
    expect(findTemplateSpy.calls.argsFor(1)).toEqual([doc2]);
  });

  it("should call the templateEngine.render with the template and data", function() {
    var doc1 = { id: 1 }, doc2 = { id: 2 }, docs = [ doc1, doc2 ];
    var someProp = {}, someMethod = function() {};
    var processor = renderDocsFactory(mockLog, mockTemplateFinder, mockTemplateEngine);

    processor.extraData.someProp = someProp;
    processor.helpers.someMethod = someMethod;

    processor.$process(docs);

    expect(renderSpy.calls.count()).toEqual(2);
    expect(renderSpy.calls.argsFor(0)).toEqual(['SOME TEMPLATE',
      { doc: doc1, docs: docs, someProp: someProp, someMethod: someMethod }]);
    expect(renderSpy.calls.argsFor(1)).toEqual(['SOME TEMPLATE',
      { doc: doc2, docs: docs, someProp: someProp, someMethod: someMethod }]);
  });

  it("should place the result of calling templateEngine.render into doc.renderedContent", function() {
    var doc1 = { id: 1 }, doc2 = { id: 2 }, docs = [ doc1, doc2 ];

    renderSpy.and.returnValue('RENDERED CONTENT');

    var processor = renderDocsFactory(mockLog, mockTemplateFinder, mockTemplateEngine);

    processor.$process(docs);
    expect(doc1.renderedContent).toEqual('RENDERED CONTENT');
    expect(doc2.renderedContent).toEqual('RENDERED CONTENT');
  });

});
