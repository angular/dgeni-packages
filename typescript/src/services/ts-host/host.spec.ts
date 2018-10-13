import { Dgeni, Package } from 'dgeni';
import { TypeFormatFlags, VariableDeclaration } from 'typescript';
import { TsParser } from '../TsParser';
import { Host } from './host';

const mockPackage = require('../../mocks/mockPackage');
const path = require('canonical-path');

describe('Host', () => {
  const basePath = path.resolve(__dirname, '../../mocks/tsParser');

  let host: Host;
  let parser: TsParser;

  /**
   * Creates the Host instance through Dgeni dependency injection. Also allows passing a function
   * that will run in Dgeni's configuration lifecycle and allows modifying the host factory.
   */
  function setupTestDgeniInstance(configureFn?: (host: Host) => void) {
    const testPackage = mockPackage() as Package;

    if (configureFn) {
      testPackage.config((tsHost: Host) => configureFn(tsHost));
    }

    const dgeni = new Dgeni([testPackage]);
    const injector = dgeni.configureInjector();

    // Load factories from the Dgeni injector.
    host = injector.get('tsHost');
    parser = injector.get('tsParser');
  }

  it("should read content of a declaration", () => {
    setupTestDgeniInstance(h => h.concatMultipleLeadingComments = true);

    const parseInfo = parser.parse(['multipleLeadingComments.ts'], basePath);
    const module = parseInfo.moduleSymbols[0];
    const declaration = module.exportArray[0].valueDeclaration!;

    expect(host.getContent(declaration))
      .toEqual('Not a license comment.\nThis is a test function');
  });

  it('should be able to disable leading comment concatenation', () => {
    setupTestDgeniInstance(h => h.concatMultipleLeadingComments = false);

    const parseInfo = parser.parse(['multipleLeadingComments.ts'], basePath);
    const module = parseInfo.moduleSymbols[0];
    const declaration = module.exportArray[0].valueDeclaration!;

    expect(host.getContent(declaration)).toEqual('This is a test function');
  });

  describe('type to string conversion', () => {

    it('should properly determine type strings', () => {
      setupTestDgeniInstance();

      const {moduleSymbols, typeChecker} = parser.parse(['typeToString.ts'], basePath);
      const testDeclarations = moduleSymbols[0].exportArray
        .map(symbol => symbol.valueDeclaration) as VariableDeclaration[];

      const typeStrings = [
        typeChecker.getTypeAtLocation(testDeclarations[0].initializer!),
        typeChecker.getTypeFromTypeNode(testDeclarations[1].type!),
        typeChecker.getTypeAtLocation(testDeclarations[2].initializer!),
      ].map(type => host.typeToString(typeChecker, type));

      expect(typeStrings[0]).toBe('"someString"');
      expect(typeStrings[1]).toBe('number');
      expect(typeStrings[2]).toBe('{ A: string; B: string; C: string; D: string; E: string; F: string; G: string; H: string; I: stri...');
    });

    it('should be able to specify type format flags', () => {
      setupTestDgeniInstance(h => h.typeFormatFlags = TypeFormatFlags.NoTruncation);

      const {moduleSymbols, typeChecker} = parser.parse(['typeToString.ts'], basePath);
      const typeDeclaration = moduleSymbols[0].exportArray[2]
          .valueDeclaration! as VariableDeclaration;
      const longType = typeChecker.getTypeAtLocation(typeDeclaration.initializer!);

      expect(host.typeToString(typeChecker, longType)).toBe(
          '{ A: string; B: string; C: string; D: string; E: string; F: string; G: string; H: string; I: string; J: string; K: string; L: string; M: string; N: string; }');
    });
  });
});
