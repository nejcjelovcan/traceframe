import { Heading } from '../components/Heading'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Design System/Palette Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive showcase of all color palettes defined in CSS custom properties. Displays all available color families in a compact, visually attractive grid layout.',
      },
    },
  },
}

export default meta
type Story = StoryObj

// Generic color palette structure - works with any palette
interface ColorFamily {
  name: string
  baseVar: string
  category: 'semantic' | 'presentational'
}

const colorFamilies: ColorFamily[] = [
  { name: 'Primary', baseVar: '--palette-primary', category: 'semantic' },
  { name: 'Secondary', baseVar: '--palette-secondary', category: 'semantic' },
  { name: 'Neutral', baseVar: '--palette-neutral', category: 'semantic' },
  { name: 'Success', baseVar: '--palette-success', category: 'semantic' },
  { name: 'Warning', baseVar: '--palette-warning', category: 'semantic' },
  { name: 'Error', baseVar: '--palette-error', category: 'semantic' },
  { name: 'Accent 1', baseVar: '--palette-accent-1', category: 'presentational' },
  { name: 'Accent 2', baseVar: '--palette-accent-2', category: 'presentational' },
  { name: 'Accent 3', baseVar: '--palette-accent-3', category: 'presentational' },
  { name: 'Accent 4', baseVar: '--palette-accent-4', category: 'presentational' },
  { name: 'Accent 5', baseVar: '--palette-accent-5', category: 'presentational' },
]

const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

interface ColorSwatchProps {
  colorVar: string
  shade: number
  isBase?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const ColorSwatch = ({ colorVar, shade, isBase = false, size = 'md' }: ColorSwatchProps) => {
  const cssVar = `${colorVar}-${shade}`
  const rgbValue = `rgb(var(${cssVar}))`

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center group">
      <div
        className={`${sizeClasses[size]} rounded shadow-sm ring-1 ring-black/5 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md ${
          isBase ? 'ring-2 ring-blue-400 shadow-md' : ''
        }`}
        style={{ backgroundColor: rgbValue }}
        title={`${cssVar}: ${rgbValue}`}
      />
      {size !== 'sm' && (
        <div className="mt-1 text-center">
          <div
            className={`text-[10px] font-mono leading-none ${isBase ? 'font-bold text-blue-600' : 'text-gray-500'}`}
          >
            {shade}
          </div>
        </div>
      )}
    </div>
  )
}

interface ColorFamilyCardProps {
  name: string
  baseVar: string
  category: 'semantic' | 'presentational'
  compact?: boolean
}

const ColorFamilyCard = ({ name, baseVar, category, compact = false }: ColorFamilyCardProps) => {
  const categoryColors = {
    semantic: 'bg-blue-50 border-blue-200 text-blue-700',
    presentational: 'bg-purple-50 border-purple-200 text-purple-700',
  }

  if (compact) {
    return (
      <div className="bg-surface rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <Heading level={3} size="sm">
            {name}
          </Heading>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${categoryColors[category]}`}
          >
            {category === 'semantic' ? 'Semantic' : 'Visual'}
          </span>
        </div>
        <div className="flex gap-1 justify-center">
          {colorShades.map((shade) => (
            <ColorSwatch
              key={shade}
              colorVar={baseVar}
              shade={shade}
              isBase={shade === 500}
              size="sm"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <Heading level={3}>{name}</Heading>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${categoryColors[category]}`}
        >
          {category === 'semantic' ? 'Semantic' : 'Visual'}
        </span>
      </div>
      <div className="flex gap-2 justify-center">
        {colorShades.map((shade) => (
          <ColorSwatch
            key={shade}
            colorVar={baseVar}
            shade={shade}
            isBase={shade === 500}
            size="md"
          />
        ))}
      </div>
    </div>
  )
}

export const AllPalettes: Story = {
  render: () => {
    const semanticColors = colorFamilies.filter((c) => c.category === 'semantic')
    const presentationalColors = colorFamilies.filter((c) => c.category === 'presentational')

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto display-flex flex-col gap-12">
          {/* Header */}
          <div className="text-center mb-10">
            <Heading level={1} size="4xl" className="mb-3">
              Color Palette System
            </Heading>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive view of all color families available in the design system. Each
              palette contains 11 shades from light (50) to dark (950).
            </p>
          </div>

          {/* Detailed View - Semantic Colors */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
              <div>
                <Heading level={2} size="2xl">
                  Semantic Colors
                </Heading>
                <p className="text-gray-600">Colors with specific meaning and usage patterns</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {semanticColors.map((family) => (
                <ColorFamilyCard
                  key={family.baseVar}
                  name={family.name}
                  baseVar={family.baseVar}
                  category={family.category}
                />
              ))}
            </div>
          </div>

          {/* Detailed View - Presentational Colors */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
              </div>
              <div>
                <Heading level={2} size="2xl">
                  Presentational Colors
                </Heading>
                <p className="text-gray-600">
                  Colors for visual appeal, accents, and data visualization
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {presentationalColors.map((family) => (
                <ColorFamilyCard
                  key={family.baseVar}
                  name={family.name}
                  baseVar={family.baseVar}
                  category={family.category}
                />
              ))}
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="mt-12 bg-surface rounded-2xl p-8 shadow-lg border border-gray-200">
            <Heading level={2} size="2xl" className="mb-6">
              Usage Guidelines
            </Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Heading level={3} className="mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-gray-200 to-gray-800 rounded"></div>
                  Color Scale
                </Heading>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <strong>50-200:</strong> Backgrounds, subtle elements
                  </li>
                  <li>
                    <strong>300-400:</strong> Borders, disabled states
                  </li>
                  <li>
                    <strong>500:</strong> Primary color (highlighted)
                  </li>
                  <li>
                    <strong>600-700:</strong> Hover states, emphasis
                  </li>
                  <li>
                    <strong>800-950:</strong> Text, high contrast
                  </li>
                </ul>
              </div>
              <div>
                <Heading level={3} className="mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  Semantic Colors
                </Heading>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <strong>Primary:</strong> Main brand actions
                  </li>
                  <li>
                    <strong>Neutral:</strong> Text, borders, backgrounds
                  </li>
                  <li>
                    <strong>Success:</strong> Positive feedback
                  </li>
                  <li>
                    <strong>Warning:</strong> Cautionary states
                  </li>
                  <li>
                    <strong>Error:</strong> Error messages, danger
                  </li>
                </ul>
              </div>
              <div>
                <Heading level={3} className="mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  CSS Variables
                </Heading>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Space-separated RGB values</li>
                  <li>Alpha channel support</li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      rgb(var(--palette-primary-500) / 0.8)
                    </code>
                  </li>
                  <li>Generated with OKLCH color space</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of all color palettes in the design system. Shows both compact grid and detailed views of semantic and presentational color families.',
      },
    },
  },
}

export const CompactGrid: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Heading level={1} size="3xl" className="mb-3">
            Color Palette Overview
          </Heading>
          <p className="text-gray-600">All available color families at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {colorFamilies.map((family) => (
            <ColorFamilyCard
              key={family.baseVar}
              name={family.name}
              baseVar={family.baseVar}
              category={family.category}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A compact grid view showing all color families in an efficient layout, perfect for quick reference.',
      },
    },
  },
}
