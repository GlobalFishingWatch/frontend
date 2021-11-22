/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.vessels = (function() {

    /**
     * Namespace vessels.
     * @exports vessels
     * @namespace
     */
    var vessels = {};

    vessels.Track = (function() {

        /**
         * Properties of a Track.
         * @memberof vessels
         * @interface ITrack
         * @property {Array.<number>|null} [data] Track data
         */

        /**
         * Constructs a new Track.
         * @memberof vessels
         * @classdesc Represents a Track.
         * @implements ITrack
         * @constructor
         * @param {vessels.ITrack=} [properties] Properties to set
         */
        function Track(properties) {
            this.data = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Track data.
         * @member {Array.<number>} data
         * @memberof vessels.Track
         * @instance
         */
        Track.prototype.data = $util.emptyArray;

        /**
         * Creates a new Track instance using the specified properties.
         * @function create
         * @memberof vessels.Track
         * @static
         * @param {vessels.ITrack=} [properties] Properties to set
         * @returns {vessels.Track} Track instance
         */
        Track.create = function create(properties) {
            return new Track(properties);
        };

        /**
         * Encodes the specified Track message. Does not implicitly {@link vessels.Track.verify|verify} messages.
         * @function encode
         * @memberof vessels.Track
         * @static
         * @param {vessels.ITrack} message Track message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Track.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && message.data.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.data.length; ++i)
                    writer.sint32(message.data[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified Track message, length delimited. Does not implicitly {@link vessels.Track.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.Track
         * @static
         * @param {vessels.ITrack} message Track message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Track.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Track message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.Track
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.Track} Track
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Track.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.Track();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.data && message.data.length))
                        message.data = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.data.push(reader.sint32());
                    } else
                        message.data.push(reader.sint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Track message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.Track
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.Track} Track
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Track.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Track message.
         * @function verify
         * @memberof vessels.Track
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Track.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (var i = 0; i < message.data.length; ++i)
                    if (!$util.isInteger(message.data[i]))
                        return "data: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a Track message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.Track
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.Track} Track
         */
        Track.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.Track)
                return object;
            var message = new $root.vessels.Track();
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".vessels.Track.data: array expected");
                message.data = [];
                for (var i = 0; i < object.data.length; ++i)
                    message.data[i] = object.data[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a Track message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.Track
         * @static
         * @param {vessels.Track} message Track
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Track.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (message.data && message.data.length) {
                object.data = [];
                for (var j = 0; j < message.data.length; ++j)
                    object.data[j] = message.data[j];
            }
            return object;
        };

        /**
         * Converts this Track to JSON.
         * @function toJSON
         * @memberof vessels.Track
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Track.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Track;
    })();

    vessels.TilesetVesselQuery = (function() {

        /**
         * Properties of a TilesetVesselQuery.
         * @memberof vessels
         * @interface ITilesetVesselQuery
         * @property {string|null} [query] TilesetVesselQuery query
         * @property {number|null} [total] TilesetVesselQuery total
         * @property {number|null} [limit] TilesetVesselQuery limit
         * @property {number|null} [offset] TilesetVesselQuery offset
         * @property {number|null} [nextOffset] TilesetVesselQuery nextOffset
         * @property {Array.<vessels.ITilesetVesselInfo>|null} [entries] TilesetVesselQuery entries
         */

        /**
         * Constructs a new TilesetVesselQuery.
         * @memberof vessels
         * @classdesc Represents a TilesetVesselQuery.
         * @implements ITilesetVesselQuery
         * @constructor
         * @param {vessels.ITilesetVesselQuery=} [properties] Properties to set
         */
        function TilesetVesselQuery(properties) {
            this.entries = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TilesetVesselQuery query.
         * @member {string} query
         * @memberof vessels.TilesetVesselQuery
         * @instance
         */
        TilesetVesselQuery.prototype.query = "";

        /**
         * TilesetVesselQuery total.
         * @member {number} total
         * @memberof vessels.TilesetVesselQuery
         * @instance
         */
        TilesetVesselQuery.prototype.total = 0;

        /**
         * TilesetVesselQuery limit.
         * @member {number} limit
         * @memberof vessels.TilesetVesselQuery
         * @instance
         */
        TilesetVesselQuery.prototype.limit = 0;

        /**
         * TilesetVesselQuery offset.
         * @member {number} offset
         * @memberof vessels.TilesetVesselQuery
         * @instance
         */
        TilesetVesselQuery.prototype.offset = 0;

        /**
         * TilesetVesselQuery nextOffset.
         * @member {number} nextOffset
         * @memberof vessels.TilesetVesselQuery
         * @instance
         */
        TilesetVesselQuery.prototype.nextOffset = 0;

        /**
         * TilesetVesselQuery entries.
         * @member {Array.<vessels.ITilesetVesselInfo>} entries
         * @memberof vessels.TilesetVesselQuery
         * @instance
         */
        TilesetVesselQuery.prototype.entries = $util.emptyArray;

        /**
         * Creates a new TilesetVesselQuery instance using the specified properties.
         * @function create
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {vessels.ITilesetVesselQuery=} [properties] Properties to set
         * @returns {vessels.TilesetVesselQuery} TilesetVesselQuery instance
         */
        TilesetVesselQuery.create = function create(properties) {
            return new TilesetVesselQuery(properties);
        };

        /**
         * Encodes the specified TilesetVesselQuery message. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
         * @function encode
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {vessels.ITilesetVesselQuery} message TilesetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselQuery.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.query != null && Object.hasOwnProperty.call(message, "query"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.query);
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.total);
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.limit);
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.offset);
            if (message.nextOffset != null && Object.hasOwnProperty.call(message, "nextOffset"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.nextOffset);
            if (message.entries != null && message.entries.length)
                for (var i = 0; i < message.entries.length; ++i)
                    $root.vessels.TilesetVesselInfo.encode(message.entries[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TilesetVesselQuery message, length delimited. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {vessels.ITilesetVesselQuery} message TilesetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselQuery.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TilesetVesselQuery message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.TilesetVesselQuery} TilesetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TilesetVesselQuery.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.TilesetVesselQuery();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.query = reader.string();
                    break;
                case 2:
                    message.total = reader.uint32();
                    break;
                case 3:
                    message.limit = reader.uint32();
                    break;
                case 4:
                    message.offset = reader.uint32();
                    break;
                case 5:
                    message.nextOffset = reader.uint32();
                    break;
                case 6:
                    if (!(message.entries && message.entries.length))
                        message.entries = [];
                    message.entries.push($root.vessels.TilesetVesselInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TilesetVesselQuery message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.TilesetVesselQuery} TilesetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TilesetVesselQuery.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TilesetVesselQuery message.
         * @function verify
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TilesetVesselQuery.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.query != null && message.hasOwnProperty("query"))
                if (!$util.isString(message.query))
                    return "query: string expected";
            if (message.total != null && message.hasOwnProperty("total"))
                if (!$util.isInteger(message.total))
                    return "total: integer expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            if (message.offset != null && message.hasOwnProperty("offset"))
                if (!$util.isInteger(message.offset))
                    return "offset: integer expected";
            if (message.nextOffset != null && message.hasOwnProperty("nextOffset"))
                if (!$util.isInteger(message.nextOffset))
                    return "nextOffset: integer expected";
            if (message.entries != null && message.hasOwnProperty("entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (var i = 0; i < message.entries.length; ++i) {
                    var error = $root.vessels.TilesetVesselInfo.verify(message.entries[i]);
                    if (error)
                        return "entries." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TilesetVesselQuery message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.TilesetVesselQuery} TilesetVesselQuery
         */
        TilesetVesselQuery.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.TilesetVesselQuery)
                return object;
            var message = new $root.vessels.TilesetVesselQuery();
            if (object.query != null)
                message.query = String(object.query);
            if (object.total != null)
                message.total = object.total >>> 0;
            if (object.limit != null)
                message.limit = object.limit >>> 0;
            if (object.offset != null)
                message.offset = object.offset >>> 0;
            if (object.nextOffset != null)
                message.nextOffset = object.nextOffset >>> 0;
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".vessels.TilesetVesselQuery.entries: array expected");
                message.entries = [];
                for (var i = 0; i < object.entries.length; ++i) {
                    if (typeof object.entries[i] !== "object")
                        throw TypeError(".vessels.TilesetVesselQuery.entries: object expected");
                    message.entries[i] = $root.vessels.TilesetVesselInfo.fromObject(object.entries[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TilesetVesselQuery message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {vessels.TilesetVesselQuery} message TilesetVesselQuery
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TilesetVesselQuery.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (options.defaults) {
                object.query = "";
                object.total = 0;
                object.limit = 0;
                object.offset = 0;
                object.nextOffset = 0;
            }
            if (message.query != null && message.hasOwnProperty("query"))
                object.query = message.query;
            if (message.total != null && message.hasOwnProperty("total"))
                object.total = message.total;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            if (message.offset != null && message.hasOwnProperty("offset"))
                object.offset = message.offset;
            if (message.nextOffset != null && message.hasOwnProperty("nextOffset"))
                object.nextOffset = message.nextOffset;
            if (message.entries && message.entries.length) {
                object.entries = [];
                for (var j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.vessels.TilesetVesselInfo.toObject(message.entries[j], options);
            }
            return object;
        };

        /**
         * Converts this TilesetVesselQuery to JSON.
         * @function toJSON
         * @memberof vessels.TilesetVesselQuery
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TilesetVesselQuery.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TilesetVesselQuery;
    })();

    vessels.TilesetVesselInfo = (function() {

        /**
         * Properties of a TilesetVesselInfo.
         * @memberof vessels
         * @interface ITilesetVesselInfo
         * @property {string|null} [id] TilesetVesselInfo id
         * @property {string|null} [name] TilesetVesselInfo name
         * @property {string|null} [end] TilesetVesselInfo end
         * @property {string|null} [start] TilesetVesselInfo start
         * @property {string|null} [ssvid] TilesetVesselInfo ssvid
         * @property {string|null} [callsign] TilesetVesselInfo callsign
         * @property {string|null} [vesselId] TilesetVesselInfo vesselId
         * @property {string|null} [tilesetId] TilesetVesselInfo tilesetId
         */

        /**
         * Constructs a new TilesetVesselInfo.
         * @memberof vessels
         * @classdesc Represents a TilesetVesselInfo.
         * @implements ITilesetVesselInfo
         * @constructor
         * @param {vessels.ITilesetVesselInfo=} [properties] Properties to set
         */
        function TilesetVesselInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TilesetVesselInfo id.
         * @member {string} id
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.id = "";

        /**
         * TilesetVesselInfo name.
         * @member {string} name
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.name = "";

        /**
         * TilesetVesselInfo end.
         * @member {string} end
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.end = "";

        /**
         * TilesetVesselInfo start.
         * @member {string} start
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.start = "";

        /**
         * TilesetVesselInfo ssvid.
         * @member {string} ssvid
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.ssvid = "";

        /**
         * TilesetVesselInfo callsign.
         * @member {string} callsign
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.callsign = "";

        /**
         * TilesetVesselInfo vesselId.
         * @member {string} vesselId
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.vesselId = "";

        /**
         * TilesetVesselInfo tilesetId.
         * @member {string} tilesetId
         * @memberof vessels.TilesetVesselInfo
         * @instance
         */
        TilesetVesselInfo.prototype.tilesetId = "";

        /**
         * Creates a new TilesetVesselInfo instance using the specified properties.
         * @function create
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {vessels.ITilesetVesselInfo=} [properties] Properties to set
         * @returns {vessels.TilesetVesselInfo} TilesetVesselInfo instance
         */
        TilesetVesselInfo.create = function create(properties) {
            return new TilesetVesselInfo(properties);
        };

        /**
         * Encodes the specified TilesetVesselInfo message. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
         * @function encode
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {vessels.ITilesetVesselInfo} message TilesetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.end);
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.start);
            if (message.ssvid != null && Object.hasOwnProperty.call(message, "ssvid"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.ssvid);
            if (message.callsign != null && Object.hasOwnProperty.call(message, "callsign"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.callsign);
            if (message.vesselId != null && Object.hasOwnProperty.call(message, "vesselId"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.vesselId);
            if (message.tilesetId != null && Object.hasOwnProperty.call(message, "tilesetId"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.tilesetId);
            return writer;
        };

        /**
         * Encodes the specified TilesetVesselInfo message, length delimited. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {vessels.ITilesetVesselInfo} message TilesetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TilesetVesselInfo message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.TilesetVesselInfo} TilesetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TilesetVesselInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.TilesetVesselInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.end = reader.string();
                    break;
                case 4:
                    message.start = reader.string();
                    break;
                case 5:
                    message.ssvid = reader.string();
                    break;
                case 6:
                    message.callsign = reader.string();
                    break;
                case 7:
                    message.vesselId = reader.string();
                    break;
                case 8:
                    message.tilesetId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TilesetVesselInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.TilesetVesselInfo} TilesetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TilesetVesselInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TilesetVesselInfo message.
         * @function verify
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TilesetVesselInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.end != null && message.hasOwnProperty("end"))
                if (!$util.isString(message.end))
                    return "end: string expected";
            if (message.start != null && message.hasOwnProperty("start"))
                if (!$util.isString(message.start))
                    return "start: string expected";
            if (message.ssvid != null && message.hasOwnProperty("ssvid"))
                if (!$util.isString(message.ssvid))
                    return "ssvid: string expected";
            if (message.callsign != null && message.hasOwnProperty("callsign"))
                if (!$util.isString(message.callsign))
                    return "callsign: string expected";
            if (message.vesselId != null && message.hasOwnProperty("vesselId"))
                if (!$util.isString(message.vesselId))
                    return "vesselId: string expected";
            if (message.tilesetId != null && message.hasOwnProperty("tilesetId"))
                if (!$util.isString(message.tilesetId))
                    return "tilesetId: string expected";
            return null;
        };

        /**
         * Creates a TilesetVesselInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.TilesetVesselInfo} TilesetVesselInfo
         */
        TilesetVesselInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.TilesetVesselInfo)
                return object;
            var message = new $root.vessels.TilesetVesselInfo();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.end != null)
                message.end = String(object.end);
            if (object.start != null)
                message.start = String(object.start);
            if (object.ssvid != null)
                message.ssvid = String(object.ssvid);
            if (object.callsign != null)
                message.callsign = String(object.callsign);
            if (object.vesselId != null)
                message.vesselId = String(object.vesselId);
            if (object.tilesetId != null)
                message.tilesetId = String(object.tilesetId);
            return message;
        };

        /**
         * Creates a plain object from a TilesetVesselInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {vessels.TilesetVesselInfo} message TilesetVesselInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TilesetVesselInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.name = "";
                object.end = "";
                object.start = "";
                object.ssvid = "";
                object.callsign = "";
                object.vesselId = "";
                object.tilesetId = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.end != null && message.hasOwnProperty("end"))
                object.end = message.end;
            if (message.start != null && message.hasOwnProperty("start"))
                object.start = message.start;
            if (message.ssvid != null && message.hasOwnProperty("ssvid"))
                object.ssvid = message.ssvid;
            if (message.callsign != null && message.hasOwnProperty("callsign"))
                object.callsign = message.callsign;
            if (message.vesselId != null && message.hasOwnProperty("vesselId"))
                object.vesselId = message.vesselId;
            if (message.tilesetId != null && message.hasOwnProperty("tilesetId"))
                object.tilesetId = message.tilesetId;
            return object;
        };

        /**
         * Converts this TilesetVesselInfo to JSON.
         * @function toJSON
         * @memberof vessels.TilesetVesselInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TilesetVesselInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TilesetVesselInfo;
    })();

    vessels.DatasetVesselV1Query = (function() {

        /**
         * Properties of a DatasetVesselV1Query.
         * @memberof vessels
         * @interface IDatasetVesselV1Query
         * @property {string|null} [dataset] DatasetVesselV1Query dataset
         * @property {Array.<vessels.IDatasetVesselQuery>|null} [results] DatasetVesselV1Query results
         */

        /**
         * Constructs a new DatasetVesselV1Query.
         * @memberof vessels
         * @classdesc Represents a DatasetVesselV1Query.
         * @implements IDatasetVesselV1Query
         * @constructor
         * @param {vessels.IDatasetVesselV1Query=} [properties] Properties to set
         */
        function DatasetVesselV1Query(properties) {
            this.results = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DatasetVesselV1Query dataset.
         * @member {string} dataset
         * @memberof vessels.DatasetVesselV1Query
         * @instance
         */
        DatasetVesselV1Query.prototype.dataset = "";

        /**
         * DatasetVesselV1Query results.
         * @member {Array.<vessels.IDatasetVesselQuery>} results
         * @memberof vessels.DatasetVesselV1Query
         * @instance
         */
        DatasetVesselV1Query.prototype.results = $util.emptyArray;

        /**
         * Creates a new DatasetVesselV1Query instance using the specified properties.
         * @function create
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {vessels.IDatasetVesselV1Query=} [properties] Properties to set
         * @returns {vessels.DatasetVesselV1Query} DatasetVesselV1Query instance
         */
        DatasetVesselV1Query.create = function create(properties) {
            return new DatasetVesselV1Query(properties);
        };

        /**
         * Encodes the specified DatasetVesselV1Query message. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
         * @function encode
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {vessels.IDatasetVesselV1Query} message DatasetVesselV1Query message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselV1Query.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.dataset != null && Object.hasOwnProperty.call(message, "dataset"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.dataset);
            if (message.results != null && message.results.length)
                for (var i = 0; i < message.results.length; ++i)
                    $root.vessels.DatasetVesselQuery.encode(message.results[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DatasetVesselV1Query message, length delimited. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {vessels.IDatasetVesselV1Query} message DatasetVesselV1Query message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselV1Query.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DatasetVesselV1Query message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.DatasetVesselV1Query} DatasetVesselV1Query
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselV1Query.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.DatasetVesselV1Query();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 10:
                    message.dataset = reader.string();
                    break;
                case 11:
                    if (!(message.results && message.results.length))
                        message.results = [];
                    message.results.push($root.vessels.DatasetVesselQuery.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DatasetVesselV1Query message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.DatasetVesselV1Query} DatasetVesselV1Query
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselV1Query.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DatasetVesselV1Query message.
         * @function verify
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DatasetVesselV1Query.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.dataset != null && message.hasOwnProperty("dataset"))
                if (!$util.isString(message.dataset))
                    return "dataset: string expected";
            if (message.results != null && message.hasOwnProperty("results")) {
                if (!Array.isArray(message.results))
                    return "results: array expected";
                for (var i = 0; i < message.results.length; ++i) {
                    var error = $root.vessels.DatasetVesselQuery.verify(message.results[i]);
                    if (error)
                        return "results." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DatasetVesselV1Query message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.DatasetVesselV1Query} DatasetVesselV1Query
         */
        DatasetVesselV1Query.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.DatasetVesselV1Query)
                return object;
            var message = new $root.vessels.DatasetVesselV1Query();
            if (object.dataset != null)
                message.dataset = String(object.dataset);
            if (object.results) {
                if (!Array.isArray(object.results))
                    throw TypeError(".vessels.DatasetVesselV1Query.results: array expected");
                message.results = [];
                for (var i = 0; i < object.results.length; ++i) {
                    if (typeof object.results[i] !== "object")
                        throw TypeError(".vessels.DatasetVesselV1Query.results: object expected");
                    message.results[i] = $root.vessels.DatasetVesselQuery.fromObject(object.results[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a DatasetVesselV1Query message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {vessels.DatasetVesselV1Query} message DatasetVesselV1Query
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DatasetVesselV1Query.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.results = [];
            if (options.defaults)
                object.dataset = "";
            if (message.dataset != null && message.hasOwnProperty("dataset"))
                object.dataset = message.dataset;
            if (message.results && message.results.length) {
                object.results = [];
                for (var j = 0; j < message.results.length; ++j)
                    object.results[j] = $root.vessels.DatasetVesselQuery.toObject(message.results[j], options);
            }
            return object;
        };

        /**
         * Converts this DatasetVesselV1Query to JSON.
         * @function toJSON
         * @memberof vessels.DatasetVesselV1Query
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DatasetVesselV1Query.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DatasetVesselV1Query;
    })();

    vessels.DatasetVesselQuery = (function() {

        /**
         * Properties of a DatasetVesselQuery.
         * @memberof vessels
         * @interface IDatasetVesselQuery
         * @property {string|null} [query] DatasetVesselQuery query
         * @property {number|null} [total] DatasetVesselQuery total
         * @property {number|null} [limit] DatasetVesselQuery limit
         * @property {number|null} [offset] DatasetVesselQuery offset
         * @property {number|null} [nextOffset] DatasetVesselQuery nextOffset
         * @property {Array.<vessels.IDatasetVesselInfo>|null} [entries] DatasetVesselQuery entries
         */

        /**
         * Constructs a new DatasetVesselQuery.
         * @memberof vessels
         * @classdesc Represents a DatasetVesselQuery.
         * @implements IDatasetVesselQuery
         * @constructor
         * @param {vessels.IDatasetVesselQuery=} [properties] Properties to set
         */
        function DatasetVesselQuery(properties) {
            this.entries = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DatasetVesselQuery query.
         * @member {string} query
         * @memberof vessels.DatasetVesselQuery
         * @instance
         */
        DatasetVesselQuery.prototype.query = "";

        /**
         * DatasetVesselQuery total.
         * @member {number} total
         * @memberof vessels.DatasetVesselQuery
         * @instance
         */
        DatasetVesselQuery.prototype.total = 0;

        /**
         * DatasetVesselQuery limit.
         * @member {number} limit
         * @memberof vessels.DatasetVesselQuery
         * @instance
         */
        DatasetVesselQuery.prototype.limit = 0;

        /**
         * DatasetVesselQuery offset.
         * @member {number} offset
         * @memberof vessels.DatasetVesselQuery
         * @instance
         */
        DatasetVesselQuery.prototype.offset = 0;

        /**
         * DatasetVesselQuery nextOffset.
         * @member {number} nextOffset
         * @memberof vessels.DatasetVesselQuery
         * @instance
         */
        DatasetVesselQuery.prototype.nextOffset = 0;

        /**
         * DatasetVesselQuery entries.
         * @member {Array.<vessels.IDatasetVesselInfo>} entries
         * @memberof vessels.DatasetVesselQuery
         * @instance
         */
        DatasetVesselQuery.prototype.entries = $util.emptyArray;

        /**
         * Creates a new DatasetVesselQuery instance using the specified properties.
         * @function create
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {vessels.IDatasetVesselQuery=} [properties] Properties to set
         * @returns {vessels.DatasetVesselQuery} DatasetVesselQuery instance
         */
        DatasetVesselQuery.create = function create(properties) {
            return new DatasetVesselQuery(properties);
        };

        /**
         * Encodes the specified DatasetVesselQuery message. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
         * @function encode
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {vessels.IDatasetVesselQuery} message DatasetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselQuery.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.query != null && Object.hasOwnProperty.call(message, "query"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.query);
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.total);
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.limit);
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.offset);
            if (message.nextOffset != null && Object.hasOwnProperty.call(message, "nextOffset"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.nextOffset);
            if (message.entries != null && message.entries.length)
                for (var i = 0; i < message.entries.length; ++i)
                    $root.vessels.DatasetVesselInfo.encode(message.entries[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DatasetVesselQuery message, length delimited. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {vessels.IDatasetVesselQuery} message DatasetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselQuery.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DatasetVesselQuery message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.DatasetVesselQuery} DatasetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselQuery.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.DatasetVesselQuery();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.query = reader.string();
                    break;
                case 2:
                    message.total = reader.uint32();
                    break;
                case 3:
                    message.limit = reader.uint32();
                    break;
                case 4:
                    message.offset = reader.uint32();
                    break;
                case 5:
                    message.nextOffset = reader.uint32();
                    break;
                case 6:
                    if (!(message.entries && message.entries.length))
                        message.entries = [];
                    message.entries.push($root.vessels.DatasetVesselInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DatasetVesselQuery message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.DatasetVesselQuery} DatasetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselQuery.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DatasetVesselQuery message.
         * @function verify
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DatasetVesselQuery.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.query != null && message.hasOwnProperty("query"))
                if (!$util.isString(message.query))
                    return "query: string expected";
            if (message.total != null && message.hasOwnProperty("total"))
                if (!$util.isInteger(message.total))
                    return "total: integer expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            if (message.offset != null && message.hasOwnProperty("offset"))
                if (!$util.isInteger(message.offset))
                    return "offset: integer expected";
            if (message.nextOffset != null && message.hasOwnProperty("nextOffset"))
                if (!$util.isInteger(message.nextOffset))
                    return "nextOffset: integer expected";
            if (message.entries != null && message.hasOwnProperty("entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (var i = 0; i < message.entries.length; ++i) {
                    var error = $root.vessels.DatasetVesselInfo.verify(message.entries[i]);
                    if (error)
                        return "entries." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DatasetVesselQuery message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.DatasetVesselQuery} DatasetVesselQuery
         */
        DatasetVesselQuery.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.DatasetVesselQuery)
                return object;
            var message = new $root.vessels.DatasetVesselQuery();
            if (object.query != null)
                message.query = String(object.query);
            if (object.total != null)
                message.total = object.total >>> 0;
            if (object.limit != null)
                message.limit = object.limit >>> 0;
            if (object.offset != null)
                message.offset = object.offset >>> 0;
            if (object.nextOffset != null)
                message.nextOffset = object.nextOffset >>> 0;
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".vessels.DatasetVesselQuery.entries: array expected");
                message.entries = [];
                for (var i = 0; i < object.entries.length; ++i) {
                    if (typeof object.entries[i] !== "object")
                        throw TypeError(".vessels.DatasetVesselQuery.entries: object expected");
                    message.entries[i] = $root.vessels.DatasetVesselInfo.fromObject(object.entries[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a DatasetVesselQuery message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {vessels.DatasetVesselQuery} message DatasetVesselQuery
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DatasetVesselQuery.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (options.defaults) {
                object.query = "";
                object.total = 0;
                object.limit = 0;
                object.offset = 0;
                object.nextOffset = 0;
            }
            if (message.query != null && message.hasOwnProperty("query"))
                object.query = message.query;
            if (message.total != null && message.hasOwnProperty("total"))
                object.total = message.total;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            if (message.offset != null && message.hasOwnProperty("offset"))
                object.offset = message.offset;
            if (message.nextOffset != null && message.hasOwnProperty("nextOffset"))
                object.nextOffset = message.nextOffset;
            if (message.entries && message.entries.length) {
                object.entries = [];
                for (var j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.vessels.DatasetVesselInfo.toObject(message.entries[j], options);
            }
            return object;
        };

        /**
         * Converts this DatasetVesselQuery to JSON.
         * @function toJSON
         * @memberof vessels.DatasetVesselQuery
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DatasetVesselQuery.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DatasetVesselQuery;
    })();

    vessels.DatasetVesselInfo = (function() {

        /**
         * Properties of a DatasetVesselInfo.
         * @memberof vessels
         * @interface IDatasetVesselInfo
         * @property {string|null} [id] DatasetVesselInfo id
         * @property {string|null} [name] DatasetVesselInfo name
         * @property {string|null} [imo] DatasetVesselInfo imo
         * @property {string|null} [ssvid] DatasetVesselInfo ssvid
         * @property {string|null} [vesselId] DatasetVesselInfo vesselId
         * @property {string|null} [type] DatasetVesselInfo type
         * @property {string|null} [dataset] DatasetVesselInfo dataset
         * @property {Array.<vessels.IStartEndValue>|null} [authorizations] DatasetVesselInfo authorizations
         * @property {Array.<vessels.IExtra>|null} [extra] DatasetVesselInfo extra
         * @property {Array.<vessels.IStartEndValue>|null} [mmsi] DatasetVesselInfo mmsi
         * @property {Array.<vessels.IStartEndValue>|null} [callsign] DatasetVesselInfo callsign
         * @property {Array.<vessels.IStartEndValue>|null} [flags] DatasetVesselInfo flags
         */

        /**
         * Constructs a new DatasetVesselInfo.
         * @memberof vessels
         * @classdesc Represents a DatasetVesselInfo.
         * @implements IDatasetVesselInfo
         * @constructor
         * @param {vessels.IDatasetVesselInfo=} [properties] Properties to set
         */
        function DatasetVesselInfo(properties) {
            this.authorizations = [];
            this.extra = [];
            this.mmsi = [];
            this.callsign = [];
            this.flags = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DatasetVesselInfo id.
         * @member {string} id
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.id = "";

        /**
         * DatasetVesselInfo name.
         * @member {string} name
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.name = "";

        /**
         * DatasetVesselInfo imo.
         * @member {string} imo
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.imo = "";

        /**
         * DatasetVesselInfo ssvid.
         * @member {string} ssvid
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.ssvid = "";

        /**
         * DatasetVesselInfo vesselId.
         * @member {string} vesselId
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.vesselId = "";

        /**
         * DatasetVesselInfo type.
         * @member {string} type
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.type = "";

        /**
         * DatasetVesselInfo dataset.
         * @member {string} dataset
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.dataset = "";

        /**
         * DatasetVesselInfo authorizations.
         * @member {Array.<vessels.IStartEndValue>} authorizations
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.authorizations = $util.emptyArray;

        /**
         * DatasetVesselInfo extra.
         * @member {Array.<vessels.IExtra>} extra
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.extra = $util.emptyArray;

        /**
         * DatasetVesselInfo mmsi.
         * @member {Array.<vessels.IStartEndValue>} mmsi
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.mmsi = $util.emptyArray;

        /**
         * DatasetVesselInfo callsign.
         * @member {Array.<vessels.IStartEndValue>} callsign
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.callsign = $util.emptyArray;

        /**
         * DatasetVesselInfo flags.
         * @member {Array.<vessels.IStartEndValue>} flags
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.flags = $util.emptyArray;

        /**
         * Creates a new DatasetVesselInfo instance using the specified properties.
         * @function create
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {vessels.IDatasetVesselInfo=} [properties] Properties to set
         * @returns {vessels.DatasetVesselInfo} DatasetVesselInfo instance
         */
        DatasetVesselInfo.create = function create(properties) {
            return new DatasetVesselInfo(properties);
        };

        /**
         * Encodes the specified DatasetVesselInfo message. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
         * @function encode
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {vessels.IDatasetVesselInfo} message DatasetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.imo != null && Object.hasOwnProperty.call(message, "imo"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.imo);
            if (message.ssvid != null && Object.hasOwnProperty.call(message, "ssvid"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.ssvid);
            if (message.vesselId != null && Object.hasOwnProperty.call(message, "vesselId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.vesselId);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.type);
            if (message.dataset != null && Object.hasOwnProperty.call(message, "dataset"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.dataset);
            if (message.authorizations != null && message.authorizations.length)
                for (var i = 0; i < message.authorizations.length; ++i)
                    $root.vessels.StartEndValue.encode(message.authorizations[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.extra != null && message.extra.length)
                for (var i = 0; i < message.extra.length; ++i)
                    $root.vessels.Extra.encode(message.extra[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.mmsi != null && message.mmsi.length)
                for (var i = 0; i < message.mmsi.length; ++i)
                    $root.vessels.StartEndValue.encode(message.mmsi[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.callsign != null && message.callsign.length)
                for (var i = 0; i < message.callsign.length; ++i)
                    $root.vessels.StartEndValue.encode(message.callsign[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.flags != null && message.flags.length)
                for (var i = 0; i < message.flags.length; ++i)
                    $root.vessels.StartEndValue.encode(message.flags[i], writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DatasetVesselInfo message, length delimited. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {vessels.IDatasetVesselInfo} message DatasetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DatasetVesselInfo message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.DatasetVesselInfo} DatasetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.DatasetVesselInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.imo = reader.string();
                    break;
                case 4:
                    message.ssvid = reader.string();
                    break;
                case 5:
                    message.vesselId = reader.string();
                    break;
                case 6:
                    message.type = reader.string();
                    break;
                case 7:
                    message.dataset = reader.string();
                    break;
                case 8:
                    if (!(message.authorizations && message.authorizations.length))
                        message.authorizations = [];
                    message.authorizations.push($root.vessels.StartEndValue.decode(reader, reader.uint32()));
                    break;
                case 9:
                    if (!(message.extra && message.extra.length))
                        message.extra = [];
                    message.extra.push($root.vessels.Extra.decode(reader, reader.uint32()));
                    break;
                case 10:
                    if (!(message.mmsi && message.mmsi.length))
                        message.mmsi = [];
                    message.mmsi.push($root.vessels.StartEndValue.decode(reader, reader.uint32()));
                    break;
                case 11:
                    if (!(message.callsign && message.callsign.length))
                        message.callsign = [];
                    message.callsign.push($root.vessels.StartEndValue.decode(reader, reader.uint32()));
                    break;
                case 12:
                    if (!(message.flags && message.flags.length))
                        message.flags = [];
                    message.flags.push($root.vessels.StartEndValue.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DatasetVesselInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.DatasetVesselInfo} DatasetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DatasetVesselInfo message.
         * @function verify
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DatasetVesselInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.imo != null && message.hasOwnProperty("imo"))
                if (!$util.isString(message.imo))
                    return "imo: string expected";
            if (message.ssvid != null && message.hasOwnProperty("ssvid"))
                if (!$util.isString(message.ssvid))
                    return "ssvid: string expected";
            if (message.vesselId != null && message.hasOwnProperty("vesselId"))
                if (!$util.isString(message.vesselId))
                    return "vesselId: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.dataset != null && message.hasOwnProperty("dataset"))
                if (!$util.isString(message.dataset))
                    return "dataset: string expected";
            if (message.authorizations != null && message.hasOwnProperty("authorizations")) {
                if (!Array.isArray(message.authorizations))
                    return "authorizations: array expected";
                for (var i = 0; i < message.authorizations.length; ++i) {
                    var error = $root.vessels.StartEndValue.verify(message.authorizations[i]);
                    if (error)
                        return "authorizations." + error;
                }
            }
            if (message.extra != null && message.hasOwnProperty("extra")) {
                if (!Array.isArray(message.extra))
                    return "extra: array expected";
                for (var i = 0; i < message.extra.length; ++i) {
                    var error = $root.vessels.Extra.verify(message.extra[i]);
                    if (error)
                        return "extra." + error;
                }
            }
            if (message.mmsi != null && message.hasOwnProperty("mmsi")) {
                if (!Array.isArray(message.mmsi))
                    return "mmsi: array expected";
                for (var i = 0; i < message.mmsi.length; ++i) {
                    var error = $root.vessels.StartEndValue.verify(message.mmsi[i]);
                    if (error)
                        return "mmsi." + error;
                }
            }
            if (message.callsign != null && message.hasOwnProperty("callsign")) {
                if (!Array.isArray(message.callsign))
                    return "callsign: array expected";
                for (var i = 0; i < message.callsign.length; ++i) {
                    var error = $root.vessels.StartEndValue.verify(message.callsign[i]);
                    if (error)
                        return "callsign." + error;
                }
            }
            if (message.flags != null && message.hasOwnProperty("flags")) {
                if (!Array.isArray(message.flags))
                    return "flags: array expected";
                for (var i = 0; i < message.flags.length; ++i) {
                    var error = $root.vessels.StartEndValue.verify(message.flags[i]);
                    if (error)
                        return "flags." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DatasetVesselInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.DatasetVesselInfo} DatasetVesselInfo
         */
        DatasetVesselInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.DatasetVesselInfo)
                return object;
            var message = new $root.vessels.DatasetVesselInfo();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.imo != null)
                message.imo = String(object.imo);
            if (object.ssvid != null)
                message.ssvid = String(object.ssvid);
            if (object.vesselId != null)
                message.vesselId = String(object.vesselId);
            if (object.type != null)
                message.type = String(object.type);
            if (object.dataset != null)
                message.dataset = String(object.dataset);
            if (object.authorizations) {
                if (!Array.isArray(object.authorizations))
                    throw TypeError(".vessels.DatasetVesselInfo.authorizations: array expected");
                message.authorizations = [];
                for (var i = 0; i < object.authorizations.length; ++i) {
                    if (typeof object.authorizations[i] !== "object")
                        throw TypeError(".vessels.DatasetVesselInfo.authorizations: object expected");
                    message.authorizations[i] = $root.vessels.StartEndValue.fromObject(object.authorizations[i]);
                }
            }
            if (object.extra) {
                if (!Array.isArray(object.extra))
                    throw TypeError(".vessels.DatasetVesselInfo.extra: array expected");
                message.extra = [];
                for (var i = 0; i < object.extra.length; ++i) {
                    if (typeof object.extra[i] !== "object")
                        throw TypeError(".vessels.DatasetVesselInfo.extra: object expected");
                    message.extra[i] = $root.vessels.Extra.fromObject(object.extra[i]);
                }
            }
            if (object.mmsi) {
                if (!Array.isArray(object.mmsi))
                    throw TypeError(".vessels.DatasetVesselInfo.mmsi: array expected");
                message.mmsi = [];
                for (var i = 0; i < object.mmsi.length; ++i) {
                    if (typeof object.mmsi[i] !== "object")
                        throw TypeError(".vessels.DatasetVesselInfo.mmsi: object expected");
                    message.mmsi[i] = $root.vessels.StartEndValue.fromObject(object.mmsi[i]);
                }
            }
            if (object.callsign) {
                if (!Array.isArray(object.callsign))
                    throw TypeError(".vessels.DatasetVesselInfo.callsign: array expected");
                message.callsign = [];
                for (var i = 0; i < object.callsign.length; ++i) {
                    if (typeof object.callsign[i] !== "object")
                        throw TypeError(".vessels.DatasetVesselInfo.callsign: object expected");
                    message.callsign[i] = $root.vessels.StartEndValue.fromObject(object.callsign[i]);
                }
            }
            if (object.flags) {
                if (!Array.isArray(object.flags))
                    throw TypeError(".vessels.DatasetVesselInfo.flags: array expected");
                message.flags = [];
                for (var i = 0; i < object.flags.length; ++i) {
                    if (typeof object.flags[i] !== "object")
                        throw TypeError(".vessels.DatasetVesselInfo.flags: object expected");
                    message.flags[i] = $root.vessels.StartEndValue.fromObject(object.flags[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a DatasetVesselInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {vessels.DatasetVesselInfo} message DatasetVesselInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DatasetVesselInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.authorizations = [];
                object.extra = [];
                object.mmsi = [];
                object.callsign = [];
                object.flags = [];
            }
            if (options.defaults) {
                object.id = "";
                object.name = "";
                object.imo = "";
                object.ssvid = "";
                object.vesselId = "";
                object.type = "";
                object.dataset = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.imo != null && message.hasOwnProperty("imo"))
                object.imo = message.imo;
            if (message.ssvid != null && message.hasOwnProperty("ssvid"))
                object.ssvid = message.ssvid;
            if (message.vesselId != null && message.hasOwnProperty("vesselId"))
                object.vesselId = message.vesselId;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.dataset != null && message.hasOwnProperty("dataset"))
                object.dataset = message.dataset;
            if (message.authorizations && message.authorizations.length) {
                object.authorizations = [];
                for (var j = 0; j < message.authorizations.length; ++j)
                    object.authorizations[j] = $root.vessels.StartEndValue.toObject(message.authorizations[j], options);
            }
            if (message.extra && message.extra.length) {
                object.extra = [];
                for (var j = 0; j < message.extra.length; ++j)
                    object.extra[j] = $root.vessels.Extra.toObject(message.extra[j], options);
            }
            if (message.mmsi && message.mmsi.length) {
                object.mmsi = [];
                for (var j = 0; j < message.mmsi.length; ++j)
                    object.mmsi[j] = $root.vessels.StartEndValue.toObject(message.mmsi[j], options);
            }
            if (message.callsign && message.callsign.length) {
                object.callsign = [];
                for (var j = 0; j < message.callsign.length; ++j)
                    object.callsign[j] = $root.vessels.StartEndValue.toObject(message.callsign[j], options);
            }
            if (message.flags && message.flags.length) {
                object.flags = [];
                for (var j = 0; j < message.flags.length; ++j)
                    object.flags[j] = $root.vessels.StartEndValue.toObject(message.flags[j], options);
            }
            return object;
        };

        /**
         * Converts this DatasetVesselInfo to JSON.
         * @function toJSON
         * @memberof vessels.DatasetVesselInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DatasetVesselInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DatasetVesselInfo;
    })();

    vessels.Extra = (function() {

        /**
         * Properties of an Extra.
         * @memberof vessels
         * @interface IExtra
         * @property {string|null} [id] Extra id
         * @property {string|null} [label] Extra label
         * @property {number|null} [value] Extra value
         */

        /**
         * Constructs a new Extra.
         * @memberof vessels
         * @classdesc Represents an Extra.
         * @implements IExtra
         * @constructor
         * @param {vessels.IExtra=} [properties] Properties to set
         */
        function Extra(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Extra id.
         * @member {string} id
         * @memberof vessels.Extra
         * @instance
         */
        Extra.prototype.id = "";

        /**
         * Extra label.
         * @member {string} label
         * @memberof vessels.Extra
         * @instance
         */
        Extra.prototype.label = "";

        /**
         * Extra value.
         * @member {number} value
         * @memberof vessels.Extra
         * @instance
         */
        Extra.prototype.value = 0;

        /**
         * Creates a new Extra instance using the specified properties.
         * @function create
         * @memberof vessels.Extra
         * @static
         * @param {vessels.IExtra=} [properties] Properties to set
         * @returns {vessels.Extra} Extra instance
         */
        Extra.create = function create(properties) {
            return new Extra(properties);
        };

        /**
         * Encodes the specified Extra message. Does not implicitly {@link vessels.Extra.verify|verify} messages.
         * @function encode
         * @memberof vessels.Extra
         * @static
         * @param {vessels.IExtra} message Extra message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Extra.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.label);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.value);
            return writer;
        };

        /**
         * Encodes the specified Extra message, length delimited. Does not implicitly {@link vessels.Extra.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.Extra
         * @static
         * @param {vessels.IExtra} message Extra message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Extra.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Extra message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.Extra
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.Extra} Extra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Extra.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.Extra();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.label = reader.string();
                    break;
                case 3:
                    message.value = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Extra message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.Extra
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.Extra} Extra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Extra.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Extra message.
         * @function verify
         * @memberof vessels.Extra
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Extra.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isString(message.label))
                    return "label: string expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (typeof message.value !== "number")
                    return "value: number expected";
            return null;
        };

        /**
         * Creates an Extra message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.Extra
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.Extra} Extra
         */
        Extra.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.Extra)
                return object;
            var message = new $root.vessels.Extra();
            if (object.id != null)
                message.id = String(object.id);
            if (object.label != null)
                message.label = String(object.label);
            if (object.value != null)
                message.value = Number(object.value);
            return message;
        };

        /**
         * Creates a plain object from an Extra message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.Extra
         * @static
         * @param {vessels.Extra} message Extra
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Extra.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.label = "";
                object.value = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
            return object;
        };

        /**
         * Converts this Extra to JSON.
         * @function toJSON
         * @memberof vessels.Extra
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Extra.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Extra;
    })();

    vessels.StartEndValue = (function() {

        /**
         * Properties of a StartEndValue.
         * @memberof vessels
         * @interface IStartEndValue
         * @property {string|null} [start] StartEndValue start
         * @property {string|null} [end] StartEndValue end
         * @property {string|null} [value] StartEndValue value
         */

        /**
         * Constructs a new StartEndValue.
         * @memberof vessels
         * @classdesc Represents a StartEndValue.
         * @implements IStartEndValue
         * @constructor
         * @param {vessels.IStartEndValue=} [properties] Properties to set
         */
        function StartEndValue(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StartEndValue start.
         * @member {string} start
         * @memberof vessels.StartEndValue
         * @instance
         */
        StartEndValue.prototype.start = "";

        /**
         * StartEndValue end.
         * @member {string} end
         * @memberof vessels.StartEndValue
         * @instance
         */
        StartEndValue.prototype.end = "";

        /**
         * StartEndValue value.
         * @member {string} value
         * @memberof vessels.StartEndValue
         * @instance
         */
        StartEndValue.prototype.value = "";

        /**
         * Creates a new StartEndValue instance using the specified properties.
         * @function create
         * @memberof vessels.StartEndValue
         * @static
         * @param {vessels.IStartEndValue=} [properties] Properties to set
         * @returns {vessels.StartEndValue} StartEndValue instance
         */
        StartEndValue.create = function create(properties) {
            return new StartEndValue(properties);
        };

        /**
         * Encodes the specified StartEndValue message. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
         * @function encode
         * @memberof vessels.StartEndValue
         * @static
         * @param {vessels.IStartEndValue} message StartEndValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartEndValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.start);
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.end);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified StartEndValue message, length delimited. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.StartEndValue
         * @static
         * @param {vessels.IStartEndValue} message StartEndValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartEndValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StartEndValue message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.StartEndValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.StartEndValue} StartEndValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartEndValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.vessels.StartEndValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.start = reader.string();
                    break;
                case 2:
                    message.end = reader.string();
                    break;
                case 3:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StartEndValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.StartEndValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.StartEndValue} StartEndValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartEndValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StartEndValue message.
         * @function verify
         * @memberof vessels.StartEndValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StartEndValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.start != null && message.hasOwnProperty("start"))
                if (!$util.isString(message.start))
                    return "start: string expected";
            if (message.end != null && message.hasOwnProperty("end"))
                if (!$util.isString(message.end))
                    return "end: string expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates a StartEndValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof vessels.StartEndValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {vessels.StartEndValue} StartEndValue
         */
        StartEndValue.fromObject = function fromObject(object) {
            if (object instanceof $root.vessels.StartEndValue)
                return object;
            var message = new $root.vessels.StartEndValue();
            if (object.start != null)
                message.start = String(object.start);
            if (object.end != null)
                message.end = String(object.end);
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a plain object from a StartEndValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof vessels.StartEndValue
         * @static
         * @param {vessels.StartEndValue} message StartEndValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StartEndValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.start = "";
                object.end = "";
                object.value = "";
            }
            if (message.start != null && message.hasOwnProperty("start"))
                object.start = message.start;
            if (message.end != null && message.hasOwnProperty("end"))
                object.end = message.end;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };

        /**
         * Converts this StartEndValue to JSON.
         * @function toJSON
         * @memberof vessels.StartEndValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StartEndValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StartEndValue;
    })();

    return vessels;
})();

module.exports = $root;
