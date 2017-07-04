import { Declaration, Symbol } from "typescript";

/** Returns the symbol declarations or an empty array (see: #230) */
export function getDeclarations(symbol: Symbol): Declaration[] {
  return symbol.getDeclarations() || [];
}
