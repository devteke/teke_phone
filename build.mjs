import { build, context } from 'esbuild'

const watch = process.argv.includes('--watch')

/** @type {import('esbuild').BuildOptions} */
const shared = {
  bundle: true,
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  format: 'cjs',
  logLevel: 'info',
}

const targets = [
  {
    ...shared,
    platform: 'node',          // FiveM server = Node 22 runtime
    target: ['node22'],
    entryPoints: ['src/server/index.ts'],
    outfile: 'dist/server.js',
  },
  {
    ...shared,
    platform: 'browser',       // FiveM client = tarayici benzeri V8 (Node builtin yok)
    target: ['es2021'],
    // 'neutral' yerine 'browser': paketlerin main/module alanlarini cozer -> fast-printf hatasi biter
    mainFields: ['browser', 'module', 'main'],
    entryPoints: ['src/client/index.ts'],
    outfile: 'dist/client.js',
  },
]

if (watch) {
  const ctxs = await Promise.all(targets.map((t) => context(t)))
  await Promise.all(ctxs.map((c) => c.watch()))
  console.log('[teke_phone] izleniyor...')
} else {
  await Promise.all(targets.map((t) => build(t)))
  console.log('[teke_phone] derleme tamamlandı')
}