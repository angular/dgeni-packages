import { getLineAndCharacterOfPosition, LineAndCharacter, Node } from 'typescript';

export class Location {
  start: LineAndCharacter;
  end: LineAndCharacter;

  constructor(declaration: Node) {
    const sourceFile = declaration.getSourceFile();
    this.start = getLineAndCharacterOfPosition(sourceFile, declaration.pos);
    this.end = getLineAndCharacterOfPosition(sourceFile, declaration.end);
    }
  }
