import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
        globals: {
            ...globals.browser,
        },
        parser: tseslint.parser,
        parserOptions: {
            projectService: true,
            ecmaFeatures: {
                jsx: true
            }
        },
    },
  },
  {
    rules: {
      // Базовые
      'curly': 'error',
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unreachable': 'error',
      'no-console': [
        "error",
        {
            "allow": [
                "warn",
                "error"
            ]
        }
      ],

      // Чистота кода
      'no-unreachable': 'error',
      'no-else-return': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': 'error',
      'no-unneeded-ternary': 'error',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/prefer-optional-chain': 'error',

      // Безопасность
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'require-await': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      'tools/**',
      'package-lock.json',
      '.yarn/**',
      '.prettierrc.cjs',
       'eslint.config.mjs',
    ],
  },
];
