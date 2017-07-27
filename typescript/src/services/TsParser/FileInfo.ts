import { Declaration } from 'typescript';
import { Location } from './Location';
import { realpathSync } from 'fs';
const path = require('canonical-path');

/**
 * The file (and the location in the file) from where an API doc element was sourced.
 */
export class FileInfo {
  relativePath = this.declaration.getSourceFile().fileName;
  location = new Location(this.declaration);
  filePath = path.resolve(this.basePath, this.relativePath);
  baseName = path.basename(this.filePath, path.extname(this.filePath));
  extension = path.extname(this.filePath).replace(/^\./, '');
  projectRelativePath = path.relative(this.basePath, this.filePath);
  realFilePath = this.getRealFilePath(this.filePath);
  realProjectRelativePath = path.relative(this.basePath, this.realFilePath);

  constructor(
    private declaration: Declaration,
    public basePath: string) {
  }

  getRealFilePath(filePath: string): string {
    return realpathSync(filePath).replace(RegExp('\\' + path.sep, 'g'), '/');
  }
}
