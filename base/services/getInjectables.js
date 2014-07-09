/**
 * @dgService getInjectables
 * @kind function
 * @descriotion
 * Use the injector to get a collection of objects from a collection of injectable factories
 */
module.exports = function getInjectables(injector) {
	return function(factories) {
    return factories.map(function(factory) {
      var instance = injector.invoke(factory);
      instance.name = instance.name || factory.name;
      return instance;
    });
  };
};
