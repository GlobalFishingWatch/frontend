import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import multiInput from 'rollup-plugin-multi-input'
import json from '@rollup/plugin-json'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import { terser } from 'rollup-plugin-terser'
import { getPackages } from '@lerna/project'

const isProduction = process.env.NODE_ENV === 'production'
const defaultConfig = {
  input: './src/**/index.ts',
  tsconfig: './tsconfig.json',
}
const prepareConfig = async (customConfig = {}) => {
  const config = {
    ...defaultConfig,
    ...customConfig,
  }
  const gfwPackages = await getPackages(__dirname).then((packages) =>
    packages.flatMap(({ name }) => {
      //support relative imports too
      return name.includes('globalfishingwatchapp') ? [] : [name, `${name}/**/*`]
    })
  )

  return {
    input: config.input,
    output: {
      dir: 'dist/',
      format: 'es',
      sourcemap: true,
    },
    external: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      '@reduxjs/toolkit',
      'countryflag',
      'lodash',
      'downshift',
      'luxon',
      ...gfwPackages,
      ...(customConfig.external || []),
    ],
    plugins: [
      // Allow json resolution
      json(),
      // Allow imports files as data-URIs or ES Modules
      url(),
      // Import svg as ReactComponents
      svgr(),
      // Supports multiple entry points
      multiInput(),
      // Compile TypeScript files
      config.tsconfig &&
        typescript({
          sourceMap: true,
          tsconfig: config.tsconfig,
          // rollupCommonJSResolveHack: true,
          // clean: isProduction,
        }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs({}),
      postcss({
        modules: true,
        plugins: [autoprefixer()],
      }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
      // Minify code only in production
      isProduction && terser(),
    ],
  }
}

export default prepareConfig
