import { DEFAULT_WORKSPACE_ID } from '@platform/config'

/**
 * Curated public workspace names, to describe what the user is looking at.
 * Sources: apps/platform/data/map/highlighted-workspaces/{marine-manager,reports}.ts
 * + public/locales/source/workspaces.json
 */
export const HIGHLIGHTED_WORKSPACES: Record<string, string> = {
  [DEFAULT_WORKSPACE_ID]: 'Default public workspace',
  // Marine Manager
  'ascension-public': 'Ascension Island',
  'fiji-public': 'Fiji',
  'guyana-public': 'Guyana',
  'micronesia-public': 'Federated States of Micronesia',
  'maldives-public': 'Maldives',
  'niue-public': 'Niue',
  'palau-public': 'Palau',
  'tristan-public': 'Tristan da Cunha',
  'mediterranean-public': 'Mediterranean and Black Sea',
  'costa_rica-public': 'Costa Rica',
  'colombia-public': 'Colombia',
  'panama-public': 'Panama',
  'cmar_core_mpas-public': 'CMAR core MPAs',
  'galapagos_and_hermandad-public': 'Galapagos and Hermandad',
  'rapanui-public': 'Rapa Nui',
  'revillagigedo-public': 'Revillagigedo',
  'revillagigedo_mexico-public': 'Revillagigedo (report)',
  // Curated reports
  'activity-report': 'Global Vessel Activity report',
  'detections-report': 'Global Dark Vessel Detections report',
  'events-report': 'Global Vessel Events report',
  'deep-sea-mining-public': 'Deep Sea Mining Watch',
  'deep_sea_mining-public': 'Deep Sea Mining Watch (report)',
}
