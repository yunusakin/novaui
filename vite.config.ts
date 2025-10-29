import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const envDirMap: Record<string, string> = {
  development: 'environments/dev',
  test: 'environments/test',
  preprod: 'environments/preprod',
  production: 'environments/prod',
}

export default defineConfig(({ mode }) => ({
  envDir: envDirMap[mode] ?? envDirMap.development,
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
}))
