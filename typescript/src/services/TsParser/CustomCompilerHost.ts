import * as fs from 'fs';
import { CompilerHost, CompilerOptions, createCompilerHost, createSourceFile, getDefaultLibFileName, ScriptTarget, SourceFile, sys, WriteFileCallback} from 'typescript';
const path = require('canonical-path');

// We need to provide our own version of CompilerHost because we want to set the
// base directory and specify what extensions to consider when trying to load a source
// file
export class CustomCompilerHost implements CompilerHost {

  constructor(private options: CompilerOptions, private baseDir: string, private extensions: string[], private log: any) {}

  getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
    let text;
    let baseFilePath;
    let resolvedPath;
    let resolvedPathWithExt;

    // let's just try loading the file as-is initially
    try {
      resolvedPath = path.resolve(this.baseDir, fileName);
      text = fs.readFileSync(resolvedPath, { encoding: this.options.charset! });
      this.log.debug('found source file:', fileName);
      return createSourceFile(path.relative(this.baseDir, resolvedPath), text, languageVersion);
    } catch (e) {
      // if it is a folder then try loading the index file of that folder
      if (e.code === 'EISDIR') {
        return this.getSourceFile(fileName + '/index.ts', languageVersion, onError);
      }
      // otherwise ignore the error and move on to the strategy below...
    }

    // Strip off the extension and resolve relative to the baseDir
    baseFilePath = fileName.replace(/\.[^.\/]+$/, '');
    resolvedPath = path.resolve(this.baseDir, baseFilePath);
    baseFilePath = path.relative(this.baseDir, resolvedPath);

    // Iterate through each possible extension and return the first source file that is actually found
    for (const extension of this.extensions) {

      // Try reading the content from files using each of the given extensions
      try {
        resolvedPathWithExt = resolvedPath + extension;
        this.log.silly('getSourceFile:', resolvedPathWithExt);
        text = fs.readFileSync(resolvedPathWithExt, { encoding: this.options.charset! });
        this.log.debug('found source file:', fileName, resolvedPathWithExt);
        return createSourceFile(baseFilePath + extension, text, languageVersion);
      } catch (e) {
        // Try again if the file simply did not exist, otherwise report the error as a warning
        if (e.code !== 'ENOENT') {
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
  writeFile: WriteFileCallback = () => { /* noop */ };

  getCurrentDirectory() {
    return this.baseDir;
  }

  getDirectories(p: string) {
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
    return fs.existsSync(fileName);
  }

  readFile(fileName: string) {
    /* tslint:disable:no-console */
    this.log.debug('readFile', fileName);
    return fs.readFileSync(fileName, 'utf-8');
  }
}
