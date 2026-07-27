import { PIPE_DATASET_VERSION as DEFAULT_PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client'

export const PIPE_DATASET_VERSION: string = DEFAULT_PIPE_DATASET_VERSION || '4'

export const PIPE_DATASET_VERSION_TOKEN = '{PIPE_DATASET_VERSION}'

export const resolveDataviewSlug = (dataviewId: string): string =>
  dataviewId.replaceAll(PIPE_DATASET_VERSION_TOKEN, PIPE_DATASET_VERSION)
