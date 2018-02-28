/* tslint:disable:only-arrow-functions */
import { Document, Package } from 'dgeni';
import { linkInheritedDocs } from './processors/linkInheritedDocs';
import { mergeParameterInfo } from './processors/mergeParameterInfo';
import { readTypeScriptModules } from './processors/readTypeScriptModules';
import { convertPrivateClassesToInterfaces } from './services/convertPrivateClassesToInterfaces';
import { exportSymbolsToDocsMap } from './services/exportSymbolsToDocsMap';
import { modules } from './services/modules';
import { TsParser } from './services/TsParser';

// Define the dgeni package for generating the docs
module.exports = new Package('typescript', [require('../jsdoc')])

// Register the services and file readers
.factory(modules)
.factory(exportSymbolsToDocsMap)
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
.processor(mergeParameterInfo)

// Configure ids and paths
.config(function(computeIdsProcessor: any, computePathsProcessor: any, EXPORT_DOC_TYPES: string[]) {

  computeIdsProcessor.idTemplates.push({
    docTypes: ['member'],
    idTemplate: '${containerDoc.id}.${name}',
    getAliases(doc: Document) {
      return doc.containerDoc.aliases.map((alias: string) => alias + '.' + doc.name);
    },
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['member'],
    pathTemplate: '${containerDoc.path}#${name}',
    getOutputPath() {
      // These docs are not written to their own file, instead they are part of their class doc
    },
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['parameter'],
    pathTemplate: '${container.path}#${name}',
    getOutputPath() {
      // These docs are not written to their own file, instead they are part of their callable doc
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
