const webpack = require('webpack')

module.exports = function override (config, env) {
  //do stuff with the webpack config...

  config.resolve.fallback = {
    fs: false,
    path: false,
    tls: false,
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
    zlib: require.resolve('browserify-zlib'),
  }
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  )

  return config
}
