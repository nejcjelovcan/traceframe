import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const previewAnnotations = [join(__dirname, 'dist', 'preview.js')]

export async function viteFinal(config) {
  const { traceframeFontsPlugin } = await import('./dist/index.js')
  config.plugins = config.plugins || []
  config.plugins.unshift(traceframeFontsPlugin())
  return config
}
