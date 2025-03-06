import { PATH_BASENAME } from 'data/config'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type MarineManagerWorkspaceId = keyof (typeof workspaceTranslations)['marine-manager']
export type MarineManagerWorkspace = {
  id: MarineManagerWorkspaceId
  img: string
  reportId?: string
  visible?: boolean
}

export const MARINE_MANAGER_WORKSPACES: MarineManagerWorkspace[] = [
  {
    id: 'ascension-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-ascension.jpg`,
  },
  {
    id: 'fiji-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-fiji.png`,
  },
  {
    id: 'galapagos-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-galapagos.jpg`,
  },
  {
    id: 'guyana-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-guyana.jpg`,
  },
  {
    id: 'micronesia-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-micronesia.png`,
  },
  {
    id: 'maldives-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-maldives.png`,
  },
  {
    id: 'niue-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-niue.jpg`,
  },
  {
    id: 'palau-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-palau.jpg`,
  },
  {
    id: 'tristan-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-tristan.jpg`,
  },
  {
    id: 'mediterranean-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-mediterranean.jpg`,
  },
]
