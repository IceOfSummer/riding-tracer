import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  resolve: {
    alias: {
      '~/*': './app/*',
      'antd-mobile': 'node_modules/antd-mobile/bundle/antd-mobile.es.js',
      'antd-mobile-style/*': 'node_modules/antd-mobile/*'
    }
  }
})
