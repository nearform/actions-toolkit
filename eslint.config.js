'use strict'

const js = require('@eslint/js')
const globals = require('globals')
const prettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    }
  },
  prettierRecommended
]
