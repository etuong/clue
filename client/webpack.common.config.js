const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, ""),

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".png", ".jpg"],
  },

  entry: {
    main: "./index.tsx",
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [path.resolve(__dirname, "../node_modules")],
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: [path.resolve(__dirname, "../node_modules")],
      },
      {
        test: [/\.scss$/, /\.css$/],
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Clueless",
    }),
  ],
};
