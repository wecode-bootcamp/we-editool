import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import packageJSON from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJSON.main,
      format: 'cjs',
    },
  ],
  plugins: [typescript({ abortOnError: false }), resolve()],
  external: ['react', '@emotion/styled', 'react-icons'],
};
