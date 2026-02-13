module.exports = {
  components: './src/playroom/components.ts',
  outputPath: './dist/playroom',
  title: 'Traceframe Playroom',
  widths: [320, 768, 1024, 1440],
  port: 9000,
  frameComponent: './src/playroom/FrameComponent.tsx',
  themes: './src/playroom/themes.ts',
  snippets: './src/playroom/snippets.ts',
  typeScriptFiles: [
    '../ui-library/src/components/**/*.{ts,tsx}',
    '../ui-library/src/icons/**/*.{ts,tsx}',
    '!**/*.{test,stories}.*',
  ],
  iframeSandbox: 'allow-scripts allow-same-origin',
  webpackConfig: () => {
    const path = require('path')
    // Only process CSS from ui-library's dist (the built styles.css)
    const uiLibraryCssPath = path.resolve(__dirname, '../ui-library/dist')
    return {
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js'],
        },
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
            include: uiLibraryCssPath,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
    }
  },
}
