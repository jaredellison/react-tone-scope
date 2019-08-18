const isTest = String(process.env.NODE_ENV) === 'test'

module.exports = {
  presets: [['@babel/env', {modules: isTest ? 'commonjs' : false}], '@babel/react'],
  plugins: [
    'syntax-dynamic-import',
    isTest ? 'dynamic-import-node' : null,
  ].filter(Boolean),
}