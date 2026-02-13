import { join } from 'node:path'

import { z } from 'zod'

import { captureStorybookScreenshots, DEFAULT_STORY_FILTER } from '../utils/storybook-capture.js'
import {
  DEFAULT_STORYBOOK_PORT,
  getUiLibraryPackagePath,
  startStorybook,
} from '../utils/storybook-runner.js'
import { getWorkspaceRoot } from '../utils/workspace.js'

/**
 * Input schema for capture_storybook_screenshots tool.
 */
export const captureStorybookScreenshotsInputSchema = {
  stories: z
    .array(z.string())
    .describe(
      'Story file paths relative to ui-library (e.g., ["src/components/Link.stories.tsx"])'
    ),
  storyFilter: z
    .string()
    .optional()
    .describe(
      `Pattern to filter story names (default: "${DEFAULT_STORY_FILTER}"). Set to empty string to capture all stories.`
    ),
  port: z.number().optional().describe(`Storybook port (default: ${DEFAULT_STORYBOOK_PORT})`),
}

/**
 * Description for the capture_storybook_screenshots tool.
 */
export const captureStorybookScreenshotsDescription =
  'Capture screenshots of Storybook stories and save them as local PNG files'

/**
 * Input arguments for captureStorybookScreenshotsTool function.
 */
export interface CaptureStorybookScreenshotsInput {
  stories: string[]
  storyFilter?: string
  port?: number
}

/**
 * Screenshot info in the result.
 */
export interface ScreenshotResultInfo {
  /** Story name (e.g., "Link/AllVariants") */
  story: string
  /** Component name */
  component: string
  /** Story ID */
  storyId: string
  /** Local file path to the PNG screenshot */
  filePath: string
}

/**
 * Result type for captureStorybookScreenshotsTool.
 */
export interface CaptureStorybookScreenshotsResult {
  /** Whether the operation succeeded */
  success: boolean
  /** Information about captured screenshots */
  screenshots: ScreenshotResultInfo[]
  /** Directory where screenshots are saved */
  outputDir?: string | undefined
  /** Human-readable summary */
  summary: string
  /** Error message if operation failed */
  error?: string | undefined
  /** Whether Storybook was started by this tool */
  storybookStarted?: boolean | undefined
}

/**
 * Capture screenshots of Storybook stories and save them locally.
 *
 * @param args - Input arguments
 * @returns Result with screenshot info and file paths
 */
export async function captureStorybookScreenshotsTool(
  args: CaptureStorybookScreenshotsInput
): Promise<CaptureStorybookScreenshotsResult> {
  const { stories, storyFilter, port } = args

  // Validate inputs
  if (stories.length === 0) {
    return {
      success: false,
      screenshots: [],
      summary: 'No story files provided',
      error: 'stories array must contain at least one story file path',
    }
  }

  let storybookProcess: { stop: () => Promise<void>; weStartedIt: boolean; url: string } | undefined

  // Save screenshots to workspace root screenshots folder
  const outputDir = join(getWorkspaceRoot(), 'screenshots')

  try {
    // Step 1: Start Storybook (or detect already running)
    const packagePath = getUiLibraryPackagePath()
    storybookProcess = await startStorybook({
      packagePath,
      port: port ?? DEFAULT_STORYBOOK_PORT,
      timeout: 60000,
    })

    // Step 2: Capture screenshots
    const captureResult = await captureStorybookScreenshots({
      storybookUrl: storybookProcess.url,
      storyFiles: stories,
      storyFilter: storyFilter ?? DEFAULT_STORY_FILTER,
      outputDir,
    })

    if (!captureResult.success || captureResult.screenshots.length === 0) {
      return {
        success: false,
        screenshots: [],
        outputDir,
        summary: 'Failed to capture screenshots',
        error: captureResult.error ?? 'No screenshots were captured',
        storybookStarted: storybookProcess.weStartedIt,
      }
    }

    // Step 3: Generate success result
    const screenshotResults: ScreenshotResultInfo[] = captureResult.screenshots.map((s) => ({
      story: s.storyName,
      component: s.componentName,
      storyId: s.storyId,
      filePath: s.filePath,
    }))

    const componentNames = [...new Set(screenshotResults.map((s) => s.component))]
    const summary = `Captured ${screenshotResults.length} screenshot(s) for ${componentNames.join(', ')} in ${outputDir}`

    return {
      success: true,
      screenshots: screenshotResults,
      outputDir,
      summary,
      storybookStarted: storybookProcess.weStartedIt,
    }
  } catch (error) {
    return {
      success: false,
      screenshots: [],
      outputDir,
      summary: 'Operation failed',
      error: error instanceof Error ? error.message : String(error),
      storybookStarted: storybookProcess?.weStartedIt,
    }
  } finally {
    // Cleanup: Stop Storybook if we started it
    if (storybookProcess?.weStartedIt) {
      try {
        await storybookProcess.stop()
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
