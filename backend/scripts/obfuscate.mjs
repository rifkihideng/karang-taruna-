import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import JavaScriptObfuscator from 'javascript-obfuscator';

// Bundle seluruh kode backend menjadi satu file, lalu obfuscate hasilnya.
// Package dari node_modules sengaja di-external agar tetap di-resolve oleh
// Node/Vercel dari backend/package.json (kode pihak ketiga sudah open source,
// yang diobfuscate adalah logika aplikasi milik sendiri).
const ENTRY = fileURLToPath(new URL('../src/vercel.js', import.meta.url));
const OUT_FILE = fileURLToPath(new URL('../dist/vercel.js', import.meta.url));

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
};

const bundled = await build({
  entryPoints: [ENTRY],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  packages: 'external',
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  write: false,
});

const code = bundled.outputFiles[0].text;
const obfuscated = JavaScriptObfuscator.obfuscate(code, obfuscationOptions).getObfuscatedCode();

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(OUT_FILE, obfuscated, 'utf8');

console.log(`✅ Backend ter-obfuscate: ${OUT_FILE} (${Buffer.byteLength(obfuscated)} bytes)`);
