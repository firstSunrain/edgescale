var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var _abs = '"'+ process.env.npm_config_env_abs +'"'

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  NODE_ABS: _abs
})
