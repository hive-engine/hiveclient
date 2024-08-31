import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';
// import inject from '@rollup/plugin-inject';
import packageJson from './package.json';

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, char => char[1].toUpperCase());
  }
  catch {
    throw new Error('Name property in package.json is missing.');
  }
};

const fileName = {
  es: `${getPackageName()}.js`,
  cjs: `${getPackageName()}.cjs`,
};

const formats = Object.keys(fileName) as (keyof typeof fileName)[];

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.json'),
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: getPackageNameCamelCase(),
      formats,

      fileName: format => fileName[format],
    },
    // rollupOptions: {
    //   plugins: [inject({ modules: { Buffer: ['buffer/', 'Buffer'] } })],
    // },
  },
});
