const htmlBlockParserAdapterFactory = require('./html-block-parser-adapter');
const TagCollection = require('../../lib/TagCollection');

describe('htmlBlockParserAdapter', function() {
  it("should ignore @tags inside inline HTML blocks", function() {
    const adapter = htmlBlockParserAdapterFactory();
    const lines = [
      '@a some text',
      '',
      '<div class="x">',
      '<div>some content</div>',
      '<div>',
      '    @b not a tag',
      '</div>',
      '@c still not a tag',
      '',
      '</div> // closing tag',
      '',
      '@b is a tag'
    ];
    adapter.init && adapter.init(lines, new TagCollection());

    adapter.nextLine(lines[0], 0);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[1], 1);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[2], 2);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[3], 3);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[4], 4);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[5], 5);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[6], 6);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[7], 7);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[8], 8);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[9], 9);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[10], 10);
    expect(adapter.parseForTags()).toBeTruthy();
  });


  it("should cope with single line HTML blocks", function() {
    const adapter = htmlBlockParserAdapterFactory();
    const lines = [
      '@a some text',
      '',
      '<div>some single line of code @b not a tag</div>',
      '',
      'some text outside the HTML block',
    ];

    adapter.init(lines, new TagCollection());

    adapter.nextLine(lines[0], 0);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[1], 1);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[2], 2);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[3], 3);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[4], 4);
    expect(adapter.parseForTags()).toBeTruthy();
  });
});
