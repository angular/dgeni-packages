import { FileInfo } from './FileInfo';

export interface ApiDoc {
  docType: string;
  name: string;
  id: string;
  aliases: string[];
  fileInfo: FileInfo;
  location: Location;
  content: string;
}