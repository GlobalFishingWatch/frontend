import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import external from 'rollup-plugin-peer-deps-external'
import camelCase from 'lodash/camelcase'

const isProduction = process.env.NODE_ENV === 'production'
const defaultConfig = {
  input: 'src/index.ts',
  libraryName: 'api-client',
  file: "dist/index.es5.js",
}
const prepareConfig = (customConfig) => {
  const config = {
    ...defaultConfig,
    ...customConfig
  }
  return {
    input: config.input,
    output: {
      dir: 'dist/',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      // Allow json resolution
      json(),
      // external modules you don't wanna include in your bundle taken from peerDependencies
      external(),
      // Compile TypeScript files
      typescript({
        sourceMap: true
      }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs({ namedExports: { 'file-saver': ['saveAs'] } }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
    ],
  }
}

export default prepareConfig
