const stylelint = require('stylelint')

module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: {
    'postcss-import': {
      root: ctx.file.dirname,
      plugins: [stylelint()],
    },
    cssnano: ctx.env === 'production' ? {} : false,
    autoprefixer: {},
  },
})
