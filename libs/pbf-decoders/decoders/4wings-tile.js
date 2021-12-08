/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.tile = (function() {

    /**
     * Namespace tile.
     * @exports tile
     * @namespace
     */
    var tile = {};

    tile.Tile = (function() {

        /**
         * Properties of a Tile.
         * @memberof tile
         * @interface ITile
         * @property {Array.<number>|null} [data] Tile data
         */

        /**
         * Constructs a new Tile.
         * @memberof tile
         * @classdesc Represents a Tile.
         * @implements ITile
         * @constructor
         * @param {tile.ITile=} [properties] Properties to set
         */
        function Tile(properties) {
            this.data = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Tile data.
         * @member {Array.<number>} data
         * @memberof tile.Tile
         * @instance
         */
        Tile.prototype.data = $util.emptyArray;

        /**
         * Creates a new Tile instance using the specified properties.
         * @function create
         * @memberof tile.Tile
         * @static
         * @param {tile.ITile=} [properties] Properties to set
         * @returns {tile.Tile} Tile instance
         */
        Tile.create = function create(properties) {
            return new Tile(properties);
        };

        /**
         * Encodes the specified Tile message. Does not implicitly {@link tile.Tile.verify|verify} messages.
         * @function encode
         * @memberof tile.Tile
         * @static
         * @param {tile.ITile} message Tile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Tile.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && message.data.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.data.length; ++i)
                    writer.uint32(message.data[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified Tile message, length delimited. Does not implicitly {@link tile.Tile.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tile.Tile
         * @static
         * @param {tile.ITile} message Tile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Tile.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Tile message from the specified reader or buffer.
         * @function decode
         * @memberof tile.Tile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tile.Tile} Tile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Tile.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.tile.Tile();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.data && message.data.length))
                        message.data = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.data.push(reader.uint32());
                    } else
                        message.data.push(reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Tile message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tile.Tile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tile.Tile} Tile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Tile.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Tile message.
         * @function verify
         * @memberof tile.Tile
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Tile.verify = function verify(message) {
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
         * Creates a Tile message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tile.Tile
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tile.Tile} Tile
         */
        Tile.fromObject = function fromObject(object) {
            if (object instanceof $root.tile.Tile)
                return object;
            var message = new $root.tile.Tile();
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".tile.Tile.data: array expected");
                message.data = [];
                for (var i = 0; i < object.data.length; ++i)
                    message.data[i] = object.data[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a Tile message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tile.Tile
         * @static
         * @param {tile.Tile} message Tile
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Tile.toObject = function toObject(message, options) {
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
         * Converts this Tile to JSON.
         * @function toJSON
         * @memberof tile.Tile
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Tile.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Tile;
    })();

    return tile;
})();

module.exports = $root;
