'use strict';

const fs = require('fs-extra')
const path = require("path");
const webpack = require("webpack");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function resolve(filePath) {
  return path.join(__dirname, filePath)
}

// Find out component's name from the parent directory name
// var componentName = path.parse(fs.readJsonSync('package.json').name).base;
const ignoreComponents = [
  "sample-component",
  "node_modules",
  "build"
];
const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
  fs.readdirSync(source).map(name =>
    path.join(source, name)
  ).filter(isDirectory);

let rootDir = process.cwd();
let componentsPathList = getDirectories(rootDir);
componentsPathList = componentsPathList.filter(folder => ignoreComponents.indexOf(path.parse(folder).base) < 0);
let componentsNameList = componentsPathList.map(folder => path.parse(folder).base);
let componentsCount = componentsNameList.length;
// let entryPaths = componentsPathList.map(name => path.join(name, "src", "index.js"));
let entryPaths = componentsPathList.reduce((map, componentPath) => {
  map[path.parse(componentPath).name] = path.join(componentPath, "src", "index.js");
  return map;
}, {});
let resolvePaths = componentsPathList.map(name => path.join(name, "node_modules"));

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
  entry: entryPaths,
  output: {
    filename: isProduction
      ? '[name].bundle.min.js'
      : '[name].bundle.js',
    path: resolve('build')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single'
  },
  resolve: {
    modules: resolvePaths
  },
  module: {
    rules: [
      {
        //  LOAD IN 3RD PARTY LIBRARIES TO GET THE GLOBAL VARIABLE THAT IT REGISTERS
        test: /p5\/lib\/p5\.min\.js$/,
        use: [
          "script-loader"
        ]
      },
      {
        //  LOAD IN 3RD PARTY LIBRARIES TO GET THE GLOBAL VARIABLE THAT IT REGISTERS
        test: /p5\/lib\/addons\/p5\.dom\.js$/,
        use: [
          "script-loader"
        ]
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
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
      new CleanWebpackPlugin(['build']),
      // new webpack.IgnorePlugin(/\@polymer\/polymer/),
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
      new CleanWebpackPlugin(['build']),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebookincubator/create-react-app/issues/240
      new CaseSensitivePathsPlugin(),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
      })
    ]
};
