import { Declaration, GetAccessorDeclaration, SetAccessorDeclaration, Symbol } from 'typescript';
import { AccessorInfoDoc } from './AccessorInfoDoc';
import { ContainerExportDoc } from './ContainerExportDoc';
import { MemberDoc } from './MemberDoc';

export class PropertyMemberDoc extends MemberDoc {
  name = this.symbol.name;
  anchor = this.name;
  id = `${this.containerDoc.id}.${this.name}`;
  aliases = this.containerDoc.aliases.map(alias => `${alias}.${this.name}` );
  getAccessor: AccessorInfoDoc | null;
  setAccessor: AccessorInfoDoc | null;

  constructor(containerDoc: ContainerExportDoc,
              symbol: Symbol,
              declaration: Declaration | null,
              getAccessorDeclaration: GetAccessorDeclaration | null,
              setAccessorDeclaration: SetAccessorDeclaration | null) {

    // For accessors, the declaration parameter will be null, and therefore the getter declaration
    // will be used for most of the things (e.g. determination of the type). If the getter doesn't
    // have a type or description, the setter will be checked manually later in this constructor.
    super(containerDoc, symbol, (declaration || getAccessorDeclaration || setAccessorDeclaration)!);

    // If this property has accessors then compute the type based on that instead
    this.getAccessor = getAccessorDeclaration && new AccessorInfoDoc('get', this, getAccessorDeclaration);
    this.setAccessor = setAccessorDeclaration && new AccessorInfoDoc('set', this, setAccessorDeclaration);

    // As mentioned before, by default the get accessor declaration will be passed to the superclass,
    // to determine information about the property. With that approach, it can happen that a few
    // things are not declared on the getter, but on the setter. In that case, if there is a
    // setter, we add the missing information by looking at the setter info document.
    if (this.setAccessor) {
      this.type = this.type || this.setAccessor.parameterDocs[0].type || '';
      this.content = this.content || this.setAccessor.content || '';
      this.decorators = this.decorators || this.setAccessor.decorators;
    }
  }
}
