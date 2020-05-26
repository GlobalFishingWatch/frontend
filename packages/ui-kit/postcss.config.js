module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: {
    'postcss-import': {
      root: ctx.file.dirname,
      plugins: [require('stylelint')],
    },
    'postcss-nested': {},
    'postcss-extend-rule': {},
    autoprefixer: {},
    cssnano: ctx.env === 'production' ? {} : false,
  },
})
