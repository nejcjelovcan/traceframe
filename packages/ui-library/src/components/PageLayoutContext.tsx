import { createContext, useContext } from 'react'

export type PageLayoutVariant = 'default' | 'filled' | 'subtle'
export type PageLayoutColor =
  | 'primary'
  | 'secondary'
  | 'accent-1'
  | 'accent-2'
  | 'accent-3'
  | 'accent-4'
  | 'accent-5'

interface PageLayoutContextValue {
  variant?: PageLayoutVariant
  color?: PageLayoutColor
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsible: boolean
}

const PageLayoutContext = createContext<PageLayoutContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  sidebarCollapsible: false,
})

export const usePageLayoutContext = () => {
  return useContext(PageLayoutContext)
}

export { PageLayoutContext }
