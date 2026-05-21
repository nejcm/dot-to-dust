import path from 'node:path';
import { fileURLToPath } from 'node:url';

import antfu from '@antfu/eslint-config';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import i18nJsonPlugin from 'eslint-plugin-i18n-json';
import reactCompiler from 'eslint-plugin-react-compiler';
import testingLibrary from 'eslint-plugin-testing-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default antfu(
  {
    react: true,
    typescript: true,
    jsonc: false,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
    ignores: [
      'dist/*',
      'node_modules',
      '__tests__/',
      'coverage',
      '.expo',
      '.expo-shared',
      'android',
      'ios',
      'expo-env.d.ts',
      'uniwind-types.d.ts',
      '.docs',
      '.vscode',
      '.agents',
      '.claude',
      '.cursor',
      'plans',
      'pnpm-workspace.yaml',
    ],
  },

  {
    rules: {
      'antfu/if-newline': 'off',
      'style/arrow-parens': ['error', 'always'],
      'max-params': ['error', 4],
      'react/display-name': 'off',
      'react/no-inline-styles': 'off',
      'react/destructuring-assignment': 'off',
      'react/no-array-index-key': 'off',
      'react/require-default-props': 'off',
      'react-refresh/only-export-components': 'warn',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: [
            '/android',
            '/ios',
            'README.md',
            'AGENTS.md',
            'CLAUDE.md',
            'CONTRIBUTING.md',
            'LICENSE',
          ],
        },
      ],
      'node/prefer-global/process': 'off',
      'no-console': 'off',
      'no-cond-assign': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'max-lines-per-function': ['error', 250],
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'ts/no-require-imports': 'off',
      'ts/no-use-before-define': 'off',
      'ts/consistent-type-definitions': 'off',
      'ts/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react-hooks/refs': 'off',
      'ts/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: true,
        },
      ],
    },
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...betterTailwindcss.configs.recommended,
    settings: {
      'better-tailwindcss': {
        entryPoint: path.resolve(__dirname, './src/global.css'),
      },
    },
    rules: {
      ...betterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
      'better-tailwindcss/no-unknown-classes': 'warn',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    },
  },

  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },

  {
    files: ['src/translations/*.json'],
    plugins: { 'i18n-json': i18nJsonPlugin },
    processor: {
      meta: { name: '.json' },
      ...i18nJsonPlugin.processors['.json'],
    },
    rules: {
      ...i18nJsonPlugin.configs.recommended.rules,
      'i18n-json/valid-message-syntax': [
        2,
        {
          syntax: path.resolve(__dirname, './scripts/i18next-syntax-validation.js'),
        },
      ],
      'i18n-json/valid-json': 2,
      'i18n-json/sorted-keys': [2, { order: 'asc', indentSpaces: 2 }],
      'i18n-json/identical-keys': [2, { filePath: path.resolve(__dirname, './src/translations/en.json') }],
      'style/semi': 'off',
      'style/comma-dangle': 'off',
      'style/quotes': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },

  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: { 'testing-library': testingLibrary },
    rules: {
      ...testingLibrary.configs.react.rules,
    },
  },
);
