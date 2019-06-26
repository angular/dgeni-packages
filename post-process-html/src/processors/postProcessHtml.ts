import { DocCollection, Processor } from 'dgeni';
import * as rehype from 'rehype';
import { VFile } from 'vfile';
import { ApiDoc } from '../api-doc-types/ApiDoc';

export function postProcessHtml(log: any, createDocMessage: any) {
  return new PostProcessHtml(log, createDocMessage);
}

/**
 * @dgProcessor postProcessHtml
 *
 * @description
 * Use the rehype processing engine to manipulate the
 * `renderedContent` HTML via rehype "plugins" that work with HTML ASTs (HASTs).
 * See https://github.com/rehypejs/rehype
 *
 * Each plugin is a factory function that will be called with the "rehype" engine as `this`.
 * The factory should return a "transform" function that takes a HAST and returns a `boolean` or `undefined`.
 * The HAST can be mutated by the "transform" function.
 * If `false` is returned then the processing stops with that plugin.
 *
 */
export class PostProcessHtml implements Processor {
  $runAfter = ['docs-rendered'];
  $runBefore = ['writing-files'];
  docTypes: string[] = [];
  plugins: any[] = [];

  constructor(private log: any, private createDocMessage: any) {}
  $process(docs: DocCollection) {
    const engine = rehype().data('settings', { fragment: true });
    this.plugins.forEach(plugin => engine.use(plugin));

    let vFile: VFile;

    docs
      .filter((doc: ApiDoc) => this.docTypes.indexOf(doc.docType) !== -1)
      .forEach((doc: ApiDoc) => {
        try {
          vFile = engine.processSync(doc.renderedContent);
          doc.renderedContent = vFile.contents.toString();
          vFile.messages.forEach((message: any) =>
            this.log.warn(this.createDocMessage(message.message, doc))
          );
          doc.vFile = vFile;
        } catch (e) {
          throw new Error(this.createDocMessage(e.message, doc));
        }
      });
  }
}
