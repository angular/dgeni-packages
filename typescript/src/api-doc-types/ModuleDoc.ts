import { Document } from 'dgeni';
import { Symbol } from 'typescript';
import { FileInfo } from './FileInfo';
import { ExportDoc } from './ExportDoc';

export interface ModuleDoc extends Document {
  docType: 'module';
  name: string,
  id: string,
  aliases: string[],
  moduleTree: Symbol,
  content: string,
  exports: ExportDoc[],
  fileInfo: FileInfo,
  location: Location
}
