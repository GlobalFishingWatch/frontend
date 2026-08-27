import { type RefObject, useEffect, useRef } from 'react'

const ACTIVE_BAND = '0px 0px -60% 0px'

type UseActiveItemOnScrollParams = {
  containerRef: RefObject<HTMLElement | null>
  itemSlugs: string[]
  onActiveChange: (slug: string) => void
}

export function useActiveItemOnScroll({
  containerRef,
  itemSlugs,
  onActiveChange,
}: UseActiveItemOnScrollParams) {
  const onActiveChangeRef = useRef(onActiveChange)
  useEffect(() => {
    onActiveChangeRef.current = onActiveChange
  }, [onActiveChange])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !itemSlugs.length) {
      return
    }

    const visibleSlugs = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = entry.target.getAttribute('data-item-slug')
          if (!slug) continue
          if (entry.isIntersecting) {
            visibleSlugs.add(slug)
          } else {
            visibleSlugs.delete(slug)
          }
        }
        const active = itemSlugs.find((slug) => visibleSlugs.has(slug))
        if (active) {
          onActiveChangeRef.current(active)
        }
      },
      { root: container, rootMargin: ACTIVE_BAND, threshold: 0 }
    )

    const elements = container.querySelectorAll('[data-item-slug]')
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [containerRef, itemSlugs])
}
