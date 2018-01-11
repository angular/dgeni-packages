import { DocCollection } from 'dgeni';
import { ConstExportDoc } from '../api-doc-types/ConstExportDoc';
export function convertPrivateClassesToInterfaces(exportDocs: DocCollection, addInjectableReference: boolean) {

  exportDocs.forEach(exportDoc => {

    // Search for classes with a constructor marked as `@internal`
    if (exportDoc.docType === 'class' && exportDoc.constructorDoc && exportDoc.constructorDoc.internal) {

      // Convert this class to an interface with no constructor
      exportDoc.docType = 'interface';
      exportDoc.constructorDoc = null;

      // convert the heritage since interfaces use `extends` not `implements`
      exportDoc.extendsClauses = exportDoc.extendsClauses.concat(exportDoc.implementsClauses);

      if (addInjectableReference) {
        // Add the `declare var SomeClass extends InjectableReference` construct
        const constExportDoc = new ConstExportDoc(exportDoc.moduleDoc, exportDoc.symbol);
        constExportDoc.type = 'InjectableReference';
        exportDocs.push(constExportDoc);
      }
    }
  });
}
