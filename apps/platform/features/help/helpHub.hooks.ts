import { type RefObject, useEffect, useRef } from 'react'

const ACTIVE_BAND = '0px 0px -60% 0px'

type UseActiveTopicOnScrollParams = {
  containerRef: RefObject<HTMLElement | null>
  topicSlugs: string[]
  onActiveChange: (slug: string) => void
}

export function useActiveTopicOnScroll({
  containerRef,
  topicSlugs,
  onActiveChange,
}: UseActiveTopicOnScrollParams) {
  const onActiveChangeRef = useRef(onActiveChange)
  useEffect(() => {
    onActiveChangeRef.current = onActiveChange
  }, [onActiveChange])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !topicSlugs.length) {
      return
    }

    const visibleSlugs = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = entry.target.getAttribute('data-topic-slug')
          if (!slug) continue
          if (entry.isIntersecting) {
            visibleSlugs.add(slug)
          } else {
            visibleSlugs.delete(slug)
          }
        }
        const active = topicSlugs.find((slug) => visibleSlugs.has(slug))
        if (active) {
          onActiveChangeRef.current(active)
        }
      },
      { root: container, rootMargin: ACTIVE_BAND, threshold: 0 }
    )

    const elements = container.querySelectorAll('[data-topic-slug]')
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [containerRef, topicSlugs])
}
