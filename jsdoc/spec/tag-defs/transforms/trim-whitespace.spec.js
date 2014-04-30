var transform = require('../../../tag-defs/transforms/trim-whitespace');

describe("trim-whitespace", function() {

  it("should trim newlines and whitespace from the end of the description", function() {
    expect(transform({}, {}, 'myId\n\nsome other text  \n  \n')).toEqual('myId\n\nsome other text');
  });

});
