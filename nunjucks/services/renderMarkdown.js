const marked = require('marked');

/**
 * @dgService renderMarkdown
 * @description
 * Render the markdown in the given string as HTML.
 */
module.exports = function renderMarkdown(trimIndentation) {

  const renderer = new marked.Renderer();

  // Remove the leading whitespace from the code block before it gets to the
  // markdown code render function
  renderer.code = (code, string, language) => {

    const trimmedCode = trimIndentation(code);
    let renderedCode = marked.Renderer.prototype.code.call(renderer, trimmedCode, string, language);

    // Bug in marked - forgets to add a final newline sometimes
    if ( !/\n$/.test(renderedCode) ) {
      renderedCode += '\n';
    }

    return renderedCode;
  };

  return content => marked(content, { renderer: renderer });
};