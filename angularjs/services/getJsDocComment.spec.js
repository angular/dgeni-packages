var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("getJsDocComment", function() {

  var getJsDocComment;

  beforeEach(function() {

    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    getJsDocComment = injector.get('getJsDocComment');

  });


  it("should return the leading comment, if it is JsDoc style", function() {
    expect(getJsDocComment({
      leadingComments: [
        {
          type: 'Block',
          value: '* some comment',
          loc: { start: { line: 12 }, end: { line: 15 } },
          range: [34, 45]
        }
      ]
    })).toEqual({
      content: 'some comment',
      startingLine: 12,
      endingLine: 15,
      range: [34, 45]
    });
  });

  it("should ignore comment if it is not JsDoc style", function() {
    expect(getJsDocComment({
      leadingComments: [
        {
          type: 'Block',
          value: 'some non-jsdoc comment',
          loc: { start: { line: 12 }, end: { line: 15 } },
          range: [34, 45]
        }
      ]
    })).toBeUndefined();
  });

  it("should only get the last of the leading comments", function() {
    expect(getJsDocComment({
      leadingComments: [
        {
          type: 'Block',
          value: '* some comment 1',
          loc: { start: { line: 12 }, end: { line: 15 } },
          range: [34, 45]
        },
        {
          type: 'Block',
          value: '* some comment 2',
          loc: { start: { line: 12 }, end: { line: 15 } },
          range: [34, 45]
        },
        {
          type: 'Block',
          value: '* some comment 3',
          loc: { start: { line: 12 }, end: { line: 15 } },
          range: [34, 45]
        }
      ]
    })).toEqual({
      content: 'some comment 3',
      startingLine: 12,
      endingLine: 15,
      range: [34, 45]
    });
  });

});