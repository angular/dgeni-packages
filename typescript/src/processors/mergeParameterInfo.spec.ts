import { Dgeni, DocCollection, Processor } from 'dgeni';
import { Injector } from 'dgeni/lib/Injector';
import { ParameterDoc } from '../api-doc-types/ParameterDoc';
import { MergeParameterInfoProcessor } from './mergeParameterInfo';
import { ReadTypeScriptModules } from './readTypeScriptModules';

const mockPackage = require('../mocks/mockPackage');
const path = require('canonical-path');

describe('mergeParameterInfo', () => {

  let dgeni: Dgeni;
  let injector: Injector;
  let tsProcessor: ReadTypeScriptModules;
  let mergeParameterInfoProcessor: MergeParameterInfoProcessor;
  let parseTagsProcessor: Processor;
  let extractTagsProcessor: Processor;

  beforeEach(() => {
    dgeni = new Dgeni([mockPackage()]);
    injector = dgeni.configureInjector();

    tsProcessor = injector.get('readTypeScriptModules');
    parseTagsProcessor = injector.get('parseTagsProcessor');
    extractTagsProcessor = injector.get('extractTagsProcessor');
    mergeParameterInfoProcessor = injector.get('mergeParameterInfo');
    tsProcessor.basePath = path.resolve(__dirname, '../mocks/readTypeScriptModules');
    tsProcessor.sourceFiles = ['methodParameters.ts'];
  });

  it('should merge the param tags into the parameter docs', () => {
    const docsArray: DocCollection = [];

    tsProcessor.$process(docsArray);
    parseTagsProcessor.$process(docsArray);
    extractTagsProcessor.$process(docsArray);
    mergeParameterInfoProcessor.$process(docsArray);

    const param3: ParameterDoc = docsArray.find(doc => doc.name === 'param3' && doc.container.name === 'method2');
    expect(param3.id).toEqual('methodParameters/TestClass.method2()~param3');
    expect(param3.description).toEqual('description of param3');
    expect(param3.type).toEqual('string');

    const param4: ParameterDoc = docsArray.find(doc => doc.name === 'param4' && doc.container.name === 'method2');
    expect(param4.id).toEqual('methodParameters/TestClass.method2()~param4');
    expect(param4.description).toEqual('description of param4');
    expect(param4.type).toEqual('number');
  });
});
