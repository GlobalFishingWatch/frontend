import { IS_PRODUCTION_WORKSPACE_ENV, PATH_BASENAME } from 'data/config'
import type { WorkspaceReportLink } from 'data/highlighted-workspaces/fishing-activity'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type MarineManagerWorkspaceId = keyof (typeof workspaceTranslations)['marine-manager']
export type MarineManagerWorkspace = {
  id: MarineManagerWorkspaceId
  img: string
  reports?: WorkspaceReportLink[]
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
  // {
  //   id: 'galapagos-public',
  //   img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-galapagos.jpg`,
  // },
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
  {
    id: 'costa_rica_1-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'costa_rica-public',
      },
    ],
  },
  {
    id: 'colombia_3-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'colombia-public',
      },
    ],
  },
  {
    id: 'panama_1-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'panama-public',
      },
    ],
  },
  {
    id: 'cmar_core_mpas-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'cmar_core_mpas-public',
      },
    ],
  },
  // {
  //   id: 'reserva_de_la_biosfera_cmar-public',
  //   img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
  //   reports: [
  //     {
  //       id: 'reserva_de_la_biosfera_cmar-public',
  //     },
  //   ],
  //   visible: !IS_PRODUCTION_WORKSPACE_ENV,
  // },
  {
    id: 'galapagos_and_hermandad-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'galapagos_and_hermandad-public',
      },
    ],
  },
  {
    id: 'revillagigedo-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'revillagigedo_mexico-public',
      },
    ],
  },
]
