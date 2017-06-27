/* tslint:disable:no-bitwise */
import { Declaration, Decorator, Symbol, SymbolFlags } from 'typescript';
import { FileInfo } from '../services/TsParser/FileInfo';
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { getContent } from "../services/TsParser/getContent";
import { getDeclarationTypeText } from "../services/TsParser/getDeclarationTypeText";
import { getDecorators } from "../services/TsParser/getDecorators";
import { getTypeText } from '../services/TsParser/getTypeText';
import { ApiDoc } from './ApiDoc';
import { ContainerExportDoc } from './ContainerExportDoc';

/**
 * This document represents a member of a ClassLikeExportDoc.
 */
export abstract class MemberDoc implements ApiDoc {
  readonly docType = 'member';
  readonly abstract name: string;
  readonly abstract id: string;
  readonly abstract aliases: string[];
  readonly abstract anchor: string;
  readonly path: string;
  readonly outputPath: string;
  readonly content = getContent(this.declaration);
  readonly fileInfo: FileInfo;

  readonly accessibility = getAccessibility(this.declaration);
  readonly decorators = getDecorators(this.declaration);
  readonly type = getDeclarationTypeText(this.declaration);
  readonly isOptional = !!(this.symbol.flags & SymbolFlags.Optional);
  readonly isGetAccessor = !!(this.symbol.flags & SymbolFlags.GetAccessor);
  readonly isSetAccessor = !!(this.symbol.flags & SymbolFlags.SetAccessor);

  constructor(public containerDoc: ContainerExportDoc, public symbol: Symbol, public declaration: Declaration, public basePath: string, public isStatic: boolean) {
    this.fileInfo = new FileInfo(this.declaration, basePath);
  }
}
