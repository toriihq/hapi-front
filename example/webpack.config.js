const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: slsw.lib.entries,
  target: 'node',
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()]
}
