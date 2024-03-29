import * as fs from 'fs';
import { CompilerHost, CompilerOptions, createSourceFile, getDefaultLibFileName, ScriptTarget, SourceFile, sys, WriteFileCallback} from 'typescript';
const path = require('canonical-path');

// We need to provide our own version of CompilerHost because we want to set the
// base directory and specify what extensions to consider when trying to load a source
// file
export class CustomCompilerHost implements CompilerHost {

  constructor(private options: CompilerOptions, private baseDir: string, private extensions: string[], private log: any) {}

  getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
    let text;
    let resolvedPath;
    let resolvedPathWithExt;

    // let's just try loading the file as-is initially
    try {
      resolvedPath = path.resolve(this.baseDir, fileName);
      text = fs.readFileSync(resolvedPath, { encoding: this.options.charset as BufferEncoding });
      this.log.debug('found source file:', fileName);
      return createSourceFile(resolvedPath, text, languageVersion);
    } catch (e) {
      // if it is a folder then try loading the index file of that folder
      if ((e as NodeJS.ErrnoException).code === 'EISDIR') {
        return this.getSourceFile(fileName + '/index.ts', languageVersion, onError);
      }
      // otherwise ignore the error and move on to the strategy below...
    }

    // Special case for `/// <reference types="x">` directives.
    // Typescript does not fully resolve these before calling getSourceFile
    // so fileName ends up looking like `node_modules/@types/x/index.d.ts`.
    // In the case that node_modules is below the baseDir, we look
    // for ../node_modules/@types/x/index.d.ts, ../..node_modules/@types/x/index.d.ts, etc...
    if (fileName.startsWith(path.join('node_modules', '@types')) && fileName.endsWith('index.d.ts')) {
      // The base directory path is already posix normalized through TypeScript. In order to
      // properly determine the depth of the base dir, the delimiter is always a forward slash.
      const baseDirDepth = this.baseDir.split('/').length;
      let maybe = path.join('..', fileName);
      for (let i = 0; i < baseDirDepth; ++i) {
        try {
          resolvedPath = path.resolve(this.baseDir, maybe);
          text = fs.readFileSync(resolvedPath, { encoding: this.options.charset as BufferEncoding });
          this.log.debug('found source file:', fileName);
          return createSourceFile(resolvedPath, text, languageVersion);
        } catch (e) {
          // ignore the error and move on to the next maybe...
        }
        maybe = path.join('..', maybe);
      }
    }

    // Strip off the extension and resolve relative to the baseDir
    resolvedPath = path.resolve(this.baseDir, fileName).replace(/\.[^./]+$/, '');

    // Iterate through each possible extension and return the first source file that is actually found
    for (const extension of this.extensions) {

      // Try reading the content from files using each of the given extensions
      try {
        resolvedPathWithExt = resolvedPath + extension;
        this.log.silly('getSourceFile:', resolvedPathWithExt);
        text = fs.readFileSync(resolvedPathWithExt, { encoding: this.options.charset as BufferEncoding });
        this.log.debug('found source file:', fileName, resolvedPathWithExt);
        return createSourceFile(resolvedPathWithExt, text, languageVersion);
      } catch (e) {
        // Try again if the file simply did not exist, otherwise report the error as a warning
        if ((e as NodeJS.ErrnoException)?.code !== 'ENOENT') {
          const errorMessage = (e instanceof Error) ? e.message : `${e}`;
          if (onError) onError(errorMessage);
          this.log.warn('Error reading ' + resolvedPathWithExt + ' : ' + errorMessage);
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
