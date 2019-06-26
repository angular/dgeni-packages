import { Package } from 'dgeni';
import { postProcessHtml } from './processors/postProcessHtml';

/**
 * @dgPackage post-process-package
 */
module.exports = new Package('post-process-package', [require('../base')])
  .processor(postProcessHtml);
