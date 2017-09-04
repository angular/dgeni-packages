import { encodeAnchor } from '../utils/encodeAnchor';
import { MemberDoc } from './MemberDoc';

export class PropertyMemberDoc extends MemberDoc {
  name = this.symbol.name;
  anchor = encodeAnchor(this.name);
  id = `${this.containerDoc.id}.${this.name}`;
  aliases = this.containerDoc.aliases.map(alias => `${alias}.${this.name}` );
}
