import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Fichiers de test : describe, test, expect, jest... sont fournis par Jest
  {
    files: ['**/*.test.{js,jsx}', 'jest.setup.js'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
  // Fichiers de configuration en CommonJS (module.exports)
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },
])
