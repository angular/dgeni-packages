var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var _ = require('lodash');

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

  it("should remove the comment from the AST comments collection if the ast param is provided", function() {
    var comment1 = {
      type: 'Block',
      value: '* some comment',
      loc: { start: { line: 12 }, end: { line: 15 } },
      range: [34, 45]
    };
    var comment2 = {
      type: 'Block',
      value: '* some comment 2',
      loc: { start: { line: 12 }, end: { line: 15 } },
      range: [54, 60]
    };

    var AST = {
      comments: [ comment1, comment2 ]
    };

    getJsDocComment({
      leadingComments: [comment1]
    }, AST);

    expect(AST.comments.length).toEqual(1);
    expect(_.any(AST.comments, comment1)).toBe(false);
    expect(_.any(AST.comments, comment2)).toBe(true);
  });

});