const path = require('path')

/**
 * @typedef {Object} PlayroomPresetOptions
 * @property {string} [components] - Path to consumer's component file (re-exports ui-library + own components)
 * @property {string} [snippets] - Path to consumer's snippet file (merges preset + own snippets)
 * @property {string} [frameComponent] - Path to consumer's frame component file (wraps or replaces preset's frame component)
 * @property {string} [outputPath] - Override output path (default: './dist/playroom')
 * @property {string} [baseUrl] - Override base URL (default: '/')
 * @property {string} [title] - Override Playroom title
 * @property {number} [port] - Override port (default: 9000)
 * @property {number[]} [widths] - Override viewport widths
 * @property {string[]} [typeScriptFiles] - Additional TypeScript file patterns for autocomplete
 * @property {string} [iframeSandbox] - Override iframe sandbox
 */

const distDir = path.join(__dirname, 'dist')

/**
 * Create a Playroom configuration with Traceframe theme support.
 *
 * @param {PlayroomPresetOptions} [options]
 * @returns {object} Playroom configuration object
 */
function createPlayroomConfig(options) {
  options = options || {}

  // Resolve ui-library dist path via styles.css (has default export condition, works with require.resolve)
  const uiLibraryDist = path.dirname(
    require.resolve('@nejcjelovcan/traceframe-ui-library/styles.css')
  )

  return {
    components: options.components || path.join(distDir, 'components.js'),
    frameComponent: options.frameComponent || path.join(distDir, 'frame-component.js'),
    themes: path.join(distDir, 'themes.js'),
    snippets: options.snippets || path.join(distDir, 'snippets', 'index.js'),
    outputPath: options.outputPath || './dist/playroom',
    baseUrl: options.baseUrl || '/',
    title: options.title || 'Playroom',
    widths: options.widths || [320, 768, 1024, 1440],
    port: options.port || 9000,
    iframeSandbox: options.iframeSandbox || 'allow-scripts allow-same-origin',
    typeScriptFiles: [path.join(uiLibraryDist, '**/*.d.ts'), ...(options.typeScriptFiles || [])],
    webpackConfig: function () {
      return {
        resolve: {
          extensions: ['.tsx', '.ts', '.jsx', '.js'],
          extensionAlias: { '.js': ['.ts', '.tsx', '.js'] },
        },
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: [
                      require.resolve('@babel/preset-env'),
                      [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
                      require.resolve('@babel/preset-typescript'),
                    ],
                  },
                },
              ],
            },
            {
              test: /\.css$/i,
              include: uiLibraryDist,
              use: [
                require.resolve('style-loader'),
                require.resolve('css-loader'),
                require.resolve('postcss-loader'),
              ],
            },
            {
              test: /\.css$/i,
              include: /node_modules[\\/]@fontsource/,
              use: [require.resolve('style-loader'), require.resolve('css-loader')],
            },
          ],
        },
      }
    },
  }
}

module.exports = { createPlayroomConfig }
