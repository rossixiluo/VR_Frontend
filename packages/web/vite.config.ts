import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import macrosPlugin from "vite-plugin-babel-macros"

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  macrosPlugin(),
  nodePolyfills()
  ],
  optimizeDeps: {
    exclude: ['@ethersproject/hash', 'wrtc'],
    include: ['js-sha3', '@ethersproject/bignumber']
  }
})
