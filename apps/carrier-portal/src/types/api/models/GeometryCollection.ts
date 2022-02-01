/**
 * Geojson geometry collection
 * @export
 * @interface GeometryCollection
 */
export interface GeometryCollection {
  /**
   * the geometry type
   * @type {string}
   * @memberof GeometryCollection
   */
  type: GeometryCollectionTypeEnum
  /**
   *
   * @type {any}
   * @memberof GeometryCollection
   */
  geometry: any
}

/**
 * @export
 * @string {string}
 */
export type GeometryCollectionTypeEnum =
  | 'Point'
  | 'LineString'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon'
