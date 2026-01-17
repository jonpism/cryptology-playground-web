import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      include: ['crypto', 'buffer', 'stream', 'util'],
      globals: {
        Buffer: true, 
        global: true,
        process: true,
      },})
  ],
  base: '/cryptology-playground-web/', 
  build: {
    outDir: 'dist'
  }
})