const path = require('path')

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, '../ui-library/tailwind.config.ts'),
    },
    autoprefixer: {},
  },
}
