import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base:'./' is mandatory — the SCORM package is served from an arbitrary LMS path,
// so every asset URL must be relative. It also lets dist/index.html open standalone.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // keep assets as files so the SCORM manifest can list them
  },
})
