import * as ts from 'typescript';
import { Host } from '../services/ts-host/host';
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
  symbol: ts.Symbol;
  declaration: ts.Declaration;
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
  content = this.host.getContent(this.declaration);
  path: string = '';
  outputPath: string = '';

  originalModule = this.fileInfo.projectRelativePath
    .replace(new RegExp("\." + this.fileInfo.extension + "$"), "");
  typeChecker: ts.TypeChecker = this.moduleDoc.typeChecker;

  constructor(public host: Host,
              public moduleDoc: ModuleDoc,
              public symbol: ts.Symbol,
              public declaration: ts.Declaration,
              public aliasSymbol?: ts.Symbol) {
  }

  protected getTypeString(decl: ts.Declaration): string | undefined {
    if (!ts.isVariableDeclaration(decl) && !ts.isPropertyDeclaration(decl) && !ts.isParameter(decl)) {
      return undefined;
    }

    if (!decl.type && !decl.initializer) {
      return undefined;
    }

    const type = decl.type ?
      this.typeChecker.getTypeFromTypeNode(decl.type) :
      this.typeChecker.getTypeAtLocation(decl);

    return this.host.typeToString(this.typeChecker, type);
  }
}
