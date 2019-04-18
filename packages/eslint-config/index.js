module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],
  plugins: ['react'],
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'error',
    'react/require-default-props': 'error',
  },
}
