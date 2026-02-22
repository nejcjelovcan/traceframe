#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatHex, parse } from 'culori';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PALETTES_DIR = path.join(__dirname, '../src/styles/tokens/palettes');
const OUTPUT_FILE = path.join(__dirname, '../src/styles/tokens/palette-fallbacks.generated.css');

const PALETTE_FILES = ['arctic.css', 'aura.css', 'forge.css', 'mist.css'];

const OKLCH_PATTERN = /oklch\s*\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/g;
const VARIABLE_PATTERN = /--(palette-[^:]+):\s*([^;]+);/g;
const COLOR_MIX_PATTERN = /color-mix\s*\(\s*in\s+oklch\s*,\s*([^,]+),\s*([^)]+)\)/g;

function parseOklchValue(value) {
  // Handle multi-line OKLCH values by removing newlines and extra spaces
  const cleanValue = value.replace(/\s+/g, ' ').trim();
  const match = cleanValue.match(/oklch\s*\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) return null;

  const l = parseFloat(match[1]) / (match[1].includes('%') ? 100 : 1);
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  return { mode: 'oklch', l, c, h };
}

function convertToRgb(oklchValue) {
  if (!oklchValue) return null;

  try {
    // Create a string representation for culori
    const oklchString = `oklch(${oklchValue.l * 100}% ${oklchValue.c} ${oklchValue.h})`;

    const rgb = parse(oklchString);
    if (!rgb) {
      console.error(`Failed to parse: ${oklchString}`);
      return null;
    }

    const hex = formatHex(rgb);
    if (!hex) {
      console.error(`Failed to format hex for: ${oklchString}`);
      return null;
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
  } catch (error) {
    console.error('Error converting OKLCH to RGB:', error, oklchValue);
    return null;
  }
}

function resolveColorMix(colorMixExpression, colorMap) {
  const cleanExpression = colorMixExpression.replace(/\s+/g, ' ').trim();

  const parts = cleanExpression.match(/color-mix\s*\(\s*in\s+oklch\s*,\s*([^,]+),\s*([^)]+)\)/);
  if (!parts) return null;

  const color1Str = parts[1].trim();
  const color2Part = parts[2].trim();

  let color1 = color1Str.startsWith('var(')
    ? colorMap[color1Str.replace(/var\((--[^)]+)\)/, '$1')]
    : parseOklchValue(color1Str);

  let color2, percentage = 50;

  const percentageMatch = color2Part.match(/(.+)\s+([\d.]+)%$/);
  if (percentageMatch) {
    const color2Str = percentageMatch[1].trim();
    percentage = parseFloat(percentageMatch[2]);
    color2 = color2Str.startsWith('var(')
      ? colorMap[color2Str.replace(/var\((--[^)]+)\)/, '$1')]
      : color2Str === 'white'
        ? { mode: 'oklch', l: 1, c: 0, h: 0 }
        : color2Str === 'black'
          ? { mode: 'oklch', l: 0, c: 0, h: 0 }
          : parseOklchValue(color2Str);
  } else {
    const color2Str = color2Part.trim();
    color2 = color2Str.startsWith('var(')
      ? colorMap[color2Str.replace(/var\((--[^)]+)\)/, '$1')]
      : color2Str === 'white'
        ? { mode: 'oklch', l: 1, c: 0, h: 0 }
        : color2Str === 'black'
          ? { mode: 'oklch', l: 0, c: 0, h: 0 }
          : parseOklchValue(color2Str);
  }

  if (!color1 || !color2) return null;

  const ratio = percentage / 100;
  const mixedL = color1.l * (1 - ratio) + color2.l * ratio;
  const mixedC = color1.c * (1 - ratio) + color2.c * ratio;

  let mixedH;
  const hDiff = Math.abs(color2.h - color1.h);
  if (hDiff <= 180) {
    mixedH = color1.h * (1 - ratio) + color2.h * ratio;
  } else {
    if (color1.h < color2.h) {
      mixedH = ((color1.h + 360) * (1 - ratio) + color2.h * ratio) % 360;
    } else {
      mixedH = (color1.h * (1 - ratio) + (color2.h + 360) * ratio) % 360;
    }
  }

  return { mode: 'oklch', l: mixedL, c: mixedC, h: mixedH };
}

async function parsePaletteFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const paletteName = path.basename(filePath, '.css');

  // Find the :root.paletteName block - look for opening brace and find matching closing brace
  const rootStartMatch = content.match(/:root\.(\w+)\s*{/);
  if (!rootStartMatch) {
    console.warn(`No :root.${paletteName} block found in ${filePath}`);
    return { paletteName, variables: {} };
  }

  const startIndex = rootStartMatch.index + rootStartMatch[0].length;

  // Find the matching closing brace by counting braces
  let braceCount = 1;
  let endIndex = startIndex;

  while (braceCount > 0 && endIndex < content.length) {
    if (content[endIndex] === '{') {
      braceCount++;
    } else if (content[endIndex] === '}') {
      braceCount--;
    }
    endIndex++;
  }

  const rootContent = content.substring(startIndex, endIndex - 1);
  const variables = {};

  for (const match of rootContent.matchAll(VARIABLE_PATTERN)) {
    const varName = match[1];
    const value = match[2].trim();

    if (value.includes('oklch')) {
      const oklchValue = parseOklchValue(value);
      if (oklchValue) {
        variables[`--${varName}`] = oklchValue;
      }
    }
  }

  const orderedVars = {};
  for (const match of rootContent.matchAll(VARIABLE_PATTERN)) {
    const varName = match[1];
    const value = match[2].trim();

    if (value.includes('color-mix')) {
      const mixedColor = resolveColorMix(value, variables);
      if (mixedColor) {
        variables[`--${varName}`] = mixedColor;
        orderedVars[`--${varName}`] = mixedColor;
      }
    } else if (variables[`--${varName}`]) {
      orderedVars[`--${varName}`] = variables[`--${varName}`];
    }
  }

  return { paletteName, variables: orderedVars };
}

async function generateFallbacks() {
  const fallbacks = [];

  fallbacks.push('/**');
  fallbacks.push(' * Auto-generated RGB fallbacks for browsers without OKLCH support');
  fallbacks.push(' * Generated from OKLCH palette definitions');
  fallbacks.push(' * DO NOT EDIT - This file is auto-generated');
  fallbacks.push(' */');
  fallbacks.push('');
  fallbacks.push('@layer base {');
  fallbacks.push('  @supports not (color: oklch(0% 0 0)) {');

  for (const paletteFile of PALETTE_FILES) {
    const filePath = path.join(PALETTES_DIR, paletteFile);
    const { paletteName, variables } = await parsePaletteFile(filePath);

    if (Object.keys(variables).length === 0) {
      continue;
    }

    fallbacks.push(`    :root.${paletteName} {`);

    for (const [varName, oklchValue] of Object.entries(variables)) {
      const rgbValue = convertToRgb(oklchValue);
      if (rgbValue) {
        fallbacks.push(`      ${varName}: ${rgbValue};`);
      }
    }

    fallbacks.push('    }');
    fallbacks.push('');
  }

  fallbacks.push('  }');
  fallbacks.push('}');

  await fs.writeFile(OUTPUT_FILE, fallbacks.join('\n'));
  console.log(`✨ Generated RGB fallbacks at ${OUTPUT_FILE}`);
}

generateFallbacks().catch((error) => {
  console.error('Failed to generate palette fallbacks:', error);
  process.exit(1);
});