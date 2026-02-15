/**
 * Recursively extracts all tokens from a token object, including nested tokens.
 * Style Dictionary v4 only registers parent tokens in allTokens, so we need to
 * walk the structure to find nested tokens that also have $value.
 */
export function extractAllTokens(token, basePath = [], originalToken = null) {
  const tokens = []
  const path = basePath.length > 0 ? basePath : token.path
  const original = originalToken || token.original

  // Add this token if it has a value
  if (token.$value !== undefined || token.value !== undefined) {
    // Get the original reference value if available
    let originalValue = null
    if (original) {
      // Navigate to the same path in original to get the unresolved reference
      if (basePath.length > 0 && token.path) {
        // For the root token, original is at token.original
        originalValue = original.$value
      } else {
        originalValue = original?.$value
      }
    }

    tokens.push({
      path,
      $value: token.$value,
      value: token.value,
      originalValue: originalValue || token.$value || token.value,
      $description: token.$description,
      description: token.description,
      $type: token.$type,
      type: token.type,
    })
  }

  // Look for nested tokens (properties that are objects with $value)
  for (const [key, value] of Object.entries(token)) {
    // Skip Style Dictionary metadata and standard token properties
    if (
      key.startsWith('$') ||
      key === 'value' ||
      key === 'path' ||
      key === 'name' ||
      key === 'attributes' ||
      key === 'original' ||
      key === 'filePath' ||
      key === 'isSource' ||
      typeof value !== 'object' ||
      value === null
    ) {
      continue
    }

    // Get the corresponding original nested value
    const nestedOriginal = original?.[key]

    // This is a nested token - recurse
    const nestedTokens = extractAllTokens(value, [...path, key], nestedOriginal)
    tokens.push(...nestedTokens)
  }

  return tokens
}
