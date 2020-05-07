import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
const getYarnWorkspaces = require('get-yarn-workspaces')

const isProduction = process.env.NODE_ENV === 'production'
const defaultConfig = {
  input: 'src/index.ts',
  tsconfig: './tsconfig.json',
}
const prepareConfig = (customConfig = {}) => {
  const config = {
    ...defaultConfig,
    ...customConfig,
  }
  return {
    input: config.input,
    output: {
      dir: 'dist/',
      format: 'es',
      sourcemap: true,
    },
    external: ['react', 'react-dom', ...getYarnWorkspaces()],
    plugins: [
      // Allow json resolution
      json(),
      // Compile TypeScript files
      typescript({
        sourceMap: true,
        tsconfig: config.tsconfig,
      }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs({ namedExports: { 'file-saver': ['saveAs'] } }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
      isProduction && terser(),
    ],
  }
}

export default prepareConfig
