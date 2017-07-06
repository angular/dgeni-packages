import { Node, NodeFlags, Symbol, SymbolFlags } from 'typescript';
import { getDeclarations } from './getDeclarations';


/* tslint:disable:no-bitwise */

export function getExportDocType(symbol: Symbol) {
  if (symbol.flags & SymbolFlags.Function) {
    return 'function';
  }
  if (symbol.flags & SymbolFlags.Class) {
    return 'class';
  }
  if (symbol.flags & SymbolFlags.Interface) {
    return 'interface';
  }
  if (symbol.flags & SymbolFlags.ConstEnum) {
    return 'enum';
  }
  if (symbol.flags & SymbolFlags.RegularEnum) {
    return 'enum';
  }
  if (symbol.flags & SymbolFlags.Property) {
    return 'module-property';
  }
  if (symbol.flags & SymbolFlags.TypeAlias) {
    return 'type-alias';
  }
  if (symbol.flags & SymbolFlags.FunctionScopedVariable) {
    return 'var';
  }
  if (symbol.flags & SymbolFlags.BlockScopedVariable) {
    return getBlockScopedVariableDocType(symbol);
  }
  if (symbol.flags & SymbolFlags.ValueModule) {
    return 'value-module';
  }

  throw new Error(`Unknown symbol type:
    symbolName: ${symbol.name}
    symbolType: ${symbol.flags}
    file: ${getDeclarations(symbol)[0].getSourceFile().fileName}`);
}

function getBlockScopedVariableDocType(symbol: Symbol) {
  let node: Node | undefined = symbol.valueDeclaration || getDeclarations(symbol)[0];
  while (node) {
    if ( node.flags & NodeFlags.Const) {
      return 'const';
    }
    node = node.parent;
  }
  return 'let';
}
