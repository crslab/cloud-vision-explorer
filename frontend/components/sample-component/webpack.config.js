'use strict';

const fs = require('fs-extra')
const path = require("path");
const webpack = require("webpack");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

// Find out component's name from the parent directory name
var componentName = path.parse(fs.readJsonSync('package.json').name).base;

function resolve(filePath) {
  return path.join(__dirname, filePath)
}

var indexJs = resolve(path.join("src", "index.js"));

var isProduction = process.argv.indexOf("-p") >= 0;
if (isProduction) {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
} else {
  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';
}

console.log("Bundling for " + (
  isProduction
  ? "production"
  : "development") + "...");

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "source-map",
  entry: indexJs,
  output: {
    filename: isProduction
      ? componentName + '.min.js'
      : componentName + '.js',
    path: resolve('./build/')
  },
  resolve: {
    modules: [
      resolve("node_modules"),
      resolve("src")
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          resolve("node_modules")
        ],
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      }
    ]
  },
  plugins: isProduction
    ? [
      // Prod Plugins

      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': process.env.NODE_ENV
      }),
      // Minify, uglify, and optimize the resources for better bundle compression.
      // Minfy options can be found here: https://github.com/babel/minify/tree/master/packages/babel-preset-minify#options
      new MinifyPlugin({
        mangle: {
          keepFnName: false,
          keepClassName: false
        },
        deadcode: {
          keepFnName: false,
          keepClassName: false
        },
        builtIns: true,
        consecutiveAdds: true,
        evaluate: true,
        flipComparisons: true,
        guards: true,
        infinity: true,
        memberExpressions: true,
        mergeVars: true,
        numericLiterals: true,
        propertyLiterals: true,
        regexpConstructors: true,
        removeConsole: false,
        removeDebugger: false,
        removeUndefined: true,
        replace: true,
        simplify: true,
        simplifyComparisons: true,
        typeConstructors: true,
        undefinedToVoid: true
      }, {
        test: /\.js($|\?)/i,
        comments: /^\**!|@preserve|@license|@cc_on/,
        babel: require('babel-core'),
        minifyPreset: require('babel-preset-minify')
      }),
      // Generate a manifest file which contains a mapping of all asset filenames
      // to their corresponding output file so that tools can pick it up without
      // having to parse `index.html`.
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
      })
    ]
    : [
      // Dev Plugins

      // Add module names to factory functions so they appear in browser profiler.
      new webpack.NamedModulesPlugin(),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': process.env.NODE_ENV
      }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebookincubator/create-react-app/issues/240
      new CaseSensitivePathsPlugin()
    ]
};
