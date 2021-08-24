module.exports = function() {
  return {
    name: 'link',
    process(url, title, doc) {
      return `{@link ${url} ${title || ''} }`;
    }
  };
};
