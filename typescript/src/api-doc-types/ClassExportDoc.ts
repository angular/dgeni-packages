import { Declaration, Symbol } from 'typescript';
import { ClassLikeExportDoc } from '../api-doc-types/ClassLikeExportDoc';
import { MemberDoc } from '../api-doc-types/MemberDoc' ;
import { ModuleDoc } from '../api-doc-types/ModuleDoc';

/**
 * Classes are Class-like but also can contain static members
 * and cannot have multiple declarations
 */
export class ClassExportDoc extends ClassLikeExportDoc {
  docType: 'class';
  statics: MemberDoc[] = [];
  constructor(
    moduleDoc: ModuleDoc,
    symbol: Symbol,
    basePath: string) {
    super(moduleDoc, symbol, symbol.valueDeclaration!, basePath);
  }
}
