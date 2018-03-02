/* tslint:disable:no-bitwise */
import { Declaration, Symbol } from 'typescript';
import { getTypeParametersText } from '../services/TsParser/getTypeParametersText';
import { ContainerExportDoc } from './ContainerExportDoc';
import { MemberDoc } from './MemberDoc';
import { getParameters, ParameterContainer } from './ParameterContainer';
import { ParameterDoc } from './ParameterDoc';

export class MethodMemberDoc extends MemberDoc implements ParameterContainer {
  readonly name = this.computeName();
  readonly parameterDocs: ParameterDoc[] = getParameters(this);
  readonly parameters = this.parameterDocs.map(p => p.paramText);
  readonly anchor = this.computeAnchor();
  readonly id = `${this.containerDoc.id}.${this.anchor}`;
  readonly aliases = this.computeAliases();
  readonly typeParameters = getTypeParametersText(this.declaration);

  constructor(
    containerDoc: ContainerExportDoc,
    symbol: Symbol,
    declaration: Declaration,
    public overloads: MethodMemberDoc[] = []) {
    super(containerDoc, symbol, declaration);
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
    const overloadIndex = this.symbol.getDeclarations()!.indexOf(this.declaration);
    // if there is more than one declaration then we need to distinguish them
    return `${anchorName}${overloadIndex > 0 ? `_${overloadIndex}` : ''}()`;
  }

  private computeAliases() {
    const aliases: string[] = [];
    this.containerDoc.aliases.forEach(alias => {
      aliases.push(`${alias}.${this.anchor}`);
    });
    return aliases;
  }
}
