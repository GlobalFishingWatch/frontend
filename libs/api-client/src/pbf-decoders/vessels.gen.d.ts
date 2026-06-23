import * as $protobuf from 'protobufjs'
import Long = require('long')

/** Namespace vessels. */
export namespace vessels {
  /**
   * Properties of a Track.
   * @deprecated Use vessels.Track.$Properties instead.
   */
  interface ITrack extends vessels.Track.$Properties {}

  /** Represents a Track. */
  class Track {
    /**
     * Constructs a new Track.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.Track.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** Track data. */
    data: number[]

    /**
     * Creates a new Track instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Track instance
     */
    static create(properties: vessels.Track.$Shape): vessels.Track & vessels.Track.$Shape
    static create(properties?: vessels.Track.$Properties): vessels.Track

    /**
     * Encodes the specified Track message. Does not implicitly {@link vessels.Track.verify|verify} messages.
     * @param message Track message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(message: vessels.Track.$Properties, writer?: $protobuf.Writer): $protobuf.Writer

    /**
     * Encodes the specified Track message, length delimited. Does not implicitly {@link vessels.Track.verify|verify} messages.
     * @param message Track message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.Track.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a Track message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.Track & vessels.Track.$Shape} Track
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.Track & vessels.Track.$Shape

    /**
     * Decodes a Track message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.Track & vessels.Track.$Shape} Track
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.Track & vessels.Track.$Shape

    /**
     * Verifies a Track message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a Track message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Track
     */
    static fromObject(object: { [k: string]: any }): vessels.Track

    /**
     * Creates a plain object from a Track message. Also converts values to other types if specified.
     * @param message Track
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.Track,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this Track to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for Track
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace Track {
    /** Properties of a Track. */
    interface $Properties {
      /** Track data */
      data?: number[] | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a Track. */
    type $Shape = vessels.Track.$Properties
  }

  /**
   * Properties of a TilesetVesselQuery.
   * @deprecated Use vessels.TilesetVesselQuery.$Properties instead.
   */
  interface ITilesetVesselQuery extends vessels.TilesetVesselQuery.$Properties {}

  /** Represents a TilesetVesselQuery. */
  class TilesetVesselQuery {
    /**
     * Constructs a new TilesetVesselQuery.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.TilesetVesselQuery.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** TilesetVesselQuery query. */
    query: string

    /** TilesetVesselQuery total. */
    total: number

    /** TilesetVesselQuery limit. */
    limit: number

    /** TilesetVesselQuery offset. */
    offset: number

    /** TilesetVesselQuery nextOffset. */
    nextOffset: number

    /** TilesetVesselQuery entries. */
    entries: vessels.TilesetVesselInfo.$Properties[]

    /**
     * Creates a new TilesetVesselQuery instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TilesetVesselQuery instance
     */
    static create(
      properties: vessels.TilesetVesselQuery.$Shape
    ): vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape
    static create(properties?: vessels.TilesetVesselQuery.$Properties): vessels.TilesetVesselQuery

    /**
     * Encodes the specified TilesetVesselQuery message. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
     * @param message TilesetVesselQuery message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.TilesetVesselQuery.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified TilesetVesselQuery message, length delimited. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
     * @param message TilesetVesselQuery message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.TilesetVesselQuery.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a TilesetVesselQuery message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape} TilesetVesselQuery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape

    /**
     * Decodes a TilesetVesselQuery message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape} TilesetVesselQuery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape

    /**
     * Verifies a TilesetVesselQuery message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a TilesetVesselQuery message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TilesetVesselQuery
     */
    static fromObject(object: { [k: string]: any }): vessels.TilesetVesselQuery

    /**
     * Creates a plain object from a TilesetVesselQuery message. Also converts values to other types if specified.
     * @param message TilesetVesselQuery
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.TilesetVesselQuery,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this TilesetVesselQuery to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for TilesetVesselQuery
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace TilesetVesselQuery {
    /** Properties of a TilesetVesselQuery. */
    interface $Properties {
      /** TilesetVesselQuery query */
      query?: string | null

      /** TilesetVesselQuery total */
      total?: number | null

      /** TilesetVesselQuery limit */
      limit?: number | null

      /** TilesetVesselQuery offset */
      offset?: number | null

      /** TilesetVesselQuery nextOffset */
      nextOffset?: number | null

      /** TilesetVesselQuery entries */
      entries?: vessels.TilesetVesselInfo.$Properties[] | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a TilesetVesselQuery. */
    type $Shape = vessels.TilesetVesselQuery.$Properties
  }

  /**
   * Properties of a TilesetVesselInfo.
   * @deprecated Use vessels.TilesetVesselInfo.$Properties instead.
   */
  interface ITilesetVesselInfo extends vessels.TilesetVesselInfo.$Properties {}

  /** Represents a TilesetVesselInfo. */
  class TilesetVesselInfo {
    /**
     * Constructs a new TilesetVesselInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.TilesetVesselInfo.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** TilesetVesselInfo id. */
    id: string

    /** TilesetVesselInfo name. */
    name: string

    /** TilesetVesselInfo end. */
    end: string

    /** TilesetVesselInfo start. */
    start: string

    /** TilesetVesselInfo ssvid. */
    ssvid: string

    /** TilesetVesselInfo callsign. */
    callsign: string

    /** TilesetVesselInfo vesselId. */
    vesselId: string

    /** TilesetVesselInfo tilesetId. */
    tilesetId: string

    /**
     * Creates a new TilesetVesselInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TilesetVesselInfo instance
     */
    static create(
      properties: vessels.TilesetVesselInfo.$Shape
    ): vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape
    static create(properties?: vessels.TilesetVesselInfo.$Properties): vessels.TilesetVesselInfo

    /**
     * Encodes the specified TilesetVesselInfo message. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
     * @param message TilesetVesselInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.TilesetVesselInfo.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified TilesetVesselInfo message, length delimited. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
     * @param message TilesetVesselInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.TilesetVesselInfo.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a TilesetVesselInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape} TilesetVesselInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape

    /**
     * Decodes a TilesetVesselInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape} TilesetVesselInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape

    /**
     * Verifies a TilesetVesselInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a TilesetVesselInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TilesetVesselInfo
     */
    static fromObject(object: { [k: string]: any }): vessels.TilesetVesselInfo

    /**
     * Creates a plain object from a TilesetVesselInfo message. Also converts values to other types if specified.
     * @param message TilesetVesselInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.TilesetVesselInfo,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this TilesetVesselInfo to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for TilesetVesselInfo
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace TilesetVesselInfo {
    /** Properties of a TilesetVesselInfo. */
    interface $Properties {
      /** TilesetVesselInfo id */
      id?: string | null

      /** TilesetVesselInfo name */
      name?: string | null

      /** TilesetVesselInfo end */
      end?: string | null

      /** TilesetVesselInfo start */
      start?: string | null

      /** TilesetVesselInfo ssvid */
      ssvid?: string | null

      /** TilesetVesselInfo callsign */
      callsign?: string | null

      /** TilesetVesselInfo vesselId */
      vesselId?: string | null

      /** TilesetVesselInfo tilesetId */
      tilesetId?: string | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a TilesetVesselInfo. */
    type $Shape = vessels.TilesetVesselInfo.$Properties
  }

  /**
   * Properties of a DatasetVesselV1Query.
   * @deprecated Use vessels.DatasetVesselV1Query.$Properties instead.
   */
  interface IDatasetVesselV1Query extends vessels.DatasetVesselV1Query.$Properties {}

  /** Represents a DatasetVesselV1Query. */
  class DatasetVesselV1Query {
    /**
     * Constructs a new DatasetVesselV1Query.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.DatasetVesselV1Query.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** DatasetVesselV1Query dataset. */
    dataset: string

    /** DatasetVesselV1Query results. */
    results: vessels.DatasetVesselQuery.$Properties[]

    /**
     * Creates a new DatasetVesselV1Query instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DatasetVesselV1Query instance
     */
    static create(
      properties: vessels.DatasetVesselV1Query.$Shape
    ): vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape
    static create(
      properties?: vessels.DatasetVesselV1Query.$Properties
    ): vessels.DatasetVesselV1Query

    /**
     * Encodes the specified DatasetVesselV1Query message. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
     * @param message DatasetVesselV1Query message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.DatasetVesselV1Query.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DatasetVesselV1Query message, length delimited. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
     * @param message DatasetVesselV1Query message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.DatasetVesselV1Query.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DatasetVesselV1Query message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape} DatasetVesselV1Query
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape

    /**
     * Decodes a DatasetVesselV1Query message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape} DatasetVesselV1Query
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape

    /**
     * Verifies a DatasetVesselV1Query message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DatasetVesselV1Query message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DatasetVesselV1Query
     */
    static fromObject(object: { [k: string]: any }): vessels.DatasetVesselV1Query

    /**
     * Creates a plain object from a DatasetVesselV1Query message. Also converts values to other types if specified.
     * @param message DatasetVesselV1Query
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.DatasetVesselV1Query,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DatasetVesselV1Query to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DatasetVesselV1Query
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace DatasetVesselV1Query {
    /** Properties of a DatasetVesselV1Query. */
    interface $Properties {
      /** DatasetVesselV1Query dataset */
      dataset?: string | null

      /** DatasetVesselV1Query results */
      results?: vessels.DatasetVesselQuery.$Properties[] | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a DatasetVesselV1Query. */
    type $Shape = vessels.DatasetVesselV1Query.$Properties
  }

  /**
   * Properties of a DatasetVesselQuery.
   * @deprecated Use vessels.DatasetVesselQuery.$Properties instead.
   */
  interface IDatasetVesselQuery extends vessels.DatasetVesselQuery.$Properties {}

  /** Represents a DatasetVesselQuery. */
  class DatasetVesselQuery {
    /**
     * Constructs a new DatasetVesselQuery.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.DatasetVesselQuery.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** DatasetVesselQuery query. */
    query: string

    /** DatasetVesselQuery total. */
    total: number

    /** DatasetVesselQuery limit. */
    limit: number

    /** DatasetVesselQuery offset. */
    offset: number

    /** DatasetVesselQuery nextOffset. */
    nextOffset: number

    /** DatasetVesselQuery entries. */
    entries: vessels.DatasetVesselInfo.$Properties[]

    /**
     * Creates a new DatasetVesselQuery instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DatasetVesselQuery instance
     */
    static create(
      properties: vessels.DatasetVesselQuery.$Shape
    ): vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape
    static create(properties?: vessels.DatasetVesselQuery.$Properties): vessels.DatasetVesselQuery

    /**
     * Encodes the specified DatasetVesselQuery message. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
     * @param message DatasetVesselQuery message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.DatasetVesselQuery.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DatasetVesselQuery message, length delimited. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
     * @param message DatasetVesselQuery message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.DatasetVesselQuery.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DatasetVesselQuery message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape} DatasetVesselQuery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape

    /**
     * Decodes a DatasetVesselQuery message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape} DatasetVesselQuery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape

    /**
     * Verifies a DatasetVesselQuery message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DatasetVesselQuery message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DatasetVesselQuery
     */
    static fromObject(object: { [k: string]: any }): vessels.DatasetVesselQuery

    /**
     * Creates a plain object from a DatasetVesselQuery message. Also converts values to other types if specified.
     * @param message DatasetVesselQuery
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.DatasetVesselQuery,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DatasetVesselQuery to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DatasetVesselQuery
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace DatasetVesselQuery {
    /** Properties of a DatasetVesselQuery. */
    interface $Properties {
      /** DatasetVesselQuery query */
      query?: string | null

      /** DatasetVesselQuery total */
      total?: number | null

      /** DatasetVesselQuery limit */
      limit?: number | null

      /** DatasetVesselQuery offset */
      offset?: number | null

      /** DatasetVesselQuery nextOffset */
      nextOffset?: number | null

      /** DatasetVesselQuery entries */
      entries?: vessels.DatasetVesselInfo.$Properties[] | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a DatasetVesselQuery. */
    type $Shape = vessels.DatasetVesselQuery.$Properties
  }

  /**
   * Properties of a DatasetVesselInfo.
   * @deprecated Use vessels.DatasetVesselInfo.$Properties instead.
   */
  interface IDatasetVesselInfo extends vessels.DatasetVesselInfo.$Properties {}

  /** Represents a DatasetVesselInfo. */
  class DatasetVesselInfo {
    /**
     * Constructs a new DatasetVesselInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.DatasetVesselInfo.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** DatasetVesselInfo id. */
    id: string

    /** DatasetVesselInfo name. */
    name: string

    /** DatasetVesselInfo imo. */
    imo: string

    /** DatasetVesselInfo ssvid. */
    ssvid: string

    /** DatasetVesselInfo vesselId. */
    vesselId: string

    /** DatasetVesselInfo type. */
    type: string

    /** DatasetVesselInfo dataset. */
    dataset: string

    /** DatasetVesselInfo authorizations. */
    authorizations: vessels.StartEndValue.$Properties[]

    /** DatasetVesselInfo extra. */
    extra: vessels.Extra.$Properties[]

    /** DatasetVesselInfo mmsi. */
    mmsi: vessels.StartEndValue.$Properties[]

    /** DatasetVesselInfo callsign. */
    callsign: vessels.StartEndValue.$Properties[]

    /** DatasetVesselInfo flags. */
    flags: vessels.StartEndValue.$Properties[]

    /**
     * Creates a new DatasetVesselInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DatasetVesselInfo instance
     */
    static create(
      properties: vessels.DatasetVesselInfo.$Shape
    ): vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape
    static create(properties?: vessels.DatasetVesselInfo.$Properties): vessels.DatasetVesselInfo

    /**
     * Encodes the specified DatasetVesselInfo message. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
     * @param message DatasetVesselInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.DatasetVesselInfo.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DatasetVesselInfo message, length delimited. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
     * @param message DatasetVesselInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.DatasetVesselInfo.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DatasetVesselInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape} DatasetVesselInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape

    /**
     * Decodes a DatasetVesselInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape} DatasetVesselInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape

    /**
     * Verifies a DatasetVesselInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DatasetVesselInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DatasetVesselInfo
     */
    static fromObject(object: { [k: string]: any }): vessels.DatasetVesselInfo

    /**
     * Creates a plain object from a DatasetVesselInfo message. Also converts values to other types if specified.
     * @param message DatasetVesselInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.DatasetVesselInfo,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DatasetVesselInfo to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DatasetVesselInfo
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace DatasetVesselInfo {
    /** Properties of a DatasetVesselInfo. */
    interface $Properties {
      /** DatasetVesselInfo id */
      id?: string | null

      /** DatasetVesselInfo name */
      name?: string | null

      /** DatasetVesselInfo imo */
      imo?: string | null

      /** DatasetVesselInfo ssvid */
      ssvid?: string | null

      /** DatasetVesselInfo vesselId */
      vesselId?: string | null

      /** DatasetVesselInfo type */
      type?: string | null

      /** DatasetVesselInfo dataset */
      dataset?: string | null

      /** DatasetVesselInfo authorizations */
      authorizations?: vessels.StartEndValue.$Properties[] | null

      /** DatasetVesselInfo extra */
      extra?: vessels.Extra.$Properties[] | null

      /** DatasetVesselInfo mmsi */
      mmsi?: vessels.StartEndValue.$Properties[] | null

      /** DatasetVesselInfo callsign */
      callsign?: vessels.StartEndValue.$Properties[] | null

      /** DatasetVesselInfo flags */
      flags?: vessels.StartEndValue.$Properties[] | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a DatasetVesselInfo. */
    type $Shape = vessels.DatasetVesselInfo.$Properties
  }

  /**
   * Properties of an Extra.
   * @deprecated Use vessels.Extra.$Properties instead.
   */
  interface IExtra extends vessels.Extra.$Properties {}

  /** Represents an Extra. */
  class Extra {
    /**
     * Constructs a new Extra.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.Extra.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** Extra id. */
    id: string

    /** Extra label. */
    label: string

    /** Extra value. */
    value: number

    /**
     * Creates a new Extra instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Extra instance
     */
    static create(properties: vessels.Extra.$Shape): vessels.Extra & vessels.Extra.$Shape
    static create(properties?: vessels.Extra.$Properties): vessels.Extra

    /**
     * Encodes the specified Extra message. Does not implicitly {@link vessels.Extra.verify|verify} messages.
     * @param message Extra message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(message: vessels.Extra.$Properties, writer?: $protobuf.Writer): $protobuf.Writer

    /**
     * Encodes the specified Extra message, length delimited. Does not implicitly {@link vessels.Extra.verify|verify} messages.
     * @param message Extra message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.Extra.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes an Extra message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.Extra & vessels.Extra.$Shape} Extra
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.Extra & vessels.Extra.$Shape

    /**
     * Decodes an Extra message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.Extra & vessels.Extra.$Shape} Extra
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.Extra & vessels.Extra.$Shape

    /**
     * Verifies an Extra message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates an Extra message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Extra
     */
    static fromObject(object: { [k: string]: any }): vessels.Extra

    /**
     * Creates a plain object from an Extra message. Also converts values to other types if specified.
     * @param message Extra
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.Extra,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this Extra to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for Extra
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace Extra {
    /** Properties of an Extra. */
    interface $Properties {
      /** Extra id */
      id?: string | null

      /** Extra label */
      label?: string | null

      /** Extra value */
      value?: number | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of an Extra. */
    type $Shape = vessels.Extra.$Properties
  }

  /**
   * Properties of a StartEndValue.
   * @deprecated Use vessels.StartEndValue.$Properties instead.
   */
  interface IStartEndValue extends vessels.StartEndValue.$Properties {}

  /** Represents a StartEndValue. */
  class StartEndValue {
    /**
     * Constructs a new StartEndValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.StartEndValue.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** StartEndValue start. */
    start: string

    /** StartEndValue end. */
    end: string

    /** StartEndValue value. */
    value: string

    /**
     * Creates a new StartEndValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StartEndValue instance
     */
    static create(
      properties: vessels.StartEndValue.$Shape
    ): vessels.StartEndValue & vessels.StartEndValue.$Shape
    static create(properties?: vessels.StartEndValue.$Properties): vessels.StartEndValue

    /**
     * Encodes the specified StartEndValue message. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
     * @param message StartEndValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.StartEndValue.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified StartEndValue message, length delimited. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
     * @param message StartEndValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.StartEndValue.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a StartEndValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.StartEndValue & vessels.StartEndValue.$Shape} StartEndValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.StartEndValue & vessels.StartEndValue.$Shape

    /**
     * Decodes a StartEndValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.StartEndValue & vessels.StartEndValue.$Shape} StartEndValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.StartEndValue & vessels.StartEndValue.$Shape

    /**
     * Verifies a StartEndValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a StartEndValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StartEndValue
     */
    static fromObject(object: { [k: string]: any }): vessels.StartEndValue

    /**
     * Creates a plain object from a StartEndValue message. Also converts values to other types if specified.
     * @param message StartEndValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.StartEndValue,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this StartEndValue to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for StartEndValue
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace StartEndValue {
    /** Properties of a StartEndValue. */
    interface $Properties {
      /** StartEndValue start */
      start?: string | null

      /** StartEndValue end */
      end?: string | null

      /** StartEndValue value */
      value?: string | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a StartEndValue. */
    type $Shape = vessels.StartEndValue.$Properties
  }
}
