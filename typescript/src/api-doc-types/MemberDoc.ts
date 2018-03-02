/* tslint:disable:no-bitwise */
import { Declaration, Symbol, SymbolFlags, SyntaxKind, TypeChecker } from 'typescript';
import { FileInfo } from '../services/TsParser/FileInfo';
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { getContent } from "../services/TsParser/getContent";
import { getDeclarationTypeText } from "../services/TsParser/getDeclarationTypeText";
import { getDecorators, ParsedDecorator } from "../services/TsParser/getDecorators";
import { ApiDoc } from './ApiDoc';
import { ContainerExportDoc } from './ContainerExportDoc';
import { ModuleDoc } from './ModuleDoc';

/**
 * This document represents a member of a ClassLikeExportDoc.
 */
export abstract class MemberDoc implements ApiDoc {
  docType = 'member';

  abstract name: string;
  abstract id: string;
  abstract aliases: string[];
  abstract anchor: string;

  path: string = '';
  outputPath: string = '';
  content = getContent(this.declaration);
  basePath = this.containerDoc.basePath;
  fileInfo = new FileInfo(this.declaration, this.basePath);
  startingLine = this.fileInfo.location.start.line + (this.fileInfo.location.start.character ? 1 : 0);
  endingLine = this.fileInfo.location.end.line;
  typeChecker: TypeChecker = this.containerDoc.typeChecker;
  moduleDoc: ModuleDoc = this.containerDoc.moduleDoc;

  accessibility = getAccessibility(this.declaration);
  decorators: ParsedDecorator[] | undefined = getDecorators(this.declaration);
  type = getDeclarationTypeText(this.declaration);
  isOptional = !!(this.symbol.flags & SymbolFlags.Optional);
  isGetAccessor = !!(this.symbol.flags & SymbolFlags.GetAccessor);
  isSetAccessor = !!(this.symbol.flags & SymbolFlags.SetAccessor);
  isCallMember = !!(this.symbol.flags & SymbolFlags.Signature && this.symbol.name === '__call');
  isNewMember = !!(this.symbol.flags & SymbolFlags.Signature && this.symbol.name === '__new');
  isReadonly = !!this.declaration.modifiers && this.declaration.modifiers.some(modifier => modifier.kind === SyntaxKind.ReadonlyKeyword);
  isAbstract = !!this.declaration.modifiers && this.declaration.modifiers.some(modifier => modifier.kind === SyntaxKind.AbstractKeyword);
  isStatic = !!this.declaration.modifiers && this.declaration.modifiers.some(modifier => modifier.kind === SyntaxKind.StaticKeyword);

  constructor(
      public containerDoc: ContainerExportDoc,
      public symbol: Symbol,
      public declaration: Declaration) {
  }
}
