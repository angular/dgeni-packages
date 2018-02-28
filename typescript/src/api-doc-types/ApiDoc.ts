import { Declaration, Symbol, TypeChecker } from 'typescript';
import { FileInfo } from '../services/TsParser/FileInfo';
import { getContent } from '../services/TsParser/getContent';
import { ModuleDoc } from './ModuleDoc';

export interface ApiDoc {
  docType: string;
  name: string;
  id: string;
  aliases: string[];
  path: string;
  outputPath: string;
  content: string;
  symbol: Symbol;
  declaration: Declaration;
  fileInfo: FileInfo;
  startingLine: number;
  endingLine: number;
}

export abstract class BaseApiDoc implements ApiDoc {

  // Concrete implementations will provide the docType string
  abstract docType: string;

  name = this.aliasSymbol ? this.aliasSymbol.name : this.symbol.name;
  aliases = [this.name, this.moduleDoc.id + "/" + this.name];
  id = this.moduleDoc.id + "/" + this.name;
  basePath = this.moduleDoc.basePath;
  fileInfo = new FileInfo(this.declaration, this.basePath);
  startingLine = this.fileInfo.location.start.line +
    (this.fileInfo.location.start.character ? 1 : 0);
  endingLine = this.fileInfo.location.end.line;
  content = getContent(this.declaration);
  path: string = '';
  outputPath: string = '';

  originalModule = this.fileInfo.projectRelativePath
    .replace(new RegExp("\." + this.fileInfo.extension + "$"), "");
  typeChecker: TypeChecker = this.moduleDoc.typeChecker;

  constructor(public moduleDoc: ModuleDoc,
              public symbol: Symbol,
              public declaration: Declaration,
              public aliasSymbol?: Symbol) {}
}
