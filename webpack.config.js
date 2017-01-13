const webpack = require('webpack');

module.exports = {
     entry: './assets/js/main.js',
     output: {
        path: './assets/js',
        filename: 'main.min.js'
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
