'use strict';

var _ = require('lodash');
var escope = require('escope');
var estraverse = require('estraverse');

var util = require('../util');


module.exports = function extractAngularAstProcessor(angularComponents, escopeMap, log) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['extractJSDocCommentsProcessor'],
    $process: $process
  };

  function $process(docs) {
    var autoDocs = _.flatten(
      docs
        .filter(doc => doc.docType === 'jsFile')
        .map(processAst));
    log.info(`Extracted ${autoDocs.length} AngularJS components`);
    Array.prototype.push.apply(docs, autoDocs);
  }

  function processAst(jsFileDoc) {
    var fileInfo = jsFileDoc.fileInfo;
    var ast = fileInfo.ast;
    var result = [];
    var scopeManager = escope.analyze(ast);
    var currentScope = scopeManager.acquire(ast);
    estraverse.traverse(ast, {
      enter: function(node) {
        if (/Function/.test(node.type)) {
          currentScope = scopeManager.acquire(node);
        }

        escopeMap.set(node, currentScope);

        if (node.type === 'ExpressionStatement') {
          Array.prototype.push.apply(result, processAngularChain(node));
        }
      },
      leave: function(node) {
        if (/Function/.test(node.type)) {
          currentScope = currentScope.upper;
        }
      }
    });
    // console.dir(result, {depth: 1, colors: true});
    log.debug(`Extracted ${result.length} AngularJS components from ${fileInfo.relativePath}`);
    result.forEach(function(doc) {
      doc.fileInfo = fileInfo;
    });
    return result;
  }

  function isAngularModuleCall(node) {
    if (node.type !== 'CallExpression') {
      return false;
    }
    if (node.callee.type !== 'MemberExpression') {
      return false;
    }
    if (node.callee.object.type !== 'Identifier') {
      return false;
    }
    if (node.callee.object.name !== 'angular') {
      return false;
    }
    if (node.callee.property.name !== 'module') {
      return false;
    }
    return true;
  }

  function processAngularChain(node) {
    var moduleDoc;
    var result = [];
    var current = node.expression;
    while (current.type === 'CallExpression') {
      if (current.callee.type !== 'MemberExpression') {
        break;
      }
      if (isAngularModuleCall(current)) {
        moduleDoc = {
          callExpression: current,
          docType: 'autoDoc',
          autoTags: {
            ngdoc: ['module'],
            name: [current.arguments[0].value]
          },
          content: util.getMatchingJSDoc(node.leadingComments)
        };
        break;
      }
      var definition = angularComponents.get(current.callee.property.name);
      if (definition) {
        if (definition.skip) {
          current = current.callee.object;
          continue;
        }
        if (current.arguments.length < definition.argumentCount) {
          log.error(`Invalid AngularJS ${definition.name} definition. Too few arguments.`);
        }
        var doc = {
          callExpression: current,
          docType: 'autoDoc',
          autoDocDefinition: definition,
          autoDocName: current.callee.property.name,
          autoTags: {
            ngdoc: [definition.ngdoc],
            name: [current.arguments[0].value]
          },
          content: util.getMatchingJSDoc(current.callee.property.leadingComments)
        };
        result.push(doc);
      } else {
        result.length = 0;
      }
      current = current.callee.object;
    }
    if (!moduleDoc) {
      return [];
    }
    result.forEach(function(doc) {
      doc.autoTags.module = [moduleDoc.autoTags.name[0]];
    });
    if (moduleDoc.callExpression.arguments.length > 1) {
      if (moduleDoc.callExpression.arguments[1].type === 'ArrayExpression') {
        moduleDoc.autoTags.requires = moduleDoc.callExpression.arguments[1].elements
          .filter(element => element.type === 'Literal')
          .map(element => element.value);
      }
      result.push(moduleDoc);
      log.debug('Extracted module ' + moduleDoc.autoTags.name[0]);
    }
    return result;
  }
};
