/**
 * Generic Style Dictionary formatter for Tailwind JSON config.
 * Generates a JSON file with Tailwind-compatible definitions
 * that reference CSS custom properties.
 *
 * Options:
 *   - tokenPath: string - dot-separated path to token group (e.g., 'color', 'fontFamily')
 *   - cssVarPrefix: string - CSS var prefix without trailing dash (e.g., '--color', '--font')
 *   - valueTemplate: string - template with {VAR} placeholder, optional {FALLBACK} for token value
 *     Examples:
 *       - 'rgb(var({VAR}) / <alpha-value>)' - for colors with alpha support
 *       - 'var({VAR}, {FALLBACK})' - for values with fallback
 *       - 'var({VAR})' - for values without fallback
 *   - keyMap: object - optional key mappings (e.g., { md: '' } maps 'md' to just the prefix)
 *   - flatOutput: boolean - if true, output flat object instead of nested (default: false)
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

/**
 * Formats a token value for use as a fallback.
 * Handles arrays (font families) and other values.
 */
function formatFallback(value) {
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' && v.includes(' ') ? `"${v}"` : v)).join(', ')
  }
  return String(value)
}

/**
 * Generates a Tailwind value from a CSS variable name and template.
 */
function generateValue(cssVarName, valueTemplate, fallbackValue) {
  let result = valueTemplate.replace(/{VAR}/g, cssVarName)
  if (fallbackValue !== undefined && valueTemplate.includes('{FALLBACK}')) {
    result = result.replace(/{FALLBACK}/g, formatFallback(fallbackValue))
  }
  return result
}

/**
 * Recursively extracts variants from a token object.
 *
 * @param token - The token object to extract from
 * @param cssVarPrefix - Base CSS var prefix (e.g., '--color')
 * @param valueTemplate - Template for generating values
 * @param keyMap - Optional key mappings
 * @param variantPrefix - Prefix for variant names (used as output keys)
 * @param cssVarSuffix - Suffix for CSS var names (includes full path)
 */
function extractVariants(
  token,
  cssVarPrefix,
  valueTemplate,
  keyMap,
  variantPrefix = '',
  cssVarSuffix = ''
) {
  const variants = {}

  // Check if this token has a value
  const tokenValue = token.$value ?? token.value
  if (tokenValue !== undefined) {
    const variantName = variantPrefix || 'DEFAULT'
    const mappedSuffix = keyMap?.[cssVarSuffix] ?? cssVarSuffix
    const varSuffixPart = mappedSuffix === '' ? '' : `-${mappedSuffix}`
    const cssVarName = `${cssVarPrefix}${varSuffixPart}`
    const generatedValue = generateValue(cssVarName, valueTemplate, tokenValue)
    variants[variantName] = generatedValue

    // If token is marked as default, also add a DEFAULT entry
    if (token.$default === true && variantName !== 'DEFAULT') {
      variants['DEFAULT'] = generatedValue
    }
  }

  // Look for nested tokens
  for (const [key, value] of Object.entries(token)) {
    if (!isTokenKey(key) || typeof value !== 'object' || value === null) {
      continue
    }

    const nestedVariantPrefix = variantPrefix ? `${variantPrefix}-${key}` : key
    const nestedCssVarSuffix = cssVarSuffix ? `${cssVarSuffix}-${key}` : key
    const nestedVariants = extractVariants(
      value,
      cssVarPrefix,
      valueTemplate,
      keyMap,
      nestedVariantPrefix,
      nestedCssVarSuffix
    )
    Object.assign(variants, nestedVariants)
  }

  return variants
}

/**
 * Gets a nested value from an object using a dot-separated path.
 */
function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export default function jsonTailwindFormatter({ dictionary, options = {} }) {
  const { tokenPath, cssVarPrefix, valueTemplate, keyMap, flatOutput } = options

  if (!tokenPath) {
    throw new Error('json/tailwind formatter requires options.tokenPath')
  }
  if (!cssVarPrefix) {
    throw new Error('json/tailwind formatter requires options.cssVarPrefix')
  }
  if (!valueTemplate) {
    throw new Error('json/tailwind formatter requires options.valueTemplate')
  }

  const tokens = getByPath(dictionary.tokens, tokenPath)
  if (!tokens) {
    return '{}\n'
  }

  const result = {}

  // Process each category/key dynamically
  for (const [category, token] of Object.entries(tokens)) {
    if (!isTokenKey(category) || typeof token !== 'object') {
      continue
    }

    // For nested output: variant names start empty (root = DEFAULT), CSS vars include category
    // For flat output: variant names start with category, CSS vars include category
    const initialVariantPrefix = flatOutput ? category : ''
    const initialCssVarSuffix = category

    const variants = extractVariants(
      token,
      cssVarPrefix,
      valueTemplate,
      keyMap,
      initialVariantPrefix,
      initialCssVarSuffix
    )

    if (Object.keys(variants).length > 0) {
      if (flatOutput) {
        Object.assign(result, variants)
      } else {
        result[category] = variants
      }
    }
  }

  return JSON.stringify(result, null, 2) + '\n'
}
