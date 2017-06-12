import { sys, getDefaultLibFileName, createSourceFile, CompilerHost, CompilerOptions, ScriptTarget, createCompilerHost, SourceFile, WriteFileCallback} from 'typescript';
var fs = require('fs');
var path = require('canonical-path');

// We need to provide our own version of CompilerHost because we want to set the
// base directory and specify what extensions to consider when trying to load a source
// file
export class CustomCompilerHost implements CompilerHost {

  constructor(private options: any, private baseDir: string, private extensions: string[], private log: any) {}

  getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
    var text, baseFilePath, resolvedPath, resolvedPathWithExt;

    // Strip off the extension and resolve relative to the baseDir
    baseFilePath = fileName.replace(/\.[^.]+$/, '');
    resolvedPath = path.resolve(this.baseDir, baseFilePath);
    baseFilePath = path.relative(this.baseDir, resolvedPath);

    // Iterate through each possible extension and return the first source file that is actually found
    for(var i=0; i<this.extensions.length; i++) {

      // Try reading the content from files using each of the given extensions
      try {
        resolvedPathWithExt = resolvedPath + this.extensions[i];
        this.log.silly('getSourceFile:', resolvedPathWithExt);
        text = fs.readFileSync(resolvedPathWithExt, { encoding: this.options.charset });
        this.log.debug('found source file:', fileName, resolvedPathWithExt);
        return createSourceFile(baseFilePath + this.extensions[i], text, languageVersion);
      }
      catch(e) {
        // Try again if the file simply did not exist, otherwise report the error as a warning
        if(e.code !== 'ENOENT') {
          if (onError) onError(e.message);
          this.log.warn('Error reading ' + resolvedPathWithExt + ' : ' + e.message);
        }
      }
    }
    throw new Error('No SourceFile found with path ' + fileName);
  }

  getDefaultLibFileName(options: CompilerOptions) {
    return path.resolve(path.dirname(sys.getExecutingFilePath()), getDefaultLibFileName(options));
  }
  writeFile: WriteFileCallback = () => {};

  getCurrentDirectory() {
    return this.baseDir;
  }

  getDirectories(path: string) {
    return [];
  }

  useCaseSensitiveFileNames() {
    return sys.useCaseSensitiveFileNames;
  }

  getCanonicalFileName(fileName: string) {
    // if underlying system can distinguish between two files whose names differs only in cases then file name already in canonical form.
    // otherwise use toLowerCase as a canonical form.
    return sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
  }

  getNewLine() {
    return sys.newLine;
  }

  fileExists(fileName: string) {
    var text, baseFilePath, resolvedPath, resolvedPathWithExt;

    // Strip off the extension and resolve relative to the baseDir
    baseFilePath = fileName.replace(/\.[^.]+$/, '');
    resolvedPath = path.resolve(this.baseDir, baseFilePath);

    // Iterate through each possible extension and return the first source file that is actually found
    for(var i=0; i<this.extensions.length; i++) {
      // Try reading the content from files using each of the given extensions
      resolvedPathWithExt = resolvedPath + this.extensions[i];
      if (fs.existsSync(resolvedPathWithExt)) return true;
    }
    return false;
  }

  readFile(fileName: string) {
    console.log('readFile - NOT IMPLEMENTED', fileName);
    return '';
  }
}