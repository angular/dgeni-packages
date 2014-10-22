module.exports = function moduleRegistrationTypes() {
  return [
    { name: 'controller', requiresName: true, hasFactory: true, group: 'controller', title: 'Controllers', plural: 'controllers', docType: 'ngController' },
    { name: 'filter', requiresName: true, hasFactory: true, group: 'filter', title: 'Filters', plural: 'filters', docType: 'ngFilter' },
    { name: 'directive', requiresName: true, hasFactory: true, group: 'directive', title: 'Directives', plural: 'directives', docType: 'ngDirective' },
    { name: 'provider', requiresName: true, hasFactory: true, group: 'provider', title: 'Providers', plural: 'providers', docType: 'ngProvider' },
    { name: 'factory', requiresName: true, hasFactory: true, group: 'service', title: 'Services', plural: 'services', docType: 'ngService' },
    { name: 'value', requiresName: true, hasFactory: false, group: 'service', title: 'Services', plural: 'services', docType: 'ngService' },
    { name: 'service', requiresName: true, hasFactory: true, group: 'service', title: 'Services', plural: 'services', docType: 'ngService' },
    { name: 'constant', requiresName: true, hasFactory: false, group: 'constant', title: 'Constants', plural: 'constants', docType: 'ngConstant' }
    // { name: 'config', requiresName: false, hasFactory: true, group: 'config-block', title: 'Config Blocks', plural: 'config-blocks', docType: 'ngConfig' },
    // { name: 'run', requiresName: false, hasFactory: true, group: 'run-block', title: 'Run Blocks', plural: 'run-blocks', docType: 'ngRun' }
  ];
};