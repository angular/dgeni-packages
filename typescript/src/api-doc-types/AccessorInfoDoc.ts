import { Declaration } from 'typescript';
import { MethodMemberDoc } from './MethodMemberDoc';
import { PropertyMemberDoc } from './PropertyMemberDoc';

/**
 * This represents a getter or setter overload of an accessor property.
 * There will be a PropertyMemberDoc that contains these docs.
 */
export class AccessorInfoDoc extends MethodMemberDoc {
  docType = `${this.accessorType}-accessor-info`;
  name = `${this.propertyDoc.name}:${this.accessorType}`;
  id = `${this.propertyDoc.id}:${this.accessorType}`;
  aliases = this.propertyDoc.aliases.map(alias => `${alias}:${this.accessorType}`);
  anchor = this.name;

  constructor(public accessorType: 'get'|'set', public propertyDoc: PropertyMemberDoc, declaration: Declaration) {
    super(propertyDoc.containerDoc, propertyDoc.symbol, declaration);
  }
}
