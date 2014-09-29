var _ = require('lodash');

module.exports = function codeDB(log) {
  var service = {
    moduleRefs: [],
    moduleDefs: {},

    addModule: function(moduleDef) {

    },

    findModule: function(name) {
      return service.moduleDefs[name];
    },

    updateModule: function(moduleRef) {
      var moduleDef = service.findModule(moduleRef.name);
      if ( !moduleDef ) {
        log.warn('module definition missing for ' + moduleRef.name);
        addModule(moduleRef);
      } else {
        if ( moduleRef.content ) {
          moduleDef.content += '\n' + moduleRef.content;
        }
      }
    }
  };
};