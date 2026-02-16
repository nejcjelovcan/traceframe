import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface LogViewContextValue {
  variant: 'cli' | 'rich'
  showTimestamps: boolean
}

const LogViewContext = createContext<LogViewContextValue>({
  variant: 'cli',
  showTimestamps: true,
})

// ---------------------------------------------------------------------------
// Auto-scroll hook
// ---------------------------------------------------------------------------

function useAutoScroll(enabled: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 2
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = scrollRef.current
    if (!el) return

    const observer = new MutationObserver(() => {
      if (isAtBottomRef.current) {
        el.scrollTop = el.scrollHeight
      }
    })

    observer.observe(el, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [enabled])

  return { scrollRef, handleScroll }
}

// ---------------------------------------------------------------------------
// Timestamp formatting
// ---------------------------------------------------------------------------

function formatTimestamp(timestamp: string | Date): string {
  if (typeof timestamp === 'string') return timestamp
  const h = String(timestamp.getHours()).padStart(2, '0')
  const m = String(timestamp.getMinutes()).padStart(2, '0')
  const s = String(timestamp.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function toDateTimeAttr(timestamp: string | Date): string | undefined {
  if (timestamp instanceof Date) return timestamp.toISOString()
  return undefined
}

// ---------------------------------------------------------------------------
// LogView
// ---------------------------------------------------------------------------

const logViewVariants = cva('flex flex-col overflow-hidden rounded-sm border border-border', {
  variants: {
    variant: {
      cli: 'bg-surface-muted font-mono text-sm',
      rich: 'bg-surface text-sm',
    },
  },
  defaultVariants: {
    variant: 'cli',
  },
})

export interface LogViewProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof logViewVariants> {
  /** Show timestamps on entries (default: true) */
  showTimestamps?: boolean
  /** Auto-scroll to bottom on new entries (default: true) */
  autoScroll?: boolean
  /** Max height of the scroll area (CSS value) */
  maxHeight?: string
}

export const LogView = forwardRef<HTMLDivElement, LogViewProps>(
  (
    {
      className,
      variant = 'cli',
      showTimestamps = true,
      autoScroll = true,
      maxHeight,
      children,
      ...props
    },
    ref
  ) => {
    const { scrollRef, handleScroll } = useAutoScroll(autoScroll)

    return (
      <LogViewContext.Provider value={{ variant: variant ?? 'cli', showTimestamps }}>
        <div className={cn(logViewVariants({ variant, className }))} ref={ref} {...props}>
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto"
            style={maxHeight ? { maxHeight } : undefined}
          >
            {children}
          </div>
        </div>
      </LogViewContext.Provider>
    )
  }
)

LogView.displayName = 'LogView'

// ---------------------------------------------------------------------------
// LogEntry
// ---------------------------------------------------------------------------

const logEntryLevelStyles: Record<string, string> = {
  info: 'text-status-info-foreground',
  success: 'text-status-success-foreground',
  warning: 'text-status-warning-foreground',
  error: 'text-status-error-foreground',
  debug: 'text-foreground-muted',
}

const levelIcons: Record<string, IconName> = {
  info: 'info-circle',
  success: 'check',
  warning: 'alert-circle',
  error: 'alert-circle',
}

export interface LogEntryProps extends HTMLAttributes<HTMLDivElement> {
  /** Timestamp displayed at the start of the entry */
  timestamp?: string | Date
  /** Log level affecting entry color */
  level?: 'info' | 'success' | 'warning' | 'error' | 'debug'
  /** Icon name (primarily for rich variant) */
  icon?: IconName
  /** Expandable detail content - when provided, entry becomes collapsible */
  detail?: ReactNode
  /** Whether the detail is expanded by default */
  defaultExpanded?: boolean
}

export const LogEntry = forwardRef<HTMLDivElement, LogEntryProps>(
  (
    { className, timestamp, level, icon, detail, defaultExpanded = false, children, ...props },
    ref
  ) => {
    const { variant, showTimestamps } = useContext(LogViewContext)
    const levelStyle = level ? logEntryLevelStyles[level] : undefined

    const timestampEl =
      showTimestamps && timestamp ? (
        variant === 'rich' ? (
          <time
            dateTime={toDateTimeAttr(timestamp)}
            className="w-[4.5rem] shrink-0 select-none bg-surface-muted pl-sm pr-2xs py-xs text-foreground-muted align-baseline border-r border-border-muted"
          >
            {formatTimestamp(timestamp)}
          </time>
        ) : (
          <time
            dateTime={toDateTimeAttr(timestamp)}
            className="shrink-0 select-none text-foreground-muted pr-xs"
          >
            {formatTimestamp(timestamp)}
          </time>
        )
      ) : null

    // Determine icon: explicit icon prop takes priority, then level-based icon for rich variant
    const effectiveIcon: IconName | undefined =
      icon ?? (variant === 'rich' && level ? levelIcons[level] : undefined)

    const iconEl = effectiveIcon ? (
      <Icon name={effectiveIcon} size="sm" aria-hidden="true" className="shrink-0" style={{marginTop: 'calc(var(--token-spacing-xs) * 1.5)'}} />
    ) : null

    // CLI variant renders flat lines
    if (variant === 'cli') {
      return (
        <div
          ref={ref}
          className={cn('flex items-start gap-sm px-md py-2xs', levelStyle, className)}
          {...props}
        >
          {timestampEl}
          {iconEl}
          <span className="min-w-0 flex-1 break-words">{children}</span>
        </div>
      )
    }

    // Rich variant without detail - flat entry
    if (!detail) {
      return (
        <div
          ref={ref}
          className={cn('flex items-stretch gap-sm', levelStyle, className)}
          {...props}
        >
          {timestampEl}
          {iconEl}
          <span className="min-w-0 flex-1 break-words px-xs py-2xs pt-xs">{children}</span>
        </div>
      )
    }

    // Rich variant with detail - collapsible entry
    return (
      <CollapsiblePrimitive.Root defaultOpen={defaultExpanded} asChild>
        <div ref={ref} className={cn(levelStyle, className)} {...props}>
          <CollapsiblePrimitive.Trigger className="flex w-full cursor-pointer items-start gap-sm text-left transition-colors hover:bg-surface-subtle overflow-hidden">
            {timestampEl}
            {iconEl}
            <span className="min-w-0 flex-1 break-words px-xs py-2xs pt-xs">{children}</span>
            <Icon
              name="chevron-right"
              size="sm"
              aria-hidden="true"
              className="shrink-0 mx-xs text-foreground-muted transition-transform duration-200 [[data-state=open]>&]:rotate-90"
              style={{marginTop: 'calc(var(--token-spacing-xs) * 1.6)'}}
            />
          </CollapsiblePrimitive.Trigger>
          <CollapsiblePrimitive.Content className="overflow-hidden border-t border-b border-border-muted bg-surface-muted px-sm py-xs data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down ">
            {detail}
          </CollapsiblePrimitive.Content>
        </div>
      </CollapsiblePrimitive.Root>
    )
  }
)

LogEntry.displayName = 'LogEntry'

// ---------------------------------------------------------------------------
// LogPrompt
// ---------------------------------------------------------------------------

export interface LogPromptProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** Called when user submits input (Enter key) */
  onSubmit?: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Prompt prefix (e.g., "> " or "$ ") */
  prefix?: string
  /** Disable the input */
  disabled?: boolean
}

export const LogPrompt = forwardRef<HTMLDivElement, LogPromptProps>(
  (
    {
      className,
      onSubmit,
      placeholder = 'Type a command...',
      prefix = '> ',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
        e.preventDefault()
        onSubmit?.(value.trim())
        setValue('')
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-xs border-t border-border px-md py-xs font-mono text-sm',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        <span className="shrink-0 select-none text-foreground-muted" aria-hidden="true">
          {prefix}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent outline-hidden placeholder:text-foreground-muted disabled:cursor-not-allowed"
          aria-label="Log prompt input"
        />
      </div>
    )
  }
)

LogPrompt.displayName = 'LogPrompt'

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { logViewVariants }
