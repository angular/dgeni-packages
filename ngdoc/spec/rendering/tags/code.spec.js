var rewire = require('rewire');
var codeTag = rewire('../../../rendering/tags/code');
var nunjucks = require('nunjucks');

describe("code custom tag", function() {
  var codeSpy, env;

  beforeEach(function() {
    codeSpy = jasmine.createSpy('code');
    codeTag.__set__('code', codeSpy);

    env = nunjucks.configure('views');
    env.addExtension(codeTag.tags[0], codeTag);
  });

  it("should pass the content to the code utility", function() {
    env.renderString('\n{% code %}\nfunction() {}\n{% endcode %}\n');
    expect(codeSpy).toHaveBeenCalledWith('function() {}', false, undefined);
  });

  it("should pass the language if provided to the code utility", function() {
    env.renderString('\n{% code lang %}\nfunction() {}\n{% endcode %}\n', { lang: 'js' });
    expect(codeSpy).toHaveBeenCalledWith('function() {}', false, 'js');
  });
});