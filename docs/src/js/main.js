'use strict';

angular.module('dgeniPipeline', ['ngSanitize', 'ngAnimate', 'hljs', 'constants'])

.controller('Main', function (PACKAGES, PROCESSORS) {
  var vm = this;

  vm.processorClass = processorClass;
  vm.selectProcessor = selectProcessor;
  vm.findPackage = findPackage;
  vm.setPackageFilter = setPackageFilter;
  vm.hasProcessors = hasProcessors;

  vm.packages = PACKAGES;
  vm.processors = PROCESSORS;

  ////////////

  function processorClass (p) {
    if (!p) return;

    var css = p.dgPackage;

    if (p.placeholder) {
      css += ' placeholder';
    }

    if (p.dgPackage !== 'base') {
      css += ' package';
    }

    return css;
  }

  function selectProcessor(p) {
    if (p.placeholder) {
      return;
    }

    vm.selectedProcessor = p;
  }

  function findPackage(pkgName) {
    var found = vm.packages.filter(function (p) {
      return p.name.toLowerCase() === pkgName;
    });

    return found[0];
  }

  function setPackageFilter(pkgName) {
    if (vm.filterForPackage && vm.filterForPackage === pkgName) {
      vm.filterForPackage = '';
    }
    else {
      vm.filterForPackage = pkgName;
    }

    vm.selectedProcessor = null;
  }

  function hasProcessors(pkg) {
    return vm.processors.some(function (p) {
      return p.dgPackage === pkg.name;
    });
  }
})

.filter('format', function ($timeout, $compile, $rootScope) {
  return function (text) {
    if (!text) return;
    // return text.replace(/\n/g, '<br>');

    var contents = marked(text);
    $compile(contents)($rootScope);

    return contents;
  };
})

.directive('code', function () {
  return function ($scope, $elm, $attr) {
    hljs.highlightBlock($elm[0]);
  }
})

.directive('setClassWhenAtTop', function ($window, $timeout) {
  var $win = angular.element($window); // wrap window object as jQuery object

  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      var topClass = $attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
          offsetTop = $element.offset().top; // get element's offset top relative to document

      $win.on('scroll', fixScrollPos);
      $scope.$watch($attrs.setClassWatch, classWatcherChanged);

      // Update offset-top when packages change, as that will affect this element's positioning
      $scope.$watch('vm.packages', function () {
        offsetTop = $element.offset().top - 40;
      });

      ////////////

      function fixScrollPos(e) {
        if ($win.scrollTop() >= offsetTop) {
          var width = $element.width();

          if (width.toString().charAt(0) === '0') {
            $timeout(function () {
              width = $element.width();

              if (width.toString().charAt(0) === '0') return;

              $element.css('width', width + 'px');
              $element.addClass(topClass);
            });
          }
          else {
            $element.css('width', width + 'px');
            $element.addClass(topClass);
          }
        }
        else {
          $element.css('width', '');
          $element.removeClass(topClass);
        }
      }

      function classWatcherChanged(n, o) {
        if (n !== o) {
          fixScrollPos();
        }
      }
    }
  };
});

////////////

$(document).ready(function () {
  hljs.initHighlightingOnLoad();
});
