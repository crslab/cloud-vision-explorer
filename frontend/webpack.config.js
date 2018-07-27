'use strict'

const webpack           = require('webpack')
const path              = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer      = require('autoprefixer')

module.exports = {
  devtool: 'inline-source-map',

  mode: 'development',

  entry: [
    path.resolve(__dirname, path.join('src', 'javascripts', 'main.js'))
  ],

  output: {
    path: path.resolve(__dirname, path.join('build', 'dev')),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: [ /node_modules/ , path.resolve(__dirname, path.join('src', 'javascripts', 'web_components'))],
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: [ /node_modules/ , path.resolve(__dirname, path.join('src', 'javascripts', 'web_components'))],
        use: [
          'eslint-loader'
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, path.join('node_modules', 'react-toolbox')),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true, // default is false
              sourceMap: true,
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, path.join('src', 'javascripts', 'components', 'RatingsHist')),
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.svg$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },


  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css'),
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    })
  ],

  resolve: {
    extensions: ['.js', '.scss', '.svg'],
    modules: ['src', 'node_modules']
  },

  devServer: {
    contentBase: path.join(__dirname, 'build', 'dev'),
    compress: true,
    hotOnly: true,
    open: true,
    stats: {
      colors: true
    },
    port: 3000
  }
}
