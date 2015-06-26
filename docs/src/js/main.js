// Code goes here

angular.module('dgeniPipeline', ['ngSanitize', 'ngAnimate'])

.controller('Main', function () {
  var vm = this;

  vm.processorClass = processorClass;
  vm.selectProcessor = selectProcessor;
  vm.findPackage = findPackage;
  vm.packages = [
    { name: 'JSDoc', abbr: 'JS' },
    { name: 'Examples', abbr: 'EX' },
    { name: 'NGDoc', abbr: 'NG' }
  ];
  vm.processors = [
    { name: 'reading-files', package: 'base', placeholder: true },
    { name: 'readFiles', package: 'base', explain: 'Read documents from files and add them to the docs collection.' },
    { name: 'files-read', package: 'base', placeholder: true },
    { name: 'extractJSDocComments', package: 'jsdoc', explain: 'This processor will create a doc for each jsdoc style comment in each jsFile doc in the docs collection.\n\nIt will optionaly remove those jsFile docs from the collection by setting the\n`removeJsFileDocs` property.\n\nThe doc will initially have the form:\n```\n{\n  fileInfo: { ... },\n  content: \'the content of the comment\',\n  startingLine: xxx,\n  endingLine: xxx,\n  codeNode: someASTNode\n  codeAncestors: arrayOfASTNodes\n}\n```' },
    { name: 'parseExamples', package: 'examples', explain: 'Search the documentation for examples that need to be extracted' },
    { name: 'parsing-tags', package: 'jsdoc', placeholder: true, explain: 'Parse the doc for jsdoc style tags' },
    { name: 'parseTags', package: 'jsdoc', explain: 'Parse the doc for jsdoc style tags' },
    { name: 'tags-parsed', package: 'jsdoc', placeholder: true },
    { name: 'filterNgDocs', package: 'ngdoc', explain: 'Remove docs that do not contain the ngdoc tag' },
    { name: 'extracting-tags', package: 'jsdoc', placeholder: true },
    { name: 'extractTags', package: 'jsdoc', explain: 'Extract the information from the tags that were parsed' },
    { name: 'tags-extracted', package: 'jsdoc', placeholder: true },
    { name: 'codeName', package: 'jsdoc', explain: ' Infer the name of the document from name of the following code' },
    { name: 'processing-docs', package: 'base', placeholder: true },
    { name: 'docs-processed', package: 'base', placeholder: true },
    { name: 'adding-extra-docs', package: 'base', placeholder: true },
    { name: 'generateExamples', package: 'examples', explain: 'Create doc objects of the various things that need to be rendered for an example.\n\nThis includes the files that will be run in an iframe, the code that will be injected into the HTML pages and the protractor test files.' },
    { name: 'generateProtractorTests', package: 'examples' },
    { name: 'extra-docs-added', package: 'base', placeholder: true },
    { name: 'computing-ids', package: 'base' },
    { name: 'computeIds', package: 'base' },
    { name: 'ids-computed', package: 'base', placeholder: true },
    { name: 'memberDocs', package: 'ngdoc' },
    { name: 'moduleDocs', package: 'ngdoc' },
    { name: 'generateComponentGroups', package: 'ngdoc' },
    { name: 'providerDocs', package: 'ngdoc' },
    { name: 'computing-paths', package: 'base', placeholder: true },
    { name: 'computePaths', package: 'base' },
    { name: 'paths-computed', package: 'base', placeholder: true },
    { name: 'rendering-docs', package: 'base', placeholder: true },
    { name: 'renderDocs', package: 'base' },
    { name: 'docs-rendered', package: 'base', placeholder: true },
    { name: 'unescapeComments', package: 'base' },
    { name: 'debugDump', package: 'base' },
    { name: 'inlineTag', package: 'jsdoc' },
    { name: 'writing-files', package: 'base', placeholder: true },
    { name: 'writeFiles', package: 'base' },
    { name: 'checkAnchorLinks', package: 'base' },
    { name: 'files-written', package: 'base', placeholder: true }
  ];

  ////////////

  function processorClass (p) {
    if (!p) return;

    var css = p['package'];

    if (p.placeholder) {
      css += ' placeholder';
    }

    if (p.package !== 'base') {
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
})

.filter('format', function () {
  return function (text) {
    if (!text) return;
    return text.replace(/\n/g, '<br>');
  };
})

.directive('setClassWhenAtTop', function ($window, $timeout) {
  var $win = angular.element($window); // wrap window object as jQuery object

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
          offsetTop = element.offset().top; // get element's offset top relative to document

      $win.on('scroll', function (e) {
        if ($win.scrollTop() >= offsetTop) {
          var width = element.width();

          if (width.toString().charAt(0) === '0') {
            console.log('timeout called! 1');
            $timeout(function () {
              width = element.width();

              if (width.toString().charAt(0) === '0') return;

              element.css('width', width + 'px');
              element.addClass(topClass);

              console.log('timeout calle init!');
            });
          }
          else {
            console.log('timeout called! 2');
            element.css('width', width + 'px');
            element.addClass(topClass);
          }
        } else {
          console.log('timeout called! 3');
          element.css('width', '');
          element.removeClass(topClass);
        }
      });
    }
  };
});
