import {sync as globSync} from 'glob';
import { difference } from 'lodash';

export interface SourcePattern {
  include: string;
  exclude?: string;
}

export function expandSourceFiles(sourceFiles: Array<SourcePattern|string>, basePath: string) {
  let filePaths: string[] = [];
  sourceFiles.forEach(sourcePattern => {
    if (isSourcePattern(sourcePattern)) {
      const include = globSync(sourcePattern.include, {cwd: basePath});
      const exclude = sourcePattern.exclude ? globSync(sourcePattern.exclude, {cwd: basePath}) : [];
      filePaths = filePaths.concat(difference(include, exclude));
    } else {
      filePaths = filePaths.concat(globSync(sourcePattern, {cwd: basePath}));
    }
  });
  return filePaths;
}

function isSourcePattern(pattern: any): pattern is SourcePattern {
  return !!pattern.include;
}
