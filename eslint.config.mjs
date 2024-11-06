// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(),
  {
    rules: {
      'no-console': 'off',
      'antfu/top-level-function': 'off',
      'node/prefer-global/process': 'off',
      'no-restricted-globals': 'off',
    },
  },
)
