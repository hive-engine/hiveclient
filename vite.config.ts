import inject from '@rollup/plugin-inject';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import packageJson from './package.json';

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
  } catch {
    throw new Error('Name property in package.json is missing.');
  }
};

const fileName = {
  cjs: `${getPackageName()}.cjs`,
  es: `${getPackageName()}.js`,
};

const formats = Object.keys(fileName) as (keyof typeof fileName)[];

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      fileName: (format) => fileName[format],
      formats,
      name: getPackageNameCamelCase(),
    },
    rollupOptions: {
      plugins: [inject({ modules: { Buffer: ['buffer/', 'Buffer'] } })],
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      rollupTypes: true,
      tsconfigPath: path.join(__dirname, 'tsconfig.json'),
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
});
