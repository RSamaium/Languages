const webpack = require('webpack');

module.exports = {
     entry: './src/languages.js',
     node: {
      fs: "empty"
     },
     output: {
         path: './',
         filename: 'language.min.js',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
         }]
     },
      plugins: [
          new webpack.optimize.UglifyJsPlugin({
              compress: {
                  warnings: false,
              },
              output: {
                  comments: false,
              },
          }),
      ]
 }
