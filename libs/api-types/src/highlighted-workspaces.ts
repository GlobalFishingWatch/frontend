export type HighlightedWorkspace = {
  id: string
  name: {
    en: string
    es?: string
    fr?: string
    id?: string
    pt?: string
  }
  description: {
    en: string
    es?: string
    fr?: string
    id?: string
    pt?: string
  }
  cta: {
    en: string
    es?: string
    fr?: string
    id?: string
    pt?: string
  }
  img?: string
  reportUrl?: string
  visible?: 'visible' | 'hidden'
}

export type HighlightedWorkspaceTitle = 'fishing-map' | 'marine-manager'

export type HighlightedWorkspaces = {
  title: HighlightedWorkspaceTitle
  workspaces: HighlightedWorkspace[]
}
