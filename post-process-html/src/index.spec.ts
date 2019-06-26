import { Package } from 'dgeni';

describe('post-process-html package', () => {
  it('should be instance of Package', () => {
    expect(require('./') instanceof Package).toBeTruthy();
  });
});
