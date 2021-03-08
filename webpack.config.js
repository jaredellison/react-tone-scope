const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.join(__dirname, './src/app.js'),

  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: path.join(__dirname, './dist'),
    open: true,
    port: 8000
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|mp3)?$/i,
        use: 'file-loader'
      }
    ]
  },

  devtool: 'source-map',

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html')
    }),
    new MiniCssExtractPlugin()
  ]
};
