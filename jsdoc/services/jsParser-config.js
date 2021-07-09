module.exports = function jsParserConfig() {
  return {

      // attach range information to each node
      range: true,

      // attach line/column location information to each node
      loc: true,

      // create a top-level comments array containing all comments
      comment: true,

      // create a top-level tokens array containing all tokens
      tokens: true,

      // Set to 3, 5 (default), 6, 7, 8, 9, 10, 11, or 12 to specify the version of ECMAScript syntax you want to use.
      // You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), 2019 (same as 10), 2020 (same as 11), or 2021 (same as 12) to use the year-based naming.
      ecmaVersion: 8,

      // specify which type of script you're parsing ("script" or "module")
      sourceType: "script",

      // specify additional language features
      ecmaFeatures: {

        // enable React JSX parsing
        jsx: true,

        // enable return in global scope
        globalReturn: true,

        // enable implied strict mode (if ecmaVersion >= 5)
        impliedStrict: false
      }
   };
};
