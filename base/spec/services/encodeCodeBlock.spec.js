var encodeCodeBlockFactory = require('../../services/encodeCodeBlock');

describe("code utility", function() {
  var encodeCodeBlock;

  beforeEach(function() {
    encodeCodeBlock = encodeCodeBlockFactory();
  });

  it("should wrap the string in code and pre tags", function() {
    expect(encodeCodeBlock('abc')).toEqual('<pre><code>abc</code></pre>');
  });
  it("should HTML encode the string", function() {
    expect(encodeCodeBlock('<div>&</div>')).toEqual('<pre><code>&lt;div&gt;&amp;&lt;/div&gt;</code></pre>');
  });

  describe("inline", function() {
    it("should only wrap in a code tag", function() {
      expect(encodeCodeBlock('abc', true)).toEqual('<code>abc</code>');
    });
  });

  describe("language", function() {
    it("should add a CSS class if a language is specified", function() {
      expect(encodeCodeBlock('abc', true, 'js')).toEqual('<code class="lang-js">abc</code>');
    });
  });
});