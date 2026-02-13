import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'

import {
  captureStorybookScreenshotsTool,
  captureStorybookScreenshotsDescription,
  captureStorybookScreenshotsInputSchema,
} from './tools/capture-storybook-screenshots.js'
import {
  getComponentTool,
  getComponentDescription,
  getComponentInputSchema,
} from './tools/get-component.js'
import {
  getDesignTokensTool,
  getDesignTokensDescription,
  getDesignTokensInputSchema,
} from './tools/get-design-tokens.js'
import { getIconTool, getIconDescription, getIconInputSchema } from './tools/get-icon.js'
import {
  getTailwindUtilitiesTool,
  getTailwindUtilitiesDescription,
  getTailwindUtilitiesInputSchema,
  UTILITY_CATEGORIES,
} from './tools/get-tailwind-utilities.js'
import {
  listComponentsTool,
  listComponentsDescription,
  listComponentsInputSchema,
} from './tools/list-components.js'
import { listIconsTool, listIconsDescription, listIconsInputSchema } from './tools/list-icons.js'
import {
  runOrOpenPlayroomTool,
  runOrOpenPlayroomDescription,
  runOrOpenPlayroomInputSchema,
} from './tools/run-or-open-playroom.js'
import {
  runOrOpenStorybookTool,
  runOrOpenStorybookDescription,
  runOrOpenStorybookInputSchema,
} from './tools/run-or-open-storybook.js'
import {
  searchIconsTool,
  searchIconsDescription,
  searchIconsInputSchema,
} from './tools/search-icons.js'
import {
  stopPlayroomTool,
  stopPlayroomDescription,
  stopPlayroomInputSchema,
} from './tools/stop-playroom.js'
import {
  stopStorybookTool,
  stopStorybookDescription,
  stopStorybookInputSchema,
} from './tools/stop-storybook.js'
import {
  validateTokenDefinitionsTool,
  validateTokenDefinitionsDescription,
  validateTokenDefinitionsInputSchema,
} from './tools/validate-token-definitions.js'
import {
  validateTokensTool,
  validateTokensDescription,
  validateTokensInputSchema,
} from './tools/validate-tokens.js'

/**
 * Creates and configures the MCP server with all available tools.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: 'mcp-ui',
    version: '0.1.0',
  })

  // Register the capture_storybook_screenshots tool
  server.registerTool(
    'capture_storybook_screenshots',
    {
      description: captureStorybookScreenshotsDescription,
      inputSchema: captureStorybookScreenshotsInputSchema,
    },
    async (args) => {
      if (!Array.isArray(args.stories) || args.stories.length === 0) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'stories is required and must be a non-empty array of strings'
        )
      }
      const storyFilter = typeof args.storyFilter === 'string' ? args.storyFilter : undefined
      const port = typeof args.port === 'number' ? args.port : undefined
      const result = await captureStorybookScreenshotsTool({
        stories: args.stories as string[],
        ...(storyFilter !== undefined ? { storyFilter } : {}),
        ...(port !== undefined ? { port } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the run_or_open_storybook tool
  server.registerTool(
    'run_or_open_storybook',
    {
      description: runOrOpenStorybookDescription,
      inputSchema: runOrOpenStorybookInputSchema,
    },
    async (args) => {
      const port = typeof args.port === 'number' ? args.port : undefined
      const result = await runOrOpenStorybookTool({
        ...(port !== undefined ? { port } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the stop_storybook tool
  server.registerTool(
    'stop_storybook',
    {
      description: stopStorybookDescription,
      inputSchema: stopStorybookInputSchema,
    },
    async (args) => {
      const port = typeof args.port === 'number' ? args.port : undefined
      const result = await stopStorybookTool({
        ...(port !== undefined ? { port } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the run_or_open_playroom tool
  server.registerTool(
    'run_or_open_playroom',
    {
      description: runOrOpenPlayroomDescription,
      inputSchema: runOrOpenPlayroomInputSchema,
    },
    async (args) => {
      const port = typeof args.port === 'number' ? args.port : undefined
      const result = await runOrOpenPlayroomTool({
        ...(port !== undefined ? { port } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the stop_playroom tool
  server.registerTool(
    'stop_playroom',
    {
      description: stopPlayroomDescription,
      inputSchema: stopPlayroomInputSchema,
    },
    async (args) => {
      const port = typeof args.port === 'number' ? args.port : undefined
      const result = await stopPlayroomTool({
        ...(port !== undefined ? { port } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the list_components tool
  server.registerTool(
    'list_components',
    {
      description: listComponentsDescription,
      inputSchema: listComponentsInputSchema,
    },
    async (args) => {
      const category = typeof args.category === 'string' ? args.category : undefined
      const result = await listComponentsTool({
        ...(category !== undefined ? { category } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the get_component tool
  server.registerTool(
    'get_component',
    {
      description: getComponentDescription,
      inputSchema: getComponentInputSchema,
    },
    async (args) => {
      if (typeof args.name !== 'string' || args.name === '') {
        throw new McpError(ErrorCode.InvalidParams, 'name is required')
      }
      const result = await getComponentTool({ name: args.name })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the get_design_tokens tool
  server.registerTool(
    'get_design_tokens',
    {
      description: getDesignTokensDescription,
      inputSchema: getDesignTokensInputSchema,
    },
    async (args) => {
      const type =
        typeof args.type === 'string' &&
        ['colors', 'typography', 'spacing', 'all'].includes(args.type)
          ? (args.type as 'colors' | 'typography' | 'spacing' | 'all')
          : undefined
      const result = await getDesignTokensTool({
        ...(type !== undefined ? { type } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the get_tailwind_utilities tool
  server.registerTool(
    'get_tailwind_utilities',
    {
      description: getTailwindUtilitiesDescription,
      inputSchema: getTailwindUtilitiesInputSchema,
    },
    (args) => {
      const category =
        typeof args.category === 'string' && UTILITY_CATEGORIES.includes(args.category as never)
          ? (args.category as 'spacing' | 'colors' | 'typography' | 'layout' | 'all')
          : undefined
      const result = getTailwindUtilitiesTool({
        ...(category !== undefined ? { category } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the search_icons tool
  server.registerTool(
    'search_icons',
    {
      description: searchIconsDescription,
      inputSchema: searchIconsInputSchema,
    },
    async (args) => {
      if (typeof args.query !== 'string' || args.query === '') {
        throw new McpError(ErrorCode.InvalidParams, 'query is required')
      }
      const result = await searchIconsTool({ query: args.query })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the list_icons tool
  server.registerTool(
    'list_icons',
    {
      description: listIconsDescription,
      inputSchema: listIconsInputSchema,
    },
    async (args) => {
      const category = typeof args.category === 'string' ? args.category : undefined
      const result = await listIconsTool({
        ...(category !== undefined ? { category } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the get_icon tool
  server.registerTool(
    'get_icon',
    {
      description: getIconDescription,
      inputSchema: getIconInputSchema,
    },
    async (args) => {
      if (typeof args.name !== 'string' || args.name === '') {
        throw new McpError(ErrorCode.InvalidParams, 'name is required')
      }
      const result = await getIconTool({ name: args.name })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the validate_tokens tool
  server.registerTool(
    'validate_tokens',
    {
      description: validateTokensDescription,
      inputSchema: validateTokensInputSchema,
    },
    async (args) => {
      const path = typeof args.path === 'string' ? args.path : undefined
      const fix = typeof args.fix === 'boolean' ? args.fix : undefined
      const report =
        typeof args.report === 'string' && ['summary', 'detailed'].includes(args.report)
          ? (args.report as 'summary' | 'detailed')
          : undefined
      const includeTests = typeof args.includeTests === 'boolean' ? args.includeTests : undefined

      const result = await validateTokensTool({
        ...(path !== undefined ? { path } : {}),
        ...(fix !== undefined ? { fix } : {}),
        ...(report !== undefined ? { report } : {}),
        ...(includeTests !== undefined ? { includeTests } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  // Register the validate_token_definitions tool
  server.registerTool(
    'validate_token_definitions',
    {
      description: validateTokenDefinitionsDescription,
      inputSchema: validateTokenDefinitionsInputSchema,
    },
    async (args) => {
      const report =
        typeof args.report === 'string' && ['summary', 'detailed'].includes(args.report)
          ? (args.report as 'summary' | 'detailed')
          : undefined

      const result = await validateTokenDefinitionsTool({
        ...(report !== undefined ? { report } : {}),
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )

  return server
}
