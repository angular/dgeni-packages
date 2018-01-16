import { Declaration, GetAccessorDeclaration, SetAccessorDeclaration, SignatureDeclaration, Symbol, SyntaxKind } from 'typescript';
import { getDeclarationTypeText } from "../services/TsParser/getDeclarationTypeText";
import { encodeAnchor } from '../utils/encodeAnchor';
import { AccessorInfoDoc } from './AccessorInfoDoc';
import { ContainerExportDoc } from './ContainerExportDoc';
import { MemberDoc } from './MemberDoc';

export class PropertyMemberDoc extends MemberDoc {
  name = this.symbol.name;
  anchor = encodeAnchor(this.name);
  id = `${this.containerDoc.id}.${this.name}`;
  aliases = this.containerDoc.aliases.map(alias => `${alias}.${this.name}` );
  getAccessor: AccessorInfoDoc | null;
  setAccessor: AccessorInfoDoc | null;

  constructor(
    containerDoc: ContainerExportDoc,
    symbol: Symbol,
    declaration: Declaration | null,
    getAccessorDeclaration: GetAccessorDeclaration | null,
    setAccessorDeclaration: SetAccessorDeclaration | null,
    isStatic: boolean,
  ) {
    super(containerDoc, symbol, (declaration || getAccessorDeclaration || setAccessorDeclaration)!, isStatic);

    // If this property has accessors then compute the type based on that instead
    this.getAccessor = getAccessorDeclaration && new AccessorInfoDoc('get', this, getAccessorDeclaration);
    this.setAccessor = setAccessorDeclaration && new AccessorInfoDoc('set', this, setAccessorDeclaration);
    this.type = this.type || this.setAccessor && this.setAccessor.parameterDocs[0].type || '';
    this.content = this.content || this.setAccessor && this.setAccessor.content || '';
  }
}
