/* tslint:disable:no-bitwise */
import { Declaration, Map, Symbol, SymbolFlags } from 'typescript';
import { FileInfo } from "../services/TsParser/FileInfo";
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { ExportDoc } from './ExportDoc' ;
import { MemberDoc } from './MemberDoc' ;
import { MethodMemberDoc } from './MethodMemberDoc';
import { ModuleDoc } from './ModuleDoc';
import { PropertyMemberDoc } from './PropertyMemberDoc';

const MethodMemberFlags = SymbolFlags.Method |
                          SymbolFlags.Signature |
                          SymbolFlags.Constructor |
                          SymbolFlags.Accessor;
const PropertyMemberFlags = SymbolFlags.Property | SymbolFlags.EnumMember;

const IgnoreMemberFlags = SymbolFlags.Prototype | SymbolFlags.TypeParameter | SymbolFlags.Constructor;

/**
 * This document represents things that contain members such as classes, enums and interfaces.
 *
 * Although such things can have multiple mergeable declarations, we consider them as a single doc.
 * So such documents are not OverloadableExport docs.
 */
export abstract class ContainerExportDoc extends ExportDoc {
  members: MemberDoc[] = [];

  protected getMemberDocs(members: Map<Symbol>, hidePrivateMembers: boolean, isStatic: boolean) {
    const memberDocs: MemberDoc[] = [];
    members.forEach(member => {
      const flags = member.getFlags();

      // Ignore the prototype export
      if (flags & IgnoreMemberFlags) return;

      if (!hidePrivateMembers || (member.name.charAt(0) !== '_' && getAccessibility(member.valueDeclaration) !== 'private')) {
        for (const declaration of member.getDeclarations()) {
          if (flags & MethodMemberFlags) {
              memberDocs.push(new MethodMemberDoc(this, member, declaration, this.basePath, isStatic));
          } else if (flags & PropertyMemberFlags) {
            memberDocs.push(new PropertyMemberDoc(this, member, declaration, this.basePath, isStatic));
          } else {
            throw new Error(`Unknown member type for member ${member.name}`);
          }
        }
      }
    });
    return memberDocs;
  }
}
