# docs package

This package contains templates and configuration to generate some basic API
documentation pages for the dgeni-packages project.

## Usage

Simply ensure that the npm dependencies have been installed:

```bash
npm install
```

and then run the docs script in package.json:

```bash
npm run docs
```

(behind the scenes this is running `dgeni ./docs`)

## Output

The output of running this package is a set of MarkDown files that
could be pushed to GitHub Pages.