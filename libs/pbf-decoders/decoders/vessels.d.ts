import * as $protobuf from "protobufjs";
/** Namespace vessels. */
export namespace vessels {

    /** Properties of a Track. */
    interface ITrack {

        /** Track data */
        data?: (number[]|null);
    }

    /** Represents a Track. */
    class Track implements ITrack {

        /**
         * Constructs a new Track.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.ITrack);

        /** Track data. */
        public data: number[];

        /**
         * Creates a new Track instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Track instance
         */
        public static create(properties?: vessels.ITrack): vessels.Track;

        /**
         * Encodes the specified Track message. Does not implicitly {@link vessels.Track.verify|verify} messages.
         * @param message Track message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.ITrack, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Track message, length delimited. Does not implicitly {@link vessels.Track.verify|verify} messages.
         * @param message Track message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.ITrack, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Track message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Track
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.Track;

        /**
         * Decodes a Track message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Track
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.Track;

        /**
         * Verifies a Track message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Track message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Track
         */
        public static fromObject(object: { [k: string]: any }): vessels.Track;

        /**
         * Creates a plain object from a Track message. Also converts values to other types if specified.
         * @param message Track
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.Track, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Track to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TilesetVesselQuery. */
    interface ITilesetVesselQuery {

        /** TilesetVesselQuery query */
        query?: (string|null);

        /** TilesetVesselQuery total */
        total?: (number|null);

        /** TilesetVesselQuery limit */
        limit?: (number|null);

        /** TilesetVesselQuery offset */
        offset?: (number|null);

        /** TilesetVesselQuery nextOffset */
        nextOffset?: (number|null);

        /** TilesetVesselQuery entries */
        entries?: (vessels.ITilesetVesselInfo[]|null);
    }

    /** Represents a TilesetVesselQuery. */
    class TilesetVesselQuery implements ITilesetVesselQuery {

        /**
         * Constructs a new TilesetVesselQuery.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.ITilesetVesselQuery);

        /** TilesetVesselQuery query. */
        public query: string;

        /** TilesetVesselQuery total. */
        public total: number;

        /** TilesetVesselQuery limit. */
        public limit: number;

        /** TilesetVesselQuery offset. */
        public offset: number;

        /** TilesetVesselQuery nextOffset. */
        public nextOffset: number;

        /** TilesetVesselQuery entries. */
        public entries: vessels.ITilesetVesselInfo[];

        /**
         * Creates a new TilesetVesselQuery instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TilesetVesselQuery instance
         */
        public static create(properties?: vessels.ITilesetVesselQuery): vessels.TilesetVesselQuery;

        /**
         * Encodes the specified TilesetVesselQuery message. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
         * @param message TilesetVesselQuery message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.ITilesetVesselQuery, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TilesetVesselQuery message, length delimited. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
         * @param message TilesetVesselQuery message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.ITilesetVesselQuery, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TilesetVesselQuery message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TilesetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.TilesetVesselQuery;

        /**
         * Decodes a TilesetVesselQuery message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TilesetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.TilesetVesselQuery;

        /**
         * Verifies a TilesetVesselQuery message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TilesetVesselQuery message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TilesetVesselQuery
         */
        public static fromObject(object: { [k: string]: any }): vessels.TilesetVesselQuery;

        /**
         * Creates a plain object from a TilesetVesselQuery message. Also converts values to other types if specified.
         * @param message TilesetVesselQuery
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.TilesetVesselQuery, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TilesetVesselQuery to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TilesetVesselInfo. */
    interface ITilesetVesselInfo {

        /** TilesetVesselInfo id */
        id?: (string|null);

        /** TilesetVesselInfo name */
        name?: (string|null);

        /** TilesetVesselInfo end */
        end?: (string|null);

        /** TilesetVesselInfo start */
        start?: (string|null);

        /** TilesetVesselInfo ssvid */
        ssvid?: (string|null);

        /** TilesetVesselInfo callsign */
        callsign?: (string|null);

        /** TilesetVesselInfo vesselId */
        vesselId?: (string|null);

        /** TilesetVesselInfo tilesetId */
        tilesetId?: (string|null);
    }

    /** Represents a TilesetVesselInfo. */
    class TilesetVesselInfo implements ITilesetVesselInfo {

        /**
         * Constructs a new TilesetVesselInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.ITilesetVesselInfo);

        /** TilesetVesselInfo id. */
        public id: string;

        /** TilesetVesselInfo name. */
        public name: string;

        /** TilesetVesselInfo end. */
        public end: string;

        /** TilesetVesselInfo start. */
        public start: string;

        /** TilesetVesselInfo ssvid. */
        public ssvid: string;

        /** TilesetVesselInfo callsign. */
        public callsign: string;

        /** TilesetVesselInfo vesselId. */
        public vesselId: string;

        /** TilesetVesselInfo tilesetId. */
        public tilesetId: string;

        /**
         * Creates a new TilesetVesselInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TilesetVesselInfo instance
         */
        public static create(properties?: vessels.ITilesetVesselInfo): vessels.TilesetVesselInfo;

        /**
         * Encodes the specified TilesetVesselInfo message. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
         * @param message TilesetVesselInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.ITilesetVesselInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TilesetVesselInfo message, length delimited. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
         * @param message TilesetVesselInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.ITilesetVesselInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TilesetVesselInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TilesetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.TilesetVesselInfo;

        /**
         * Decodes a TilesetVesselInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TilesetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.TilesetVesselInfo;

        /**
         * Verifies a TilesetVesselInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TilesetVesselInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TilesetVesselInfo
         */
        public static fromObject(object: { [k: string]: any }): vessels.TilesetVesselInfo;

        /**
         * Creates a plain object from a TilesetVesselInfo message. Also converts values to other types if specified.
         * @param message TilesetVesselInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.TilesetVesselInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TilesetVesselInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DatasetVesselV1Query. */
    interface IDatasetVesselV1Query {

        /** DatasetVesselV1Query dataset */
        dataset?: (string|null);

        /** DatasetVesselV1Query results */
        results?: (vessels.IDatasetVesselQuery[]|null);
    }

    /** Represents a DatasetVesselV1Query. */
    class DatasetVesselV1Query implements IDatasetVesselV1Query {

        /**
         * Constructs a new DatasetVesselV1Query.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.IDatasetVesselV1Query);

        /** DatasetVesselV1Query dataset. */
        public dataset: string;

        /** DatasetVesselV1Query results. */
        public results: vessels.IDatasetVesselQuery[];

        /**
         * Creates a new DatasetVesselV1Query instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DatasetVesselV1Query instance
         */
        public static create(properties?: vessels.IDatasetVesselV1Query): vessels.DatasetVesselV1Query;

        /**
         * Encodes the specified DatasetVesselV1Query message. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
         * @param message DatasetVesselV1Query message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.IDatasetVesselV1Query, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DatasetVesselV1Query message, length delimited. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
         * @param message DatasetVesselV1Query message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.IDatasetVesselV1Query, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DatasetVesselV1Query message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DatasetVesselV1Query
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.DatasetVesselV1Query;

        /**
         * Decodes a DatasetVesselV1Query message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DatasetVesselV1Query
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.DatasetVesselV1Query;

        /**
         * Verifies a DatasetVesselV1Query message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DatasetVesselV1Query message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DatasetVesselV1Query
         */
        public static fromObject(object: { [k: string]: any }): vessels.DatasetVesselV1Query;

        /**
         * Creates a plain object from a DatasetVesselV1Query message. Also converts values to other types if specified.
         * @param message DatasetVesselV1Query
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.DatasetVesselV1Query, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DatasetVesselV1Query to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DatasetVesselQuery. */
    interface IDatasetVesselQuery {

        /** DatasetVesselQuery query */
        query?: (string|null);

        /** DatasetVesselQuery total */
        total?: (number|null);

        /** DatasetVesselQuery limit */
        limit?: (number|null);

        /** DatasetVesselQuery offset */
        offset?: (number|null);

        /** DatasetVesselQuery nextOffset */
        nextOffset?: (number|null);

        /** DatasetVesselQuery entries */
        entries?: (vessels.IDatasetVesselInfo[]|null);
    }

    /** Represents a DatasetVesselQuery. */
    class DatasetVesselQuery implements IDatasetVesselQuery {

        /**
         * Constructs a new DatasetVesselQuery.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.IDatasetVesselQuery);

        /** DatasetVesselQuery query. */
        public query: string;

        /** DatasetVesselQuery total. */
        public total: number;

        /** DatasetVesselQuery limit. */
        public limit: number;

        /** DatasetVesselQuery offset. */
        public offset: number;

        /** DatasetVesselQuery nextOffset. */
        public nextOffset: number;

        /** DatasetVesselQuery entries. */
        public entries: vessels.IDatasetVesselInfo[];

        /**
         * Creates a new DatasetVesselQuery instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DatasetVesselQuery instance
         */
        public static create(properties?: vessels.IDatasetVesselQuery): vessels.DatasetVesselQuery;

        /**
         * Encodes the specified DatasetVesselQuery message. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
         * @param message DatasetVesselQuery message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.IDatasetVesselQuery, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DatasetVesselQuery message, length delimited. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
         * @param message DatasetVesselQuery message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.IDatasetVesselQuery, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DatasetVesselQuery message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DatasetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.DatasetVesselQuery;

        /**
         * Decodes a DatasetVesselQuery message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DatasetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.DatasetVesselQuery;

        /**
         * Verifies a DatasetVesselQuery message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DatasetVesselQuery message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DatasetVesselQuery
         */
        public static fromObject(object: { [k: string]: any }): vessels.DatasetVesselQuery;

        /**
         * Creates a plain object from a DatasetVesselQuery message. Also converts values to other types if specified.
         * @param message DatasetVesselQuery
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.DatasetVesselQuery, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DatasetVesselQuery to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DatasetVesselInfo. */
    interface IDatasetVesselInfo {

        /** DatasetVesselInfo id */
        id?: (string|null);

        /** DatasetVesselInfo name */
        name?: (string|null);

        /** DatasetVesselInfo imo */
        imo?: (string|null);

        /** DatasetVesselInfo ssvid */
        ssvid?: (string|null);

        /** DatasetVesselInfo vesselId */
        vesselId?: (string|null);

        /** DatasetVesselInfo type */
        type?: (string|null);

        /** DatasetVesselInfo dataset */
        dataset?: (string|null);

        /** DatasetVesselInfo authorizations */
        authorizations?: (vessels.IStartEndValue[]|null);

        /** DatasetVesselInfo extra */
        extra?: (vessels.IExtra[]|null);

        /** DatasetVesselInfo mmsi */
        mmsi?: (vessels.IStartEndValue[]|null);

        /** DatasetVesselInfo callsign */
        callsign?: (vessels.IStartEndValue[]|null);

        /** DatasetVesselInfo flags */
        flags?: (vessels.IStartEndValue[]|null);
    }

    /** Represents a DatasetVesselInfo. */
    class DatasetVesselInfo implements IDatasetVesselInfo {

        /**
         * Constructs a new DatasetVesselInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.IDatasetVesselInfo);

        /** DatasetVesselInfo id. */
        public id: string;

        /** DatasetVesselInfo name. */
        public name: string;

        /** DatasetVesselInfo imo. */
        public imo: string;

        /** DatasetVesselInfo ssvid. */
        public ssvid: string;

        /** DatasetVesselInfo vesselId. */
        public vesselId: string;

        /** DatasetVesselInfo type. */
        public type: string;

        /** DatasetVesselInfo dataset. */
        public dataset: string;

        /** DatasetVesselInfo authorizations. */
        public authorizations: vessels.IStartEndValue[];

        /** DatasetVesselInfo extra. */
        public extra: vessels.IExtra[];

        /** DatasetVesselInfo mmsi. */
        public mmsi: vessels.IStartEndValue[];

        /** DatasetVesselInfo callsign. */
        public callsign: vessels.IStartEndValue[];

        /** DatasetVesselInfo flags. */
        public flags: vessels.IStartEndValue[];

        /**
         * Creates a new DatasetVesselInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DatasetVesselInfo instance
         */
        public static create(properties?: vessels.IDatasetVesselInfo): vessels.DatasetVesselInfo;

        /**
         * Encodes the specified DatasetVesselInfo message. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
         * @param message DatasetVesselInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.IDatasetVesselInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DatasetVesselInfo message, length delimited. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
         * @param message DatasetVesselInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.IDatasetVesselInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DatasetVesselInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DatasetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.DatasetVesselInfo;

        /**
         * Decodes a DatasetVesselInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DatasetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.DatasetVesselInfo;

        /**
         * Verifies a DatasetVesselInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DatasetVesselInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DatasetVesselInfo
         */
        public static fromObject(object: { [k: string]: any }): vessels.DatasetVesselInfo;

        /**
         * Creates a plain object from a DatasetVesselInfo message. Also converts values to other types if specified.
         * @param message DatasetVesselInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.DatasetVesselInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DatasetVesselInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Extra. */
    interface IExtra {

        /** Extra id */
        id?: (string|null);

        /** Extra label */
        label?: (string|null);

        /** Extra value */
        value?: (number|null);
    }

    /** Represents an Extra. */
    class Extra implements IExtra {

        /**
         * Constructs a new Extra.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.IExtra);

        /** Extra id. */
        public id: string;

        /** Extra label. */
        public label: string;

        /** Extra value. */
        public value: number;

        /**
         * Creates a new Extra instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Extra instance
         */
        public static create(properties?: vessels.IExtra): vessels.Extra;

        /**
         * Encodes the specified Extra message. Does not implicitly {@link vessels.Extra.verify|verify} messages.
         * @param message Extra message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.IExtra, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Extra message, length delimited. Does not implicitly {@link vessels.Extra.verify|verify} messages.
         * @param message Extra message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.IExtra, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Extra message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Extra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.Extra;

        /**
         * Decodes an Extra message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Extra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.Extra;

        /**
         * Verifies an Extra message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Extra message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Extra
         */
        public static fromObject(object: { [k: string]: any }): vessels.Extra;

        /**
         * Creates a plain object from an Extra message. Also converts values to other types if specified.
         * @param message Extra
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.Extra, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Extra to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StartEndValue. */
    interface IStartEndValue {

        /** StartEndValue start */
        start?: (string|null);

        /** StartEndValue end */
        end?: (string|null);

        /** StartEndValue value */
        value?: (string|null);
    }

    /** Represents a StartEndValue. */
    class StartEndValue implements IStartEndValue {

        /**
         * Constructs a new StartEndValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: vessels.IStartEndValue);

        /** StartEndValue start. */
        public start: string;

        /** StartEndValue end. */
        public end: string;

        /** StartEndValue value. */
        public value: string;

        /**
         * Creates a new StartEndValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StartEndValue instance
         */
        public static create(properties?: vessels.IStartEndValue): vessels.StartEndValue;

        /**
         * Encodes the specified StartEndValue message. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
         * @param message StartEndValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: vessels.IStartEndValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StartEndValue message, length delimited. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
         * @param message StartEndValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: vessels.IStartEndValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StartEndValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StartEndValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): vessels.StartEndValue;

        /**
         * Decodes a StartEndValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StartEndValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): vessels.StartEndValue;

        /**
         * Verifies a StartEndValue message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StartEndValue message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StartEndValue
         */
        public static fromObject(object: { [k: string]: any }): vessels.StartEndValue;

        /**
         * Creates a plain object from a StartEndValue message. Also converts values to other types if specified.
         * @param message StartEndValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: vessels.StartEndValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StartEndValue to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
