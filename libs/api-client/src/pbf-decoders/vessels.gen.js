/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const vessels = $root.vessels = (() => {

    /**
     * Namespace vessels.
     * @exports vessels
     * @namespace
     */
    const vessels = {};

    vessels.Track = (function() {

        /**
         * Properties of a Track.
         * @typedef {Object} vessels.Track.$Properties
         * @property {Array.<number>|null} [data] Track data
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of a Track.
         * @memberof vessels
         * @interface ITrack
         * @augments vessels.Track.$Properties
         * @deprecated Use vessels.Track.$Properties instead.
         */

        /**
         * Shape of a Track.
         * @typedef {vessels.Track.$Properties} vessels.Track.$Shape
         */

        /**
         * Constructs a new Track.
         * @memberof vessels
         * @classdesc Represents a Track.
         * @constructor
         * @param {vessels.Track.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function Track(properties) {
            this.data = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @param {vessels.Track.$Properties=} [properties] Properties to set
         * @returns {vessels.Track} Track instance
         * @type {{
         *   (properties: vessels.Track.$Shape): vessels.Track & vessels.Track.$Shape;
         *   (properties?: vessels.Track.$Properties): vessels.Track;
         * }}
         */
        Track.create = function create(properties) {
            return new Track(properties);
        };

        /**
         * Encodes the specified Track message. Does not implicitly {@link vessels.Track.verify|verify} messages.
         * @function encode
         * @memberof vessels.Track
         * @static
         * @param {vessels.Track.$Properties} message Track message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Track.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.data != null && message.data.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (let i = 0; i < message.data.length; ++i)
                    writer.sint32(message.data[i]);
                writer.ldelim();
            }
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Track message, length delimited. Does not implicitly {@link vessels.Track.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.Track
         * @static
         * @param {vessels.Track.$Properties} message Track message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Track.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes a Track message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.Track
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.Track & vessels.Track.$Shape} Track
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Track.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.Track();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType === 2) {
                            if (!(message.data && message.data.length))
                                message.data = [];
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.data.push(reader.sint32());
                            continue;
                        }
                        if (wireType !== 0)
                            break;
                        if (!(message.data && message.data.length))
                            message.data = [];
                        message.data.push(reader.sint32());
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes a Track message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.Track
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.Track & vessels.Track.$Shape} Track
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
        Track.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.data != null && Object.hasOwnProperty.call(message, "data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (let i = 0; i < message.data.length; ++i)
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
        Track.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.Track)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.Track: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.Track();
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".vessels.Track.data: array expected");
                message.data = Array(object.data.length);
                for (let i = 0; i < object.data.length; ++i)
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
        Track.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (message.data && message.data.length) {
                object.data = Array(message.data.length);
                for (let j = 0; j < message.data.length; ++j)
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

        /**
         * Gets the type url for Track
         * @function getTypeUrl
         * @memberof vessels.Track
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Track.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.Track";
        };

        return Track;
    })();

    vessels.TilesetVesselQuery = (function() {

        /**
         * Properties of a TilesetVesselQuery.
         * @typedef {Object} vessels.TilesetVesselQuery.$Properties
         * @property {string|null} [query] TilesetVesselQuery query
         * @property {number|null} [total] TilesetVesselQuery total
         * @property {number|null} [limit] TilesetVesselQuery limit
         * @property {number|null} [offset] TilesetVesselQuery offset
         * @property {number|null} [nextOffset] TilesetVesselQuery nextOffset
         * @property {Array.<vessels.TilesetVesselInfo.$Properties>|null} [entries] TilesetVesselQuery entries
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of a TilesetVesselQuery.
         * @memberof vessels
         * @interface ITilesetVesselQuery
         * @augments vessels.TilesetVesselQuery.$Properties
         * @deprecated Use vessels.TilesetVesselQuery.$Properties instead.
         */

        /**
         * Shape of a TilesetVesselQuery.
         * @typedef {vessels.TilesetVesselQuery.$Properties} vessels.TilesetVesselQuery.$Shape
         */

        /**
         * Constructs a new TilesetVesselQuery.
         * @memberof vessels
         * @classdesc Represents a TilesetVesselQuery.
         * @constructor
         * @param {vessels.TilesetVesselQuery.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function TilesetVesselQuery(properties) {
            this.entries = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @member {Array.<vessels.TilesetVesselInfo.$Properties>} entries
         * @memberof vessels.TilesetVesselQuery
         * @instance
         */
        TilesetVesselQuery.prototype.entries = $util.emptyArray;

        /**
         * Creates a new TilesetVesselQuery instance using the specified properties.
         * @function create
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {vessels.TilesetVesselQuery.$Properties=} [properties] Properties to set
         * @returns {vessels.TilesetVesselQuery} TilesetVesselQuery instance
         * @type {{
         *   (properties: vessels.TilesetVesselQuery.$Shape): vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape;
         *   (properties?: vessels.TilesetVesselQuery.$Properties): vessels.TilesetVesselQuery;
         * }}
         */
        TilesetVesselQuery.create = function create(properties) {
            return new TilesetVesselQuery(properties);
        };

        /**
         * Encodes the specified TilesetVesselQuery message. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
         * @function encode
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {vessels.TilesetVesselQuery.$Properties} message TilesetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselQuery.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
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
                for (let i = 0; i < message.entries.length; ++i)
                    $root.vessels.TilesetVesselInfo.encode(message.entries[i], writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified TilesetVesselQuery message, length delimited. Does not implicitly {@link vessels.TilesetVesselQuery.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {vessels.TilesetVesselQuery.$Properties} message TilesetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselQuery.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes a TilesetVesselQuery message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape} TilesetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TilesetVesselQuery.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.TilesetVesselQuery(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.query = value;
                        else
                            delete message.query;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.total = value;
                        else
                            delete message.total;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.limit = value;
                        else
                            delete message.limit;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.offset = value;
                        else
                            delete message.offset;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.nextOffset = value;
                        else
                            delete message.nextOffset;
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if (!(message.entries && message.entries.length))
                            message.entries = [];
                        message.entries.push($root.vessels.TilesetVesselInfo.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes a TilesetVesselQuery message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.TilesetVesselQuery & vessels.TilesetVesselQuery.$Shape} TilesetVesselQuery
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
        TilesetVesselQuery.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.query != null && Object.hasOwnProperty.call(message, "query"))
                if (!$util.isString(message.query))
                    return "query: string expected";
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                if (!$util.isInteger(message.total))
                    return "total: integer expected";
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                if (!$util.isInteger(message.offset))
                    return "offset: integer expected";
            if (message.nextOffset != null && Object.hasOwnProperty.call(message, "nextOffset"))
                if (!$util.isInteger(message.nextOffset))
                    return "nextOffset: integer expected";
            if (message.entries != null && Object.hasOwnProperty.call(message, "entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (let i = 0; i < message.entries.length; ++i) {
                    let error = $root.vessels.TilesetVesselInfo.verify(message.entries[i], _depth + 1);
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
        TilesetVesselQuery.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.TilesetVesselQuery)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.TilesetVesselQuery: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.TilesetVesselQuery();
            if (object.query != null)
                if (typeof object.query !== "string" || object.query.length)
                    message.query = String(object.query);
            if (object.total != null)
                if (Number(object.total) !== 0)
                    message.total = object.total >>> 0;
            if (object.limit != null)
                if (Number(object.limit) !== 0)
                    message.limit = object.limit >>> 0;
            if (object.offset != null)
                if (Number(object.offset) !== 0)
                    message.offset = object.offset >>> 0;
            if (object.nextOffset != null)
                if (Number(object.nextOffset) !== 0)
                    message.nextOffset = object.nextOffset >>> 0;
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".vessels.TilesetVesselQuery.entries: array expected");
                message.entries = Array(object.entries.length);
                for (let i = 0; i < object.entries.length; ++i) {
                    if (!$util.isObject(object.entries[i]))
                        throw TypeError(".vessels.TilesetVesselQuery.entries: object expected");
                    message.entries[i] = $root.vessels.TilesetVesselInfo.fromObject(object.entries[i], _depth + 1);
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
        TilesetVesselQuery.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (options.defaults) {
                object.query = "";
                object.total = 0;
                object.limit = 0;
                object.offset = 0;
                object.nextOffset = 0;
            }
            if (message.query != null && Object.hasOwnProperty.call(message, "query"))
                object.query = message.query;
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                object.total = message.total;
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                object.limit = message.limit;
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                object.offset = message.offset;
            if (message.nextOffset != null && Object.hasOwnProperty.call(message, "nextOffset"))
                object.nextOffset = message.nextOffset;
            if (message.entries && message.entries.length) {
                object.entries = Array(message.entries.length);
                for (let j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.vessels.TilesetVesselInfo.toObject(message.entries[j], options, _depth + 1);
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

        /**
         * Gets the type url for TilesetVesselQuery
         * @function getTypeUrl
         * @memberof vessels.TilesetVesselQuery
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        TilesetVesselQuery.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.TilesetVesselQuery";
        };

        return TilesetVesselQuery;
    })();

    vessels.TilesetVesselInfo = (function() {

        /**
         * Properties of a TilesetVesselInfo.
         * @typedef {Object} vessels.TilesetVesselInfo.$Properties
         * @property {string|null} [id] TilesetVesselInfo id
         * @property {string|null} [name] TilesetVesselInfo name
         * @property {string|null} [end] TilesetVesselInfo end
         * @property {string|null} [start] TilesetVesselInfo start
         * @property {string|null} [ssvid] TilesetVesselInfo ssvid
         * @property {string|null} [callsign] TilesetVesselInfo callsign
         * @property {string|null} [vesselId] TilesetVesselInfo vesselId
         * @property {string|null} [tilesetId] TilesetVesselInfo tilesetId
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of a TilesetVesselInfo.
         * @memberof vessels
         * @interface ITilesetVesselInfo
         * @augments vessels.TilesetVesselInfo.$Properties
         * @deprecated Use vessels.TilesetVesselInfo.$Properties instead.
         */

        /**
         * Shape of a TilesetVesselInfo.
         * @typedef {vessels.TilesetVesselInfo.$Properties} vessels.TilesetVesselInfo.$Shape
         */

        /**
         * Constructs a new TilesetVesselInfo.
         * @memberof vessels
         * @classdesc Represents a TilesetVesselInfo.
         * @constructor
         * @param {vessels.TilesetVesselInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function TilesetVesselInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @param {vessels.TilesetVesselInfo.$Properties=} [properties] Properties to set
         * @returns {vessels.TilesetVesselInfo} TilesetVesselInfo instance
         * @type {{
         *   (properties: vessels.TilesetVesselInfo.$Shape): vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape;
         *   (properties?: vessels.TilesetVesselInfo.$Properties): vessels.TilesetVesselInfo;
         * }}
         */
        TilesetVesselInfo.create = function create(properties) {
            return new TilesetVesselInfo(properties);
        };

        /**
         * Encodes the specified TilesetVesselInfo message. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
         * @function encode
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {vessels.TilesetVesselInfo.$Properties} message TilesetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselInfo.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
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
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified TilesetVesselInfo message, length delimited. Does not implicitly {@link vessels.TilesetVesselInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {vessels.TilesetVesselInfo.$Properties} message TilesetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TilesetVesselInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes a TilesetVesselInfo message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape} TilesetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TilesetVesselInfo.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.TilesetVesselInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.id = value;
                        else
                            delete message.id;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.name = value;
                        else
                            delete message.name;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.end = value;
                        else
                            delete message.end;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.start = value;
                        else
                            delete message.start;
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.ssvid = value;
                        else
                            delete message.ssvid;
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.callsign = value;
                        else
                            delete message.callsign;
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.vesselId = value;
                        else
                            delete message.vesselId;
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.tilesetId = value;
                        else
                            delete message.tilesetId;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes a TilesetVesselInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.TilesetVesselInfo & vessels.TilesetVesselInfo.$Shape} TilesetVesselInfo
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
        TilesetVesselInfo.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                if (!$util.isString(message.end))
                    return "end: string expected";
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                if (!$util.isString(message.start))
                    return "start: string expected";
            if (message.ssvid != null && Object.hasOwnProperty.call(message, "ssvid"))
                if (!$util.isString(message.ssvid))
                    return "ssvid: string expected";
            if (message.callsign != null && Object.hasOwnProperty.call(message, "callsign"))
                if (!$util.isString(message.callsign))
                    return "callsign: string expected";
            if (message.vesselId != null && Object.hasOwnProperty.call(message, "vesselId"))
                if (!$util.isString(message.vesselId))
                    return "vesselId: string expected";
            if (message.tilesetId != null && Object.hasOwnProperty.call(message, "tilesetId"))
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
        TilesetVesselInfo.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.TilesetVesselInfo)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.TilesetVesselInfo: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.TilesetVesselInfo();
            if (object.id != null)
                if (typeof object.id !== "string" || object.id.length)
                    message.id = String(object.id);
            if (object.name != null)
                if (typeof object.name !== "string" || object.name.length)
                    message.name = String(object.name);
            if (object.end != null)
                if (typeof object.end !== "string" || object.end.length)
                    message.end = String(object.end);
            if (object.start != null)
                if (typeof object.start !== "string" || object.start.length)
                    message.start = String(object.start);
            if (object.ssvid != null)
                if (typeof object.ssvid !== "string" || object.ssvid.length)
                    message.ssvid = String(object.ssvid);
            if (object.callsign != null)
                if (typeof object.callsign !== "string" || object.callsign.length)
                    message.callsign = String(object.callsign);
            if (object.vesselId != null)
                if (typeof object.vesselId !== "string" || object.vesselId.length)
                    message.vesselId = String(object.vesselId);
            if (object.tilesetId != null)
                if (typeof object.tilesetId !== "string" || object.tilesetId.length)
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
        TilesetVesselInfo.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
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
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                object.end = message.end;
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                object.start = message.start;
            if (message.ssvid != null && Object.hasOwnProperty.call(message, "ssvid"))
                object.ssvid = message.ssvid;
            if (message.callsign != null && Object.hasOwnProperty.call(message, "callsign"))
                object.callsign = message.callsign;
            if (message.vesselId != null && Object.hasOwnProperty.call(message, "vesselId"))
                object.vesselId = message.vesselId;
            if (message.tilesetId != null && Object.hasOwnProperty.call(message, "tilesetId"))
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

        /**
         * Gets the type url for TilesetVesselInfo
         * @function getTypeUrl
         * @memberof vessels.TilesetVesselInfo
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        TilesetVesselInfo.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.TilesetVesselInfo";
        };

        return TilesetVesselInfo;
    })();

    vessels.DatasetVesselV1Query = (function() {

        /**
         * Properties of a DatasetVesselV1Query.
         * @typedef {Object} vessels.DatasetVesselV1Query.$Properties
         * @property {string|null} [dataset] DatasetVesselV1Query dataset
         * @property {Array.<vessels.DatasetVesselQuery.$Properties>|null} [results] DatasetVesselV1Query results
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of a DatasetVesselV1Query.
         * @memberof vessels
         * @interface IDatasetVesselV1Query
         * @augments vessels.DatasetVesselV1Query.$Properties
         * @deprecated Use vessels.DatasetVesselV1Query.$Properties instead.
         */

        /**
         * Shape of a DatasetVesselV1Query.
         * @typedef {vessels.DatasetVesselV1Query.$Properties} vessels.DatasetVesselV1Query.$Shape
         */

        /**
         * Constructs a new DatasetVesselV1Query.
         * @memberof vessels
         * @classdesc Represents a DatasetVesselV1Query.
         * @constructor
         * @param {vessels.DatasetVesselV1Query.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function DatasetVesselV1Query(properties) {
            this.results = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @member {Array.<vessels.DatasetVesselQuery.$Properties>} results
         * @memberof vessels.DatasetVesselV1Query
         * @instance
         */
        DatasetVesselV1Query.prototype.results = $util.emptyArray;

        /**
         * Creates a new DatasetVesselV1Query instance using the specified properties.
         * @function create
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {vessels.DatasetVesselV1Query.$Properties=} [properties] Properties to set
         * @returns {vessels.DatasetVesselV1Query} DatasetVesselV1Query instance
         * @type {{
         *   (properties: vessels.DatasetVesselV1Query.$Shape): vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape;
         *   (properties?: vessels.DatasetVesselV1Query.$Properties): vessels.DatasetVesselV1Query;
         * }}
         */
        DatasetVesselV1Query.create = function create(properties) {
            return new DatasetVesselV1Query(properties);
        };

        /**
         * Encodes the specified DatasetVesselV1Query message. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
         * @function encode
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {vessels.DatasetVesselV1Query.$Properties} message DatasetVesselV1Query message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselV1Query.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.dataset != null && Object.hasOwnProperty.call(message, "dataset"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.dataset);
            if (message.results != null && message.results.length)
                for (let i = 0; i < message.results.length; ++i)
                    $root.vessels.DatasetVesselQuery.encode(message.results[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified DatasetVesselV1Query message, length delimited. Does not implicitly {@link vessels.DatasetVesselV1Query.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {vessels.DatasetVesselV1Query.$Properties} message DatasetVesselV1Query message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselV1Query.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes a DatasetVesselV1Query message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape} DatasetVesselV1Query
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselV1Query.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.DatasetVesselV1Query(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 10: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.dataset = value;
                        else
                            delete message.dataset;
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.results && message.results.length))
                            message.results = [];
                        message.results.push($root.vessels.DatasetVesselQuery.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes a DatasetVesselV1Query message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.DatasetVesselV1Query & vessels.DatasetVesselV1Query.$Shape} DatasetVesselV1Query
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
        DatasetVesselV1Query.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.dataset != null && Object.hasOwnProperty.call(message, "dataset"))
                if (!$util.isString(message.dataset))
                    return "dataset: string expected";
            if (message.results != null && Object.hasOwnProperty.call(message, "results")) {
                if (!Array.isArray(message.results))
                    return "results: array expected";
                for (let i = 0; i < message.results.length; ++i) {
                    let error = $root.vessels.DatasetVesselQuery.verify(message.results[i], _depth + 1);
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
        DatasetVesselV1Query.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.DatasetVesselV1Query)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.DatasetVesselV1Query: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.DatasetVesselV1Query();
            if (object.dataset != null)
                if (typeof object.dataset !== "string" || object.dataset.length)
                    message.dataset = String(object.dataset);
            if (object.results) {
                if (!Array.isArray(object.results))
                    throw TypeError(".vessels.DatasetVesselV1Query.results: array expected");
                message.results = Array(object.results.length);
                for (let i = 0; i < object.results.length; ++i) {
                    if (!$util.isObject(object.results[i]))
                        throw TypeError(".vessels.DatasetVesselV1Query.results: object expected");
                    message.results[i] = $root.vessels.DatasetVesselQuery.fromObject(object.results[i], _depth + 1);
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
        DatasetVesselV1Query.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.results = [];
            if (options.defaults)
                object.dataset = "";
            if (message.dataset != null && Object.hasOwnProperty.call(message, "dataset"))
                object.dataset = message.dataset;
            if (message.results && message.results.length) {
                object.results = Array(message.results.length);
                for (let j = 0; j < message.results.length; ++j)
                    object.results[j] = $root.vessels.DatasetVesselQuery.toObject(message.results[j], options, _depth + 1);
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

        /**
         * Gets the type url for DatasetVesselV1Query
         * @function getTypeUrl
         * @memberof vessels.DatasetVesselV1Query
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        DatasetVesselV1Query.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.DatasetVesselV1Query";
        };

        return DatasetVesselV1Query;
    })();

    vessels.DatasetVesselQuery = (function() {

        /**
         * Properties of a DatasetVesselQuery.
         * @typedef {Object} vessels.DatasetVesselQuery.$Properties
         * @property {string|null} [query] DatasetVesselQuery query
         * @property {number|null} [total] DatasetVesselQuery total
         * @property {number|null} [limit] DatasetVesselQuery limit
         * @property {number|null} [offset] DatasetVesselQuery offset
         * @property {number|null} [nextOffset] DatasetVesselQuery nextOffset
         * @property {Array.<vessels.DatasetVesselInfo.$Properties>|null} [entries] DatasetVesselQuery entries
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of a DatasetVesselQuery.
         * @memberof vessels
         * @interface IDatasetVesselQuery
         * @augments vessels.DatasetVesselQuery.$Properties
         * @deprecated Use vessels.DatasetVesselQuery.$Properties instead.
         */

        /**
         * Shape of a DatasetVesselQuery.
         * @typedef {vessels.DatasetVesselQuery.$Properties} vessels.DatasetVesselQuery.$Shape
         */

        /**
         * Constructs a new DatasetVesselQuery.
         * @memberof vessels
         * @classdesc Represents a DatasetVesselQuery.
         * @constructor
         * @param {vessels.DatasetVesselQuery.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function DatasetVesselQuery(properties) {
            this.entries = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @member {Array.<vessels.DatasetVesselInfo.$Properties>} entries
         * @memberof vessels.DatasetVesselQuery
         * @instance
         */
        DatasetVesselQuery.prototype.entries = $util.emptyArray;

        /**
         * Creates a new DatasetVesselQuery instance using the specified properties.
         * @function create
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {vessels.DatasetVesselQuery.$Properties=} [properties] Properties to set
         * @returns {vessels.DatasetVesselQuery} DatasetVesselQuery instance
         * @type {{
         *   (properties: vessels.DatasetVesselQuery.$Shape): vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape;
         *   (properties?: vessels.DatasetVesselQuery.$Properties): vessels.DatasetVesselQuery;
         * }}
         */
        DatasetVesselQuery.create = function create(properties) {
            return new DatasetVesselQuery(properties);
        };

        /**
         * Encodes the specified DatasetVesselQuery message. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
         * @function encode
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {vessels.DatasetVesselQuery.$Properties} message DatasetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselQuery.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
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
                for (let i = 0; i < message.entries.length; ++i)
                    $root.vessels.DatasetVesselInfo.encode(message.entries[i], writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified DatasetVesselQuery message, length delimited. Does not implicitly {@link vessels.DatasetVesselQuery.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {vessels.DatasetVesselQuery.$Properties} message DatasetVesselQuery message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselQuery.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes a DatasetVesselQuery message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape} DatasetVesselQuery
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselQuery.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.DatasetVesselQuery(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.query = value;
                        else
                            delete message.query;
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.total = value;
                        else
                            delete message.total;
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.limit = value;
                        else
                            delete message.limit;
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.offset = value;
                        else
                            delete message.offset;
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        if (value = reader.uint32())
                            message.nextOffset = value;
                        else
                            delete message.nextOffset;
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if (!(message.entries && message.entries.length))
                            message.entries = [];
                        message.entries.push($root.vessels.DatasetVesselInfo.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes a DatasetVesselQuery message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.DatasetVesselQuery & vessels.DatasetVesselQuery.$Shape} DatasetVesselQuery
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
        DatasetVesselQuery.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.query != null && Object.hasOwnProperty.call(message, "query"))
                if (!$util.isString(message.query))
                    return "query: string expected";
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                if (!$util.isInteger(message.total))
                    return "total: integer expected";
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                if (!$util.isInteger(message.offset))
                    return "offset: integer expected";
            if (message.nextOffset != null && Object.hasOwnProperty.call(message, "nextOffset"))
                if (!$util.isInteger(message.nextOffset))
                    return "nextOffset: integer expected";
            if (message.entries != null && Object.hasOwnProperty.call(message, "entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (let i = 0; i < message.entries.length; ++i) {
                    let error = $root.vessels.DatasetVesselInfo.verify(message.entries[i], _depth + 1);
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
        DatasetVesselQuery.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.DatasetVesselQuery)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.DatasetVesselQuery: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.DatasetVesselQuery();
            if (object.query != null)
                if (typeof object.query !== "string" || object.query.length)
                    message.query = String(object.query);
            if (object.total != null)
                if (Number(object.total) !== 0)
                    message.total = object.total >>> 0;
            if (object.limit != null)
                if (Number(object.limit) !== 0)
                    message.limit = object.limit >>> 0;
            if (object.offset != null)
                if (Number(object.offset) !== 0)
                    message.offset = object.offset >>> 0;
            if (object.nextOffset != null)
                if (Number(object.nextOffset) !== 0)
                    message.nextOffset = object.nextOffset >>> 0;
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".vessels.DatasetVesselQuery.entries: array expected");
                message.entries = Array(object.entries.length);
                for (let i = 0; i < object.entries.length; ++i) {
                    if (!$util.isObject(object.entries[i]))
                        throw TypeError(".vessels.DatasetVesselQuery.entries: object expected");
                    message.entries[i] = $root.vessels.DatasetVesselInfo.fromObject(object.entries[i], _depth + 1);
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
        DatasetVesselQuery.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (options.defaults) {
                object.query = "";
                object.total = 0;
                object.limit = 0;
                object.offset = 0;
                object.nextOffset = 0;
            }
            if (message.query != null && Object.hasOwnProperty.call(message, "query"))
                object.query = message.query;
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                object.total = message.total;
            if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                object.limit = message.limit;
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                object.offset = message.offset;
            if (message.nextOffset != null && Object.hasOwnProperty.call(message, "nextOffset"))
                object.nextOffset = message.nextOffset;
            if (message.entries && message.entries.length) {
                object.entries = Array(message.entries.length);
                for (let j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.vessels.DatasetVesselInfo.toObject(message.entries[j], options, _depth + 1);
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

        /**
         * Gets the type url for DatasetVesselQuery
         * @function getTypeUrl
         * @memberof vessels.DatasetVesselQuery
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        DatasetVesselQuery.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.DatasetVesselQuery";
        };

        return DatasetVesselQuery;
    })();

    vessels.DatasetVesselInfo = (function() {

        /**
         * Properties of a DatasetVesselInfo.
         * @typedef {Object} vessels.DatasetVesselInfo.$Properties
         * @property {string|null} [id] DatasetVesselInfo id
         * @property {string|null} [name] DatasetVesselInfo name
         * @property {string|null} [imo] DatasetVesselInfo imo
         * @property {string|null} [ssvid] DatasetVesselInfo ssvid
         * @property {string|null} [vesselId] DatasetVesselInfo vesselId
         * @property {string|null} [type] DatasetVesselInfo type
         * @property {string|null} [dataset] DatasetVesselInfo dataset
         * @property {Array.<vessels.StartEndValue.$Properties>|null} [authorizations] DatasetVesselInfo authorizations
         * @property {Array.<vessels.Extra.$Properties>|null} [extra] DatasetVesselInfo extra
         * @property {Array.<vessels.StartEndValue.$Properties>|null} [mmsi] DatasetVesselInfo mmsi
         * @property {Array.<vessels.StartEndValue.$Properties>|null} [callsign] DatasetVesselInfo callsign
         * @property {Array.<vessels.StartEndValue.$Properties>|null} [flags] DatasetVesselInfo flags
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of a DatasetVesselInfo.
         * @memberof vessels
         * @interface IDatasetVesselInfo
         * @augments vessels.DatasetVesselInfo.$Properties
         * @deprecated Use vessels.DatasetVesselInfo.$Properties instead.
         */

        /**
         * Shape of a DatasetVesselInfo.
         * @typedef {vessels.DatasetVesselInfo.$Properties} vessels.DatasetVesselInfo.$Shape
         */

        /**
         * Constructs a new DatasetVesselInfo.
         * @memberof vessels
         * @classdesc Represents a DatasetVesselInfo.
         * @constructor
         * @param {vessels.DatasetVesselInfo.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function DatasetVesselInfo(properties) {
            this.authorizations = [];
            this.extra = [];
            this.mmsi = [];
            this.callsign = [];
            this.flags = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @member {Array.<vessels.StartEndValue.$Properties>} authorizations
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.authorizations = $util.emptyArray;

        /**
         * DatasetVesselInfo extra.
         * @member {Array.<vessels.Extra.$Properties>} extra
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.extra = $util.emptyArray;

        /**
         * DatasetVesselInfo mmsi.
         * @member {Array.<vessels.StartEndValue.$Properties>} mmsi
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.mmsi = $util.emptyArray;

        /**
         * DatasetVesselInfo callsign.
         * @member {Array.<vessels.StartEndValue.$Properties>} callsign
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.callsign = $util.emptyArray;

        /**
         * DatasetVesselInfo flags.
         * @member {Array.<vessels.StartEndValue.$Properties>} flags
         * @memberof vessels.DatasetVesselInfo
         * @instance
         */
        DatasetVesselInfo.prototype.flags = $util.emptyArray;

        /**
         * Creates a new DatasetVesselInfo instance using the specified properties.
         * @function create
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {vessels.DatasetVesselInfo.$Properties=} [properties] Properties to set
         * @returns {vessels.DatasetVesselInfo} DatasetVesselInfo instance
         * @type {{
         *   (properties: vessels.DatasetVesselInfo.$Shape): vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape;
         *   (properties?: vessels.DatasetVesselInfo.$Properties): vessels.DatasetVesselInfo;
         * }}
         */
        DatasetVesselInfo.create = function create(properties) {
            return new DatasetVesselInfo(properties);
        };

        /**
         * Encodes the specified DatasetVesselInfo message. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
         * @function encode
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {vessels.DatasetVesselInfo.$Properties} message DatasetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselInfo.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
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
                for (let i = 0; i < message.authorizations.length; ++i)
                    $root.vessels.StartEndValue.encode(message.authorizations[i], writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
            if (message.extra != null && message.extra.length)
                for (let i = 0; i < message.extra.length; ++i)
                    $root.vessels.Extra.encode(message.extra[i], writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
            if (message.mmsi != null && message.mmsi.length)
                for (let i = 0; i < message.mmsi.length; ++i)
                    $root.vessels.StartEndValue.encode(message.mmsi[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
            if (message.callsign != null && message.callsign.length)
                for (let i = 0; i < message.callsign.length; ++i)
                    $root.vessels.StartEndValue.encode(message.callsign[i], writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
            if (message.flags != null && message.flags.length)
                for (let i = 0; i < message.flags.length; ++i)
                    $root.vessels.StartEndValue.encode(message.flags[i], writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified DatasetVesselInfo message, length delimited. Does not implicitly {@link vessels.DatasetVesselInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {vessels.DatasetVesselInfo.$Properties} message DatasetVesselInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DatasetVesselInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes a DatasetVesselInfo message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape} DatasetVesselInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DatasetVesselInfo.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.DatasetVesselInfo(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.id = value;
                        else
                            delete message.id;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.name = value;
                        else
                            delete message.name;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.imo = value;
                        else
                            delete message.imo;
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.ssvid = value;
                        else
                            delete message.ssvid;
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.vesselId = value;
                        else
                            delete message.vesselId;
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.type = value;
                        else
                            delete message.type;
                        continue;
                    }
                case 7: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.dataset = value;
                        else
                            delete message.dataset;
                        continue;
                    }
                case 8: {
                        if (wireType !== 2)
                            break;
                        if (!(message.authorizations && message.authorizations.length))
                            message.authorizations = [];
                        message.authorizations.push($root.vessels.StartEndValue.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                case 9: {
                        if (wireType !== 2)
                            break;
                        if (!(message.extra && message.extra.length))
                            message.extra = [];
                        message.extra.push($root.vessels.Extra.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                case 10: {
                        if (wireType !== 2)
                            break;
                        if (!(message.mmsi && message.mmsi.length))
                            message.mmsi = [];
                        message.mmsi.push($root.vessels.StartEndValue.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                case 11: {
                        if (wireType !== 2)
                            break;
                        if (!(message.callsign && message.callsign.length))
                            message.callsign = [];
                        message.callsign.push($root.vessels.StartEndValue.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                case 12: {
                        if (wireType !== 2)
                            break;
                        if (!(message.flags && message.flags.length))
                            message.flags = [];
                        message.flags.push($root.vessels.StartEndValue.decode(reader, reader.uint32(), undefined, _depth + 1));
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes a DatasetVesselInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.DatasetVesselInfo & vessels.DatasetVesselInfo.$Shape} DatasetVesselInfo
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
        DatasetVesselInfo.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.imo != null && Object.hasOwnProperty.call(message, "imo"))
                if (!$util.isString(message.imo))
                    return "imo: string expected";
            if (message.ssvid != null && Object.hasOwnProperty.call(message, "ssvid"))
                if (!$util.isString(message.ssvid))
                    return "ssvid: string expected";
            if (message.vesselId != null && Object.hasOwnProperty.call(message, "vesselId"))
                if (!$util.isString(message.vesselId))
                    return "vesselId: string expected";
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.dataset != null && Object.hasOwnProperty.call(message, "dataset"))
                if (!$util.isString(message.dataset))
                    return "dataset: string expected";
            if (message.authorizations != null && Object.hasOwnProperty.call(message, "authorizations")) {
                if (!Array.isArray(message.authorizations))
                    return "authorizations: array expected";
                for (let i = 0; i < message.authorizations.length; ++i) {
                    let error = $root.vessels.StartEndValue.verify(message.authorizations[i], _depth + 1);
                    if (error)
                        return "authorizations." + error;
                }
            }
            if (message.extra != null && Object.hasOwnProperty.call(message, "extra")) {
                if (!Array.isArray(message.extra))
                    return "extra: array expected";
                for (let i = 0; i < message.extra.length; ++i) {
                    let error = $root.vessels.Extra.verify(message.extra[i], _depth + 1);
                    if (error)
                        return "extra." + error;
                }
            }
            if (message.mmsi != null && Object.hasOwnProperty.call(message, "mmsi")) {
                if (!Array.isArray(message.mmsi))
                    return "mmsi: array expected";
                for (let i = 0; i < message.mmsi.length; ++i) {
                    let error = $root.vessels.StartEndValue.verify(message.mmsi[i], _depth + 1);
                    if (error)
                        return "mmsi." + error;
                }
            }
            if (message.callsign != null && Object.hasOwnProperty.call(message, "callsign")) {
                if (!Array.isArray(message.callsign))
                    return "callsign: array expected";
                for (let i = 0; i < message.callsign.length; ++i) {
                    let error = $root.vessels.StartEndValue.verify(message.callsign[i], _depth + 1);
                    if (error)
                        return "callsign." + error;
                }
            }
            if (message.flags != null && Object.hasOwnProperty.call(message, "flags")) {
                if (!Array.isArray(message.flags))
                    return "flags: array expected";
                for (let i = 0; i < message.flags.length; ++i) {
                    let error = $root.vessels.StartEndValue.verify(message.flags[i], _depth + 1);
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
        DatasetVesselInfo.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.DatasetVesselInfo)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.DatasetVesselInfo: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.DatasetVesselInfo();
            if (object.id != null)
                if (typeof object.id !== "string" || object.id.length)
                    message.id = String(object.id);
            if (object.name != null)
                if (typeof object.name !== "string" || object.name.length)
                    message.name = String(object.name);
            if (object.imo != null)
                if (typeof object.imo !== "string" || object.imo.length)
                    message.imo = String(object.imo);
            if (object.ssvid != null)
                if (typeof object.ssvid !== "string" || object.ssvid.length)
                    message.ssvid = String(object.ssvid);
            if (object.vesselId != null)
                if (typeof object.vesselId !== "string" || object.vesselId.length)
                    message.vesselId = String(object.vesselId);
            if (object.type != null)
                if (typeof object.type !== "string" || object.type.length)
                    message.type = String(object.type);
            if (object.dataset != null)
                if (typeof object.dataset !== "string" || object.dataset.length)
                    message.dataset = String(object.dataset);
            if (object.authorizations) {
                if (!Array.isArray(object.authorizations))
                    throw TypeError(".vessels.DatasetVesselInfo.authorizations: array expected");
                message.authorizations = Array(object.authorizations.length);
                for (let i = 0; i < object.authorizations.length; ++i) {
                    if (!$util.isObject(object.authorizations[i]))
                        throw TypeError(".vessels.DatasetVesselInfo.authorizations: object expected");
                    message.authorizations[i] = $root.vessels.StartEndValue.fromObject(object.authorizations[i], _depth + 1);
                }
            }
            if (object.extra) {
                if (!Array.isArray(object.extra))
                    throw TypeError(".vessels.DatasetVesselInfo.extra: array expected");
                message.extra = Array(object.extra.length);
                for (let i = 0; i < object.extra.length; ++i) {
                    if (!$util.isObject(object.extra[i]))
                        throw TypeError(".vessels.DatasetVesselInfo.extra: object expected");
                    message.extra[i] = $root.vessels.Extra.fromObject(object.extra[i], _depth + 1);
                }
            }
            if (object.mmsi) {
                if (!Array.isArray(object.mmsi))
                    throw TypeError(".vessels.DatasetVesselInfo.mmsi: array expected");
                message.mmsi = Array(object.mmsi.length);
                for (let i = 0; i < object.mmsi.length; ++i) {
                    if (!$util.isObject(object.mmsi[i]))
                        throw TypeError(".vessels.DatasetVesselInfo.mmsi: object expected");
                    message.mmsi[i] = $root.vessels.StartEndValue.fromObject(object.mmsi[i], _depth + 1);
                }
            }
            if (object.callsign) {
                if (!Array.isArray(object.callsign))
                    throw TypeError(".vessels.DatasetVesselInfo.callsign: array expected");
                message.callsign = Array(object.callsign.length);
                for (let i = 0; i < object.callsign.length; ++i) {
                    if (!$util.isObject(object.callsign[i]))
                        throw TypeError(".vessels.DatasetVesselInfo.callsign: object expected");
                    message.callsign[i] = $root.vessels.StartEndValue.fromObject(object.callsign[i], _depth + 1);
                }
            }
            if (object.flags) {
                if (!Array.isArray(object.flags))
                    throw TypeError(".vessels.DatasetVesselInfo.flags: array expected");
                message.flags = Array(object.flags.length);
                for (let i = 0; i < object.flags.length; ++i) {
                    if (!$util.isObject(object.flags[i]))
                        throw TypeError(".vessels.DatasetVesselInfo.flags: object expected");
                    message.flags[i] = $root.vessels.StartEndValue.fromObject(object.flags[i], _depth + 1);
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
        DatasetVesselInfo.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
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
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.imo != null && Object.hasOwnProperty.call(message, "imo"))
                object.imo = message.imo;
            if (message.ssvid != null && Object.hasOwnProperty.call(message, "ssvid"))
                object.ssvid = message.ssvid;
            if (message.vesselId != null && Object.hasOwnProperty.call(message, "vesselId"))
                object.vesselId = message.vesselId;
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.dataset != null && Object.hasOwnProperty.call(message, "dataset"))
                object.dataset = message.dataset;
            if (message.authorizations && message.authorizations.length) {
                object.authorizations = Array(message.authorizations.length);
                for (let j = 0; j < message.authorizations.length; ++j)
                    object.authorizations[j] = $root.vessels.StartEndValue.toObject(message.authorizations[j], options, _depth + 1);
            }
            if (message.extra && message.extra.length) {
                object.extra = Array(message.extra.length);
                for (let j = 0; j < message.extra.length; ++j)
                    object.extra[j] = $root.vessels.Extra.toObject(message.extra[j], options, _depth + 1);
            }
            if (message.mmsi && message.mmsi.length) {
                object.mmsi = Array(message.mmsi.length);
                for (let j = 0; j < message.mmsi.length; ++j)
                    object.mmsi[j] = $root.vessels.StartEndValue.toObject(message.mmsi[j], options, _depth + 1);
            }
            if (message.callsign && message.callsign.length) {
                object.callsign = Array(message.callsign.length);
                for (let j = 0; j < message.callsign.length; ++j)
                    object.callsign[j] = $root.vessels.StartEndValue.toObject(message.callsign[j], options, _depth + 1);
            }
            if (message.flags && message.flags.length) {
                object.flags = Array(message.flags.length);
                for (let j = 0; j < message.flags.length; ++j)
                    object.flags[j] = $root.vessels.StartEndValue.toObject(message.flags[j], options, _depth + 1);
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

        /**
         * Gets the type url for DatasetVesselInfo
         * @function getTypeUrl
         * @memberof vessels.DatasetVesselInfo
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        DatasetVesselInfo.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.DatasetVesselInfo";
        };

        return DatasetVesselInfo;
    })();

    vessels.Extra = (function() {

        /**
         * Properties of an Extra.
         * @typedef {Object} vessels.Extra.$Properties
         * @property {string|null} [id] Extra id
         * @property {string|null} [label] Extra label
         * @property {number|null} [value] Extra value
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of an Extra.
         * @memberof vessels
         * @interface IExtra
         * @augments vessels.Extra.$Properties
         * @deprecated Use vessels.Extra.$Properties instead.
         */

        /**
         * Shape of an Extra.
         * @typedef {vessels.Extra.$Properties} vessels.Extra.$Shape
         */

        /**
         * Constructs a new Extra.
         * @memberof vessels
         * @classdesc Represents an Extra.
         * @constructor
         * @param {vessels.Extra.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function Extra(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @param {vessels.Extra.$Properties=} [properties] Properties to set
         * @returns {vessels.Extra} Extra instance
         * @type {{
         *   (properties: vessels.Extra.$Shape): vessels.Extra & vessels.Extra.$Shape;
         *   (properties?: vessels.Extra.$Properties): vessels.Extra;
         * }}
         */
        Extra.create = function create(properties) {
            return new Extra(properties);
        };

        /**
         * Encodes the specified Extra message. Does not implicitly {@link vessels.Extra.verify|verify} messages.
         * @function encode
         * @memberof vessels.Extra
         * @static
         * @param {vessels.Extra.$Properties} message Extra message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Extra.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.label);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.value);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified Extra message, length delimited. Does not implicitly {@link vessels.Extra.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.Extra
         * @static
         * @param {vessels.Extra.$Properties} message Extra message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Extra.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes an Extra message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.Extra
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.Extra & vessels.Extra.$Shape} Extra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Extra.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.Extra(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.id = value;
                        else
                            delete message.id;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.label = value;
                        else
                            delete message.label;
                        continue;
                    }
                case 3: {
                        if (wireType !== 5)
                            break;
                        if ((value = reader.float()) !== 0)
                            message.value = value;
                        else
                            delete message.value;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes an Extra message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.Extra
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.Extra & vessels.Extra.$Shape} Extra
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
        Extra.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                if (!$util.isString(message.label))
                    return "label: string expected";
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
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
        Extra.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.Extra)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.Extra: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.Extra();
            if (object.id != null)
                if (typeof object.id !== "string" || object.id.length)
                    message.id = String(object.id);
            if (object.label != null)
                if (typeof object.label !== "string" || object.label.length)
                    message.label = String(object.label);
            if (object.value != null)
                if (Number(object.value) !== 0)
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
        Extra.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.label = "";
                object.value = 0;
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                object.label = message.label;
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
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

        /**
         * Gets the type url for Extra
         * @function getTypeUrl
         * @memberof vessels.Extra
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        Extra.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.Extra";
        };

        return Extra;
    })();

    vessels.StartEndValue = (function() {

        /**
         * Properties of a StartEndValue.
         * @typedef {Object} vessels.StartEndValue.$Properties
         * @property {string|null} [start] StartEndValue start
         * @property {string|null} [end] StartEndValue end
         * @property {string|null} [value] StartEndValue value
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */

        /**
         * Properties of a StartEndValue.
         * @memberof vessels
         * @interface IStartEndValue
         * @augments vessels.StartEndValue.$Properties
         * @deprecated Use vessels.StartEndValue.$Properties instead.
         */

        /**
         * Shape of a StartEndValue.
         * @typedef {vessels.StartEndValue.$Properties} vessels.StartEndValue.$Shape
         */

        /**
         * Constructs a new StartEndValue.
         * @memberof vessels
         * @classdesc Represents a StartEndValue.
         * @constructor
         * @param {vessels.StartEndValue.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
         */
        function StartEndValue(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
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
         * @param {vessels.StartEndValue.$Properties=} [properties] Properties to set
         * @returns {vessels.StartEndValue} StartEndValue instance
         * @type {{
         *   (properties: vessels.StartEndValue.$Shape): vessels.StartEndValue & vessels.StartEndValue.$Shape;
         *   (properties?: vessels.StartEndValue.$Properties): vessels.StartEndValue;
         * }}
         */
        StartEndValue.create = function create(properties) {
            return new StartEndValue(properties);
        };

        /**
         * Encodes the specified StartEndValue message. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
         * @function encode
         * @memberof vessels.StartEndValue
         * @static
         * @param {vessels.StartEndValue.$Properties} message StartEndValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartEndValue.encode = function encode(message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.start);
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.end);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.value);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Encodes the specified StartEndValue message, length delimited. Does not implicitly {@link vessels.StartEndValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof vessels.StartEndValue
         * @static
         * @param {vessels.StartEndValue.$Properties} message StartEndValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartEndValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
        };

        /**
         * Decodes a StartEndValue message from the specified reader or buffer.
         * @function decode
         * @memberof vessels.StartEndValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {vessels.StartEndValue & vessels.StartEndValue.$Shape} StartEndValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartEndValue.decode = function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
            let end = length === undefined ? reader.len : reader.pos + length, message = _target || new $root.vessels.StartEndValue(), value;
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.start = value;
                        else
                            delete message.start;
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.end = value;
                        else
                            delete message.end;
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        if ((value = reader.stringVerify()).length)
                            message.value = value;
                        else
                            delete message.value;
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== undefined)
                throw Error("missing end group");
            return message;
        };

        /**
         * Decodes a StartEndValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof vessels.StartEndValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {vessels.StartEndValue & vessels.StartEndValue.$Shape} StartEndValue
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
        StartEndValue.verify = function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                return "max depth exceeded";
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                if (!$util.isString(message.start))
                    return "start: string expected";
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                if (!$util.isString(message.end))
                    return "end: string expected";
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
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
        StartEndValue.fromObject = function fromObject(object, _depth) {
            if (object instanceof $root.vessels.StartEndValue)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".vessels.StartEndValue: object expected");
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let message = new $root.vessels.StartEndValue();
            if (object.start != null)
                if (typeof object.start !== "string" || object.start.length)
                    message.start = String(object.start);
            if (object.end != null)
                if (typeof object.end !== "string" || object.end.length)
                    message.end = String(object.end);
            if (object.value != null)
                if (typeof object.value !== "string" || object.value.length)
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
        StartEndValue.toObject = function toObject(message, options, _depth) {
            if (!options)
                options = {};
            if (_depth === undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
            let object = {};
            if (options.defaults) {
                object.start = "";
                object.end = "";
                object.value = "";
            }
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                object.start = message.start;
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                object.end = message.end;
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
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

        /**
         * Gets the type url for StartEndValue
         * @function getTypeUrl
         * @memberof vessels.StartEndValue
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        StartEndValue.getTypeUrl = function getTypeUrl(prefix) {
            if (prefix === undefined)
                prefix = "type.googleapis.com";
            return prefix + "/vessels.StartEndValue";
        };

        return StartEndValue;
    })();

    return vessels;
})();

export {
  $root as default
};
