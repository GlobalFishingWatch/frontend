import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import { getPackages } from '@lerna/project'

const isProduction = process.env.NODE_ENV === 'production'
const defaultConfig = {
  input: 'src/index.ts',
  tsconfig: './tsconfig.json',
}
const prepareConfig = async (customConfig = {}) => {
  const config = {
    ...defaultConfig,
    ...customConfig,
  }
  const gfwPackages = await getPackages(__dirname)

  return {
    input: config.input,
    output: {
      dir: 'dist/',
      format: 'es',
      sourcemap: true,
    },
    external: ['react', 'react-dom', ...gfwPackages.map(({ name }) => name)],
    plugins: [
      // Allow json resolution
      json(),
      // Compile TypeScript files
      typescript({
        sourceMap: true,
        tsconfig: config.tsconfig,
      }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs({
        namedExports: {
          'file-saver': ['saveAs'],
        },
      }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
      isProduction && terser(),
    ],
  }
}

export default prepareConfig
