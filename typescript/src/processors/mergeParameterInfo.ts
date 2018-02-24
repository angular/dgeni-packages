import { DocCollection, Processor } from 'dgeni';
import { ParameterDoc } from '../api-doc-types/ParameterDoc';

/**
 * @dgProcessor
 *
 * @description
 * Merge the description from `@param` tags into the parameter docs
 * extracted from the TypeScript
 */
export function mergeParameterInfo() {
  return new MergeParameterInfoProcessor();
}

export class MergeParameterInfoProcessor implements Processor {
  $runAfter = ['readTypeScriptModules', 'tags-extracted'];
  $runBefore = ['extra-docs-added'];

  $process(docs: DocCollection) {
    docs.forEach((doc: ParameterDoc) => {
      if (doc.docType === 'parameter') {
        // The `params` property comes from parsing the `@param` jsdoc tags on the container doc
        const paramTag = doc.container.params && doc.container.params.find((param: any) => param.name === doc.name);
        if (paramTag && paramTag.description) {
          doc.description = paramTag.description;
        }
      }
    });
  }
}
