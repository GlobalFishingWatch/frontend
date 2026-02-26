import type { DatasetsMigration } from '@globalfishingwatch/api-types'

import { LATEST_DATASETS_VMS, replaceDatasetPublicToPrivate } from './datasets.latest'

export const LEGACY_DATASETS_TO_LATEST_VMS_FISHING: DatasetsMigration = {
  'public-belize-fishing-effort:v20220304': LATEST_DATASETS_VMS.blz.fishing,
  'public-bra-onyxsat-fishing-effort:v20211126': LATEST_DATASETS_VMS.bra.fishing,
  'public-chile-fishing-effort:v20211126': LATEST_DATASETS_VMS.chl.fishing,
  'public-costa-rica-fishing-effort:v20211126': LATEST_DATASETS_VMS.cri.fishing,
  'public-ecuador-fishing-effort:v20211126': LATEST_DATASETS_VMS.ecu.fishing,
  'public-norway-fishing-effort:v20220112': LATEST_DATASETS_VMS.nor.fishing,
  'public-panama-fishing-effort:v20211126': LATEST_DATASETS_VMS.pan.fishing,
  'public-peru-fishing-effort:v20211126': LATEST_DATASETS_VMS.per.fishing,
  'public-png-fishing-effort:v20230210': LATEST_DATASETS_VMS.png.fishing,
}

export const LEGACY_DATASETS_TO_LATEST_VMS_PRESENCE: DatasetsMigration = {
  'public-belize-fishing-effort:v20220304': LATEST_DATASETS_VMS.blz.fishing,
  'public-bra-onyxsat-fishing-effort:v20211126': LATEST_DATASETS_VMS.bra.fishing,
  'public-chile-fishing-effort:v20211126': LATEST_DATASETS_VMS.chl.fishing,
  'public-costa-rica-fishing-effort:v20211126': LATEST_DATASETS_VMS.cri.fishing,
  'public-ecuador-fishing-effort:v20211126': LATEST_DATASETS_VMS.ecu.fishing,
  'public-norway-fishing-effort:v20220112': LATEST_DATASETS_VMS.nor.fishing,
  'public-panama-fishing-effort:v20211126': LATEST_DATASETS_VMS.pan.fishing,
  'public-peru-fishing-effort:v20211126': LATEST_DATASETS_VMS.per.fishing,
  'public-png-fishing-effort:v20230210': LATEST_DATASETS_VMS.png.fishing,
}

export const LEGACY_DATASETS_TO_LATEST_VMS_IDENTITY: DatasetsMigration = {
  'public-png-vessel-identity-fishing:v20230210': LATEST_DATASETS_VMS.png.identity,
  'public-peru-vessel-identity-fishing:v20211126': LATEST_DATASETS_VMS.per.identity,
  'public-panama-vessel-identity-fishing:v20211126': LATEST_DATASETS_VMS.pan.fishing,
  'public-norway-vessel-identity-non-fishing:v20220112': LATEST_DATASETS_VMS.nor.identity,
  'public-norway-vessel-identity-fishing:v20220112': LATEST_DATASETS_VMS.nor.identity,
  'public-ecuador-vessel-identity-non-fishing:v20211126': LATEST_DATASETS_VMS.ecu.identity,
  'public-ecuador-vessel-identity-fishing:v20211126': LATEST_DATASETS_VMS.ecu.identity,
  'public-costa-rica-vessel-identity-vessels:v20211126': LATEST_DATASETS_VMS.cri.identity,
  'public-chile-vessel-identity-non-fishing:v20211126': LATEST_DATASETS_VMS.chl.identity,
  'public-chile-vessel-identity-fishing:v20211126': LATEST_DATASETS_VMS.chl.identity,
  'public-brazil-opentuna-vessel-identity-fishing:v20210311': LATEST_DATASETS_VMS.bra.identity,
  'public-bra-onyxsat-vessel-identity-fishing:v20211126': LATEST_DATASETS_VMS.bra.identity,
  'public-belize-vessel-identity-fishing:v20220304': LATEST_DATASETS_VMS.blz.identity,
  'private-peru-vessel-identity-fishing:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.per.identity
  ),
  'private-panama-vessel-identity-non-fishing:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.pan.identity
  ),
  'private-panama-vessel-identity-fishing:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.pan.identity
  ),
  'private-ecuador-vessel-identity-non-fishing:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.ecu.identity
  ),
  'private-ecuador-vessel-identity-fishing:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.ecu.identity
  ),
  'private-costa-rica-vessel-identity-vessels:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.cri.identity
  ),
  'private-brazil-opentuna-vessel-identity-fishing:v20210311': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.bra.identity
  ),
  'private-bra-onyxsat-vessel-identity-non-fishing:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.bra.identity
  ),
  'private-bra-onyxsat-vessel-identity-fishing:v20211126': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.bra.identity
  ),
  'private-belize-vessel-identity-non-fishing:v20220304': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.blz.identity
  ),
  'private-belize-vessel-identity-fishing:v20220304': replaceDatasetPublicToPrivate(
    LATEST_DATASETS_VMS.blz.identity
  ),
}

export const LEGACY_DATASETS_TO_LATEST_VMS: DatasetsMigration = {
  ...LEGACY_DATASETS_TO_LATEST_VMS_FISHING,
  ...LEGACY_DATASETS_TO_LATEST_VMS_PRESENCE,
  ...LEGACY_DATASETS_TO_LATEST_VMS_IDENTITY,
}
