var getTypeClassFactory = require('./getTypeClass');

describe("getTypeClass", () => {
  it("should convert the type name to a css string", () => {
    var getTypeClass = getTypeClassFactory();
    expect(getTypeClass('string')).toEqual('label type-hint type-hint-string');
    expect(getTypeClass('Object')).toEqual('label type-hint type-hint-object');
    expect(getTypeClass('')).toEqual('label type-hint type-hint-object');
    expect(getTypeClass('function() {}')).toEqual('label type-hint type-hint-function');
    expect(getTypeClass('array.<string>')).toEqual('label type-hint type-hint-array');
  });
});