const transformFactory = require('./trim-whitespace');

describe("trim-whitespace", () => {

  let transform;

  beforeEach(() => {
    transform = transformFactory();
  });

  it("should trim newlines and whitespace from the end of the description", () => {
    expect(transform({}, {}, 'myId\n\nsome other text  \n  \n')).toEqual('myId\n\nsome other text');
  });

  it("should not do anything if the value is not a string", () => {
    const someNonStringObject = {};
    expect(transform({}, {}, someNonStringObject)).toEqual(someNonStringObject);
  });

});
