import { Dgeni } from 'dgeni';
import { mockPackage } from '../mocks/mockPackage';
import { PostProcessHtml } from './postProcessHtml';

describe('postProcessHtml', () => {
  let dgeni: Dgeni;
  let injector: any;
  let processor: PostProcessHtml;
  let createDocMessage: any;

  beforeEach(() => {
    dgeni = new Dgeni([mockPackage(true)]);
    injector = dgeni.configureInjector();
    createDocMessage = injector.get('createDocMessage');
    processor = injector.get('postProcessHtml');
    processor.docTypes = ['a', 'b'];
  });

  it('should be available from the injector', () => {
    expect(processor).toBeDefined();
  });

  it('should only process docs that match the specified docTypes', () => {
    const elements: string[] = [];
    const captureFirstElement = (ast: any) => {
      elements.push(ast.children[0].tagName);
    };
    processor.plugins = [() => captureFirstElement];

    const docs = [
      { docType: 'a', renderedContent: '<a></a>' },
      { docType: 'b', renderedContent: '<b></b>' },
      { docType: 'c', renderedContent: '<c></c>' },
      { docType: 'd', renderedContent: '<d></d>' },
    ];
    processor.$process(docs);
    expect(elements).toEqual(['a', 'b']);
  });

  it('should run all the plugins on each doc', () => {
    const capitalizeFirstElement = (ast: any) => {
      ast.children[0].tagName = ast.children[0].tagName.toUpperCase();
    };
    const addOneToFirstElement = (ast: any) => {
      ast.children[0].tagName = ast.children[0].tagName + '1';
    };
    const elements: string[] = [];
    const captureFirstElement = (ast: any) => {
      elements.push(ast.children[0].tagName);
    };

    const docs = [
      { docType: 'a', renderedContent: '<a></a>' },
      { docType: 'b', renderedContent: '<b></b>' },
      { docType: 'c', renderedContent: '<c></c>' },
      { docType: 'd', renderedContent: '<d></d>' },
    ];

    processor.plugins = [
      () => capitalizeFirstElement,
      () => addOneToFirstElement,
      () => captureFirstElement,
    ];
    processor.$process(docs);
    expect(elements).toEqual(['A1', 'B1']);
  });

  it('should report non-fatal errors', () => {
    const log = injector.get('log');
    const addWarning = (_: any, file: any) => {
      file.message('There was a problem');
    };
    processor.plugins = [() => addWarning];
    processor.$process([{ docType: 'a', renderedContent: '' }]);
    expect(log.warn).toHaveBeenCalledWith('There was a problem - doc (a) ');
  });

  it('should throw on fatal errors', () => {
    const log = injector.get('log');
    const addError = (_: any, file: any) => {
      file.fail('There was an error');
    };
    const doc = { docType: 'a', renderedContent: '' };
    processor.plugins = [() => addError];
    expect(() => processor.$process([doc])).toThrowError(createDocMessage('There was an error', doc));
    expect(log.error).not.toHaveBeenCalled();
  });
});
