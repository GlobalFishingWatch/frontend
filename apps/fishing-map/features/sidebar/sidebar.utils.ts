export function getScrollElement() {
  return document.querySelector('.scrollContainer') as HTMLElement
}

export function resetSidebarScroll() {
  const scrollContainer = getScrollElement()
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0 })
  }
}
