import { TypeChecker } from 'typescript';
import { ContainerExportDoc } from './ContainerExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { OverloadInfo } from './OverloadInfo';

/**
 * Docs that represent exported functions or methods.
 */
export interface ParameterContainer {
  name: string;
  id: string;
  aliases: string[];
  parameters: string[];
  type: string;
  containerDoc: ModuleDoc | ContainerExportDoc;
  moduleDoc: ModuleDoc;
  basePath: string;
  namespacesToInclude: string[];
  typeChecker: TypeChecker;
}
