import { DocCollection, Document, Processor } from 'dgeni';
import { Symbol } from 'typescript';
import { ClassLikeExportDoc, HeritageInfo } from '../api-doc-types/ClassLikeExportDoc';

export function linkInheritedDocs(exportSymbolsToDocsMap: Map<Symbol, ClassLikeExportDoc>, createDocMessage: any, log: any) {
  return new LinkInheritedDocs(exportSymbolsToDocsMap, createDocMessage, log);
}

export class LinkInheritedDocs implements Processor {
    $runAfter = ['readTypeScriptModules'];
    $runBefore = ['parsing-tags'];

    constructor(private exportSymbolsToDocsMap: Map<Symbol, ClassLikeExportDoc>, private createDocMessage: any, private log: any) { }

    $process(docs: DocCollection) {
      docs.forEach((doc: Document) => {
        if (doc instanceof ClassLikeExportDoc) {
          this.log.debug(`- processing typecript doc ${doc.id} for ancestors`);

          doc.extendsClauses.forEach(clause => this.updateHeritageInfo(doc, clause));
          this.log.debug('  - found "extends" ancestors: ' + doc.extendsClauses.map(clause => clause.doc && clause.doc.id).join(', '));
          this.reportErrors(doc, doc.extendsClauses);

          doc.implementsClauses.forEach(clause => this.updateHeritageInfo(doc, clause));
          this.log.debug('  - found "implements" ancestors: ' + doc.implementsClauses.map(clause => clause.doc && clause.doc.id).join(', '));
          this.reportErrors(doc, doc.implementsClauses);
        }
      });
    }

    private updateHeritageInfo(doc: ClassLikeExportDoc, clause: HeritageInfo) {
      clause.symbol = doc.typeChecker.getTypeFromTypeNode(clause.type).getSymbol();
      clause.doc = clause.symbol && this.exportSymbolsToDocsMap.get(clause.symbol);
      if (clause.doc) clause.doc.descendants.push(doc);
    }

    private reportErrors(doc: ClassLikeExportDoc, clauses: HeritageInfo[]) {
      const missingSymbols: string[] = [];
      const missingDocs: string[] = [];
      clauses.forEach(clause => {
        if (!clause.doc) {
          (clause.symbol ? missingDocs : missingSymbols).push(clause.text);
        }
      });

      if (missingSymbols.length) {
        this.log.warn(this.createDocMessage(`Unresolved TypeScript symbol(s): ${missingSymbols.join(', ')}`, doc));
      }
      if (missingDocs.length) {
        this.createDocMessage(`Missing API doc for the following symbol(s): ${missingDocs.join(', ')}, (missing public export?)`, doc);
      }
    }
  }
