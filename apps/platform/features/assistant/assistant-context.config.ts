import type { AssistantContextModule, AssistantRouteId } from 'features/assistant/assistant-context'

export const ASSISTANT_CONTEXTS: Partial<
  Record<AssistantRouteId, () => Promise<AssistantContextModule>>
> = {
  '/_platform/_map': () => import('features/_map/assistant/map-assistant-context'),
}
