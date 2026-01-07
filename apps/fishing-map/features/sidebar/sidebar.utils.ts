export const SCROLL_CONTAINER_DOM_ID = 'scroll-container'

export function getScrollElement(id = SCROLL_CONTAINER_DOM_ID) {
  if (typeof window === 'undefined') {
    return null
  }
  return document.getElementById(id) as HTMLElement
}

export function resetSidebarScroll() {
  const scrollContainer = getScrollElement()
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0 })
  }
}
