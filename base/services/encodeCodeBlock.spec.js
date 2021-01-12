var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("code utility", () => {
  var encodeCodeBlock;

  beforeEach(() => {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    encodeCodeBlock = injector.get('encodeCodeBlock');
  });

  it("should wrap the string in code and pre tags", () => {
    expect(encodeCodeBlock('abc')).toEqual('<pre><code>abc</code></pre>');
  });

  it("should HTML encode the string", () => {
    expect(encodeCodeBlock('<div>&</div>')).toEqual('<pre><code>&lt;div&gt;&amp;&lt;/div&gt;</code></pre>');
  });

  it("should encode HTML entities", () => {
    expect(encodeCodeBlock('<div>&#10;</div>')).toEqual('<pre><code>&lt;div&gt;&amp;#10;&lt;/div&gt;</code></pre>');
  });

  describe("inline", () => {
    it("should only wrap in a code tag", () => {
      expect(encodeCodeBlock('abc', true)).toEqual('<code>abc</code>');
    });
  });

  describe("language", () => {
    it("should add a CSS class if a language is specified", () => {
      expect(encodeCodeBlock('abc', true, 'js')).toEqual('<code class="lang-js">abc</code>');
    });
  });
});