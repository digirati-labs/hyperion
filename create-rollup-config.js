import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import replace from 'rollup-plugin-replace';
import json from '@rollup/plugin-json';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

const isProduction = process.env.NODE_ENV === 'production';

export function createRollupConfig(globalName, pkg, external = []) {
  return [
    {
      input: 'src/index.ts',
      output: [
        {
          file: pkg.web,
          name: globalName,
          format: 'umd',
          sourcemap: true,
        },
      ],
      plugins: [
        typescript({ target: isProduction ? 'es5' : 'es2020' }),
        replace({
          'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        }),
        resolve({ browser: true }), // so Rollup can find `ms`
        commonjs({ extensions: ['.js', '.ts'] }), // the ".ts" extension is required
        json(),
        isProduction && terser(),
        isProduction && compiler(),
      ],
      external,
    },
    {
      input: 'src/index.ts',
      output: [
        {
          file: pkg.main,
          format: 'cjs',
          sourcemap: true,
        },
        {
          file: pkg.module,
          format: 'es',
          sourcemap: true,
        },
      ],
      external: ['crypto', ...external, ...Object.keys(pkg.dependencies)],
      plugins: [
        typescript(),
        replace({
          'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        }),
        resolve(), // so Rollup can find `ms`
        commonjs({ extensions: ['.js', '.ts'] }), // the ".ts" extension is required
        json(),
        isProduction && visualizer(),
      ],
    },
  ];
}
