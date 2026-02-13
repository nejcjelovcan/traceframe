import '@testing-library/jest-dom/vitest'

// Mock ResizeObserver for Radix UI components
// Radix uses ResizeObserver internally for positioning, which jsdom doesn't support
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

// Mock pointer capture methods for Radix UI Select
// These are used by @radix-ui/react-select internally but jsdom doesn't support them
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () {
    return false
  }
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function () {}
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function () {}
}

// Mock scrollIntoView for Radix UI Select items
// jsdom doesn't implement scrollIntoView
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {}
}
