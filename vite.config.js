import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const dighumUrl = process.env.DIGHUM_URL;
const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      host: '0.0.0.0',
    //   open: true,
    //   proxy: {
    //     '/dighum': { // 获取请求中带 /api 的请求
    //       target: 'http://bb.com',  // 后台服务器的源
    //       secure: false,
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/dighum/, '/')
    //   }
    // }
  },
    plugins: [
      vue(),
    ],
      resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    __APP_ENV__: JSON.stringify(env.APP_ENV),
      'process.env': env
  }
}
})

