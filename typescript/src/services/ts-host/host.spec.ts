import { Dgeni, Package } from 'dgeni';
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
  function setupTestDgeniInstance(configureFn: (host: Host) => void) {
    const testPackage = mockPackage() as Package;

    testPackage.config((tsHost: Host) => configureFn(tsHost));

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
});
