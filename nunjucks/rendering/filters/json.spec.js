var filter = require('./json');

describe("json filter", () => {
  it("should have the name 'json'", () => {
    expect(filter.name).toEqual('json');
  });
  it("should return the value stringified into JSON", () => {
    expect(filter.process({ prop1: 'val1', prop2: [1,2,3] }))
        .toEqual('{\n'+
                 '  "prop1": "val1",\n'+
                 '  "prop2": [\n' +
                 '    1,\n'+
                 '    2,\n'+
                 '    3\n'+
                 '  ]\n'+
                 '}');
  });
});

