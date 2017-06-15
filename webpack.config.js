const Path = require('path');
const webpackConfig = require('@silverstripe/webpack-config');
const {
  resolveJS,
  externalJS,
  moduleJS,
  pluginJS,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = {
  MODULES: 'node_modules',
  THIRDPARTY: 'thirdparty',
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
};

const config = {
  name: 'js',
  entry: {
    main: `${PATHS.SRC}/js/index.js`,
  },
  output: {
    path: PATHS.DIST,
    filename: 'js/[name].js',
  },
  devtool: (ENV !== 'production') ? 'source-map' : '',
  resolve: resolveJS(ENV, PATHS),
  externals: externalJS(ENV, PATHS),
  module: moduleJS(ENV, PATHS),
  plugins: pluginJS(ENV, PATHS),
};

module.exports = config;
