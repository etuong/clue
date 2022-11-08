const path = require("path");
const webpack = require("./webpack.common.config");

module.exports = {
  ...webpack,
  devtool: "inline-source-map",

  mode: "development",

  devServer: {
    host: "localhost",
    port: 3000,
    contentBase: path.resolve(__dirname, ""),
    historyApiFallback: true,
    proxy: {
      "/api/*": "http://localhost:8080",
    },
  },

  plugins: [...webpack.plugins],
};
