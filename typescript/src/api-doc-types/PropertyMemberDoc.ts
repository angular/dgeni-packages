import { Declaration, GetAccessorDeclaration, SetAccessorDeclaration, SignatureDeclaration, Symbol, SyntaxKind } from 'typescript';
import { getDeclarationTypeText } from "../services/TsParser/getDeclarationTypeText";
import { getParameters } from '../services/TsParser/getParameters';
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
    basePath: string,
    namespacesToInclude: string[],
    isStatic: boolean,
  ) {
    super(containerDoc, symbol, (declaration || getAccessorDeclaration || setAccessorDeclaration)!, basePath, namespacesToInclude, isStatic);

    // If this property has accessors then compute the type based on that instead
    this.getAccessor = getAccessorDeclaration && new AccessorInfoDoc('get', this, getAccessorDeclaration, basePath, namespacesToInclude);
    this.setAccessor = setAccessorDeclaration && new AccessorInfoDoc('set', this, setAccessorDeclaration, basePath, namespacesToInclude);
    this.type = this.type || this.setAccessor && this.setAccessor.parameters[0].split(/:\s?/)[1] || '';
    this.content = this.content || this.setAccessor && this.setAccessor.content || '';
  }
}
