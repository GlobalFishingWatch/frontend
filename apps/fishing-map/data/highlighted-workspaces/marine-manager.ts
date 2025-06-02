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
  {
    id: 'costa_rica_amps-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'costa_rica_amps-public',
      },
      {
        id: 'cmar_mpas_no_take_analysis_using_all_sources-user-public',
        key: 'workspace.noTakeReportLink',
      },
    ],
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
  {
    id: 'colombia-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'colombias_amps-public',
      },
      {
        id: 'cmar_mpas_no_take_analysis_using_all_sources-user-public',
        key: 'workspace.noTakeReportLink',
      },
    ],
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
  {
    id: 'panama-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'panama-public',
      },
    ],
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
  {
    id: 'reserva_de_la_biosfera_cmar-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'reserva_de_la_biosfera_cmar-public',
      },
      {
        id: 'cmar_mpas_no_take_analysis_using_all_sources-user-public',
        key: 'workspace.noTakeReportLink',
      },
    ],
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
  {
    id: 'galapagos_y_hermandad-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'galapagos_y_hermandad-public',
      },
    ],
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
  {
    id: 'revillagigedo-public',
    img: `${PATH_BASENAME}/images/highlighted-workspaces/mm-default.jpg`,
    reports: [
      {
        id: 'revillagigedo-public',
      },
    ],
    visible: !IS_PRODUCTION_WORKSPACE_ENV,
  },
]
