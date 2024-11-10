// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(),
  {
    rules: {
      'antfu/top-level-function': 'off',
      'node/prefer-global/process': 'off',
      'no-restricted-globals': 'off',
      'no-console': 'off',
      'object-shorthand': 'off',
      'ts/consistent-type-definitions': 'off',
      'ts/no-use-before-define': 'warn',
    },
  },
)
