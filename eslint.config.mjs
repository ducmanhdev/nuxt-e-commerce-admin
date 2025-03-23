import path from 'node:path'
import { fileURLToPath } from 'node:url'

import antfu from '@antfu/eslint-config'
import { includeIgnoreFile } from '@eslint/compat'
import { globalIgnores } from 'eslint/config'
import withNuxt from './.nuxt/eslint.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default withNuxt(
  includeIgnoreFile(gitignorePath),
  globalIgnores([
    'prisma/migrations/*',
  ]),
  antfu({
    formatters: true,
    stylistic: {
      'indent': 2,
      'quotes': 'single',
      'semi': false,
      'no-extra-semi': true,
      'comma-dangle': 'always-multiline',
    },
    rules: {
      'vue/singleline-html-element-content-newline': 'off',
      'antfu/top-level-function': 'off',
      'antfu/if-newline': 'off',
      'node/prefer-global/process': 'off',
      'no-restricted-globals': 'off',
    },
  }),
)
