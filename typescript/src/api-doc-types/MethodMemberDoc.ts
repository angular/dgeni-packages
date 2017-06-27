/* tslint:disable:no-bitwise */
import { SymbolFlags } from 'typescript';
import { getParameters } from '../services/TsParser/getParameters';
import { getTypeParametersText } from '../services/TsParser/getTypeParametersText';
import { MemberDoc } from './MemberDoc';

export class MethodMemberDoc extends MemberDoc {
  readonly parameters = getParameters(this.declaration);
  readonly name = this.computeName();
  readonly anchor = this.computeAnchor();
  readonly id = `${this.containerDoc.id}.${this.anchor})`;
  readonly aliases = this.computeAliases();
  readonly typeParameters = getTypeParametersText(this.declaration);

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
    return encodeURI(this.symbol.getDeclarations().length === 1 ? anchorName : `${anchorName}(${this.parameters.join(', ')})`);
  }

  private computeAliases() {
    const aliases: string[] = [];
    this.containerDoc.aliases.forEach(alias => {
      aliases.push(`${alias}.${this.anchor}`);
    });
    return aliases;
  }
}
