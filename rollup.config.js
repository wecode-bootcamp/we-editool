import typescript from 'rollup-plugin-typescript2';
import analyze from 'rollup-plugin-analyzer';
import packageJSON from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJSON.main,
      format: 'cjs',
    },
  ],
  plugins: [
    typescript({ abortOnError: false, tsconfigOverride: { exclude: ['__tests__'] } }),
    analyze({
      // TODO: Add size_limit for CI
      onAnalysis: ({ bundleSize }) => {},
      summaryOnly: true,
    }),
  ],
  external: ['react', '@emotion/styled', 'react-icons'],
};
