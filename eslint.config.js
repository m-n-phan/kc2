import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      '**/dist/**/*',
      '**/coverage/**/*',
      'reports/**/*',
      '**/*.config.js',
      '**/*.config.ts',
      '**/build/**/*',
      '**/*.tsbuildinfo'
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    env: {
      node: true,
      browser: true,
      es2020: true,
    },
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Core JavaScript rules
      ...js.configs.recommended.rules,
      
      // TypeScript rules  
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'ignoreRestSiblings': true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      
      // React rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Relaxed rules for development
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-unused-vars': 'off', // Handled by TypeScript ESLint
      
      // Testing exceptions
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
]; 