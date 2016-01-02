const webpack = require('webpack')
module.exports = {
  entry: {
    app: [ './client.js' ]
  },
  output: {
    filename: 'bundle.js'
  },
  context: __dirname,
  node: {
    __filename: true
  },
  module: {
    loaders: [
      // use ES2015 on this app
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      // allow third-party glslify/browserify modules to work
      {
        test: /node_modules/,
        loader: 'ify'
      }
    ],
    // allow local glslify/browserify config to work
    postLoaders: [
      {
        test: /\.js$/,
        loader: 'ify'
      }
    ]
  }
}
