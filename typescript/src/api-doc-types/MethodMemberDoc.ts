/* tslint:disable:no-bitwise */
import { Declaration, SignatureDeclaration, Symbol, SymbolFlags } from 'typescript';
import { getTypeParametersText } from '../services/TsParser/getTypeParametersText';
import { encodeAnchor } from '../utils/encodeAnchor';
import { ContainerExportDoc } from './ContainerExportDoc';
import { MemberDoc } from './MemberDoc';
import { ModuleDoc } from './ModuleDoc';
import { getParameters, ParameterContainer } from './ParameterContainer';
import { ParameterDoc } from './ParameterDoc';

export class MethodMemberDoc extends MemberDoc implements ParameterContainer {
  readonly name = this.computeName();
  readonly parameterDocs = getParameters(this);
  readonly parameters = this.parameterDocs.map(p => p.paramText);
  readonly anchor = this.computeAnchor();
  readonly id = `${this.containerDoc.id}.${this.anchor}`;
  readonly aliases = this.computeAliases();
  readonly typeParameters = getTypeParametersText(this.declaration, this.namespacesToInclude);

  constructor(
    containerDoc: ContainerExportDoc,
    symbol: Symbol,
    declaration: Declaration,
    isStatic: boolean,
    public overloads: MethodMemberDoc[] = []) {
    super(containerDoc, symbol, declaration, isStatic);
    // fix up parameter ids and aliases, now that we have computed the id for this doc
    this.parameterDocs.forEach(param => {
      param.id = `${this.id}~${param.name}`;
      param.aliases = this.aliases.map(alias => `${alias}~${param.name}`);
    });
  }

  private computeName() {
    return this.symbol.name === '__new' ? 'new ' :
            this.symbol.name === '__constructor' ? 'constructor' :
            this.symbol.name === '__call' ? '' :
            this.symbol.name;
  }

  private computeAnchor() {
    // if the member is a "call" type then it has no name
    const anchorName = this.name.trim() || 'call';
    // if there is more than one declaration then we need to include the param list to distinguish them
    return encodeAnchor(this.symbol.getDeclarations()!.length === 1 ? anchorName : `${anchorName}(${this.parameters.join(', ')})`);
  }

  private computeAliases() {
    const aliases: string[] = [];
    this.containerDoc.aliases.forEach(alias => {
      aliases.push(`${alias}.${this.anchor}`);
    });
    return aliases;
  }
}
