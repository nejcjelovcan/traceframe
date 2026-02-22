import { type VariantProps } from 'class-variance-authority'
import { forwardRef, type InputHTMLAttributes } from 'react'

import { Input, type inputWrapperVariants } from './Input.js'

export interface SearchInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof inputWrapperVariants> {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  return <Input ref={ref} type="search" leftIcon="search" {...props} />
})

SearchInput.displayName = 'SearchInput'
