import {Declaration} from 'typescript';
import {getContent} from '../TsParser';

/**
 * Host that will be used for TypeScript AST operations that should be configurable or shared
 * across multiple doc types.
 */
export class Host {

  /** Whether multiple leading comments for a TypeScript node should be concatenated. */
  concatMultipleLeadingComments: boolean = true;

  getContent(declaration: Declaration) {
    return getContent(declaration, this.concatMultipleLeadingComments);
  }

}
