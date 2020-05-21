module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: {
    'postcss-import': {
      root: ctx.file.dirname,
      plugins: [require('stylelint'), require('postcss-modules')],
    },
    cssnano: ctx.env === 'production' ? {} : false,
    autoprefixer: {},
  },
})
