import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '../utils/cn.js'

const containerVariants = cva('mx-auto', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-none w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-sm',
      md: 'px-base',
      lg: 'px-lg',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'md',
  },
})

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div className={cn(containerVariants({ size, padding, className }))} ref={ref} {...props} />
    )
  }
)

Container.displayName = 'Container'

export { containerVariants }
