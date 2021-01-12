const Package = require('dgeni').Package;

const somePackage = new Package('somePackage');

/**
 * @dgPackage testPackage
 */
module.exports = new Package('testPackage', [require('./testPackage2'), somePackage])
.processor(require('./testProcessor'))
.processor({ name: 'pseudo', $runAfter: ['testProcessor'] });