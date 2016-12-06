module.exports = {
  entry: [__dirname + '/src/app.js'],
  output: {
    filename: __dirname + '/bundle.js'
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    },
    {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }
    ]
  }
}