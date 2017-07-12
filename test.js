/*
 * Use this script to run the tests
 * We cannot use the Jasmine CLI directly because it doesn't seem to
 * understand the glob and only runs one spec file.
 *
 * Equally we cannot use a jasmine.json config file because it doesn't
 * allow us to set the projectBaseDir, which means that you have to run
 * jasmine CLI from this directory.
 *
 * Using a file like this gives us full control and keeps the package.json
 * file clean and simple.
 */

require('source-map-support').install();
const Jasmine = require('jasmine');
const jasmine = new Jasmine({ projectBaseDir: __dirname });
jasmine.loadConfig({ spec_files: ['!(node_modules)/**/*.spec.js'] });
jasmine.execute();