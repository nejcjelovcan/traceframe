const { createPlayroomConfig } = require('@nejcjelovcan/traceframe-playroom-preset')

module.exports = createPlayroomConfig({
  baseUrl: '/traceframe/playroom/',
  title: 'Traceframe Playroom',
  typeScriptFiles: [
    '../ui-library/src/components/**/*.{ts,tsx}',
    '../ui-library/src/icons/**/*.{ts,tsx}',
    '!**/*.{test,stories}.*',
  ],
})
