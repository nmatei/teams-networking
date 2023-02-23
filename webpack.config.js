const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
  const isProduction = !!env.WEBPACK_BUILD;
  return {
    mode: isProduction ? "production" : "development",
    entry: ["./src/index.js"],
    devtool: isProduction ? false : "inline-source-map",
    devServer: {
      static: ["dist", "src"],
      watchFiles: ["src/**/*.*"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ],
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/"
    }
  };
};
