/**
 * @dgProcessor generateComponentGroupsProcessor
 * @description
 * Generate documents for each group of components (by type) within a module
 */
module.exports = function generateComponentGroupsProcessor(moduleMap) {
  return {
    $runAfter: ['moduleDocsProcessor'],
    $runBefore: ['computing-paths'],
    $process(docs) {

      moduleMap.forEach(module => {

        // We don't want the overview docType to be represented as a componentGroup
        const componentDocs = module.components.filter(doc => doc.docType !== 'overview');
        const componentGroupsMap = {};
        for(const componentDoc of componentDocs) {
          (componentGroupsMap[componentDoc.docType] = componentGroupsMap[componentDoc.docType] || []).push(componentDoc);
        }

        module.componentGroups = Object.keys(componentGroupsMap)
          .map(docType => {
            const componentGroupDoc = {
              id: module.id + '.' + docType,
              docType: 'componentGroup',
              groupType: docType,
              moduleName: module.name,
              moduleDoc: module,
              area: module.area,
              name: docType + ' components in '  + module.name,
              components: componentGroupsMap[docType],
            };
            docs.push(componentGroupDoc);
            return componentGroupDoc;
          });
      });
    }
  };
};