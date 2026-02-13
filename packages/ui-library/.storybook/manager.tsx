import React from 'react'
import { addons } from '@storybook/manager-api'

addons.register('playroom-link', () => {
  const base = window.location.pathname.replace(/\/$/, '')
  const playroomUrl = `${base}/playroom/`

  addons.add('playroom-link/tool', {
    type: 'tool',
    title: 'Open Playroom',
    render: () => (
      <a
        href={playroomUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        Playroom
      </a>
    ),
  })
})
