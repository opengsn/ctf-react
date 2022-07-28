module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    mocha: true,
    node: true
  },
  globals: {
    artifacts: false,
    assert: false,
    contract: false,
    web3: false
  },
  extends:
    [
      'standard-with-typescript'
    ],
  // This is needed to add configuration to rules with type information
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // The 'tsconfig.packages.json' is needed to add not-compiled files to the project
    project: ['./tsconfig.json', './tsconfig.packages.json']
  },
  ignorePatterns: [
    'dist/'
  ]
}
