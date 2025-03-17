import { SCROLL_CONTAINER_DOM_ID } from 'features/sidebar/Sidebar'

export function getScrollElement() {
  return document.getElementById(SCROLL_CONTAINER_DOM_ID) as HTMLElement
}

export function resetSidebarScroll() {
  const scrollContainer = getScrollElement()
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0 })
  }
}
