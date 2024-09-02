// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import typeScriptEslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...typeScriptEslint.configs.strictTypeChecked,
  ...typeScriptEslint.configs.stylisticTypeChecked,
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
    indent: 2,
    quotes: 'single',
    semi: true,
  }),
  perfectionist.configs['recommended-natural'],
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs'],
          defaultProject: 'tsconfig.json',
        },
        tsconfigDirName: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js'],
    ...typeScriptEslint.configs.disableTypeChecked,
  },
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
