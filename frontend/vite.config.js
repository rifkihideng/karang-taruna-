import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import JavaScriptObfuscator from 'javascript-obfuscator'

// Opsi obfuscation untuk bundle produksi. Ini menyamarkan kode yang dikirim ke
// browser agar sulit dibaca/digunakan ulang (bukan enkripsi, hanya mempersulit).
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true,
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  splitStrings: true,
  splitStringsChunkLength: 8,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  stringArrayThreshold: 1,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
}

// Plugin Vite: obfuscate setiap chunk JS hasil build (hanya saat `vite build`).
function obfuscateBundle() {
  return {
    name: 'obfuscate-bundle',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName]
        if (chunk.type !== 'chunk') continue
        chunk.code = JavaScriptObfuscator.obfuscate(chunk.code, obfuscationOptions).getObfuscatedCode()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), obfuscateBundle()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
})
