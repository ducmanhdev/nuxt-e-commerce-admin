// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(eslintPluginPrettierRecommended).override('nuxt/typescript/rules', {
  rules: {
    '@typescript-eslint/unified-signatures': 'off'
  }
})
