const path = require('path');
const webpack = require('webpack');


const config = {
  entry: [
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './docs',
    hot: true
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.plugins = [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
  return config;
};
