import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function useLayerPanelDataviewSort(id: string) {
  const sort = useSortable({ id })

  const { transform, transition, activeIndex, index, isSorting } = sort

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isSorting && { overflow: 'hidden', zIndex: index === activeIndex ? 1 : 0 }),
    backgroundColor:
      index === activeIndex ? 'rgba(var(--white-rgb), var(--opacity-secondary))' : 'transparent',
  }

  return { ...sort, style }
}
