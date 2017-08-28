import { Declaration, Symbol, TypeChecker } from 'typescript';
import { FileInfo } from '../services/TsParser/FileInfo';
import { getContent } from '../services/TsParser/getContent';
import { ApiDoc } from './ApiDoc';
import { ModuleDoc } from './ModuleDoc';

/**
 * An export document is an abstraction somewhere between a TypeScript symbol and a declaration depending upon the underlying type.
 * Exported functions can be overloaded and so have one doc per declaration
 * Exported interfaces can have multiple declarations, they would be merged together
 */
export abstract class ExportDoc implements ApiDoc {

  // Concrete implementations will provide the docType string
  abstract docType: string;

  name = this.symbol.name;
  aliases = [this.name, this.moduleDoc.id + "/" + this.name];
  id = this.moduleDoc.id + "/" + this.name;
  fileInfo = new FileInfo(this.declaration, this.basePath);
  startingLine = this.fileInfo.location.start.line + (this.fileInfo.location.start.character ? 1 : 0);
  endingLine = this.fileInfo.location.end.line;
  originalModule = this.fileInfo.projectRelativePath.replace(new RegExp("\." + this.fileInfo.extension + "$"), "");
  content = getContent(this.declaration);
  path: string;
  outputPath: string;

  constructor(
      public moduleDoc: ModuleDoc,
      public symbol: Symbol,
      public declaration: Declaration,
      public basePath: string,
      public typeChecker: TypeChecker,
      public namespacesToInclude: string[]) {
      }
}
