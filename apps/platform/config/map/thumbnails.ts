/** Bucket the `ocean-areas:screenshots` and `screenshots-ports` scripts upload thumbnails to */
export const PLACE_THUMBNAILS_BASE_URL =
  'https://storage.googleapis.com/gfw-public-place-thumbnails-us-central1'

/**
 * `<folder>/<id>@2x.webp`, relative to the bucket or to a script's output folder. The folder is
 * `ports`, or an area's report dataset id. Characters outside `[\w.-]` become `_` — some port ids
 * hold `(` or `&`.
 */
export const getPlaceThumbnailPath = (folder: string, id: string | number) =>
  `${folder}/${String(id).replace(/[^\w.-]/g, '_')}@2x.webp`
