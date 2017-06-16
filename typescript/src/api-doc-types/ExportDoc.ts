import { Symbol, Declaration } from 'typescript';
import { ApiDoc } from './ApiDoc';
import { ModuleDoc } from './ModuleDoc';
import { MemberDoc } from './MemberDoc';

export interface ExportDoc extends ApiDoc {
  accessibility: string;
  exportSymbol: Symbol;
  typeParams: string;
  heritage: string;
  decorators: any[];
  moduleDoc: ModuleDoc;
  additionalDeclarations: Declaration[];
  members: MemberDoc[];
  statics: MemberDoc[];
}
