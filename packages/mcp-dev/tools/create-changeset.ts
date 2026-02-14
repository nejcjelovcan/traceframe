import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { z } from 'zod'

import { getWorkspaceRoot, resolvePackage } from '@nejcjelovcan/mcp-shared'

/**
 * Word lists for generating human-readable changeset filenames.
 * Matches the adjective-noun-noun convention used by @changesets/cli.
 */
const ADJECTIVES = [
  'brave',
  'bright',
  'calm',
  'cool',
  'curly',
  'dry',
  'early',
  'fair',
  'fast',
  'flat',
  'fresh',
  'gold',
  'green',
  'heavy',
  'hot',
  'kind',
  'large',
  'late',
  'lean',
  'light',
  'long',
  'loud',
  'lucky',
  'mild',
  'neat',
  'new',
  'nice',
  'odd',
  'old',
  'plain',
  'poor',
  'proud',
  'quick',
  'rare',
  'red',
  'rich',
  'rude',
  'shy',
  'slow',
  'small',
  'smart',
  'soft',
  'sour',
  'sweet',
  'tall',
  'tame',
  'thin',
  'tiny',
  'warm',
  'weak',
  'wild',
  'wise',
  'young',
]

const NOUNS = [
  'ants',
  'bags',
  'bats',
  'beds',
  'bees',
  'bikes',
  'birds',
  'boats',
  'books',
  'brooms',
  'bugs',
  'buses',
  'cakes',
  'cars',
  'cats',
  'chairs',
  'clams',
  'clouds',
  'coats',
  'coins',
  'combs',
  'cows',
  'crabs',
  'cups',
  'days',
  'dogs',
  'dolls',
  'dots',
  'doves',
  'drums',
  'ducks',
  'ears',
  'eels',
  'eggs',
  'elms',
  'eyes',
  'fans',
  'feet',
  'fish',
  'flies',
  'foxes',
  'frogs',
  'games',
  'geese',
  'goats',
  'grapes',
  'grass',
  'hats',
  'hens',
  'hills',
  'hogs',
  'homes',
  'inks',
  'jars',
  'jets',
  'keys',
  'kings',
  'kites',
  'lamps',
  'lemons',
  'lions',
  'maps',
  'meals',
  'mice',
  'moons',
  'nails',
  'nets',
  'news',
  'nuts',
  'owls',
  'pans',
  'paws',
  'peas',
  'pens',
  'pigs',
  'pins',
  'plums',
  'pots',
  'rings',
  'rocks',
  'rooms',
  'roses',
  'rugs',
  'seals',
  'ships',
  'shoes',
  'signs',
  'snails',
  'socks',
  'spots',
  'stars',
  'stews',
  'tails',
  'teams',
  'teeth',
  'tents',
  'toads',
  'toys',
  'trees',
  'vans',
  'waves',
  'worms',
  'yaks',
]

/**
 * Pick a random element from an array using crypto-safe randomness.
 */
function randomPick<T>(arr: readonly T[]): T {
  const index = randomBytes(4).readUInt32BE(0) % arr.length
  return arr[index]!
}

/**
 * Generate a human-readable changeset filename (adjective-noun-noun).
 */
function generateChangesetName(): string {
  return `${randomPick(ADJECTIVES)}-${randomPick(NOUNS)}-${randomPick(NOUNS)}`
}

/**
 * Allowed bump types.
 */
const ALLOWED_BUMPS = ['patch', 'minor', 'major'] as const
type BumpType = (typeof ALLOWED_BUMPS)[number]

/**
 * Input schema for create_changeset tool.
 */
export const createChangesetInputSchema = {
  packages: z
    .array(z.string())
    .describe(
      'Package names that changed. Accepts bare name or full scoped name (resolved via package resolver).'
    ),
  bump: z
    .enum(['patch', 'minor', 'major'])
    .describe(
      'Semver bump type: "patch" for fixes, "minor" for features, "major" for breaking changes'
    ),
  summary: z.string().describe('Short description of the change (appears in the changelog)'),
}

/**
 * Description for the create_changeset tool.
 */
export const createChangesetDescription =
  'Create a changeset file non-interactively. Generates a .changeset/<name>.md file for versioning and changelog generation.'

/**
 * Input arguments for createChangeset function.
 */
export interface CreateChangesetInput {
  packages: string[]
  bump: BumpType
  summary: string
}

/**
 * Result type for createChangeset.
 */
export type CreateChangesetResult =
  | {
      file: string
      content: string
      packages: string[]
      bump: BumpType
      summary: string
    }
  | { resolved: false; error: string; validPackages: string[] }

/**
 * Create a changeset file non-interactively.
 *
 * @param args - Input arguments containing packages, bump type, and summary
 * @returns Result with file path and content, or error
 */
export async function createChangeset(args: CreateChangesetInput): Promise<CreateChangesetResult> {
  const { packages, bump, summary } = args

  // Validate inputs
  if (packages.length === 0) {
    return {
      resolved: false,
      error: 'At least one package is required',
      validPackages: [],
    }
  }

  if (summary.trim() === '') {
    return {
      resolved: false,
      error: 'summary is required and cannot be empty',
      validPackages: [],
    }
  }

  if (!ALLOWED_BUMPS.includes(bump)) {
    return {
      resolved: false,
      error: `Invalid bump type: "${bump}". Allowed: ${ALLOWED_BUMPS.join(', ')}`,
      validPackages: [],
    }
  }

  // Resolve all package names
  const resolvedPackages: string[] = []
  for (const pkg of packages) {
    const resolution = await resolvePackage(pkg)

    if (!resolution.resolved) {
      return {
        resolved: false,
        error: resolution.error ?? `Unknown package: "${pkg}"`,
        validPackages: resolution.validPackages ?? [],
      }
    }

    resolvedPackages.push(resolution.package!)
  }

  // Generate changeset content
  const frontmatterLines = resolvedPackages.map((pkg) => `"${pkg}": ${bump}`)
  const content = `---\n${frontmatterLines.join('\n')}\n---\n\n${summary.trim()}\n`

  // Write the changeset file
  const workspaceRoot = getWorkspaceRoot()
  const changesetDir = join(workspaceRoot, '.changeset')
  const fileName = `${generateChangesetName()}.md`
  const filePath = join(changesetDir, fileName)

  // Ensure .changeset directory exists
  await mkdir(changesetDir, { recursive: true })
  await writeFile(filePath, content, 'utf-8')

  return {
    file: `.changeset/${fileName}`,
    content,
    packages: resolvedPackages,
    bump,
    summary: summary.trim(),
  }
}
