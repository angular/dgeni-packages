import { Declaration,ParameterDeclaration, SignatureDeclaration, TypeChecker } from 'typescript';
import { nodeToString } from '../services/TsParser/nodeToString';
import { ContainerExportDoc } from './ContainerExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { ParameterDoc } from './ParameterDoc';

export interface ParamTag {
  name: string;
  description: string;
}

/**
 * Docs that represent exported functions or methods.
 */
export interface ParameterContainer {
  name: string;
  id: string;
  aliases: string[];
  parameterDocs: ParameterDoc[];
  parameters: string[];
  type: string;
  containerDoc: ModuleDoc | ContainerExportDoc;
  moduleDoc: ModuleDoc;
  declaration: Declaration;
  basePath: string;
  typeChecker: TypeChecker;
  params?: ParamTag[];
}

export function getParameters(callableDoc: ParameterContainer) {
  const declaration = callableDoc.declaration as SignatureDeclaration;
  const signature = callableDoc.typeChecker.getSignatureFromDeclaration(declaration);

  if (!signature) {
    const name = declaration.name ? nodeToString(declaration.name) : 'unknown';
    throw new Error(`Invalid call signature for "${name}" in ${declaration.getSourceFile().fileName} at line ${declaration.getStart()}`);
  }

  return signature.getParameters().map(parameter => {
    return new ParameterDoc(callableDoc, parameter, parameter.valueDeclaration as ParameterDeclaration)
  });
}
