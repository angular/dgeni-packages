var processor = require('../../processors/defaultTagTransforms');
var Config = require('dgeni').Config;

describe("defaultTagTransforms processor", function() {
  it("should extract the transforms from the config", function() {
    var transforms = [ {} ];
    var config = new Config({
      processing: {
        defaultTagTransforms: transforms
      }
    });
    var defaultTagTransforms = processor.exports.defaultTagTransforms[1](config);
    expect(defaultTagTransforms).toBe(transforms);
  });
});