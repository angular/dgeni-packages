const basePackage = require('./');
const mockPackage = require('./mocks/mockPackage');
const Dgeni = require('dgeni');
const path = require('canonical-path');

describe('base package', () => {

  function runDgeni(docs) {
    const testPackage = new Dgeni.Package('testPackage', [mockPackage()])
      .processor('provideTestDocs', function provideTestDocs() {
        return {
          $runBefore: ['computeIdsProcessor'],
          $process() {
            return docs;
          }
        };
      })

      .config(function(readFilesProcessor, writeFilesProcessor, renderDocsProcessor, unescapeCommentsProcessor) {
        readFilesProcessor.$enabled = false;
        writeFilesProcessor.$enabled = false;
        renderDocsProcessor.$enabled = false;
        unescapeCommentsProcessor.$enabled = false;
      })

      .config(function(computeIdsProcessor) {
        computeIdsProcessor.idTemplates.push({
          docTypes: ['service', 'guide'],
          getId(doc) {
            return doc.docType + ':' + doc.fileInfo.baseName;
          },
          getAliases(doc) {
            return [doc.fileInfo.baseName, doc.fileInfo.relativePath];
          }
        });
      })

      .config(function(computePathsProcessor) {
        computePathsProcessor.pathTemplates = [
          // Default path processor template
          {
            docTypes: ['service', 'guide'],
            getPath(doc) {
              let docPath = path.dirname(doc.fileInfo.relativePath);
              if ( doc.fileInfo.baseName !== 'index' ) {
                docPath = path.join(docPath, doc.fileInfo.baseName);
              }
              return docPath;
            },
            getOutputPath(doc) {
              return doc.path +
                  ( doc.fileInfo.baseName === 'index' ? '/index.html' : '.html');
            }
          }
        ];
      });

    return new Dgeni([testPackage]).generate();
  }

  it("should be instance of Package", () => {
      expect(basePackage instanceof Dgeni.Package).toBeTruthy();
  });


  describe("computeIdsProcessor", () => {

    it("should use provided id templates", done => {
      const doc1 = { docType: 'service', fileInfo: { relativePath: 'a/b/c/d.js', baseName: 'd' } };
      const doc2 = { docType: 'guide', fileInfo: { relativePath: 'x/y/z/index', baseName: 'index' } };


      runDgeni([doc1,doc2]).then(
        docs => {
          expect(doc1.id).toEqual('service:d');
          expect(doc1.aliases).toEqual(['d', 'a/b/c/d.js']);
          expect(doc2.id).toEqual('guide:index');
          expect(doc2.aliases).toEqual(['index', 'x/y/z/index']);
          done();
        },
        err => console.log('Failed: ', err));
    });

  });


  describe("computePathsProcessor", () => {

    it("should use provided path templates", done => {
      const doc1 = { docType: 'service', fileInfo: { relativePath: 'a/b/c/d.js', baseName: 'd' } };
      const doc2 = { docType: 'guide', fileInfo: { relativePath: 'x/y/z/index', baseName: 'index' } };


      runDgeni([doc1,doc2]).then(
        docs => {
          expect(doc1.path).toEqual('a/b/c/d');
          expect(doc1.outputPath).toEqual('a/b/c/d.html');
          expect(doc2.path).toEqual('x/y/z');
          expect(doc2.outputPath).toEqual('x/y/z/index.html');
          done();
        },
        err => console.log('Failed: ', err));
    });

  });


});