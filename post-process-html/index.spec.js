var package = require('./');
var Dgeni = require('dgeni');

describe('post-process-html package', () => {
  it('should be instance of Package', () => {
    expect(require('./') instanceof Dgeni.Package).toBeTruthy();
  });
});
