var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var partialsPath;
var options;

module.exports = {
  name: 'api-docs',
  description: 'Compute the various fields for docs in the API area',
  runAfter: ['compute-id', 'partial-names'],
  runBefore: ['compute-path'],
  init: function(config, injectables) {
    injectables.value('moduleMap', Object.create(null));
    partialsPath = config.get('rendering.contentsFolder');
    if ( !partialsPath ) {
      throw new Error('Invalid configuration. You must provide config.rendering.contentsFolder');
    }
    options = _.assign({
      outputPath: '${area}/${module}/${docType}/${name}.html',
      path: '${area}/${module}/${docType}/${name}',
      moduleOutputPath: '${area}/${name}/index.html',
      modulePath: '${area}/${name}'
    }, config.get('processing.api-docs', {}));
  },

  process: function(docs, partialNames, moduleMap) {
    var parts;

    // Compute some extra fields for docs in the API area
    _.forEach(docs, function(doc) {

      if ( doc.area === 'api' && doc.docType !== 'overview' ) {

        if ( doc.docType === 'module' ) {

          doc.outputPath = path.join(partialsPath, _.template(options.moduleOutputPath, doc));
          doc.path = _.template(options.modulePath, doc);

          moduleMap[doc.name] = doc;

          // Create a place to store references to the module's components
          doc.components = [];

          // Compute the package name and filename for the module
          var match = /^ng(.*)/.exec(doc.name);
          if ( match ) {
            var packageName = match[1].toLowerCase();
            if ( packageName ) { packageName = '-' + packageName; }
            doc.packageName = 'angular' + packageName;
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

          doc.outputPath = path.join(partialsPath, _.template(options.outputPath, doc));
          doc.path = _.template(options.path, doc);
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

        var containerDoc = partialNames.getDoc(doc.memberof);

        if ( !containerDoc ) {
          log.warn('Missing container document "'+ doc.memberof + '" referenced by "'+ doc.id + '" in file "' + doc.file + '" at line ' + doc.startingLine);
          return;
        }
        if ( _.isArray(containerDoc) ) {
          // The memberof field was ambiguous, try prepending the module name too
          containerDoc = partialNames.getDoc(_.template('${module}.${memberof}', doc));
          if ( !containerDoc || _.isArray(containerDoc) ) {
            log.warn('Ambiguous container document reference "'+ doc.memberof + '" referenced by "'+ doc.id + '" in file "' + doc.file + '" at line ' + doc.startingLine);
            return;
          } else {
            doc.memberof = _.template('${module}.${memberof}', doc);
          }
        }

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
        var serviceDoc = partialNames.getDoc(serviceId);

        if ( !serviceDoc ) {
          log.warn('Missing service "' + serviceId + '" for provider "' + doc.id + '"');
        } else if ( _.isArray(serviceDoc) ) {
          log.warn('Ambiguous service name "' + serviceId + '" for provider "' + doc.id + '"\n' +
            _.reduce(doc, function(msg, doc) {
              return msg + '\n  "' + doc.id + '"';
            }, 'Matching docs: '));
        } else {
          doc.serviceDoc = serviceDoc;
          serviceDoc.providerDoc = doc;
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
