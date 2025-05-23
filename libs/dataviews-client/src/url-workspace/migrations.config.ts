export const PUBLIC_VMS_TRACK_DATASETS = [
  'public-belize-fishing-tracks',
  'public-bra-onyxsat-fishing-tracks',
  'public-chile-fishing-tracks',
  'public-chile-non-fishing-tracks',
  'public-costa-rica-fishing-tracks',
  'public-ecuador-fishing-tracks',
  'public-ecuador-non-fishing-tracks',
  'public-indonesia-fishing-tracks',
  'public-mexico-fishing-tracks',
  'public-panama-fishing-tracks',
  'public-panama-non-fishing-tracks',
  'public-peru-fishing-tracks',
]

export const FULL_VMS_VESSELS_DATASETS = [
  'full-chile-fishing-vessels',
  'full-indonesia-fishing-vessels',
  'full-panama-fishing-vessels',
  'full-panama-non-fishing-vessels',
  'full-peru-fishing-vessels',
]

export const AIS_LEGACY_FISHING_EFFORT_DATASETS_DICT = {
  'public-global-fishing-effort:v20201001': 'public-global-fishing-effort:v20231026',
}

export const AIS_LEGACY_VESSELS_DATASETS_DICT = {
  'public-global-other-vessels:v20201001': 'public-global-vessel-identity:v3.0',
  'public-global-carrier-vessels:v20201001': 'public-global-vessel-identity:v3.0',
  'public-global-all-vessels:v20201001': 'public-global-vessel-identity:v3.0',
  'public-global-fishing-vessels:v20201001': 'public-global-vessel-identity:v3.0',
  'public-global-support-vessels:v20201001': 'public-global-vessel-identity:v3.0',
  'private-global-other-vessels:v20201001': 'public-global-vessel-identity:v3.0',
  'public-global-carriers-tracks:v20201001': 'public-global-all-tracks:v20231026',
  'public-global-fishing-longliner-tracks:v20201001': 'public-global-all-tracks:v20231026',
  'public-global-support-tracks:v20201001': 'public-global-all-tracks:v20231026',
  'public-global-fishing-tracks:v20201001': 'public-global-all-tracks:v20231026',
  'public-global-presence-tracks:v20201001': 'public-global-all-tracks:v20231026',
  'public-global-all-tracks:v20201001': 'public-global-all-tracks:v20231026',
  'private-global-presence-tracks:v20201001': 'public-global-all-tracks:v20231026',
  'public-global-vessel-identity:v20231026': 'public-global-vessel-identity:v3.0',
  'public-global-all-tracks:v20231026': 'public-global-all-tracks:v3.0',
}

export const VMS_LEGACY_VESSELS_DATASETS_DICT = {
  'public-png-fishing-vessels:v20230210': 'public-png-vessel-identity-fishing:v20230210',
  'public-peru-fishing-vessels:v20211126': 'public-peru-vessel-identity-fishing:v20211126',
  'public-panama-fishing-vessels:v20211126': 'public-panama-vessel-identity-fishing:v20211126',
  'public-norway-non-fishing-vessels:v20220': 'public-norway-vessel-identity-non-fishing:v20220112',
  'public-norway-fishing-vessels:v20220112': 'public-norway-vessel-identity-fishing:v20220112',
  'public-mexico-fishing-vessels:v20220922': 'public-mexico-vessel-identity-fishing:v20220902',
  'public-indonesia-fishing-vessels:v20200320':
    'public-indonesia-vessel-identity-fishing:v20211126',
  'public-ecuador-non-fishing-vessels:v20211':
    'public-ecuador-vessel-identity-non-fishing:v20211126',
  'public-ecuador-fishing-vessels:v20211126': 'public-ecuador-vessel-identity-fishing:v20211126',
  'public-costa-rica-fishing-vessels:v20211': 'public-costa-rica-vessel-identity-vessels:v20211126',
  'public-chile-non-fishing-vessels:v20211': 'public-chile-vessel-identity-non-fishing:v20211126',
  'public-chile-fishing-vessels:v20211126': 'public-chile-vessel-identity-fishing:v20211126',
  'public-brazil-opentuna-fishing-vessels:v20210311':
    'public-brazil-opentuna-vessel-identity-fishing:v20210311',
  'public-bra-onyxsat-fishing-vessels:v20211126':
    'public-bra-onyxsat-vessel-identity-fishing:v20211126',
  'public-belize-fishing-vessels:v20220304': 'public-belize-vessel-identity-fishing:v20220304',
  'private-peru-fishing-vessels:v20211126': 'private-peru-vessel-identity-fishing:v20211126',
  'private-panama-non-fishing-vessels:v20211126':
    'private-panama-vessel-identity-non-fishing:v20211126',
  'private-panama-fishing-vessels:v20211126': 'private-panama-vessel-identity-fishing:v20211126',
  'private-indonesia-zebrax-vessels:v20210811':
    'private-indonesia-zebrax-vessel-identity:v20210811',
  'private-indonesia-transporters-vessels:v20200320':
    'private-indonesia-vessel-identity-transporters:v20211126',
  'private-indonesia-rare-vessels:v20220224': 'private-indonesia-rare-vessel-identity:v20220224',
  'private-indonesia-pelagic-vessels:v20220224':
    'private-indonesia-pelagic-vessel-identity:v20220224',
  'private-indonesia-ipnlf-vessels:v20220224': 'private-indonesia-ipnlf-vessel-identity:v20220224',
  'private-indonesia-fishing-vessels:v20200320':
    'private-indonesia-vessel-identity-fishing:v2021112',
  'private-indonesia-aruna-vessels:v20220224': 'private-indonesia-aruna-vessel-identity:v20220224',
  'private-ecuador-presence-vessels:v20211126':
    'private-ecuador-vessel-identity-non-fishing:v20211126',
  'private-ecuador-fishing-vessels:v20211126': 'private-ecuador-vessel-identity-fishing:v20211126',
  'private-costa-rica-fishing-vessels:v20211126':
    'private-costa-rica-vessel-identity-vessels:v20211126',
  'private-brazil-opentuna-fishing-vessels:v20210311':
    'private-brazil-opentuna-vessel-identity-fishing:v20210311',
  'private-bra-onyxsat-non-fishing-vessels:v20211126':
    'private-bra-onyxsat-vessel-identity-non-fishing:v20211126',
  'private-bra-onyxsat-fishing-vessels:v20211126':
    'private-bra-onyxsat-vessel-identity-fishing:v20211126',
  'private-belize-non-fishing-vessels:v20220304':
    'private-belize-vessel-identity-non-fishing:v20220304',
  'private-belize-fishing-vessels:v20220304': 'private-belize-vessel-identity-fishing:v20220304',
}

export const EVENTS_LEGACY_VESSELS_DATASETS_DICT = {
  'public-global-fishing-events:v20201001': 'public-global-fishing-events:v20231026',
  'public-global-loitering-events-carriers:v20201001': 'public-global-loitering-events:v20231026',
  'public-global-encounters-events:v20201001': 'public-global-encounters-events:v20231026',
  'public-global-port-visits-c2-events:v20201001': 'public-global-port-visits-c2-events:v20231026',
}

export const DETECTIONS_LEGACY_DATASETS_DICT = {
  'public-ais-presence-viirs-match:v20231026': 'public-global-viirs-presence:v3.0',
}

// Date added: October 2023
// Release: Vessel Profile
// Changelog: v2 datasets are not compatible with v3 format responses
export const ALL_LEGACY_VESSELS_DATASETS_DICT: Record<string, string> = {
  ...AIS_LEGACY_FISHING_EFFORT_DATASETS_DICT,
  ...AIS_LEGACY_VESSELS_DATASETS_DICT,
  ...VMS_LEGACY_VESSELS_DATASETS_DICT,
}

export const ALL_LEGACY_EVENTS_DATASETS_DICT: Record<string, string> = {
  ...EVENTS_LEGACY_VESSELS_DATASETS_DICT,
}
