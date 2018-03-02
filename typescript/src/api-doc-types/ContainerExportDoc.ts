/* tslint:disable:no-bitwise */
import {
    FunctionLikeDeclaration,
    GetAccessorDeclaration,
    Map,
    SetAccessorDeclaration,
    Symbol,
    SymbolFlags,
    SyntaxKind,
    UnderscoreEscapedMap
} from 'typescript';
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { ExportDoc } from './ExportDoc';
import { MemberDoc } from './MemberDoc';
import { MethodMemberDoc } from './MethodMemberDoc';
import { PropertyMemberDoc } from './PropertyMemberDoc';

const MethodMemberFlags = SymbolFlags.Method |
                          SymbolFlags.Signature |
                          SymbolFlags.Constructor |
                          SymbolFlags.Accessor;
const PropertyMemberFlags = SymbolFlags.Property | SymbolFlags.EnumMember;

const MembersToIgnoreFlags = SymbolFlags.Prototype | SymbolFlags.TypeParameter | SymbolFlags.Constructor;

/**
 * This document represents things that contain members such as classes, enums and interfaces.
 *
 * Although such things can have multiple mergeable declarations, we consider them as a single doc.
 * So such documents are not OverloadableExport docs.
 */
export abstract class ContainerExportDoc extends ExportDoc {
  members: MemberDoc[] = [];

  protected getMemberDocs(members: UnderscoreEscapedMap<Symbol>, hidePrivateMembers: boolean) {
    const memberDocs: MemberDoc[] = [];
    members.forEach(member => {
      const flags = member.getFlags();

      // Ignore the prototype export
      if (flags & MembersToIgnoreFlags) return;

      // Ignore private members, if configured to do so
      if (hidePrivateMembers && getAccessibility(member.valueDeclaration) === 'private') return;

      const overloads: MethodMemberDoc[] = [];
      let memberDoc: MemberDoc|null = null;
      let getAccessorDeclaration: GetAccessorDeclaration | null = null;
      let setAccessorDeclaration: SetAccessorDeclaration | null = null;

      for (const declaration of member.getDeclarations()!) {
        if (flags & MethodMemberFlags) {
          if (declaration.kind === SyntaxKind.GetAccessor) {
            getAccessorDeclaration = declaration as GetAccessorDeclaration;
          } else if (declaration.kind === SyntaxKind.SetAccessor) {
            setAccessorDeclaration = declaration as SetAccessorDeclaration;
          } else if ((declaration as FunctionLikeDeclaration).body) {
            // This is the "real" declaration of the method
            memberDoc = new MethodMemberDoc(this, member, declaration, overloads);
          } else {
            // This is an overload signature of the method
            overloads.push(new MethodMemberDoc(this, member, declaration, overloads));
          }
        } else if (flags & PropertyMemberFlags) {
          memberDoc = new PropertyMemberDoc(this, member, declaration, null, null);
        } else {
          throw new Error(`Unknown member type for member ${member.name}`);
        }
      }

      // If at least one of the declarations was an accessor then the whole member is a property.
      if (getAccessorDeclaration || setAccessorDeclaration) {
        memberDoc = new PropertyMemberDoc(this, member, null, getAccessorDeclaration, setAccessorDeclaration);
      }

      // If there is no member doc then we are in an interface or abstract class and we just take the first overload
      // as the primary one.
      memberDocs.push(memberDoc || overloads.shift()!);
    });
    return memberDocs;
  }
}
