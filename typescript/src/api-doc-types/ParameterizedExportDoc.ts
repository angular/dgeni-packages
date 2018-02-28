import { Declaration, Symbol } from 'typescript';
import { getTypeParametersText } from '../services/TsParser/getTypeParametersText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';

export abstract class ParameterizedExportDoc extends ExportDoc {
  typeParameters = getTypeParametersText(this.declaration);

  constructor(moduleDoc: ModuleDoc,
              symbol: Symbol,
              declaration: Declaration,
              aliasSymbol?: Symbol) {

    super(moduleDoc, symbol, declaration, aliasSymbol);
  }
}
