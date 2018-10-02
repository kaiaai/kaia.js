import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/kaia.ts',
  plugins: [typescript()],
  output: [{
    file: 'dist/kaia-iife.js',
    format: 'iife',
    name: 'idbKeyval'
  }, {
    file: 'dist/kaia-cjs.js',
    format: 'cjs'
  }, {
    file: 'dist/kaia.mjs',
    format: 'es'
  }, {
    file: 'dist/kaia-amd.js',
    format: 'amd',
  }]
};
