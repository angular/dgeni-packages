import { DocCollection } from 'dgeni';
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
        exportDocs.push({
          docType: 'var',
          name: exportDoc.name,
          id: exportDoc.id,
          returnType: 'InjectableReference'
        });
      }
    }
  });
}
