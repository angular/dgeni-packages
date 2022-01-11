import { Declaration, TypeChecker } from 'typescript';
import * as path from 'canonical-path';

import { ModuleSymbol } from '../services/TsParser';
import { FileInfo } from '../services/TsParser/FileInfo';

import { ApiDoc } from './ApiDoc';
import { ExportDoc } from './ExportDoc';

/**
 * A module doc represents an ES6 module that contains exports such as classes, functions, constants, etc,
 * which are represented by docs of their own.
 */
export class ModuleDoc implements ApiDoc {
  docType = 'module';
  id = ensureRelative(this.basePath, this.symbol.name.replace(/^"|"$/g, '').replace(/\/index$/, ''));
  name = this.id.split('/').pop()!;
  declaration: Declaration = this.symbol.valueDeclaration!;
  aliases = [this.id, this.name];
  exports: ExportDoc[] = [];
  fileInfo = new FileInfo(this.declaration, this.basePath);
  startingLine = this.fileInfo.location.start.line + (this.fileInfo.location.start.character ? 1 : 0);
  endingLine = this.fileInfo.location.end.line;
  path: string = '';
  outputPath: string = '';
  content: string = '';

  constructor(public symbol: ModuleSymbol,
              public basePath: string,
              public hidePrivateMembers: boolean,
              public typeChecker: TypeChecker) {}
}

/**
 * Convert a potentially absolute path to relative.
 *
 * If `toPath` is already relative, it is practically returned unchanged. If it is an absolute path,
 * it is resolved relative to `fromPath` (which should always be an absolute path).
 */
function ensureRelative(absoluteFromPath: string, toPath: string): string {
  const absoluteToPath = path.resolve(absoluteFromPath, toPath);
  return path.relative(absoluteFromPath, absoluteToPath);
}
