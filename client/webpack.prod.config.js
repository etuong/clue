const webpack = require('./webpack.common.config');

module.exports = {
  ...webpack,

  mode: 'production',

  plugins: [
    ...webpack.plugins,
  ]
};