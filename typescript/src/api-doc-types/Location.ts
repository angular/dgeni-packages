import { LineAndCharacter } from 'typescript';

export interface Location {
  start: LineAndCharacter;
  end: LineAndCharacter;
}