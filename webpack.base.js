/* eslint no-console:"off" */
const {resolve} = require('path')
const deepmerge = require('deepmerge')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackValidator = require('webpack-validator')
const {getIfUtils, removeEmpty} = require('webpack-config-utils')
const OfflinePlugin = require('offline-plugin')

const defaultSettings = {
  context: 'src',
  output: {
    path: 'dist',
    publicPath: '/'
  },
  plugins: {
    HtmlWebpackPlugin: {
      template: './index.html',
      inject: 'body'
    },
    DefinePlugin: {}
  }
}

module.exports = (settings = {}) => env => {
  const setup = deepmerge(defaultSettings, settings)
  const {ifProd, ifNotProd} = getIfUtils(env)
  const config = {
    bail: true,
    context: resolve(setup.context),
    entry: ifProd(
      setup.entry,
      [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        setup.entry.app
      ]
    ),
    output: {
      filename: ifProd('bundle.[name].[chunkhash].js', 'bundle.[name].js'),
      path: resolve(setup.output.path),
      publicPath: ifNotProd('/', setup.output.publicPath)
    },
    devtool: ifProd('source-map', 'eval'),
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: require('./babelrc')
        },
        ifProd(
          {
            test: /\.s?css$/,
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader'
            })
          },
          { test: /\.s?css$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] }
        ),
        { test: /\.svg$/, loader: 'svg-inline-loader' }
      ],
    },

    plugins: removeEmpty([
      ifNotProd(new webpack.HotModuleReplacementPlugin()),
      new ProgressBarPlugin(),
      new ExtractTextPlugin(ifProd('styles.[name].[chunkhash].css', 'styles.[name].css')),
      ifProd(new InlineManifestWebpackPlugin()),
      ifProd(new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
      })),
      new HtmlWebpackPlugin(setup.plugins.HtmlWebpackPlugin),
      ifProd(new OfflinePlugin()),
      new webpack.DefinePlugin(Object.assign({},{
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }, setup.plugins.DefinePlugin)),
    ]),
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    }
  }

  return config
}


