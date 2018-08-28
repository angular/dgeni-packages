import { DocCollection, Document } from 'dgeni';
import { ClassExportDoc } from '../api-doc-types/ClassExportDoc';
import { ConstExportDoc } from '../api-doc-types/ConstExportDoc';

export function convertPrivateClassesToInterfaces(exportDocs: DocCollection, addInjectableReference: boolean) {

  exportDocs.forEach(exportDoc => {

    // Search for classes with a constructor marked as `@internal`
    if (isPrivateClassExportDoc(exportDoc)) {
      // Convert this class to an interface with no constructor
      exportDoc.docType = 'interface';
      exportDoc.constructorDoc = undefined;

      // convert the heritage since interfaces use `extends` not `implements`
      exportDoc.extendsClauses = exportDoc.extendsClauses.concat(exportDoc.implementsClauses);

      if (addInjectableReference) {
        // Add the `declare var SomeClass extends InjectableReference` construct
        const constExportDoc = new ConstExportDoc(exportDoc.host, exportDoc.moduleDoc,
            exportDoc.symbol, exportDoc.aliasSymbol);

        constExportDoc.type = 'InjectableReference';
        exportDocs.push(constExportDoc);
      }
    }
  });
}

/** Whether the specified document is a class document with an internal constructor. */
function isPrivateClassExportDoc(doc: Document): doc is ClassExportDoc {
  return doc.docType === 'class' && doc.constructorDoc && doc.constructorDoc.internal;
}
