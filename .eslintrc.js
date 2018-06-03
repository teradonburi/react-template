module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'browser': true, // ブラウザ
    'es6': true, // ES6
    'node': true, // NodeJS
  },
  // reactプラグイン
  'extends': ['eslint:recommended', 'plugin:react/recommended'],
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true // JSX文法有効
    },
    'sourceType': 'module'
  },
  // reactプラグイン使用
  'plugins': [
    'react'
  ],
  'globals': {
  },
  'rules': {
    // インデントルール
    'indent': 'off',
    'indent-legacy': [
      'error',
      2,
      { 'SwitchCase': 1 }
    ],
    // 改行コード
    'linebreak-style': [
      'error',
      'unix'
    ],
    // シングルクォートチェック
    'quotes': [
      'error',
      'single'
    ],
    // 末尾セミコロンチェック
    'semi': [
      'error',
      'never'
    ],
    // マルチライン末尾コンマ必須
    'comma-dangle': [
      'error',
      'always-multiline'
    ],
    // 末尾スペースチェック
    'no-trailing-spaces': [
      'error'
    ],
    // 単語間スペースチェック
    'keyword-spacing': [
      'error',
      { 'before': true, 'after': true }
    ],
    // オブジェクトコロンのスペースチェック
    'key-spacing': [
      'error',
      { 'mode': 'minimum' }
    ],
    // コンマ後スペースチェック
    'comma-spacing': [
      'error',
      { 'before': false, 'after': true }
    ],
    // ブロック前スペースチェック
    'space-before-blocks': [
      'error'
    ],
    // アロー関数スペースチェック
    'arrow-spacing': [
      'error',
      { "before": true, "after": true }
    ],
    // 括弧内のスペースチェック
    'space-in-parens': [
      'error',
      'never'
    ],
    // オブジェクトのdot記法強制
    'dot-notation': [
      'error'
    ],
    // ブロックを不要に改行しない
    'brace-style': [
      'error',
      '1tbs'
    ],
    // elseでreturnさせない
    'no-else-return': [
      'error'
    ],
    // 未使用変数チェック
    'no-unused-vars': [
      'warn',
      { 'ignoreRestSiblings': true }
    ],
    'no-console': 'off',
    'no-useless-escape': 'off',
    // reactのprop-typesチェックをしない
    'react/prop-types': 'off',
    // reactのコンポーネント名チェックをしない
    'react/display-name': 'off',
    // Stateless Functional Componentをpure functionで書かせる
    'react/prefer-stateless-function': [
      2,
      { 'ignorePureComponents': true },
    ],
    // string形式refsの禁止
    'react/no-string-refs': 'on', 
  }
}