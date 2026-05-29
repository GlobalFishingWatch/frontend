import * as $protobuf from 'protobufjs'
import Long = require('long')
/** Namespace vessels. */
export namespace vessels {
  /** Properties of a DeckTrackAttribute. */
  interface IDeckTrackAttribute {
    /** DeckTrackAttribute value */
    value?: number[] | null

    /** DeckTrackAttribute size */
    size?: number | null

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]
  }

  /** Represents a DeckTrackAttribute. */
  class DeckTrackAttribute implements IDeckTrackAttribute {
    /**
     * Constructs a new DeckTrackAttribute.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.IDeckTrackAttribute)

    /** Unknown fields preserved while decoding */
    public $unknowns?: Uint8Array[]

    /** DeckTrackAttribute value. */
    public value: number[]

    /** DeckTrackAttribute size. */
    public size: number

    /**
     * Creates a new DeckTrackAttribute instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeckTrackAttribute instance
     */
    public static create(properties?: vessels.IDeckTrackAttribute): vessels.DeckTrackAttribute

    /**
     * Encodes the specified DeckTrackAttribute message. Does not implicitly {@link vessels.DeckTrackAttribute.verify|verify} messages.
     * @param message DeckTrackAttribute message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: vessels.IDeckTrackAttribute,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DeckTrackAttribute message, length delimited. Does not implicitly {@link vessels.DeckTrackAttribute.verify|verify} messages.
     * @param message DeckTrackAttribute message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: vessels.IDeckTrackAttribute,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DeckTrackAttribute message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DeckTrackAttribute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DeckTrackAttribute

    /**
     * Decodes a DeckTrackAttribute message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DeckTrackAttribute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): vessels.DeckTrackAttribute

    /**
     * Verifies a DeckTrackAttribute message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DeckTrackAttribute message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeckTrackAttribute
     */
    public static fromObject(object: { [k: string]: any }): vessels.DeckTrackAttribute

    /**
     * Creates a plain object from a DeckTrackAttribute message. Also converts values to other types if specified.
     * @param message DeckTrackAttribute
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: vessels.DeckTrackAttribute,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DeckTrackAttribute to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DeckTrackAttribute
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    public static getTypeUrl(prefix?: string): string
  }

  /** Properties of a DeckTrackAttributeStruct. */
  interface IDeckTrackAttributeStruct {
    /** DeckTrackAttributeStruct getPath */
    getPath?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getTimestamp */
    getTimestamp?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getSpeed */
    getSpeed?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getElevation */
    getElevation?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getCourse */
    getCourse?: vessels.IDeckTrackAttribute | null

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]
  }

  /** Represents a DeckTrackAttributeStruct. */
  class DeckTrackAttributeStruct implements IDeckTrackAttributeStruct {
    /**
     * Constructs a new DeckTrackAttributeStruct.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.IDeckTrackAttributeStruct)

    /** Unknown fields preserved while decoding */
    public $unknowns?: Uint8Array[]

    /** DeckTrackAttributeStruct getPath. */
    public getPath?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getTimestamp. */
    public getTimestamp?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getSpeed. */
    public getSpeed?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getElevation. */
    public getElevation?: vessels.IDeckTrackAttribute | null

    /** DeckTrackAttributeStruct getCourse. */
    public getCourse?: vessels.IDeckTrackAttribute | null

    /**
     * Creates a new DeckTrackAttributeStruct instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeckTrackAttributeStruct instance
     */
    public static create(
      properties?: vessels.IDeckTrackAttributeStruct
    ): vessels.DeckTrackAttributeStruct

    /**
     * Encodes the specified DeckTrackAttributeStruct message. Does not implicitly {@link vessels.DeckTrackAttributeStruct.verify|verify} messages.
     * @param message DeckTrackAttributeStruct message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: vessels.IDeckTrackAttributeStruct,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Encodes the specified DeckTrackAttributeStruct message, length delimited. Does not implicitly {@link vessels.DeckTrackAttributeStruct.verify|verify} messages.
     * @param message DeckTrackAttributeStruct message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: vessels.IDeckTrackAttributeStruct,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DeckTrackAttributeStruct message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DeckTrackAttributeStruct
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number
    ): vessels.DeckTrackAttributeStruct

    /**
     * Decodes a DeckTrackAttributeStruct message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DeckTrackAttributeStruct
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array
    ): vessels.DeckTrackAttributeStruct

    /**
     * Verifies a DeckTrackAttributeStruct message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DeckTrackAttributeStruct message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeckTrackAttributeStruct
     */
    public static fromObject(object: { [k: string]: any }): vessels.DeckTrackAttributeStruct

    /**
     * Creates a plain object from a DeckTrackAttributeStruct message. Also converts values to other types if specified.
     * @param message DeckTrackAttributeStruct
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: vessels.DeckTrackAttributeStruct,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DeckTrackAttributeStruct to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DeckTrackAttributeStruct
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    public static getTypeUrl(prefix?: string): string
  }

  /** Properties of a DeckTrack. */
  interface IDeckTrack {
    /** DeckTrack length */
    length?: number | null

    /** DeckTrack startIndices */
    startIndices?: number[] | null

    /** DeckTrack attributes */
    attributes?: vessels.IDeckTrackAttributeStruct | null

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[]
  }

  /** Represents a DeckTrack. */
  class DeckTrack implements IDeckTrack {
    /**
     * Constructs a new DeckTrack.
     * @param [properties] Properties to set
     */
    constructor(properties?: vessels.IDeckTrack)

    /** Unknown fields preserved while decoding */
    public $unknowns?: Uint8Array[]

    /** DeckTrack length. */
    public length: number

    /** DeckTrack startIndices. */
    public startIndices: number[]

    /** DeckTrack attributes. */
    public attributes?: vessels.IDeckTrackAttributeStruct | null

    /**
     * Creates a new DeckTrack instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeckTrack instance
     */
    public static create(properties?: vessels.IDeckTrack): vessels.DeckTrack

    /**
     * Encodes the specified DeckTrack message. Does not implicitly {@link vessels.DeckTrack.verify|verify} messages.
     * @param message DeckTrack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: vessels.IDeckTrack, writer?: $protobuf.Writer): $protobuf.Writer

    /**
     * Encodes the specified DeckTrack message, length delimited. Does not implicitly {@link vessels.DeckTrack.verify|verify} messages.
     * @param message DeckTrack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: vessels.IDeckTrack,
      writer?: $protobuf.Writer
    ): $protobuf.Writer

    /**
     * Decodes a DeckTrack message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DeckTrack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): vessels.DeckTrack

    /**
     * Decodes a DeckTrack message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DeckTrack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): vessels.DeckTrack

    /**
     * Verifies a DeckTrack message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null

    /**
     * Creates a DeckTrack message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeckTrack
     */
    public static fromObject(object: { [k: string]: any }): vessels.DeckTrack

    /**
     * Creates a plain object from a DeckTrack message. Also converts values to other types if specified.
     * @param message DeckTrack
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: vessels.DeckTrack,
      options?: $protobuf.IConversionOptions
    ): { [k: string]: any }

    /**
     * Converts this DeckTrack to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any }

    /**
     * Gets the type url for DeckTrack
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    public static getTypeUrl(prefix?: string): string
  }
}
