module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  settings: {
    'import/extensions': ['.ts', '.tsx'],
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
        moduleDirectory: ['src', 'node_modules'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',

    'import/order': [
      'error',

      {
        groups: [
          // node.jsの組み込みモジュール
          'builtin',
          // 外部ライブラリ
          'external',
          // 親ディレクトリ
          'parent',
          // 兄弟ディレトリ
          'sibling',
          // 同ディレクトリ
          'index',
          // オブジェクト
          'object',
          // 型
          'type',
        ],
        // pathを基準に任意の場所に配置
        pathGroups: [
          {
            // パス
            pattern: '{react,react-dom/**,react-router-dom}',
            // 位置の基準となるグループ
            group: 'builtin',
            // グループより前か後か
            position: 'before',
          },
          {
            pattern: '**/*.css',
            group: 'type',
            position: 'after',
          },
          {
            pattern: '@fortawesome/**',
            group: 'index',
            position: 'before',
          },
          {
            pattern: '@/components/**',
            group: 'index',
            position: 'before',
          },
          {
            pattern: '@slack/webhook',
            group: 'index',
            position: 'before',
          },
          {
            pattern: '@/{types,utils}/**',
            group: 'index',
            position: 'before',
          },
        ],
        // builtinを構成オプションの並び替え順序に影響させる
        pathGroupsExcludedImportTypes: ['builtin'],
        // アルファベット順
        alphabetize: {
          order: 'asc',
        },
        // グループごとに改行
        'newlines-between': 'always',
      },
    ],
  },
};
