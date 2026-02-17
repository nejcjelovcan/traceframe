import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Tokens/Gradients',
  parameters: {
    layout: 'padded',
  },
  argTypes: {},
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const GradientShowcase = () => {
  const gradientCategories = [
    {
      title: 'Interactive Gradients',
      gradients: [
        { name: 'primary', label: 'Primary', className: 'bg-gradient-interactive-primary' },
        { name: 'secondary', label: 'Secondary', className: 'bg-gradient-interactive-secondary' },
        {
          name: 'destructive',
          label: 'Destructive',
          className: 'bg-gradient-interactive-destructive',
        },
      ],
    },
    {
      title: 'Status Gradients',
      gradients: [
        { name: 'info', label: 'Info', className: 'bg-gradient-status-info' },
        { name: 'success', label: 'Success', className: 'bg-gradient-status-success' },
        { name: 'warning', label: 'Warning', className: 'bg-gradient-status-warning' },
        { name: 'error', label: 'Error', className: 'bg-gradient-status-error' },
      ],
    },
    {
      title: 'Accent Gradients',
      gradients: [
        { name: 'accent-1', label: 'Accent 1', className: 'bg-gradient-accent-1' },
        { name: 'accent-2', label: 'Accent 2', className: 'bg-gradient-accent-2' },
        { name: 'accent-3', label: 'Accent 3', className: 'bg-gradient-accent-3' },
        { name: 'accent-4', label: 'Accent 4', className: 'bg-gradient-accent-4' },
        { name: 'accent-5', label: 'Accent 5', className: 'bg-gradient-accent-5' },
      ],
    },
  ]

  return (
    <div className="space-y-xl">
      {gradientCategories.map((category) => (
        <div key={category.title}>
          <h3 className="text-lg font-semibold mb-md">{category.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
            {category.gradients.map((gradient) => (
              <div key={gradient.name} className="space-y-xs">
                <div
                  className={`h-24 rounded-md shadow-md ${gradient.className}`}
                  aria-label={`${gradient.label} gradient preview`}
                />
                <div className="text-sm">
                  <div className="font-medium">{gradient.label}</div>
                  <code className="text-xs text-foreground-muted">{gradient.className}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-xl">
        <h3 className="text-lg font-semibold mb-md">Usage Example</h3>
        <div className="grid gap-md md:grid-cols-2">
          <div className="p-lg rounded-lg bg-gradient-interactive-primary text-foreground-filled">
            <h4 className="text-lg font-semibold mb-sm">Primary Button Style</h4>
            <p className="text-sm opacity-90">
              This shows how a gradient can be used for emphasis on primary actions.
            </p>
          </div>
          <div className="inverse p-lg rounded-lg">
            <h4 className="text-lg font-semibold mb-sm">Inverse Context</h4>
            <p className="text-sm opacity-90">
              Use the .inverse utility class for contrasting surface areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <GradientShowcase />,
}
