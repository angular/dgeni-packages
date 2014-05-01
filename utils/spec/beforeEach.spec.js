var _ = require('lodash');

beforeEach(function() {

  jasmine.addCustomEqualityTester(
    function(first, second) {
      if ( (first && first.constructor === undefined) || (second && second.constructor === undefined) ) {
        var k;
        for(k in second) {
          if ( !_.isEqual(first[k], second[k]) ) {
            return false;
          }
        }
        for(k in first) {
          if ( !_.isEqual(first[k], second[k]) ) {
            return false;
          }
        }
        return true;
      }
      return undefined;
    }
  );
});