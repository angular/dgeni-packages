beforeEach(function() {
  jasmine.addMatchers({
    // This is a special matcher that can cope with
    toEqualMap: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var k;
          for(k in actual) {
            if ( !util.equals_(expected[k], actual[k], customEqualityTesters) ) {
              return { pass: false, message: 'expected is missing property: ' + k };
            }
          }
          for(k in expected) {
            if ( !util.equals_(expected[k], actual[k], customEqualityTesters) ) {
              return { pass: false, message: 'actual is missing property: ' + k };
            }
          }
          return { pass: true };
        }
      };
    }
  });
});