const path = require('canonical-path');
import { DocCollection, Processor } from 'dgeni';
import { getCombinedModifierFlags, getLineAndCharacterOfPosition, ModifierFlags, Node, SourceFile, Symbol, SymbolFlags, TypeChecker } from 'typescript';

import { getContent, getExportDocType, ModuleSymbols, TsParser } from '../../services/TsParser';
import { Location } from '../../services/TsParser/Location';

import { ApiDoc } from '../../api-doc-types/ApiDoc';
import { ClassExportDoc } from '../../api-doc-types/ClassExportDoc';
import { ClassLikeExportDoc } from '../../api-doc-types/ClassLikeExportDoc';
import { ConstExportDoc } from '../../api-doc-types/ConstExportDoc';
import { EnumExportDoc } from '../../api-doc-types/EnumExportDoc';
import { ExportDoc } from '../../api-doc-types/ExportDoc';
import { FunctionExportDoc } from '../../api-doc-types/FunctionExportDoc';
import { InterfaceExportDoc } from '../../api-doc-types/InterfaceExportDoc';
import { MemberDoc } from '../../api-doc-types/MemberDoc';
import { MethodMemberDoc } from '../../api-doc-types/MethodMemberDoc';
import { ModuleDoc } from '../../api-doc-types/ModuleDoc';
import { TypeAliasExportDoc } from '../../api-doc-types/TypeAliasExportDoc';

import { expandSourceFiles, SourcePattern } from './SourcePattern';

export function readTypeScriptModules(tsParser: TsParser, modules: any, namespacesToInclude: string[], createDocMessage: any, log: any) {
  return new ReadTypeScriptModules(tsParser, modules, namespacesToInclude, createDocMessage, log);
}

export class ReadTypeScriptModules implements Processor {
    $runAfter = ['files-read'];
    $runBefore = ['parsing-tags'];

    $validate = {
      basePath: {presence: true},
      hidePrivateMembers: {inclusion: [true, false]},
      ignoreExportsMatching: {},
      sortClassMembers: {inclusion: [true, false]},
      sourceFiles: {presence: true},
    };

    // A collection of globs that identify those modules for which we should create docs
    sourceFiles: Array<SourcePattern|string> = [];
    // The base path from which to load the source files
    basePath = '.';
    // We can ignore members of classes that are private
    hidePrivateMembers = true;
    // We leave class members sorted in order of declaration
    sortClassMembers = false;
    // We can provide a collection of strings or regexes to ignore exports whose export names match
    ignoreExportsMatching: Array<string|RegExp> = ['___esModule'];
    ignoreExportsRegexes: RegExp[];

    constructor(
      private tsParser: TsParser,
      private modules: any,
      private namespacesToInclude: string[],
      private createDocMessage: any,
      private log: any) {}

    $process(docs: DocCollection) {
      // Convert ignoreExportsMatching to an array of regexes
      this.ignoreExportsRegexes = convertToRegexCollection(this.ignoreExportsMatching);
      // Extract the modules from source files via the TypeScript parser
      const basePath = path.resolve(this.basePath);
      const filesPaths = expandSourceFiles(this.sourceFiles, basePath);
      const parseInfo = this.tsParser.parse(filesPaths, this.basePath);
      this.addModuleDocs(docs, parseInfo.moduleSymbols, basePath);
    }

    private addModuleDocs(docs: DocCollection, moduleSymbols: ModuleSymbols, basePath: string) {

      // Iterate through each of the modules to generate module docs, export docs and member docs.
      moduleSymbols.forEach(moduleSymbol => {
        // Create a doc for this module and add it to the module lookup collection and the docs collection
        const moduleDoc = new ModuleDoc(moduleSymbol, basePath);
        this.modules[moduleDoc.id] = moduleDoc;
        docs.push(moduleDoc);
        this.addExportDocs(docs, moduleDoc);
      });
    }

    private addExportDocs(docs: DocCollection, moduleDoc: ModuleDoc) {
      // Iterate through this module's exports and generate a doc for each
      moduleDoc.symbol.exportArray.forEach(exportSymbol => {

        // Ignore exports that match the configured regular expressions
        if (anyMatches(this.ignoreExportsRegexes, exportSymbol.name)) return;

        // If the symbol is an alias (e.g. re-exported from another module) then get the original resolved symbol
        const resolvedExport = exportSymbol.resolvedSymbol || exportSymbol;

        // If the resolved symbol contains no declarations then it is invalid (perhaps an abstract class?)
        // For the moment we are just going to ignore such exports (:scream:)
        // TODO: find a way of generating docs for them
        if (!resolvedExport.declarations) {
          this.log.info(`Export has no declarations: ${resolvedExport.name}`);
          return;
        }

        switch (getExportDocType(resolvedExport)) {
          case 'class':
            const classDoc = new ClassExportDoc(moduleDoc, resolvedExport, this.basePath, this.hidePrivateMembers, this.namespacesToInclude);
            this.addMemberDocs(docs, classDoc.members);
            this.addMemberDocs(docs, classDoc.statics);
            if (classDoc.constructorDoc) this.addMemberDocs(docs, [classDoc.constructorDoc]);
            this.addExportDoc(docs, moduleDoc, classDoc);
            break;
          case 'interface':
            const interfaceDoc = new InterfaceExportDoc(moduleDoc, resolvedExport, this.basePath, this.namespacesToInclude);
            this.addMemberDocs(docs, interfaceDoc.members);
            this.addExportDoc(docs, moduleDoc, interfaceDoc);
            break;
          case 'enum':
            const enumDoc = new EnumExportDoc(moduleDoc, resolvedExport, this.basePath, this.namespacesToInclude);
            enumDoc.members.forEach(doc => docs.push(doc));
            this.addExportDoc(docs, moduleDoc, enumDoc);
            break;
          case 'const':
          case 'let':
          case 'var':
            this.addExportDoc(docs, moduleDoc, new ConstExportDoc(moduleDoc, resolvedExport, this.basePath, this.namespacesToInclude));
            break;
          case 'type-alias':
            this.addExportDoc(docs, moduleDoc, new TypeAliasExportDoc(moduleDoc, resolvedExport, this.basePath, this.namespacesToInclude));
            break;
          case 'function':
            const functionDoc = new FunctionExportDoc(moduleDoc, resolvedExport, this.basePath, this.namespacesToInclude);
            this.addExportDoc(docs, moduleDoc, functionDoc);
            functionDoc.overloads.forEach(doc => docs.push(doc));
            break;
          default:
            this.log.error(`Don't know how to create export document for ${resolvedExport.name}`);
            break;
        }
      });
    }

    private addExportDoc(docs: DocCollection, moduleDoc: ModuleDoc, exportDoc: ExportDoc) {
      this.log.debug('>>>> EXPORT: ' + exportDoc.name + ' (' + exportDoc.docType + ') from ' + moduleDoc.id);
      moduleDoc.exports.push(exportDoc);
      docs.push(exportDoc);
    }

    private addMemberDocs(docs: DocCollection, members: MemberDoc[]) {
      members.forEach(member => {
        docs.push(member);
        if (member instanceof MethodMemberDoc) member.overloads.forEach(overloadDoc => docs.push(overloadDoc));
      });
    }
  }

function convertToRegexCollection(items: Array<string|RegExp>|string|RegExp): RegExp[] {
  if (!items) return [];
  // Must be an array
  if (!Array.isArray(items)) items = [items];
  // Convert string to exact matching regexes
  return items.map(item => item instanceof RegExp ? item : new RegExp('^' + item + '$'));
}

function anyMatches(regexes: RegExp[], item: string) {
  for (const regex of regexes) {
    if (item.match(regex)) {
      return true;
    }
  }
  return false;
}
