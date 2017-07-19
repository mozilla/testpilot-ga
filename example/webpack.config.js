const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    background_scripts: "./background_scripts/background.js",
    popup: "./popup/example.js"
  },
  output: {
    path: path.resolve(__dirname, "addon"),
    filename: "[name]/index.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
