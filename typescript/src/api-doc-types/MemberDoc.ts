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
  docType: 'member';
  abstract name: string;
  abstract id: string;
  abstract aliases: string[];
  path: string;
  outputPath: string;
  content = getContent(this.declaration);
  fileInfo: FileInfo;

  accessibility = getAccessibility(this.declaration);
  decorators = getDecorators(this.declaration);
  type = getDeclarationTypeText(this.declaration);
  isOptional = this.symbol.flags & SymbolFlags.Optional;

  constructor(public containerDoc: ContainerExportDoc, public symbol: Symbol, public declaration: Declaration, basePath: string) {
    this.fileInfo = new FileInfo(this.declaration, basePath);
  }

}
