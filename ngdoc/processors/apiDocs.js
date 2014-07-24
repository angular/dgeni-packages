var _ = require('lodash');
var path = require('canonical-path');

/**
 * @dgProcessor apiDocsProcessor
 * @description
 * Compute the various fields for docs in the API area
 */
module.exports = function apiDocsProcessor(log, partialNameMap, moduleMap, createDocMessage) {
  return {
    $runAfter: ['computeIdProcessor', 'collectPartialNamesProcessor'],
    $runBefore: ['computePathProcessor'],
    $validate: {
      apiDocsPath: { presence: true },
    },
    $process: function(docs) {
      var parts;

      var apiDocsPath = this.apiDocsPath;
      var outputPathTemplate = this.outputPathTemplate || '${area}/${module}/${docType}/${name}.html';
      var apiPathTemplate = this.apiPathTemplate || '${area}/${module}/${docType}/${name}';
      var moduleOutputPathTemplate = this.moduleOutputPathTemplate || '${area}/${name}/index.html';
      var modulePathTemplate = this.modulePathTemplate || '${area}/${name}';

      // Compute some extra fields for docs in the API area
      _.forEach(docs, function(doc) {

        if ( doc.area === 'api' && doc.docType !== 'overview' ) {

          if ( doc.docType === 'module' ) {

            doc.outputPathTemplate = path.join(apiDocsPath, _.template(moduleOutputPathTemplate, doc));
            doc.path = _.template(modulePathTemplate, doc);

            moduleMap[doc.name] = doc;

            // Create a place to store references to the module's components
            doc.components = [];

            // Compute the package name and filename for the module
            var match = /^ng(.*)/.exec(doc.name);
            if ( match ) {
              if ( !doc.packageName ) {
                var packageName = match[1].toLowerCase();
                if ( packageName ) { packageName = '-' + packageName; }
                doc.packageName = 'angular' + packageName;
              }
              doc.packageFile = doc.packageName + '.js';
            }

          } else {

            // Is this doc a member of another doc?
            if ( doc.name.indexOf('#' ) !== -1 ) {
              doc.isMember = true;
              parts = doc.id.split('#');
              doc.memberof = parts[0];
              doc.name = parts[1];
            }

            doc.outputPathTemplate = path.join(apiDocsPath, _.template(outputPathTemplate, doc));
            doc.path = _.template(apiPathTemplate, doc);
          }
        }

      });


      // Merge the memberof docs into their parent doc
      var mergeableTypes = {
        method: 'methods',
        property: 'properties',
        event: 'events'
      };

      docs = _.filter(docs, function(doc) {

        if ( doc.isMember ) {
          log.debug('child doc found', doc.id, doc.memberof);

          var containerDocs = partialNameMap.getDocs(doc.memberof);

          if ( containerDocs.length === 0 ) {
            log.warn(createDocMessage('Missing container document'+ doc.memberof, doc));
            return;
          }
          if ( containerDocs.length > 0 ) {
            // The memberof field was ambiguous, try prepending the module name too
            containerDocs = partialNameMap.getDocs(_.template('${module}.${memberof}', doc));
            if ( containerDocs.length !== 1 ) {
              log.warn(createDocMessage('Ambiguous container document reference'+ doc.memberof));
              return;
            } else {
              doc.memberof = _.template('${module}.${memberof}', doc);
            }
          }

          var containerDoc = containerDocs[0];
          var containerProperty = mergeableTypes[doc.docType];
          var container = containerDoc[containerProperty] = containerDoc[containerProperty] || [];
          container.push(doc);

        } else {
          return doc;
        }
      });

      // Map services to their providers
      _.forEach(docs, function(doc) {
        if ( doc.docType === 'provider' ) {
          var serviceId = doc.id.replace(/provider:/, 'service:').replace(/Provider$/, '');
          var serviceDocs = partialNameMap.getDocs(serviceId);

          if ( serviceDocs.length === 0 ) {
            log.warn(createDocMessage('Missing service "' + serviceId + '" for provider', doc));
          } else if ( serviceDocs.length > 1 ) {
            log.warn(createDocMessage('Ambiguous service name "' + serviceId + '" for provider\n' +
              _.reduce(doc, function(msg, doc) {
                return msg + '\n  "' + doc.id + '"';
              }, 'Matching docs: '),
              doc));
          } else {
            doc.serviceDoc = serviceDocs[0];
            serviceDocs[0].providerDoc = doc;
          }
        }
      });

      // Attach each doc to its module
      _.forEach(docs, function(doc) {
        if ( doc.docType !== 'module' && doc.module ) {
          var module = moduleMap[doc.module];
          if ( module ) {
            module.components.push(doc);
          }
          doc.moduleDoc = module;
        }
      });


      return docs;
    }
  };
};