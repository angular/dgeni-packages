import * as fs from 'fs';
import { CompilerHost, CompilerOptions, sys } from 'typescript';
import { CustomCompilerHost } from './CustomCompilerHost';
const { resolve } = require('canonical-path');

describe('CustomCompilerHost', () => {
  let options: CompilerOptions;
  let host: CompilerHost;
  let baseDir: string;
  let extensions: string[];
  let log: any;

  beforeEach(() => {
    options = { charset: 'utf8' };
    baseDir = resolve(__dirname, '../../mocks/tsParser');
    extensions = ['.ts', '.js'];
    log = require('dgeni/lib/mocks/log')(false);

    host = new CustomCompilerHost(options, baseDir, extensions, log);
  });

  describe('getSourceFile', () => {
    it('should return a SourceFile object for a given path', () => {
      const sourceFile = host.getSourceFile('testSrc.ts', 0)!;
      expect(sourceFile.fileName).toEqual('testSrc.ts');
      expect(sourceFile.pos).toEqual(0);
      expect(sourceFile.text).toEqual(jasmine.any(String));
    });

    it('should return a SourceFile object for a given path, with fileName relative to baseDir', () => {
      const sourceFile = host.getSourceFile(resolve(baseDir, 'testSrc.ts'), 0)!;
      expect(sourceFile.fileName).toEqual('testSrc.ts');
      expect(sourceFile.pos).toEqual(0);
      expect(sourceFile.text).toEqual(jasmine.any(String));
    });

    it('should try each of the configured extensions and update the filename to the correct extension', () => {
      let sourceFile = host.getSourceFile('testSrc.js', 0)!;
      expect(sourceFile.fileName).toEqual('testSrc.ts');

      sourceFile = host.getSourceFile('../mockPackage.ts', 0)!;
      expect(sourceFile.fileName).toEqual('../mockPackage.js');
    });

    it('should cope with folders with names that look like source files', () => {
      const sourceFile = host.getSourceFile('zone.js', 0)!;
      expect(sourceFile.fileName).toEqual('zone.js/index.ts');
    });
  });

  describe('getDefaultLibFileName', () => {
    it('should return a path to the default library', () => {
      expect(host.getDefaultLibFileName(options)).toContain('typescript/lib/lib.d.ts');
    });
  });

  describe('fileExists', () => {
    it('should delegate to fs.existsSync', () => {
      const mockResult: any = {};
      spyOn(fs, 'existsSync').and.returnValue(mockResult);
      const result = host.fileExists('a/b/c.ts');
      expect(result).toBe(mockResult);
      expect(fs.existsSync).toHaveBeenCalledWith('a/b/c.ts');
    });
  });

  describe('readFile', () => {
    it('should delegate to fs.readFileSync', () => {
      const mockResult = 'content of file';
      spyOn(fs, 'readFileSync').and.returnValue(mockResult);
      const result = host.readFile('a/b/c.ts');
      expect(result).toBe(mockResult);
      expect(fs.readFileSync).toHaveBeenCalledWith('a/b/c.ts', 'utf-8');
    });
  });

  describe('writeFile', () => {
    it('should do nothing', () => {
      host.writeFile('', '', false, undefined, []);
    });
  });

  describe('getCurrentDirectory', () => {
    it('should return the baseDir', () => {
      expect(host.getCurrentDirectory()).toEqual(baseDir);
    });
  });

  describe('useCaseSensitiveFileNames', () => {
    it('should return true if the OS is case sensitive', () => {
      expect(host.useCaseSensitiveFileNames()).toBe(sys.useCaseSensitiveFileNames);
    });
  });

  describe('getCanonicalFileName', () => {
    it('should lower case the filename', () => {
      const expectedFilePath = host.useCaseSensitiveFileNames() ? 'SomeFile.ts' : 'somefile.ts';
      expect(host.getCanonicalFileName('SomeFile.ts')).toEqual(expectedFilePath);
    });
  });

  describe('getNewLine', () => {
    it('should return the newline character for the OS', () => {
      expect(host.getNewLine()).toEqual(require('os').EOL);
    });
  });
});
