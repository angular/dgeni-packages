'use strict';


module.exports = function resolveAngularComponentsProcessor(angularComponents, log, resolveDI, resolveIdentifierNode) {
  return {
    $runAfter: ['extractAngularAstProcessor'],
    $runBefore: ['parsing-tags'],
    $process: $process
  };

  function $process(docs) {
    docs
      .filter(doc => doc.docType === 'autoDoc')
      .filter(doc => doc.autoTags.ngdoc[0] !== 'module')
      .forEach(function(doc) {
        var definition = angularComponents.get(doc.autoDocName);
        log.debug('Resolving', doc.autoTags.name[0]);
        var value = resolveIdentifierNode(doc.callExpression.arguments[1]);
        if (!value) {
          return;
        }
        var members = definition.resolveValue(doc, value);
        if (members) {
          members.forEach(function(member) {
            log.debug('Extracted member ' + member.autoTags.name[0]);
          });
        }
        Array.prototype.push.apply(docs, members);
        resolveDI(value, doc);
      });
  }
};
