import {Declaration, Type, TypeChecker, TypeFormatFlags} from 'typescript';
import {getContent} from '../TsParser';

/**
 * Host that will be used for TypeScript AST operations that should be configurable or shared
 * across multiple doc types.
 */
export class Host {

  /** Whether multiple leading comments for a TypeScript node should be concatenated. */
  concatMultipleLeadingComments: boolean = true;

  /** Flags that will be used to format a Type into a string representation. */
  typeFormatFlags: TypeFormatFlags = TypeFormatFlags.None;

  getContent(declaration: Declaration): string {
    return getContent(declaration, this.concatMultipleLeadingComments);
  }

  typeToString(typeChecker: TypeChecker, type: Type): string {
    return typeChecker.typeToString(type, undefined, this.typeFormatFlags);
  }
}
