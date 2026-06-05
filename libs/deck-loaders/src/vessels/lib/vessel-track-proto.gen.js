/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from 'protobufjs/minimal.js'

// Common aliases
const $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util

// Exported root namespace
const $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {})

export const vessels = ($root.vessels = (() => {
  /**
   * Namespace vessels.
   * @exports vessels
   * @namespace
   */
  const vessels = {}

  vessels.DeckTrackAttribute = (function () {
    /**
     * Properties of a DeckTrackAttribute.
     * @typedef {Object} vessels.DeckTrackAttribute.$Properties
     * @property {Array.<number>|null} [value] DeckTrackAttribute value
     * @property {number|null} [size] DeckTrackAttribute size
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */

    /**
     * Properties of a DeckTrackAttribute.
     * @memberof vessels
     * @interface IDeckTrackAttribute
     * @augments vessels.DeckTrackAttribute.$Properties
     * @deprecated Use vessels.DeckTrackAttribute.$Properties instead.
     */

    /**
     * Shape of a DeckTrackAttribute.
     * @typedef {vessels.DeckTrackAttribute.$Properties} vessels.DeckTrackAttribute.$Shape
     */

    /**
     * Constructs a new DeckTrackAttribute.
     * @memberof vessels
     * @classdesc Represents a DeckTrackAttribute.
     * @constructor
     * @param {vessels.DeckTrackAttribute.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */
    function DeckTrackAttribute(properties) {
      this.value = []
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null && keys[i] !== '__proto__')
            this[keys[i]] = properties[keys[i]]
    }

    /**
     * DeckTrackAttribute value.
     * @member {Array.<number>} value
     * @memberof vessels.DeckTrackAttribute
     * @instance
     */
    DeckTrackAttribute.prototype.value = $util.emptyArray

    /**
     * DeckTrackAttribute size.
     * @member {number} size
     * @memberof vessels.DeckTrackAttribute
     * @instance
     */
    DeckTrackAttribute.prototype.size = 0

    /**
     * Creates a new DeckTrackAttribute instance using the specified properties.
     * @function create
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {vessels.DeckTrackAttribute.$Properties=} [properties] Properties to set
     * @returns {vessels.DeckTrackAttribute} DeckTrackAttribute instance
     * @type {{
     *   (properties: vessels.DeckTrackAttribute.$Shape): vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape;
     *   (properties?: vessels.DeckTrackAttribute.$Properties): vessels.DeckTrackAttribute;
     * }}
     */
    DeckTrackAttribute.create = function create(properties) {
      return new DeckTrackAttribute(properties)
    }

    /**
     * Encodes the specified DeckTrackAttribute message. Does not implicitly {@link vessels.DeckTrackAttribute.verify|verify} messages.
     * @function encode
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {vessels.DeckTrackAttribute.$Properties} message DeckTrackAttribute message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DeckTrackAttribute.encode = function encode(message, writer, _depth) {
      if (!writer) writer = $Writer.create()
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      if (message.value != null && message.value.length) {
        writer.uint32(/* id 1, wireType 2 =*/ 10).fork()
        for (let i = 0; i < message.value.length; ++i) writer.float(message.value[i])
        writer.ldelim()
      }
      if (message.size != null && Object.hasOwnProperty.call(message, 'size'))
        writer.uint32(/* id 2, wireType 0 =*/ 16).uint32(message.size)
      if (message.$unknowns != null && Object.hasOwnProperty.call(message, '$unknowns'))
        for (let i = 0; i < message.$unknowns.length; ++i) writer.raw(message.$unknowns[i])
      return writer
    }

    /**
     * Encodes the specified DeckTrackAttribute message, length delimited. Does not implicitly {@link vessels.DeckTrackAttribute.verify|verify} messages.
     * @function encodeDelimited
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {vessels.DeckTrackAttribute.$Properties} message DeckTrackAttribute message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DeckTrackAttribute.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim()
    }

    /**
     * Decodes a DeckTrackAttribute message from the specified reader or buffer.
     * @function decode
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape} DeckTrackAttribute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DeckTrackAttribute.decode = function decode(reader, length, _end, _depth, _target) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      if (_depth === undefined) _depth = 0
      if (_depth > $Reader.recursionLimit) throw Error('max depth exceeded')
      let end = length === undefined ? reader.len : reader.pos + length,
        message = _target || new $root.vessels.DeckTrackAttribute(),
        value
      while (reader.pos < end) {
        let start = reader.pos
        let tag = reader.tag()
        if (tag === _end) {
          _end = undefined
          break
        }
        let wireType = tag & 7
        switch ((tag >>>= 3)) {
          case 1: {
            if (wireType === 2) {
              if (!(message.value && message.value.length)) message.value = []
              let end2 = reader.uint32() + reader.pos
              while (reader.pos < end2) message.value.push(reader.float())
              continue
            }
            if (wireType !== 5) break
            if (!(message.value && message.value.length)) message.value = []
            message.value.push(reader.float())
            continue
          }
          case 2: {
            if (wireType !== 0) break
            if ((value = reader.uint32())) message.size = value
            else delete message.size
            continue
          }
        }
        reader.skipType(wireType, _depth, tag)
        if (!reader.discardUnknown) {
          $util.makeProp(message, '$unknowns', false)
          ;(message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos))
        }
      }
      if (_end !== undefined) throw Error('missing end group')
      return message
    }

    /**
     * Decodes a DeckTrackAttribute message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {vessels.DeckTrackAttribute & vessels.DeckTrackAttribute.$Shape} DeckTrackAttribute
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DeckTrackAttribute.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a DeckTrackAttribute message.
     * @function verify
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DeckTrackAttribute.verify = function verify(message, _depth) {
      if (typeof message !== 'object' || message === null) return 'object expected'
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) return 'max depth exceeded'
      if (message.value != null && message.hasOwnProperty('value')) {
        if (!Array.isArray(message.value)) return 'value: array expected'
        for (let i = 0; i < message.value.length; ++i)
          if (typeof message.value[i] !== 'number') return 'value: number[] expected'
      }
      if (message.size != null && message.hasOwnProperty('size'))
        if (!$util.isInteger(message.size)) return 'size: integer expected'
      return null
    }

    /**
     * Creates a DeckTrackAttribute message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {vessels.DeckTrackAttribute} DeckTrackAttribute
     */
    DeckTrackAttribute.fromObject = function fromObject(object, _depth) {
      if (object instanceof $root.vessels.DeckTrackAttribute) return object
      if (!$util.isObject(object)) throw TypeError('.vessels.DeckTrackAttribute: object expected')
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      let message = new $root.vessels.DeckTrackAttribute()
      if (object.value) {
        if (!Array.isArray(object.value))
          throw TypeError('.vessels.DeckTrackAttribute.value: array expected')
        message.value = Array(object.value.length)
        for (let i = 0; i < object.value.length; ++i) message.value[i] = Number(object.value[i])
      }
      if (object.size != null) if (Number(object.size) !== 0) message.size = object.size >>> 0
      return message
    }

    /**
     * Creates a plain object from a DeckTrackAttribute message. Also converts values to other types if specified.
     * @function toObject
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {vessels.DeckTrackAttribute} message DeckTrackAttribute
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DeckTrackAttribute.toObject = function toObject(message, options, _depth) {
      if (!options) options = {}
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      let object = {}
      if (options.arrays || options.defaults) object.value = []
      if (options.defaults) object.size = 0
      if (message.value && message.value.length) {
        object.value = Array(message.value.length)
        for (let j = 0; j < message.value.length; ++j)
          object.value[j] =
            options.json && !isFinite(message.value[j])
              ? String(message.value[j])
              : message.value[j]
      }
      if (message.size != null && message.hasOwnProperty('size')) object.size = message.size
      return object
    }

    /**
     * Converts this DeckTrackAttribute to JSON.
     * @function toJSON
     * @memberof vessels.DeckTrackAttribute
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DeckTrackAttribute.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    /**
     * Gets the type url for DeckTrackAttribute
     * @function getTypeUrl
     * @memberof vessels.DeckTrackAttribute
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    DeckTrackAttribute.getTypeUrl = function getTypeUrl(prefix) {
      if (prefix === undefined) prefix = 'type.googleapis.com'
      return prefix + '/vessels.DeckTrackAttribute'
    }

    return DeckTrackAttribute
  })()

  vessels.DeckTrackAttributeStruct = (function () {
    /**
     * Properties of a DeckTrackAttributeStruct.
     * @typedef {Object} vessels.DeckTrackAttributeStruct.$Properties
     * @property {vessels.DeckTrackAttribute.$Properties|null} [getPath] DeckTrackAttributeStruct getPath
     * @property {vessels.DeckTrackAttribute.$Properties|null} [getTimestamp] DeckTrackAttributeStruct getTimestamp
     * @property {vessels.DeckTrackAttribute.$Properties|null} [getSpeed] DeckTrackAttributeStruct getSpeed
     * @property {vessels.DeckTrackAttribute.$Properties|null} [getElevation] DeckTrackAttributeStruct getElevation
     * @property {vessels.DeckTrackAttribute.$Properties|null} [getCourse] DeckTrackAttributeStruct getCourse
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */

    /**
     * Properties of a DeckTrackAttributeStruct.
     * @memberof vessels
     * @interface IDeckTrackAttributeStruct
     * @augments vessels.DeckTrackAttributeStruct.$Properties
     * @deprecated Use vessels.DeckTrackAttributeStruct.$Properties instead.
     */

    /**
     * Shape of a DeckTrackAttributeStruct.
     * @typedef {vessels.DeckTrackAttributeStruct.$Properties} vessels.DeckTrackAttributeStruct.$Shape
     */

    /**
     * Constructs a new DeckTrackAttributeStruct.
     * @memberof vessels
     * @classdesc Represents a DeckTrackAttributeStruct.
     * @constructor
     * @param {vessels.DeckTrackAttributeStruct.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */
    function DeckTrackAttributeStruct(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null && keys[i] !== '__proto__')
            this[keys[i]] = properties[keys[i]]
    }

    /**
     * DeckTrackAttributeStruct getPath.
     * @member {vessels.DeckTrackAttribute.$Properties|null|undefined} getPath
     * @memberof vessels.DeckTrackAttributeStruct
     * @instance
     */
    DeckTrackAttributeStruct.prototype.getPath = null

    /**
     * DeckTrackAttributeStruct getTimestamp.
     * @member {vessels.DeckTrackAttribute.$Properties|null|undefined} getTimestamp
     * @memberof vessels.DeckTrackAttributeStruct
     * @instance
     */
    DeckTrackAttributeStruct.prototype.getTimestamp = null

    /**
     * DeckTrackAttributeStruct getSpeed.
     * @member {vessels.DeckTrackAttribute.$Properties|null|undefined} getSpeed
     * @memberof vessels.DeckTrackAttributeStruct
     * @instance
     */
    DeckTrackAttributeStruct.prototype.getSpeed = null

    /**
     * DeckTrackAttributeStruct getElevation.
     * @member {vessels.DeckTrackAttribute.$Properties|null|undefined} getElevation
     * @memberof vessels.DeckTrackAttributeStruct
     * @instance
     */
    DeckTrackAttributeStruct.prototype.getElevation = null

    /**
     * DeckTrackAttributeStruct getCourse.
     * @member {vessels.DeckTrackAttribute.$Properties|null|undefined} getCourse
     * @memberof vessels.DeckTrackAttributeStruct
     * @instance
     */
    DeckTrackAttributeStruct.prototype.getCourse = null

    /**
     * Creates a new DeckTrackAttributeStruct instance using the specified properties.
     * @function create
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {vessels.DeckTrackAttributeStruct.$Properties=} [properties] Properties to set
     * @returns {vessels.DeckTrackAttributeStruct} DeckTrackAttributeStruct instance
     * @type {{
     *   (properties: vessels.DeckTrackAttributeStruct.$Shape): vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape;
     *   (properties?: vessels.DeckTrackAttributeStruct.$Properties): vessels.DeckTrackAttributeStruct;
     * }}
     */
    DeckTrackAttributeStruct.create = function create(properties) {
      return new DeckTrackAttributeStruct(properties)
    }

    /**
     * Encodes the specified DeckTrackAttributeStruct message. Does not implicitly {@link vessels.DeckTrackAttributeStruct.verify|verify} messages.
     * @function encode
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {vessels.DeckTrackAttributeStruct.$Properties} message DeckTrackAttributeStruct message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DeckTrackAttributeStruct.encode = function encode(message, writer, _depth) {
      if (!writer) writer = $Writer.create()
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      if (message.getPath != null && Object.hasOwnProperty.call(message, 'getPath'))
        $root.vessels.DeckTrackAttribute.encode(
          message.getPath,
          writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
          _depth + 1
        ).ldelim()
      if (message.getTimestamp != null && Object.hasOwnProperty.call(message, 'getTimestamp'))
        $root.vessels.DeckTrackAttribute.encode(
          message.getTimestamp,
          writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          _depth + 1
        ).ldelim()
      if (message.getSpeed != null && Object.hasOwnProperty.call(message, 'getSpeed'))
        $root.vessels.DeckTrackAttribute.encode(
          message.getSpeed,
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          _depth + 1
        ).ldelim()
      if (message.getElevation != null && Object.hasOwnProperty.call(message, 'getElevation'))
        $root.vessels.DeckTrackAttribute.encode(
          message.getElevation,
          writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
          _depth + 1
        ).ldelim()
      if (message.getCourse != null && Object.hasOwnProperty.call(message, 'getCourse'))
        $root.vessels.DeckTrackAttribute.encode(
          message.getCourse,
          writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
          _depth + 1
        ).ldelim()
      if (message.$unknowns != null && Object.hasOwnProperty.call(message, '$unknowns'))
        for (let i = 0; i < message.$unknowns.length; ++i) writer.raw(message.$unknowns[i])
      return writer
    }

    /**
     * Encodes the specified DeckTrackAttributeStruct message, length delimited. Does not implicitly {@link vessels.DeckTrackAttributeStruct.verify|verify} messages.
     * @function encodeDelimited
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {vessels.DeckTrackAttributeStruct.$Properties} message DeckTrackAttributeStruct message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DeckTrackAttributeStruct.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim()
    }

    /**
     * Decodes a DeckTrackAttributeStruct message from the specified reader or buffer.
     * @function decode
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape} DeckTrackAttributeStruct
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DeckTrackAttributeStruct.decode = function decode(reader, length, _end, _depth, _target) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      if (_depth === undefined) _depth = 0
      if (_depth > $Reader.recursionLimit) throw Error('max depth exceeded')
      let end = length === undefined ? reader.len : reader.pos + length,
        message = _target || new $root.vessels.DeckTrackAttributeStruct(),
        value
      while (reader.pos < end) {
        let start = reader.pos
        let tag = reader.tag()
        if (tag === _end) {
          _end = undefined
          break
        }
        let wireType = tag & 7
        switch ((tag >>>= 3)) {
          case 1: {
            if (wireType !== 2) break
            message.getPath = $root.vessels.DeckTrackAttribute.decode(
              reader,
              reader.uint32(),
              undefined,
              _depth + 1,
              message.getPath
            )
            continue
          }
          case 2: {
            if (wireType !== 2) break
            message.getTimestamp = $root.vessels.DeckTrackAttribute.decode(
              reader,
              reader.uint32(),
              undefined,
              _depth + 1,
              message.getTimestamp
            )
            continue
          }
          case 3: {
            if (wireType !== 2) break
            message.getSpeed = $root.vessels.DeckTrackAttribute.decode(
              reader,
              reader.uint32(),
              undefined,
              _depth + 1,
              message.getSpeed
            )
            continue
          }
          case 4: {
            if (wireType !== 2) break
            message.getElevation = $root.vessels.DeckTrackAttribute.decode(
              reader,
              reader.uint32(),
              undefined,
              _depth + 1,
              message.getElevation
            )
            continue
          }
          case 5: {
            if (wireType !== 2) break
            message.getCourse = $root.vessels.DeckTrackAttribute.decode(
              reader,
              reader.uint32(),
              undefined,
              _depth + 1,
              message.getCourse
            )
            continue
          }
        }
        reader.skipType(wireType, _depth, tag)
        if (!reader.discardUnknown) {
          $util.makeProp(message, '$unknowns', false)
          ;(message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos))
        }
      }
      if (_end !== undefined) throw Error('missing end group')
      return message
    }

    /**
     * Decodes a DeckTrackAttributeStruct message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {vessels.DeckTrackAttributeStruct & vessels.DeckTrackAttributeStruct.$Shape} DeckTrackAttributeStruct
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DeckTrackAttributeStruct.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a DeckTrackAttributeStruct message.
     * @function verify
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DeckTrackAttributeStruct.verify = function verify(message, _depth) {
      if (typeof message !== 'object' || message === null) return 'object expected'
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) return 'max depth exceeded'
      if (message.getPath != null && message.hasOwnProperty('getPath')) {
        let error = $root.vessels.DeckTrackAttribute.verify(message.getPath, _depth + 1)
        if (error) return 'getPath.' + error
      }
      if (message.getTimestamp != null && message.hasOwnProperty('getTimestamp')) {
        let error = $root.vessels.DeckTrackAttribute.verify(message.getTimestamp, _depth + 1)
        if (error) return 'getTimestamp.' + error
      }
      if (message.getSpeed != null && message.hasOwnProperty('getSpeed')) {
        let error = $root.vessels.DeckTrackAttribute.verify(message.getSpeed, _depth + 1)
        if (error) return 'getSpeed.' + error
      }
      if (message.getElevation != null && message.hasOwnProperty('getElevation')) {
        let error = $root.vessels.DeckTrackAttribute.verify(message.getElevation, _depth + 1)
        if (error) return 'getElevation.' + error
      }
      if (message.getCourse != null && message.hasOwnProperty('getCourse')) {
        let error = $root.vessels.DeckTrackAttribute.verify(message.getCourse, _depth + 1)
        if (error) return 'getCourse.' + error
      }
      return null
    }

    /**
     * Creates a DeckTrackAttributeStruct message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {vessels.DeckTrackAttributeStruct} DeckTrackAttributeStruct
     */
    DeckTrackAttributeStruct.fromObject = function fromObject(object, _depth) {
      if (object instanceof $root.vessels.DeckTrackAttributeStruct) return object
      if (!$util.isObject(object))
        throw TypeError('.vessels.DeckTrackAttributeStruct: object expected')
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      let message = new $root.vessels.DeckTrackAttributeStruct()
      if (object.getPath != null) {
        if (!$util.isObject(object.getPath))
          throw TypeError('.vessels.DeckTrackAttributeStruct.getPath: object expected')
        message.getPath = $root.vessels.DeckTrackAttribute.fromObject(object.getPath, _depth + 1)
      }
      if (object.getTimestamp != null) {
        if (!$util.isObject(object.getTimestamp))
          throw TypeError('.vessels.DeckTrackAttributeStruct.getTimestamp: object expected')
        message.getTimestamp = $root.vessels.DeckTrackAttribute.fromObject(
          object.getTimestamp,
          _depth + 1
        )
      }
      if (object.getSpeed != null) {
        if (!$util.isObject(object.getSpeed))
          throw TypeError('.vessels.DeckTrackAttributeStruct.getSpeed: object expected')
        message.getSpeed = $root.vessels.DeckTrackAttribute.fromObject(object.getSpeed, _depth + 1)
      }
      if (object.getElevation != null) {
        if (!$util.isObject(object.getElevation))
          throw TypeError('.vessels.DeckTrackAttributeStruct.getElevation: object expected')
        message.getElevation = $root.vessels.DeckTrackAttribute.fromObject(
          object.getElevation,
          _depth + 1
        )
      }
      if (object.getCourse != null) {
        if (!$util.isObject(object.getCourse))
          throw TypeError('.vessels.DeckTrackAttributeStruct.getCourse: object expected')
        message.getCourse = $root.vessels.DeckTrackAttribute.fromObject(
          object.getCourse,
          _depth + 1
        )
      }
      return message
    }

    /**
     * Creates a plain object from a DeckTrackAttributeStruct message. Also converts values to other types if specified.
     * @function toObject
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {vessels.DeckTrackAttributeStruct} message DeckTrackAttributeStruct
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DeckTrackAttributeStruct.toObject = function toObject(message, options, _depth) {
      if (!options) options = {}
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      let object = {}
      if (options.defaults) {
        object.getPath = null
        object.getTimestamp = null
        object.getSpeed = null
        object.getElevation = null
        object.getCourse = null
      }
      if (message.getPath != null && message.hasOwnProperty('getPath'))
        object.getPath = $root.vessels.DeckTrackAttribute.toObject(
          message.getPath,
          options,
          _depth + 1
        )
      if (message.getTimestamp != null && message.hasOwnProperty('getTimestamp'))
        object.getTimestamp = $root.vessels.DeckTrackAttribute.toObject(
          message.getTimestamp,
          options,
          _depth + 1
        )
      if (message.getSpeed != null && message.hasOwnProperty('getSpeed'))
        object.getSpeed = $root.vessels.DeckTrackAttribute.toObject(
          message.getSpeed,
          options,
          _depth + 1
        )
      if (message.getElevation != null && message.hasOwnProperty('getElevation'))
        object.getElevation = $root.vessels.DeckTrackAttribute.toObject(
          message.getElevation,
          options,
          _depth + 1
        )
      if (message.getCourse != null && message.hasOwnProperty('getCourse'))
        object.getCourse = $root.vessels.DeckTrackAttribute.toObject(
          message.getCourse,
          options,
          _depth + 1
        )
      return object
    }

    /**
     * Converts this DeckTrackAttributeStruct to JSON.
     * @function toJSON
     * @memberof vessels.DeckTrackAttributeStruct
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DeckTrackAttributeStruct.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    /**
     * Gets the type url for DeckTrackAttributeStruct
     * @function getTypeUrl
     * @memberof vessels.DeckTrackAttributeStruct
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    DeckTrackAttributeStruct.getTypeUrl = function getTypeUrl(prefix) {
      if (prefix === undefined) prefix = 'type.googleapis.com'
      return prefix + '/vessels.DeckTrackAttributeStruct'
    }

    return DeckTrackAttributeStruct
  })()

  vessels.DeckTrack = (function () {
    /**
     * Properties of a DeckTrack.
     * @typedef {Object} vessels.DeckTrack.$Properties
     * @property {number|null} [length] DeckTrack length
     * @property {Array.<number>|null} [startIndices] DeckTrack startIndices
     * @property {vessels.DeckTrackAttributeStruct.$Properties|null} [attributes] DeckTrack attributes
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */

    /**
     * Properties of a DeckTrack.
     * @memberof vessels
     * @interface IDeckTrack
     * @augments vessels.DeckTrack.$Properties
     * @deprecated Use vessels.DeckTrack.$Properties instead.
     */

    /**
     * Shape of a DeckTrack.
     * @typedef {vessels.DeckTrack.$Properties} vessels.DeckTrack.$Shape
     */

    /**
     * Constructs a new DeckTrack.
     * @memberof vessels
     * @classdesc Represents a DeckTrack.
     * @constructor
     * @param {vessels.DeckTrack.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */
    function DeckTrack(properties) {
      this.startIndices = []
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null && keys[i] !== '__proto__')
            this[keys[i]] = properties[keys[i]]
    }

    /**
     * DeckTrack length.
     * @member {number} length
     * @memberof vessels.DeckTrack
     * @instance
     */
    DeckTrack.prototype.length = 0

    /**
     * DeckTrack startIndices.
     * @member {Array.<number>} startIndices
     * @memberof vessels.DeckTrack
     * @instance
     */
    DeckTrack.prototype.startIndices = $util.emptyArray

    /**
     * DeckTrack attributes.
     * @member {vessels.DeckTrackAttributeStruct.$Properties|null|undefined} attributes
     * @memberof vessels.DeckTrack
     * @instance
     */
    DeckTrack.prototype.attributes = null

    /**
     * Creates a new DeckTrack instance using the specified properties.
     * @function create
     * @memberof vessels.DeckTrack
     * @static
     * @param {vessels.DeckTrack.$Properties=} [properties] Properties to set
     * @returns {vessels.DeckTrack} DeckTrack instance
     * @type {{
     *   (properties: vessels.DeckTrack.$Shape): vessels.DeckTrack & vessels.DeckTrack.$Shape;
     *   (properties?: vessels.DeckTrack.$Properties): vessels.DeckTrack;
     * }}
     */
    DeckTrack.create = function create(properties) {
      return new DeckTrack(properties)
    }

    /**
     * Encodes the specified DeckTrack message. Does not implicitly {@link vessels.DeckTrack.verify|verify} messages.
     * @function encode
     * @memberof vessels.DeckTrack
     * @static
     * @param {vessels.DeckTrack.$Properties} message DeckTrack message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DeckTrack.encode = function encode(message, writer, _depth) {
      if (!writer) writer = $Writer.create()
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      if (message.length != null && Object.hasOwnProperty.call(message, 'length'))
        writer.uint32(/* id 1, wireType 0 =*/ 8).uint32(message.length)
      if (message.startIndices != null && message.startIndices.length) {
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork()
        for (let i = 0; i < message.startIndices.length; ++i) writer.uint32(message.startIndices[i])
        writer.ldelim()
      }
      if (message.attributes != null && Object.hasOwnProperty.call(message, 'attributes'))
        $root.vessels.DeckTrackAttributeStruct.encode(
          message.attributes,
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          _depth + 1
        ).ldelim()
      if (message.$unknowns != null && Object.hasOwnProperty.call(message, '$unknowns'))
        for (let i = 0; i < message.$unknowns.length; ++i) writer.raw(message.$unknowns[i])
      return writer
    }

    /**
     * Encodes the specified DeckTrack message, length delimited. Does not implicitly {@link vessels.DeckTrack.verify|verify} messages.
     * @function encodeDelimited
     * @memberof vessels.DeckTrack
     * @static
     * @param {vessels.DeckTrack.$Properties} message DeckTrack message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DeckTrack.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim()
    }

    /**
     * Decodes a DeckTrack message from the specified reader or buffer.
     * @function decode
     * @memberof vessels.DeckTrack
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {vessels.DeckTrack & vessels.DeckTrack.$Shape} DeckTrack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DeckTrack.decode = function decode(reader, length, _end, _depth, _target) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      if (_depth === undefined) _depth = 0
      if (_depth > $Reader.recursionLimit) throw Error('max depth exceeded')
      let end = length === undefined ? reader.len : reader.pos + length,
        message = _target || new $root.vessels.DeckTrack(),
        value
      while (reader.pos < end) {
        let start = reader.pos
        let tag = reader.tag()
        if (tag === _end) {
          _end = undefined
          break
        }
        let wireType = tag & 7
        switch ((tag >>>= 3)) {
          case 1: {
            if (wireType !== 0) break
            if ((value = reader.uint32())) message.length = value
            else delete message.length
            continue
          }
          case 2: {
            if (wireType === 2) {
              if (!(message.startIndices && message.startIndices.length)) message.startIndices = []
              let end2 = reader.uint32() + reader.pos
              while (reader.pos < end2) message.startIndices.push(reader.uint32())
              continue
            }
            if (wireType !== 0) break
            if (!(message.startIndices && message.startIndices.length)) message.startIndices = []
            message.startIndices.push(reader.uint32())
            continue
          }
          case 3: {
            if (wireType !== 2) break
            message.attributes = $root.vessels.DeckTrackAttributeStruct.decode(
              reader,
              reader.uint32(),
              undefined,
              _depth + 1,
              message.attributes
            )
            continue
          }
        }
        reader.skipType(wireType, _depth, tag)
        if (!reader.discardUnknown) {
          $util.makeProp(message, '$unknowns', false)
          ;(message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos))
        }
      }
      if (_end !== undefined) throw Error('missing end group')
      return message
    }

    /**
     * Decodes a DeckTrack message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof vessels.DeckTrack
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {vessels.DeckTrack & vessels.DeckTrack.$Shape} DeckTrack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DeckTrack.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a DeckTrack message.
     * @function verify
     * @memberof vessels.DeckTrack
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DeckTrack.verify = function verify(message, _depth) {
      if (typeof message !== 'object' || message === null) return 'object expected'
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) return 'max depth exceeded'
      if (message.length != null && message.hasOwnProperty('length'))
        if (!$util.isInteger(message.length)) return 'length: integer expected'
      if (message.startIndices != null && message.hasOwnProperty('startIndices')) {
        if (!Array.isArray(message.startIndices)) return 'startIndices: array expected'
        for (let i = 0; i < message.startIndices.length; ++i)
          if (!$util.isInteger(message.startIndices[i])) return 'startIndices: integer[] expected'
      }
      if (message.attributes != null && message.hasOwnProperty('attributes')) {
        let error = $root.vessels.DeckTrackAttributeStruct.verify(message.attributes, _depth + 1)
        if (error) return 'attributes.' + error
      }
      return null
    }

    /**
     * Creates a DeckTrack message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof vessels.DeckTrack
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {vessels.DeckTrack} DeckTrack
     */
    DeckTrack.fromObject = function fromObject(object, _depth) {
      if (object instanceof $root.vessels.DeckTrack) return object
      if (!$util.isObject(object)) throw TypeError('.vessels.DeckTrack: object expected')
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      let message = new $root.vessels.DeckTrack()
      if (object.length != null)
        if (Number(object.length) !== 0) message.length = object.length >>> 0
      if (object.startIndices) {
        if (!Array.isArray(object.startIndices))
          throw TypeError('.vessels.DeckTrack.startIndices: array expected')
        message.startIndices = Array(object.startIndices.length)
        for (let i = 0; i < object.startIndices.length; ++i)
          message.startIndices[i] = object.startIndices[i] >>> 0
      }
      if (object.attributes != null) {
        if (!$util.isObject(object.attributes))
          throw TypeError('.vessels.DeckTrack.attributes: object expected')
        message.attributes = $root.vessels.DeckTrackAttributeStruct.fromObject(
          object.attributes,
          _depth + 1
        )
      }
      return message
    }

    /**
     * Creates a plain object from a DeckTrack message. Also converts values to other types if specified.
     * @function toObject
     * @memberof vessels.DeckTrack
     * @static
     * @param {vessels.DeckTrack} message DeckTrack
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DeckTrack.toObject = function toObject(message, options, _depth) {
      if (!options) options = {}
      if (_depth === undefined) _depth = 0
      if (_depth > $util.recursionLimit) throw Error('max depth exceeded')
      let object = {}
      if (options.arrays || options.defaults) object.startIndices = []
      if (options.defaults) {
        object.length = 0
        object.attributes = null
      }
      if (message.length != null && message.hasOwnProperty('length')) object.length = message.length
      if (message.startIndices && message.startIndices.length) {
        object.startIndices = Array(message.startIndices.length)
        for (let j = 0; j < message.startIndices.length; ++j)
          object.startIndices[j] = message.startIndices[j]
      }
      if (message.attributes != null && message.hasOwnProperty('attributes'))
        object.attributes = $root.vessels.DeckTrackAttributeStruct.toObject(
          message.attributes,
          options,
          _depth + 1
        )
      return object
    }

    /**
     * Converts this DeckTrack to JSON.
     * @function toJSON
     * @memberof vessels.DeckTrack
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DeckTrack.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    /**
     * Gets the type url for DeckTrack
     * @function getTypeUrl
     * @memberof vessels.DeckTrack
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    DeckTrack.getTypeUrl = function getTypeUrl(prefix) {
      if (prefix === undefined) prefix = 'type.googleapis.com'
      return prefix + '/vessels.DeckTrack'
    }

    return DeckTrack
  })()

  return vessels
})())

export { $root as default }
