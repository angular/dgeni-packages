var rewire = require('rewire');
var filter = rewire('../../../rendering/filters/code');

describe("code custom filter", function() {

  it("should have the name 'code'", function() {
    expect(filter.name).toEqual('code');
  });


  it("should call the code utility", function() {
    var codeSpy = jasmine.createSpy('code');
    filter.__set__('code', codeSpy);

    filter.process('function foo() { }');

    expect(codeSpy).toHaveBeenCalledWith('function foo() { }', true, undefined);
  });


  it("should pass the language to the code utility", function() {
    var codeSpy = jasmine.createSpy('code');
    filter.__set__('code', codeSpy);

    filter.process('function foo() { }', 'js');

    expect(codeSpy).toHaveBeenCalledWith('function foo() { }', true, 'js');
  });
});