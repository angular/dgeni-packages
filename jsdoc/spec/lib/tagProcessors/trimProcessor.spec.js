var trimProcessor = require('../../../lib/tagProcessors/trimProcessor');

describe("trimProcessor", function() {
  
  it("should trim newlines from the end of the description", function() {
    var tag = { name: 'info', description: 'myId\n\nsome other text  \n  \n'};
    trimProcessor(tag);
    expect(tag.description).toEqual('myId\n\nsome other text');
  });

});

