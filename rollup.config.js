import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { uglify } from 'rollup-plugin-uglify';

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['js', 'jsx'],
      preferBuiltins: false,
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }], '@babel/preset-react'],
    }),
    commonjs(),
    uglify(),
  ],
};
