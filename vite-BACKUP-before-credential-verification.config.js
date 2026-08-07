import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        assessment: resolve(__dirname, 'assessment.html'),
        admin: resolve(__dirname, 'admin.html'),
        mission: resolve(__dirname, 'mission.html')
      }
    }
  }
})
