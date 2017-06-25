/* tslint:disable:no-bitwise */
import { SymbolFlags } from 'typescript';
import { getParameters } from '../services/TsParser/getParameters';
import { getTypeParametersString } from '../services/TsParser/getTypeParametersString';
import { MemberDoc } from './MemberDoc';

export class MethodMemberDoc extends MemberDoc {
  parameters = getParameters(this.declaration);
  isConstructor = this.symbol.flags & SymbolFlags.Constructor;
  isCallMember = this.symbol.name === '__call';
  isNewMember = this.symbol.name === '__new';
  name = this.computeName();
  id = `${this.containerDoc.id}.${this.name}`;
  aliases = this.containerDoc.aliases.map(alias => `${alias}.${this.name}` );
  typeParameters = getTypeParametersString(this.declaration);

  private computeName() {
    return (this.symbol.name === '__new' ? 'new ' :
            this.symbol.name === '__call' ? '' :
            this.symbol.name) +
            this.parameters.join(', ');
  }
}
