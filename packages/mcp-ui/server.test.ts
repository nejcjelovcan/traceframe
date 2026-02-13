import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { describe, expect, it } from 'vitest'

import { createServer } from './server.js'

describe('MCP Server', () => {
  describe('createServer', () => {
    it('should create a server instance', () => {
      const server = createServer()
      expect(server).toBeDefined()
    })
  })

  describe('MCP protocol communication', () => {
    it('should list all registered tools', async () => {
      const server = createServer()
      const client = new Client({ name: 'test-client', version: '1.0.0' })

      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

      await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])

      const toolsResult = await client.listTools()
      expect(toolsResult.tools).toHaveLength(14)

      const toolNames = toolsResult.tools.map((t) => t.name)
      expect(toolNames).toContain('capture_storybook_screenshots')
      expect(toolNames).toContain('run_or_open_storybook')
      expect(toolNames).toContain('stop_storybook')
      expect(toolNames).toContain('run_or_open_playroom')
      expect(toolNames).toContain('stop_playroom')
      expect(toolNames).toContain('list_components')
      expect(toolNames).toContain('get_component')
      expect(toolNames).toContain('get_design_tokens')
      expect(toolNames).toContain('get_tailwind_utilities')
      expect(toolNames).toContain('search_icons')
      expect(toolNames).toContain('list_icons')
      expect(toolNames).toContain('get_icon')
      expect(toolNames).toContain('validate_tokens')
      expect(toolNames).toContain('validate_token_definitions')

      await client.close()
      await server.close()
    })

    it('should return error for capture_storybook_screenshots with missing stories', async () => {
      const server = createServer()
      const client = new Client({ name: 'test-client', version: '1.0.0' })

      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

      await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])

      const result = await client.callTool({
        name: 'capture_storybook_screenshots',
        arguments: {},
      })
      expect(result.isError).toBe(true)

      await client.close()
      await server.close()
    })

    it('should return error for capture_storybook_screenshots with empty stories array', async () => {
      const server = createServer()
      const client = new Client({ name: 'test-client', version: '1.0.0' })

      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

      await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])

      const result = await client.callTool({
        name: 'capture_storybook_screenshots',
        arguments: { stories: [] },
      })
      expect(result.isError).toBe(true)

      await client.close()
      await server.close()
    })
  })
})
