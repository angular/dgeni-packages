module.exports = function basePathFactory(config) {
  return config.get('basePath', process.cwd());
};