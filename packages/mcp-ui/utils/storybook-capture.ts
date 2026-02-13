import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { chromium, type Browser } from 'playwright'
import sharp from 'sharp'

import { getWorkspaceRoot } from './workspace.js'

/**
 * Default viewport dimensions for screenshots.
 */
export const DEFAULT_VIEWPORT = { width: 800, height: 600 }

/**
 * Default device scale factor for screenshots (2x for retina quality).
 */
export const DEFAULT_DEVICE_SCALE_FACTOR = 2

/**
 * Default story filter - only capture AllVariants stories.
 */
export const DEFAULT_STORY_FILTER = 'AllVariants'

/**
 * Options for capturing Storybook screenshots.
 */
export interface CaptureOptions {
  /** Storybook URL (e.g., "http://localhost:6006") */
  storybookUrl: string
  /** Story file paths relative to ui-library (e.g., ["src/components/Link.stories.tsx"]) */
  storyFiles: string[]
  /** Output directory for screenshots (default: temp directory) */
  outputDir?: string
  /** Pattern to filter story names (default: "AllVariants") */
  storyFilter?: string
  /** Viewport dimensions (default: 800x600) */
  viewport?: { width: number; height: number }
  /** Device scale factor for retina screenshots (default: 2) */
  deviceScaleFactor?: number
}

/**
 * Information about a captured screenshot.
 */
export interface CapturedScreenshot {
  /** Story ID (e.g., "components-link--all-variants") */
  storyId: string
  /** Human-readable story name (e.g., "Link/AllVariants") */
  storyName: string
  /** Component name extracted from the story file */
  componentName: string
  /** Local file path to the PNG screenshot */
  filePath: string
}

/**
 * Result of a capture operation.
 */
export interface CaptureResult {
  /** Whether the capture succeeded */
  success: boolean
  /** Captured screenshots */
  screenshots: CapturedScreenshot[]
  /** Error message if capture failed */
  error?: string | undefined
  /** Output directory where screenshots are saved */
  outputDir: string
}

/**
 * Information about a story extracted from a story file.
 */
export interface StoryInfo {
  /** Story ID for URL (e.g., "components-link--all-variants") */
  id: string
  /** Human-readable name (e.g., "Link/AllVariants") */
  name: string
  /** Component name (e.g., "Link") */
  componentName: string
  /** Export name in the file (e.g., "AllVariants") */
  exportName: string
}

/**
 * Extract story information from a story file.
 *
 * Story files follow the pattern:
 * - export default { title: 'Components/Link' }
 * - export const AllVariants = ...
 *
 * @param filePath - Absolute path to the story file
 * @param storyFilter - Pattern to filter story exports (default: "AllVariants")
 * @returns Array of story info objects
 */
export async function extractStoriesFromFile(
  filePath: string,
  storyFilter: string = DEFAULT_STORY_FILTER
): Promise<StoryInfo[]> {
  const content = await readFile(filePath, 'utf-8')

  // Extract the title from default export
  // Matches: title: 'Components/Link' or title: "Components/Link"
  const titleMatch = /title:\s*['"]([^'"]+)['"]/i.exec(content)
  if (!titleMatch || titleMatch[1] === undefined) {
    return []
  }

  const fullTitle = titleMatch[1]
  // Get component name from title (last part)
  const titleParts = fullTitle.split('/')
  const componentName = titleParts[titleParts.length - 1] ?? fullTitle

  // Find all exported story names
  // Matches: export const AllVariants = or export const Primary =
  const storyExportRegex = /export\s+const\s+(\w+)\s*[=:]/g
  const stories: StoryInfo[] = []

  let match
  while ((match = storyExportRegex.exec(content)) !== null) {
    const exportName = match[1]
    if (exportName === undefined) continue

    // Skip non-story exports
    if (exportName === 'default' || exportName.startsWith('_')) continue

    // Apply story filter
    if (storyFilter && !exportName.includes(storyFilter)) continue

    // Convert to story ID format
    // Title "Components/Link" + export "AllVariants" -> "components-link--all-variants"
    const titleId = fullTitle.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
    const exportId = exportName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
    const storyId = `${titleId}--${exportId}`

    stories.push({
      id: storyId,
      name: `${componentName}/${exportName}`,
      componentName,
      exportName,
    })
  }

  return stories
}

/**
 * Capture screenshots of Storybook stories.
 *
 * @param options - Capture options
 * @returns Capture result with screenshot information
 */
export async function captureStorybookScreenshots(options: CaptureOptions): Promise<CaptureResult> {
  const {
    storybookUrl,
    storyFiles,
    storyFilter = DEFAULT_STORY_FILTER,
    viewport = DEFAULT_VIEWPORT,
    deviceScaleFactor = DEFAULT_DEVICE_SCALE_FACTOR,
  } = options

  // Create output directory
  const outputDir = options.outputDir ?? join(tmpdir(), `storybook-screenshots-${Date.now()}`)
  await mkdir(outputDir, { recursive: true })

  const workspaceRoot = getWorkspaceRoot()
  const uiLibraryPath = join(workspaceRoot, 'packages/ui-library')

  // Extract stories from all provided files
  const allStories: Array<StoryInfo & { sourceFile: string }> = []

  for (const storyFile of storyFiles) {
    const absolutePath = join(uiLibraryPath, storyFile)
    try {
      const stories = await extractStoriesFromFile(absolutePath, storyFilter)
      for (const story of stories) {
        allStories.push({ ...story, sourceFile: storyFile })
      }
    } catch (error) {
      // Skip files that can't be read
      console.error(`Failed to read story file ${storyFile}:`, error)
    }
  }

  if (allStories.length === 0) {
    return {
      success: false,
      screenshots: [],
      error: `No stories matching filter "${storyFilter}" found in provided files`,
      outputDir,
    }
  }

  // Launch browser
  let browser: Browser | undefined
  const screenshots: CapturedScreenshot[] = []

  try {
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor,
    })
    const page = await context.newPage()

    // Capture each story
    for (const story of allStories) {
      try {
        // Navigate to the story iframe
        const storyUrl = `${storybookUrl}/iframe.html?id=${story.id}&viewMode=story`
        await page.goto(storyUrl, { waitUntil: 'networkidle' })

        // Wait for any animations to settle
        await page.waitForTimeout(500)

        // Generate filename
        const filename = `${story.componentName.toLowerCase()}-${story.exportName.toLowerCase()}.png`
        const filePath = join(outputDir, filename)

        // Take screenshot at 2x scale for retina quality
        const screenshotBuffer = await page.screenshot({ fullPage: true })

        // Save at full resolution with DPI metadata set to 144 (2x of standard 72 DPI)
        // This keeps all the detail while displaying at the intended viewport size
        await sharp(screenshotBuffer)
          .withMetadata({ density: 72 * deviceScaleFactor })
          .toFile(filePath)

        screenshots.push({
          storyId: story.id,
          storyName: story.name,
          componentName: story.componentName,
          filePath,
        })
      } catch (error) {
        console.error(`Failed to capture story ${story.name}:`, error)
        // Continue with other stories
      }
    }
  } catch (error) {
    return {
      success: false,
      screenshots,
      error: `Browser operation failed: ${error instanceof Error ? error.message : String(error)}`,
      outputDir,
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }

  return {
    success: screenshots.length > 0,
    screenshots,
    outputDir,
    error: screenshots.length === 0 ? 'No screenshots were captured successfully' : undefined,
  }
}
