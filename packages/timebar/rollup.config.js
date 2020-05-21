import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import html from 'rollup-plugin-html'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import json from 'rollup-plugin-json'
import svgr from '@svgr/rollup'
import { terser } from 'rollup-plugin-terser'
import multiInput from 'rollup-plugin-multi-input'

import pkg from './package.json'

require('dotenv').config()

const distFolder = pkg.main.split('/')[0]

const isProduction = process.env.NODE_ENV === 'production'

export default [
  {
    input: ['./src/**/index.js'],
    output: {
      dir: distFolder,
      format: 'esm',
      sourcemap: !isProduction,
    },
    plugins: [
      json(),
      svgr(),
      html({ include: '**/*.html' }),
      external(),
      multiInput(),
      postcss({
        modules: true,
        plugins: [autoprefixer()],
      }),
      url(),
      babel({ exclude: /node_modules/ }),
      resolve(),
      commonjs({ include: /node_modules/ }),
      isProduction && terser(),
    ],
  },
]
