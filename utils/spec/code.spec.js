var code = require('../code');

describe("code utility", function() {
  it("should wrap the string in code and pre tags", function() {
    expect(code('abc')).toEqual('<pre><code>abc</code></pre>');
  });
  it("should HTML encode the string", function() {
    expect(code('<div>&</div>')).toEqual('<pre><code>&lt;div&gt;&amp;&lt;/div&gt;</code></pre>');
  });
  it("should encode HTML entities", function() {
    expect(code('<div>&#10;</div>')).toEqual('<pre><code>&lt;div&gt;&amp;#10;&lt;/div&gt;</code></pre>');
  });

  describe("inline", function() {
    it("should only wrap in a code tag", function() {
      expect(code('abc', true)).toEqual('<code>abc</code>');
    });
  });

  describe("language", function() {
    it("should add a CSS class if a language is specified", function() {
      expect(code('abc', true, 'js')).toEqual('<code class="lang-js">abc</code>');
    });
  });
});
