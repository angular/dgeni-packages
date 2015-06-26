try {
  angular.module('constants')
}
catch (e) {
  angular.module('constants', []);
}

angular.module('constants')
.constant('{$ doc.name $}', {$ doc.items | json $});