import { __String, MethodDeclaration } from 'typescript';
import { TsParser } from '.';
import { getContent } from './getContent';
const path = require('canonical-path');

describe('getContent', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should get the leading jsdoc comments for exports', () => {
    const parseInfo = parser.parse(['tsParser/getContent.test.ts'], basePath);
    const module = parseInfo.moduleSymbols[0];

    expect(getContent(module.exportArray[0].getDeclarations()![0])).toEqual('Description of TestClass\n@deprecated warning');
    expect(getContent(module.exportArray[1].getDeclarations()![0])).toEqual('Description of function');
  });

  it('should get the leading jsdoc comments for class members and their parameters', () => {
    const parseInfo = parser.parse(['tsParser/getContent.test.ts'], basePath);
    const module = parseInfo.moduleSymbols[0];

    expect(getContent(module.exportArray[0].members!.get('property' as __String)!.valueDeclaration)).toEqual('Some property');

    const method: MethodDeclaration = module.exportArray[0].members!.get('method' as __String)!.valueDeclaration as MethodDeclaration;
    expect(getContent(method)).toEqual('Some method');
    expect(getContent(method.parameters[0])).toEqual('param 1');
  });

  it('should properly concatenate multiple leading comments', () => {
    const parseInfo = parser.parse(['tsParser/multipleLeadingComments.ts'], basePath);
    const module = parseInfo.moduleSymbols[0];

    expect(getContent(module.exportArray[0].getDeclarations()![0])).toEqual('Not a license comment.\nThis is a test function');
  });

  describe('leading comments concatenation disabled', () => {

    it('should be able to disable concatenation', () => {
      const parseInfo = parser.parse(['tsParser/multipleLeadingComments.ts'], basePath);
      const module = parseInfo.moduleSymbols[0];

      expect(getContent(module.exportArray[0].getDeclarations()![0], false))
        .toEqual('This is a test function');
    });

    it('should not throw if node does not have any leading comment', () => {
      const parseInfo = parser.parse(['tsParser/multipleLeadingComments.ts'], basePath);
      const module = parseInfo.moduleSymbols[0];

      expect(() => getContent(module.exportArray[1].getDeclarations()![0], false))
        .not.toThrow();
    });

    it('should skip leading single-line comments', () => {
      const parseInfo = parser.parse(['tsParser/multipleLeadingComments.ts'], basePath);
      const module = parseInfo.moduleSymbols[0];

      expect(getContent(module.exportArray[2].getDeclarations()![0], false))
        .toEqual('This is the real comment.');
    });

    it('should skip leading non-js multi line comments', () => {
      const parseInfo = parser.parse(['tsParser/multipleLeadingComments.ts'], basePath);
      const module = parseInfo.moduleSymbols[0];

      expect(getContent(module.exportArray[3].getDeclarations()![0], false))
        .toEqual('First real comment.');
    });
  });
});
