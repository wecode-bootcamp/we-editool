import typescript from 'rollup-plugin-typescript2';
import analyze from 'rollup-plugin-analyzer';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import packageJSON from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJSON.main,
      format: 'cjs',
    },
    {
      file: packageJSON.module,
      format: 'esm',
    },
  ],
  plugins: [
    typescript(),
    analyze({
      // TODO: Add size_limit for CI
      onAnalysis: ({ bundleSize }) => {},
      summaryOnly: true,
    }),
    nodeResolve(),
    commonjs(),
    peerDepsExternal(),
  ],
};
