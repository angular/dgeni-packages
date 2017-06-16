import { Node, Symbol, SymbolFlags, NodeFlags } from 'typescript';

export function getExportDocType(symbol: Symbol, log: any) {
  if(symbol.flags & SymbolFlags.Function) {
    return 'function';
  }
  if(symbol.flags & SymbolFlags.Class) {
    return 'class';
  }
  if(symbol.flags & SymbolFlags.Interface) {
    return 'interface';
  }
  if(symbol.flags & SymbolFlags.ConstEnum) {
    return 'enum';
  }
  if(symbol.flags & SymbolFlags.RegularEnum) {
    return 'enum';
  }
  if(symbol.flags & SymbolFlags.Property) {
    return 'module-property';
  }
  if(symbol.flags & SymbolFlags.TypeAlias) {
    return 'type-alias';
  }
  if(symbol.flags & SymbolFlags.FunctionScopedVariable) {
    return 'var';
  }
  if(symbol.flags & SymbolFlags.BlockScopedVariable) {
    return getBlockScopedVariableDocType(symbol);
  }
  if(symbol.flags & SymbolFlags.ValueModule) {
    return 'value-module';
  }

  log.warn('getExportDocType(): Unknown symbol type', {
    symbolName: symbol.name,
    symbolType: symbol.flags,
    file: symbol.getDeclarations()[0].getSourceFile().fileName
  });
  return 'unknown';
};

function getBlockScopedVariableDocType(symbol: Symbol) {
  let node: Node | undefined = symbol.valueDeclaration || symbol.getDeclarations()[0];
  while(node) {
    if ( node.flags & NodeFlags.Const) {
      return 'const';
    }
    node = node.parent;
  }
  return 'let';
}
