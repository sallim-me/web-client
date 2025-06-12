const path = require("path");
const { version } = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env.REACT_APP_VERSION': JSON.stringify(version),
        })
      );

      // Add HtmlWebpackPlugin with version injection
      webpackConfig.plugins = webpackConfig.plugins.map((plugin) => {
        if (plugin instanceof HtmlWebpackPlugin) {
          plugin.userOptions.version = version;
        }
        return plugin;
      });

      return webpackConfig;
    },
  },
};
