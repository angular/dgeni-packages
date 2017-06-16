import { Symbol } from 'typescript';
const path = require('canonical-path');


export function getFileInfo(symbol: Symbol, basePath: string) {
  const fileName = symbol.declarations![0].getSourceFile().fileName;
  const file = path.resolve(basePath, fileName);
  return {
    filePath: file,
    baseName: path.basename(file, path.extname(file)),
    extension: path.extname(file).replace(/^\./, ''),
    basePath: basePath,
    relativePath: fileName,
    projectRelativePath: path.relative(basePath, file)
  };
}
