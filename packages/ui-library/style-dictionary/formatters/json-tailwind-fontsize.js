/**
 * Style Dictionary formatter for Tailwind fontSize JSON.
 * Generates a JSON file with Tailwind-compatible fontSize definitions
 * in the format: [fontSize, { lineHeight }]
 *
 * Supports $default: true to add a DEFAULT entry.
 */

// Style Dictionary metadata keys to skip when traversing tokens
const SD_METADATA_KEYS = new Set([
  'value',
  'path',
  'name',
  'attributes',
  'original',
  'filePath',
  'isSource',
])

function isTokenKey(key) {
  return !key.startsWith('$') && !SD_METADATA_KEYS.has(key)
}

export default function jsonTailwindFontSizeFormatter({ dictionary }) {
  const fontSizeTokens = dictionary.tokens.fontSize
  if (!fontSizeTokens) {
    return '{}\n'
  }

  const result = {}
  let defaultKey = null

  for (const [key, token] of Object.entries(fontSizeTokens)) {
    if (!isTokenKey(key) || typeof token !== 'object') {
      continue
    }

    const fontSize = token.$value ?? token.value
    const lineHeight = token.$lineHeight

    if (fontSize === undefined) {
      continue
    }

    // Tailwind fontSize format: [size, { lineHeight }]
    if (lineHeight !== undefined) {
      result[key] = [fontSize, { lineHeight }]
    } else {
      result[key] = fontSize
    }

    // Track default for later
    if (token.$default === true) {
      defaultKey = key
    }
  }

  // Add DEFAULT entry if a token was marked as default
  if (defaultKey && result[defaultKey]) {
    result['DEFAULT'] = result[defaultKey]
  }

  return JSON.stringify(result, null, 2) + '\n'
}
