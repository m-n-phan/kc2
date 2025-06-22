import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    // Ignore compiled output and other generated files in all workspaces
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/reports/**',
      '**/build/**',
      'node_modules/**',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.tsbuildinfo'
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.es2020,
        ...globals.node,
        ...globals.browser,
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
