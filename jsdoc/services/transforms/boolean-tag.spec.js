var transformFactory = require('./boolean-tag');

describe("boolean-tag transform", function() {
  var transform;

  beforeEach(function() {
    transform = transformFactory();
  });

  it("should transform non-null and non-undefined values to `true`", function() {
    var doc = {}, tag = {};

    var value = '', newValue = transform(doc, tag, value);
    expect(newValue).toEqual(true);

    var value = 'some text', newValue = transform(doc, tag, value);
    expect(newValue).toEqual(true);

    var value = {}, newValue = transform(doc, tag, value);
    expect(newValue).toEqual(true);
  });

  it("should transform null and undefined values to `false`", function() {
    var doc = {}, tag = {};

    var value = null, newValue = transform(doc, tag, value);
    expect(newValue).toEqual(false);

    var value = undefined, newValue = transform(doc, tag, value);
    expect(newValue).toEqual(false);
  });
});
