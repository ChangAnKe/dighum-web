import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const dighumUrl = process.env.DIGHUM_URL;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      host: '0.0.0.0',
      proxy: {
        [process.env.DIGHUM_BASE_API]: { // 获取请求中带 /api 的请求
          target: dighumUrl,  // 后台服务器的源
          changeOrigin: true
        }
      }
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

