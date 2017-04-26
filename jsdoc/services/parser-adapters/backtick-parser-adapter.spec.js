const backTickParserAdapterFactory = require('./backtick-parser-adapter');
const TagCollection = require('../../lib/TagCollection');

describe('backTickParserAdapter', function() {
  it("should ignore @tags inside back-ticked code blocks", function() {
    const adapter = backTickParserAdapterFactory();
    const lines = [
      '@a some text',
      '',
      '',
      '```',
      '  some code',
      '  @b not a tag',
      '```',
      '',
      'more text',
      '@b is a tag'
    ];
    adapter.init && adapter.init(lines, new TagCollection());

    adapter.nextLine(lines[0], 0);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[1], 1);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[2], 2);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[3], 3);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[4], 4);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[5], 5);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[6], 6);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[7], 7);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[8], 8);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[9], 9);
    expect(adapter.parseForTags()).toBeTruthy();
  });


  it("should cope with single line back-ticked code blocks", function() {
    const adapter = backTickParserAdapterFactory();
    const lines = [
      '@a some text',
      '',
      '```some single line of code @b not a tag```',
      '',
      'some text outside a code block',
      '```',
      '  some code',
      '  @b not a tag',
      '```'
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
    adapter.nextLine(lines[5], 5);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[6], 6);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[7], 7);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[8], 8);
    expect(adapter.parseForTags()).toBeTruthy();
  });

  it('should reset on each run', () => {
    const adapter = backTickParserAdapterFactory();
    const lines = [
      '@a some text',
      '```',
      'missing end tick'
    ];

    adapter.init && adapter.init(lines, new TagCollection());
    adapter.nextLine(lines[0], 0);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[1], 1);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[2], 2);
    expect(adapter.parseForTags()).toBeFalsy();

    adapter.init && adapter.init(lines, new TagCollection());
    adapter.nextLine(lines[0], 0);
    expect(adapter.parseForTags()).toBeTruthy();
    adapter.nextLine(lines[1], 1);
    expect(adapter.parseForTags()).toBeFalsy();
    adapter.nextLine(lines[2], 2);
    expect(adapter.parseForTags()).toBeFalsy();
  });
});
