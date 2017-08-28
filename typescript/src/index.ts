/* tslint:disable:only-arrow-functions */
import { Document, Package } from 'dgeni';
import { linkInheritedDocs } from './processors/linkInheritedDocs';
import { readTypeScriptModules } from './processors/readTypeScriptModules';
import { convertPrivateClassesToInterfaces } from './services/convertPrivateClassesToInterfaces';
import { exportSymbolsToDocsMap } from './services/exportSymbolsToDocsMap';
import { modules } from './services/modules';
import { namespacesToInclude } from './services/namespacesToInclude';
import { TsParser } from './services/TsParser';

const path = require('canonical-path');

// Define the dgeni package for generating the docs
module.exports = new Package('typescript', [require('../jsdoc')])

// Register the services and file readers
.factory(modules)
.factory(exportSymbolsToDocsMap)
.factory(namespacesToInclude)
.factory('tsParser', function(log) { return new TsParser(log); })

.factory('convertPrivateClassesToInterfaces', function() { return convertPrivateClassesToInterfaces; })

.factory('EXPORT_DOC_TYPES', function() {
  return [
    'class',
    'interface',
    'function',
    'var',
    'const',
    'let',
    'enum',
    'type-alias',
    'value-module',
  ];
})

// Register the processors
.processor(readTypeScriptModules)
.processor(linkInheritedDocs)

// Configure ids and paths
.config(function(computeIdsProcessor: any, computePathsProcessor: any, EXPORT_DOC_TYPES: string[]) {

  computeIdsProcessor.idTemplates.push({
    docTypes: ['member'],
    idTemplate: '${classDoc.id}.${name}',
    getAliases(doc: Document) {
      return doc.classDoc.aliases.map((alias: string) => alias + '.' + doc.name);
    },
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['member'],
    pathTemplate: '${classDoc.path}#${name}',
    getOutputPath() {
      // These docs are not written to their own file, instead they are part of their class doc
    },
  });

  const MODULES_DOCS_PATH = 'partials/modules';

  computePathsProcessor.pathTemplates.push({
    docTypes: ['module'],
    outputPathTemplate: MODULES_DOCS_PATH + '/${id}/index.html',
    pathTemplate: '/${id}',
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: EXPORT_DOC_TYPES,
    outputPathTemplate: MODULES_DOCS_PATH + '/${path}/index.html',
    pathTemplate: '${moduleDoc.path}/${name}',
  });
});
