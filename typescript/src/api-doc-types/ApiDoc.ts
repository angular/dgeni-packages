import { Declaration, Symbol } from 'typescript';
import { AugmentedSymbol } from '../services/TsParser';
import { FileInfo } from '../services/TsParser/FileInfo';

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
