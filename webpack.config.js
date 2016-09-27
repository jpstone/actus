var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './src/index'
  ],
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: 'babel!eslint',
        include: `${__dirname}/src`,
        exclude: /node_modules$/
      },
      {
        test: /\.scss$/,
        loaders: 'style!css!sass',
        exclude: /node_modules$/,
        include: `${__dirname}/src`
      }
    ]
  }
};
