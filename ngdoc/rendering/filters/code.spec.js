const codeFilterFactory = require('./code');

describe("code custom filter", () => {

  let codeFilter, codeSpy;

  beforeEach(() => {
    codeSpy = jasmine.createSpy('code').and.callFake(value => '<code>' + value + '</code>');
    codeFilter = codeFilterFactory(codeSpy);
  });

  it("should have the name 'code'", () => {
    expect(codeFilter.name).toEqual('code');
  });


  it("should call the code utility", () => {
    codeFilter.process('function foo() { }');
    expect(codeSpy).toHaveBeenCalledWith('function foo() { }', true, undefined);
  });


  it("should pass the language to the code utility", () => {
    codeFilter.process('function foo() { }', 'js');
    expect(codeSpy).toHaveBeenCalledWith('function foo() { }', true, 'js');
  });
});