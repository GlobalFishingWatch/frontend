module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    "@typescript-eslint/explicit-member-accessibility": 0
  }
}
