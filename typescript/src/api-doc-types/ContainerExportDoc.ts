/* tslint:disable:no-bitwise */
import { Declaration, Symbol, SymbolFlags } from 'typescript';
import { FileInfo } from "../services/TsParser/FileInfo";
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { ExportDoc } from './ExportDoc' ;
import { MemberDoc } from './MemberDoc' ;
import { MethodMemberDoc } from './MethodMemberDoc';
import { ModuleDoc } from './ModuleDoc';
import { PropertyMemberDoc } from './PropertyMemberDoc';

/**
 * This document represents things that contain members such as classes, enums and interfaces.
 *
 * Although such things can have multiple mergeable declarations, we consider them as a single doc.
 * So such documents are not OverloadableExport docs.
 */
export abstract class ContainerExportDoc extends ExportDoc {
  members: MemberDoc[];

  protected getMemberDocs(members: Symbol[], hidePrivateMembers: boolean) {
    const memberDocs: MemberDoc[] = [];
    members.forEach(member => {
      if (!hidePrivateMembers || member.name.charAt(0) === '_' || getAccessibility(member.valueDeclaration) !== 'public') {
        if (member.getFlags() & SymbolFlags.Method) {
          for (const declaration of member.getDeclarations()) {
            memberDocs.push(new MethodMemberDoc(this, member, declaration, this.basePath));
          }
        } else {
          memberDocs.push(new PropertyMemberDoc(this, member, member.valueDeclaration!, this.basePath));
        }
      }
    });
  }
}
