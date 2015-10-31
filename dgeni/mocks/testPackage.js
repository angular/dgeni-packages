var Package = require('dgeni').Package;

var somePackage = new Package('somePackage');

/**
 * @dgPackage testPackage
 */
module.exports = new Package('testPackage', [require('./testPackage2'), somePackage])
.processor(require('./testProcessor'))
.processor({ name: 'pseudo', $runAfter: ['testProcessor'] });