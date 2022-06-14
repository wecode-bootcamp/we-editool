import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import externals from 'rollup-plugin-node-externals';
import analyze from 'rollup-plugin-analyzer';
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
    peerDepsExternal(),
    externals(),
    analyze({
      // TODO: Add size_limit for CI
      onAnalysis: ({ bundleSize }) => {},
      summaryOnly: true,
    }),
  ],
};
