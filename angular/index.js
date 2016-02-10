'use strict';

var dgeni = require('dgeni');


module.exports = new dgeni.Package('angular', [
  require('dgeni-packages/ngdoc')
])

.processor(require('./processors/extract-angular-ast'))
.processor(require('./processors/generate-angular-tags'))
.processor(require('./processors/resolve-angular-components'))

.factory(require('./services/angular-components'))
.factory(require('./services/escope-map'))
.factory(require('./services/resolve-class-like'))
.factory(require('./services/resolve-di'))
.factory(require('./services/resolve-identifier-node'))
.factory(require('./services/resolve-object'))
.factory(require('./services/resolve-return-object'))

.config(function(angularComponents, resolveClassLike, resolveObject, resolveReturnObject) {
  angularComponents.add('animation', {
    resolveValue: resolveObject
  });
  angularComponents.add('component', {
    ngdoc: 'directive',
    resolveValue: resolveObject
  });
  angularComponents.add('config', {
    skip: true
  });
  angularComponents.add('constant', {
    resolveValue: resolveObject
  });
  angularComponents.add('controller', {
    resolveValue: resolveClassLike
  });
  angularComponents.add('decorator', {});
  angularComponents.add('directive', {
    resolveValue: resolveReturnObject
  });
  angularComponents.add('factory', {
    ngdoc: 'service',
    resolveValue: resolveReturnObject
  });
  angularComponents.add('filter', {
    resolveValue: resolveReturnObject
  });
  angularComponents.add('provider', {
    resolveValue: resolveClassLike
  });
  angularComponents.add('run', {
    skip: true
  });
  angularComponents.add('service', {
    resolveValue: resolveClassLike
  });
  angularComponents.add('value', {
    ngdoc: 'service',
    resolveValue: resolveObject
  });
});
