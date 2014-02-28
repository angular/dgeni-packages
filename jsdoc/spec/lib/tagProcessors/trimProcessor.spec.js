var trimProcessor = require('../../../lib/tagProcessors/trimProcessor');

describe("trimProcessor", function() {
  
  it("should trim newlines from the end of the description", function() {
    var tags = [{ name: 'info', description: 'myId\n\nsome other text  \n  \n'}];
    trimProcessor({tags: tags});
    expect(tags[0].description).toEqual('myId\n\nsome other text');
  });

});

