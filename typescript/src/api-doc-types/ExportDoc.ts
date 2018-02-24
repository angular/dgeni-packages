import { BaseApiDoc } from './ApiDoc';

/**
 * An export document is an abstraction somewhere between a TypeScript symbol and a declaration
 * depending upon the underlying type.
 *
 * Exported functions can be overloaded and so have one doc per declaration
 * Exported interfaces can have multiple declarations, they would be merged together
 */
export abstract class ExportDoc extends BaseApiDoc {}
