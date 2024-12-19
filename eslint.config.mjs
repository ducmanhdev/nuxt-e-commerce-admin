// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(eslintPluginPrettierRecommended).override('nuxt/javascript', {
  rules: {
    '@typescript-eslint/unified-signatures': 'warn',
  },
})
