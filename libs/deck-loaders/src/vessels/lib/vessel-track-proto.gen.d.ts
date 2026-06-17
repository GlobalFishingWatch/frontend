import * as $protobuf from 'protobufjs'
import Long = require('long')

/** Namespace vessels. */
export namespace vessels {
  /**
   * Properties of a DeckTrackAttribute.
   * @deprecated Use vessels.DeckTrackAttribute.$Properties instead.
   */
  interface IDeckTrackAttribute extends vessels.DeckTrackAttribute.$Properties {}

  /** Represents a DeckTrackAttribute. */
  class DeckTrackAttribute {
    /**
     * Constructs a new DeckTrackAttribute.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.DeckTrackAttribute.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** DeckTrackAttribute value. */
    value: number[]

    /** DeckTrackAttribute size. */
    size: number

    /**
     * Creates a new DeckTrackAttribute instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeckTrackAttribute instance
     */
    static create(
      properties: vessels.DeckTrackAttribute.$Shape
    ): vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape
    static create(properties?: vessels.DeckTrackAttribute.$Properties): vessels.DeckTrackAttribute

    /**
     * Encodes the specified DeckTrackAttribute message. Does not implicitly {@link vessels.DeckTrackAttribute.verify|verify} messages.
     * @param message DeckTrackAttribute message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.DeckTrackAttribute.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DeckTrackAttribute message, length delimited. Does not implicitly {@link vessels.DeckTrackAttribute.verify|verify} messages.
     * @param message DeckTrackAttribute message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.DeckTrackAttribute.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DeckTrackAttribute message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape} DeckTrackAttribute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape

    /**
     * Decodes a DeckTrackAttribute message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape} DeckTrackAttribute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape

    /**
     * Verifies a DeckTrackAttribute message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DeckTrackAttribute message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeckTrackAttribute
     */
    static fromObject(object: { [k: string]: any }): vessels.DeckTrackAttribute

    /**
     * Creates a plain object from a DeckTrackAttribute message. Also converts values to other types if specified.
     * @param message DeckTrackAttribute
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.DeckTrackAttribute,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DeckTrackAttribute to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DeckTrackAttribute
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace DeckTrackAttribute {
    /** Properties of a DeckTrackAttribute. */
    interface $Properties {
      /** DeckTrackAttribute value */
      value?: number[] | null

      /** DeckTrackAttribute size */
      size?: number | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a DeckTrackAttribute. */
    type $Shape = vessels.DeckTrackAttribute.$Properties
  }

  /**
   * Properties of a DeckTrackAttributeStruct.
   * @deprecated Use vessels.DeckTrackAttributeStruct.$Properties instead.
   */
  interface IDeckTrackAttributeStruct extends vessels.DeckTrackAttributeStruct.$Properties {}

  /** Represents a DeckTrackAttributeStruct. */
  class DeckTrackAttributeStruct {
    /**
     * Constructs a new DeckTrackAttributeStruct.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.DeckTrackAttributeStruct.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** DeckTrackAttributeStruct getPath. */
    getPath?: vessels.DeckTrackAttribute.$Properties | null

    /** DeckTrackAttributeStruct getTimestamp. */
    getTimestamp?: vessels.DeckTrackAttribute.$Properties | null

    /** DeckTrackAttributeStruct getSpeed. */
    getSpeed?: vessels.DeckTrackAttribute.$Properties | null

    /** DeckTrackAttributeStruct getElevation. */
    getElevation?: vessels.DeckTrackAttribute.$Properties | null

    /** DeckTrackAttributeStruct getCourse. */
    getCourse?: vessels.DeckTrackAttribute.$Properties | null

    /**
     * Creates a new DeckTrackAttributeStruct instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeckTrackAttributeStruct instance
     */
    static create(
      properties: vessels.DeckTrackAttributeStruct.$Shape
    ): vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape
    static create(
      properties?: vessels.DeckTrackAttributeStruct.$Properties
    ): vessels.DeckTrackAttributeStruct

    /**
     * Encodes the specified DeckTrackAttributeStruct message. Does not implicitly {@link vessels.DeckTrackAttributeStruct.verify|verify} messages.
     * @param message DeckTrackAttributeStruct message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.DeckTrackAttributeStruct.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DeckTrackAttributeStruct message, length delimited. Does not implicitly {@link vessels.DeckTrackAttributeStruct.verify|verify} messages.
     * @param message DeckTrackAttributeStruct message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.DeckTrackAttributeStruct.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DeckTrackAttributeStruct message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape} DeckTrackAttributeStruct
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape

    /**
     * Decodes a DeckTrackAttributeStruct message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape} DeckTrackAttributeStruct
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape

    /**
     * Verifies a DeckTrackAttributeStruct message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DeckTrackAttributeStruct message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeckTrackAttributeStruct
     */
    static fromObject(object: { [k: string]: any }): vessels.DeckTrackAttributeStruct

    /**
     * Creates a plain object from a DeckTrackAttributeStruct message. Also converts values to other types if specified.
     * @param message DeckTrackAttributeStruct
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.DeckTrackAttributeStruct,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DeckTrackAttributeStruct to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DeckTrackAttributeStruct
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace DeckTrackAttributeStruct {
    /** Properties of a DeckTrackAttributeStruct. */
    interface $Properties {
      /** DeckTrackAttributeStruct getPath */
      getPath?: vessels.DeckTrackAttribute.$Properties | null

      /** DeckTrackAttributeStruct getTimestamp */
      getTimestamp?: vessels.DeckTrackAttribute.$Properties | null

      /** DeckTrackAttributeStruct getSpeed */
      getSpeed?: vessels.DeckTrackAttribute.$Properties | null

      /** DeckTrackAttributeStruct getElevation */
      getElevation?: vessels.DeckTrackAttribute.$Properties | null

      /** DeckTrackAttributeStruct getCourse */
      getCourse?: vessels.DeckTrackAttribute.$Properties | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a DeckTrackAttributeStruct. */
    type $Shape = vessels.DeckTrackAttributeStruct.$Properties
  }

  /**
   * Properties of a DeckTrack.
   * @deprecated Use vessels.DeckTrack.$Properties instead.
   */
  interface IDeckTrack extends vessels.DeckTrack.$Properties {}

  /** Represents a DeckTrack. */
  class DeckTrack {
    /**
     * Constructs a new DeckTrack.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.DeckTrack.$Properties)

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]

    /** DeckTrack length. */
    length: number

    /** DeckTrack startIndices. */
    startIndices: number[]

    /** DeckTrack attributes. */
    attributes?: vessels.DeckTrackAttributeStruct.$Properties | null

    /**
     * Creates a new DeckTrack instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeckTrack instance
     */
    static create(
      properties: vessels.DeckTrack.$Shape
    ): vessels.DeckTrack & vessels.DeckTrack.$Shape
    static create(properties?: vessels.DeckTrack.$Properties): vessels.DeckTrack

    /**
     * Encodes the specified DeckTrack message. Does not implicitly {@link vessels.DeckTrack.verify|verify} messages.
     * @param message DeckTrack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: vessels.DeckTrack.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DeckTrack message, length delimited. Does not implicitly {@link vessels.DeckTrack.verify|verify} messages.
     * @param message DeckTrack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: vessels.DeckTrack.$Properties,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DeckTrack message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {vessels.DeckTrack & vessels.DeckTrack.$Shape} DeckTrack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DeckTrack & vessels.DeckTrack.$Shape

    /**
     * Decodes a DeckTrack message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {vessels.DeckTrack & vessels.DeckTrack.$Shape} DeckTrack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.DeckTrack & vessels.DeckTrack.$Shape

    /**
     * Verifies a DeckTrack message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DeckTrack message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeckTrack
     */
    static fromObject(object: { [k: string]: any }): vessels.DeckTrack

    /**
     * Creates a plain object from a DeckTrack message. Also converts values to other types if specified.
     * @param message DeckTrack
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: vessels.DeckTrack,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DeckTrack to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DeckTrack
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string
  }

  namespace DeckTrack {
    /** Properties of a DeckTrack. */
    interface $Properties {
      /** DeckTrack length */
      length?: number | null

      /** DeckTrack startIndices */
      startIndices?: number[] | null

      /** DeckTrack attributes */
      attributes?: vessels.DeckTrackAttributeStruct.$Properties | null

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[]
    }

    /** Shape of a DeckTrack. */
    type $Shape = vessels.DeckTrack.$Properties
  }
}
