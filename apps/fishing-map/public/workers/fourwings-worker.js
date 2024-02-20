var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports) {
    "use strict";
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/pbf/index.js
var require_pbf = __commonJS({
  "node_modules/pbf/index.js"(exports, module) {
    "use strict";
    module.exports = Pbf2;
    var ieee754 = require_ieee754();
    function Pbf2(buf) {
      this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
      this.pos = 0;
      this.type = 0;
      this.length = this.buf.length;
    }
    Pbf2.Varint = 0;
    Pbf2.Fixed64 = 1;
    Pbf2.Bytes = 2;
    Pbf2.Fixed32 = 5;
    var SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
    var SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
    var TEXT_DECODER_MIN_LENGTH = 12;
    var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf8");
    Pbf2.prototype = {
      destroy: function() {
        this.buf = null;
      },
      // === READING =================================================================
      readFields: function(readField, result, end) {
        end = end || this.length;
        while (this.pos < end) {
          var val = this.readVarint(), tag = val >> 3, startPos = this.pos;
          this.type = val & 7;
          readField(tag, result, this);
          if (this.pos === startPos)
            this.skip(val);
        }
        return result;
      },
      readMessage: function(readField, result) {
        return this.readFields(readField, result, this.readVarint() + this.pos);
      },
      readFixed32: function() {
        var val = readUInt32(this.buf, this.pos);
        this.pos += 4;
        return val;
      },
      readSFixed32: function() {
        var val = readInt32(this.buf, this.pos);
        this.pos += 4;
        return val;
      },
      // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)
      readFixed64: function() {
        var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
        this.pos += 8;
        return val;
      },
      readSFixed64: function() {
        var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
        this.pos += 8;
        return val;
      },
      readFloat: function() {
        var val = ieee754.read(this.buf, this.pos, true, 23, 4);
        this.pos += 4;
        return val;
      },
      readDouble: function() {
        var val = ieee754.read(this.buf, this.pos, true, 52, 8);
        this.pos += 8;
        return val;
      },
      readVarint: function(isSigned) {
        var buf = this.buf, val, b;
        b = buf[this.pos++];
        val = b & 127;
        if (b < 128)
          return val;
        b = buf[this.pos++];
        val |= (b & 127) << 7;
        if (b < 128)
          return val;
        b = buf[this.pos++];
        val |= (b & 127) << 14;
        if (b < 128)
          return val;
        b = buf[this.pos++];
        val |= (b & 127) << 21;
        if (b < 128)
          return val;
        b = buf[this.pos];
        val |= (b & 15) << 28;
        return readVarintRemainder(val, isSigned, this);
      },
      readVarint64: function() {
        return this.readVarint(true);
      },
      readSVarint: function() {
        var num = this.readVarint();
        return num % 2 === 1 ? (num + 1) / -2 : num / 2;
      },
      readBoolean: function() {
        return Boolean(this.readVarint());
      },
      readString: function() {
        var end = this.readVarint() + this.pos;
        var pos = this.pos;
        this.pos = end;
        if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
          return readUtf8TextDecoder(this.buf, pos, end);
        }
        return readUtf8(this.buf, pos, end);
      },
      readBytes: function() {
        var end = this.readVarint() + this.pos, buffer = this.buf.subarray(this.pos, end);
        this.pos = end;
        return buffer;
      },
      // verbose for performance reasons; doesn't affect gzipped size
      readPackedVarint: function(arr, isSigned) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readVarint(isSigned));
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readVarint(isSigned));
        return arr;
      },
      readPackedSVarint: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readSVarint());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readSVarint());
        return arr;
      },
      readPackedBoolean: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readBoolean());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readBoolean());
        return arr;
      },
      readPackedFloat: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readFloat());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readFloat());
        return arr;
      },
      readPackedDouble: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readDouble());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readDouble());
        return arr;
      },
      readPackedFixed32: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readFixed32());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readFixed32());
        return arr;
      },
      readPackedSFixed32: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readSFixed32());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readSFixed32());
        return arr;
      },
      readPackedFixed64: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readFixed64());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readFixed64());
        return arr;
      },
      readPackedSFixed64: function(arr) {
        if (this.type !== Pbf2.Bytes)
          return arr.push(this.readSFixed64());
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end)
          arr.push(this.readSFixed64());
        return arr;
      },
      skip: function(val) {
        var type = val & 7;
        if (type === Pbf2.Varint)
          while (this.buf[this.pos++] > 127) {
          }
        else if (type === Pbf2.Bytes)
          this.pos = this.readVarint() + this.pos;
        else if (type === Pbf2.Fixed32)
          this.pos += 4;
        else if (type === Pbf2.Fixed64)
          this.pos += 8;
        else
          throw new Error("Unimplemented type: " + type);
      },
      // === WRITING =================================================================
      writeTag: function(tag, type) {
        this.writeVarint(tag << 3 | type);
      },
      realloc: function(min) {
        var length = this.length || 16;
        while (length < this.pos + min)
          length *= 2;
        if (length !== this.length) {
          var buf = new Uint8Array(length);
          buf.set(this.buf);
          this.buf = buf;
          this.length = length;
        }
      },
      finish: function() {
        this.length = this.pos;
        this.pos = 0;
        return this.buf.subarray(0, this.length);
      },
      writeFixed32: function(val) {
        this.realloc(4);
        writeInt32(this.buf, val, this.pos);
        this.pos += 4;
      },
      writeSFixed32: function(val) {
        this.realloc(4);
        writeInt32(this.buf, val, this.pos);
        this.pos += 4;
      },
      writeFixed64: function(val) {
        this.realloc(8);
        writeInt32(this.buf, val & -1, this.pos);
        writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
        this.pos += 8;
      },
      writeSFixed64: function(val) {
        this.realloc(8);
        writeInt32(this.buf, val & -1, this.pos);
        writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
        this.pos += 8;
      },
      writeVarint: function(val) {
        val = +val || 0;
        if (val > 268435455 || val < 0) {
          writeBigVarint(val, this);
          return;
        }
        this.realloc(4);
        this.buf[this.pos++] = val & 127 | (val > 127 ? 128 : 0);
        if (val <= 127)
          return;
        this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
        if (val <= 127)
          return;
        this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
        if (val <= 127)
          return;
        this.buf[this.pos++] = val >>> 7 & 127;
      },
      writeSVarint: function(val) {
        this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
      },
      writeBoolean: function(val) {
        this.writeVarint(Boolean(val));
      },
      writeString: function(str) {
        str = String(str);
        this.realloc(str.length * 4);
        this.pos++;
        var startPos = this.pos;
        this.pos = writeUtf8(this.buf, str, this.pos);
        var len = this.pos - startPos;
        if (len >= 128)
          makeRoomForExtraLength(startPos, len, this);
        this.pos = startPos - 1;
        this.writeVarint(len);
        this.pos += len;
      },
      writeFloat: function(val) {
        this.realloc(4);
        ieee754.write(this.buf, val, this.pos, true, 23, 4);
        this.pos += 4;
      },
      writeDouble: function(val) {
        this.realloc(8);
        ieee754.write(this.buf, val, this.pos, true, 52, 8);
        this.pos += 8;
      },
      writeBytes: function(buffer) {
        var len = buffer.length;
        this.writeVarint(len);
        this.realloc(len);
        for (var i = 0; i < len; i++)
          this.buf[this.pos++] = buffer[i];
      },
      writeRawMessage: function(fn, obj) {
        this.pos++;
        var startPos = this.pos;
        fn(obj, this);
        var len = this.pos - startPos;
        if (len >= 128)
          makeRoomForExtraLength(startPos, len, this);
        this.pos = startPos - 1;
        this.writeVarint(len);
        this.pos += len;
      },
      writeMessage: function(tag, fn, obj) {
        this.writeTag(tag, Pbf2.Bytes);
        this.writeRawMessage(fn, obj);
      },
      writePackedVarint: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedVarint, arr);
      },
      writePackedSVarint: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedSVarint, arr);
      },
      writePackedBoolean: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedBoolean, arr);
      },
      writePackedFloat: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedFloat, arr);
      },
      writePackedDouble: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedDouble, arr);
      },
      writePackedFixed32: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedFixed32, arr);
      },
      writePackedSFixed32: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedSFixed32, arr);
      },
      writePackedFixed64: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedFixed64, arr);
      },
      writePackedSFixed64: function(tag, arr) {
        if (arr.length)
          this.writeMessage(tag, writePackedSFixed64, arr);
      },
      writeBytesField: function(tag, buffer) {
        this.writeTag(tag, Pbf2.Bytes);
        this.writeBytes(buffer);
      },
      writeFixed32Field: function(tag, val) {
        this.writeTag(tag, Pbf2.Fixed32);
        this.writeFixed32(val);
      },
      writeSFixed32Field: function(tag, val) {
        this.writeTag(tag, Pbf2.Fixed32);
        this.writeSFixed32(val);
      },
      writeFixed64Field: function(tag, val) {
        this.writeTag(tag, Pbf2.Fixed64);
        this.writeFixed64(val);
      },
      writeSFixed64Field: function(tag, val) {
        this.writeTag(tag, Pbf2.Fixed64);
        this.writeSFixed64(val);
      },
      writeVarintField: function(tag, val) {
        this.writeTag(tag, Pbf2.Varint);
        this.writeVarint(val);
      },
      writeSVarintField: function(tag, val) {
        this.writeTag(tag, Pbf2.Varint);
        this.writeSVarint(val);
      },
      writeStringField: function(tag, str) {
        this.writeTag(tag, Pbf2.Bytes);
        this.writeString(str);
      },
      writeFloatField: function(tag, val) {
        this.writeTag(tag, Pbf2.Fixed32);
        this.writeFloat(val);
      },
      writeDoubleField: function(tag, val) {
        this.writeTag(tag, Pbf2.Fixed64);
        this.writeDouble(val);
      },
      writeBooleanField: function(tag, val) {
        this.writeVarintField(tag, Boolean(val));
      }
    };
    function readVarintRemainder(l, s, p) {
      var buf = p.buf, h, b;
      b = buf[p.pos++];
      h = (b & 112) >> 4;
      if (b < 128)
        return toNum(l, h, s);
      b = buf[p.pos++];
      h |= (b & 127) << 3;
      if (b < 128)
        return toNum(l, h, s);
      b = buf[p.pos++];
      h |= (b & 127) << 10;
      if (b < 128)
        return toNum(l, h, s);
      b = buf[p.pos++];
      h |= (b & 127) << 17;
      if (b < 128)
        return toNum(l, h, s);
      b = buf[p.pos++];
      h |= (b & 127) << 24;
      if (b < 128)
        return toNum(l, h, s);
      b = buf[p.pos++];
      h |= (b & 1) << 31;
      if (b < 128)
        return toNum(l, h, s);
      throw new Error("Expected varint not more than 10 bytes");
    }
    function readPackedEnd(pbf) {
      return pbf.type === Pbf2.Bytes ? pbf.readVarint() + pbf.pos : pbf.pos + 1;
    }
    function toNum(low, high, isSigned) {
      if (isSigned) {
        return high * 4294967296 + (low >>> 0);
      }
      return (high >>> 0) * 4294967296 + (low >>> 0);
    }
    function writeBigVarint(val, pbf) {
      var low, high;
      if (val >= 0) {
        low = val % 4294967296 | 0;
        high = val / 4294967296 | 0;
      } else {
        low = ~(-val % 4294967296);
        high = ~(-val / 4294967296);
        if (low ^ 4294967295) {
          low = low + 1 | 0;
        } else {
          low = 0;
          high = high + 1 | 0;
        }
      }
      if (val >= 18446744073709552e3 || val < -18446744073709552e3) {
        throw new Error("Given varint doesn't fit into 10 bytes");
      }
      pbf.realloc(10);
      writeBigVarintLow(low, high, pbf);
      writeBigVarintHigh(high, pbf);
    }
    function writeBigVarintLow(low, high, pbf) {
      pbf.buf[pbf.pos++] = low & 127 | 128;
      low >>>= 7;
      pbf.buf[pbf.pos++] = low & 127 | 128;
      low >>>= 7;
      pbf.buf[pbf.pos++] = low & 127 | 128;
      low >>>= 7;
      pbf.buf[pbf.pos++] = low & 127 | 128;
      low >>>= 7;
      pbf.buf[pbf.pos] = low & 127;
    }
    function writeBigVarintHigh(high, pbf) {
      var lsb = (high & 7) << 4;
      pbf.buf[pbf.pos++] |= lsb | ((high >>>= 3) ? 128 : 0);
      if (!high)
        return;
      pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
      if (!high)
        return;
      pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
      if (!high)
        return;
      pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
      if (!high)
        return;
      pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
      if (!high)
        return;
      pbf.buf[pbf.pos++] = high & 127;
    }
    function makeRoomForExtraLength(startPos, len, pbf) {
      var extraLen = len <= 16383 ? 1 : len <= 2097151 ? 2 : len <= 268435455 ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));
      pbf.realloc(extraLen);
      for (var i = pbf.pos - 1; i >= startPos; i--)
        pbf.buf[i + extraLen] = pbf.buf[i];
    }
    function writePackedVarint(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeVarint(arr[i]);
    }
    function writePackedSVarint(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeSVarint(arr[i]);
    }
    function writePackedFloat(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeFloat(arr[i]);
    }
    function writePackedDouble(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeDouble(arr[i]);
    }
    function writePackedBoolean(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeBoolean(arr[i]);
    }
    function writePackedFixed32(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeFixed32(arr[i]);
    }
    function writePackedSFixed32(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeSFixed32(arr[i]);
    }
    function writePackedFixed64(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeFixed64(arr[i]);
    }
    function writePackedSFixed64(arr, pbf) {
      for (var i = 0; i < arr.length; i++)
        pbf.writeSFixed64(arr[i]);
    }
    function readUInt32(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + buf[pos + 3] * 16777216;
    }
    function writeInt32(buf, val, pos) {
      buf[pos] = val;
      buf[pos + 1] = val >>> 8;
      buf[pos + 2] = val >>> 16;
      buf[pos + 3] = val >>> 24;
    }
    function readInt32(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16) + (buf[pos + 3] << 24);
    }
    function readUtf8(buf, pos, end) {
      var str = "";
      var i = pos;
      while (i < end) {
        var b0 = buf[i];
        var c = null;
        var bytesPerSequence = b0 > 239 ? 4 : b0 > 223 ? 3 : b0 > 191 ? 2 : 1;
        if (i + bytesPerSequence > end)
          break;
        var b1, b2, b3;
        if (bytesPerSequence === 1) {
          if (b0 < 128) {
            c = b0;
          }
        } else if (bytesPerSequence === 2) {
          b1 = buf[i + 1];
          if ((b1 & 192) === 128) {
            c = (b0 & 31) << 6 | b1 & 63;
            if (c <= 127) {
              c = null;
            }
          }
        } else if (bytesPerSequence === 3) {
          b1 = buf[i + 1];
          b2 = buf[i + 2];
          if ((b1 & 192) === 128 && (b2 & 192) === 128) {
            c = (b0 & 15) << 12 | (b1 & 63) << 6 | b2 & 63;
            if (c <= 2047 || c >= 55296 && c <= 57343) {
              c = null;
            }
          }
        } else if (bytesPerSequence === 4) {
          b1 = buf[i + 1];
          b2 = buf[i + 2];
          b3 = buf[i + 3];
          if ((b1 & 192) === 128 && (b2 & 192) === 128 && (b3 & 192) === 128) {
            c = (b0 & 15) << 18 | (b1 & 63) << 12 | (b2 & 63) << 6 | b3 & 63;
            if (c <= 65535 || c >= 1114112) {
              c = null;
            }
          }
        }
        if (c === null) {
          c = 65533;
          bytesPerSequence = 1;
        } else if (c > 65535) {
          c -= 65536;
          str += String.fromCharCode(c >>> 10 & 1023 | 55296);
          c = 56320 | c & 1023;
        }
        str += String.fromCharCode(c);
        i += bytesPerSequence;
      }
      return str;
    }
    function readUtf8TextDecoder(buf, pos, end) {
      return utf8TextDecoder.decode(buf.subarray(pos, end));
    }
    function writeUtf8(buf, str, pos) {
      for (var i = 0, c, lead; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c > 55295 && c < 57344) {
          if (lead) {
            if (c < 56320) {
              buf[pos++] = 239;
              buf[pos++] = 191;
              buf[pos++] = 189;
              lead = c;
              continue;
            } else {
              c = lead - 55296 << 10 | c - 56320 | 65536;
              lead = null;
            }
          } else {
            if (c > 56319 || i + 1 === str.length) {
              buf[pos++] = 239;
              buf[pos++] = 191;
              buf[pos++] = 189;
            } else {
              lead = c;
            }
            continue;
          }
        } else if (lead) {
          buf[pos++] = 239;
          buf[pos++] = 191;
          buf[pos++] = 189;
          lead = null;
        }
        if (c < 128) {
          buf[pos++] = c;
        } else {
          if (c < 2048) {
            buf[pos++] = c >> 6 | 192;
          } else {
            if (c < 65536) {
              buf[pos++] = c >> 12 | 224;
            } else {
              buf[pos++] = c >> 18 | 240;
              buf[pos++] = c >> 12 & 63 | 128;
            }
            buf[pos++] = c >> 6 & 63 | 128;
          }
          buf[pos++] = c & 63 | 128;
        }
      }
      return pos;
    }
  }
});

// node_modules/@loaders.gl/worker-utils/dist/lib/node/worker_threads-browser.js
var parentPort = null;

// node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js
function getTransferList(object) {
  let recursive = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  let transfers = arguments.length > 2 ? arguments[2] : void 0;
  const transfersSet = transfers || /* @__PURE__ */ new Set();
  if (!object) {
  } else if (isTransferable(object)) {
    transfersSet.add(object);
  } else if (isTransferable(object.buffer)) {
    transfersSet.add(object.buffer);
  } else if (ArrayBuffer.isView(object)) {
  } else if (recursive && typeof object === "object") {
    for (const key in object) {
      getTransferList(object[key], recursive, transfersSet);
    }
  }
  return transfers === void 0 ? Array.from(transfersSet) : [];
}
function isTransferable(object) {
  if (!object) {
    return false;
  }
  if (object instanceof ArrayBuffer) {
    return true;
  }
  if (typeof MessagePort !== "undefined" && object instanceof MessagePort) {
    return true;
  }
  if (typeof ImageBitmap !== "undefined" && object instanceof ImageBitmap) {
    return true;
  }
  if (typeof OffscreenCanvas !== "undefined" && object instanceof OffscreenCanvas) {
    return true;
  }
  return false;
}

// node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-body.js
async function getParentPort() {
  return parentPort;
}
var onMessageWrapperMap = /* @__PURE__ */ new Map();
var WorkerBody = class {
  static async inWorkerThread() {
    return typeof self !== "undefined" || Boolean(await getParentPort());
  }
  static set onmessage(onMessage) {
    async function handleMessage(message) {
      const parentPort2 = await getParentPort();
      const {
        type,
        payload
      } = parentPort2 ? message : message.data;
      onMessage(type, payload);
    }
    getParentPort().then((parentPort2) => {
      if (parentPort2) {
        parentPort2.on("message", handleMessage);
        parentPort2.on("exit", () => console.debug("Node worker closing"));
      } else {
        globalThis.onmessage = handleMessage;
      }
    });
  }
  static async addEventListener(onMessage) {
    let onMessageWrapper = onMessageWrapperMap.get(onMessage);
    if (!onMessageWrapper) {
      onMessageWrapper = async (message) => {
        if (!isKnownMessage(message)) {
          return;
        }
        const parentPort3 = await getParentPort();
        const {
          type,
          payload
        } = parentPort3 ? message : message.data;
        onMessage(type, payload);
      };
    }
    const parentPort2 = await getParentPort();
    if (parentPort2) {
      console.error("not implemented");
    } else {
      globalThis.addEventListener("message", onMessageWrapper);
    }
  }
  static async removeEventListener(onMessage) {
    const onMessageWrapper = onMessageWrapperMap.get(onMessage);
    onMessageWrapperMap.delete(onMessage);
    const parentPort2 = await getParentPort();
    if (parentPort2) {
      console.error("not implemented");
    } else {
      globalThis.removeEventListener("message", onMessageWrapper);
    }
  }
  static async postMessage(type, payload) {
    const data = {
      source: "loaders.gl",
      type,
      payload
    };
    const transferList = getTransferList(payload);
    const parentPort2 = await getParentPort();
    if (parentPort2) {
      parentPort2.postMessage(data, transferList);
    } else {
      globalThis.postMessage(data, transferList);
    }
  }
};
function isKnownMessage(message) {
  const {
    type,
    data
  } = message;
  return type === "message" && data && typeof data.source === "string" && data.source.startsWith("loaders.gl");
}

// node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/create-loader-worker.js
var requestId = 0;
async function createLoaderWorker(loader) {
  if (!await WorkerBody.inWorkerThread()) {
    return;
  }
  WorkerBody.onmessage = async (type, payload) => {
    switch (type) {
      case "process":
        try {
          const {
            input,
            options = {},
            context = {}
          } = payload;
          const result = await parseData({
            loader,
            arrayBuffer: input,
            options,
            context: {
              ...context,
              _parse: parseOnMainThread
            }
          });
          WorkerBody.postMessage("done", {
            result
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "";
          WorkerBody.postMessage("error", {
            error: message
          });
        }
        break;
      default:
    }
  };
}
function parseOnMainThread(arrayBuffer, loader, options, context) {
  return new Promise((resolve, reject) => {
    const id = requestId++;
    const onMessage = (type, payload2) => {
      if (payload2.id !== id) {
        return;
      }
      switch (type) {
        case "done":
          WorkerBody.removeEventListener(onMessage);
          resolve(payload2.result);
          break;
        case "error":
          WorkerBody.removeEventListener(onMessage);
          reject(payload2.error);
          break;
        default:
      }
    };
    WorkerBody.addEventListener(onMessage);
    const payload = {
      id,
      input: arrayBuffer,
      options
    };
    WorkerBody.postMessage("process", payload);
  });
}
async function parseData(_ref) {
  let {
    loader,
    arrayBuffer,
    options,
    context
  } = _ref;
  let data;
  let parser;
  if (loader.parseSync || loader.parse) {
    data = arrayBuffer;
    parser = loader.parseSync || loader.parse;
  } else if (loader.parseTextSync) {
    const textDecoder = new TextDecoder();
    data = textDecoder.decode(arrayBuffer);
    parser = loader.parseTextSync;
  } else {
    throw new Error(`Could not load data with ${loader.name} loader`);
  }
  options = {
    ...options,
    modules: loader && loader.options && loader.options.modules || {},
    worker: false
  };
  return await parser(data, {
    ...options
  }, context, loader);
}

// libs/deck-loaders/package.json
var package_default = {
  name: "@globalfishingwatch/deck-loaders",
  version: "0.0.1",
  main: "./index.cjs",
  module: "./index.js",
  dependencies: {
    "@loaders.gl/loader-utils": "^4.x",
    pbf: "3.x"
  }
};

// libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts
var import_pbf = __toESM(require_pbf());

// libs/deck-loaders/src/fourwings/helpers/time.ts
var CONFIG_BY_INTERVAL = {
  HOUR: {
    getTime: (frame) => {
      return frame * 1e3 * 60 * 60;
    },
    getIntervalFrame: (timestamp) => {
      return timestamp / (1e3 * 60 * 60);
    }
  },
  DAY: {
    getTime: (frame) => {
      return frame * 1e3 * 60 * 60 * 24;
    },
    getIntervalFrame: (timestamp) => {
      return timestamp / (1e3 * 60 * 60 * 24);
    }
  },
  MONTH: {
    getTime: (frame) => {
      const year = Math.floor(frame / 12);
      const month = frame % 12;
      return new Date(year, month, 1).getTime();
    },
    getIntervalFrame: (timestamp) => {
      const date = new Date(timestamp);
      return date.getFullYear() * 12 + date.getMonth();
    }
  },
  YEAR: {
    getTime: (frame) => {
      return new Date(frame, 0, 1).getTime();
    },
    getIntervalFrame: (timestamp) => {
      const date = new Date(timestamp);
      return date.getFullYear();
    }
  }
};

// libs/deck-loaders/src/fourwings/lib/parse-fourwings.ts
var NO_DATA_VALUE = 4294967295;
var SCALE_VALUE = 1;
var OFFSET_VALUE = 0;
var CELL_NUM_INDEX = 0;
var CELL_START_INDEX = 1;
var CELL_END_INDEX = 2;
var CELL_VALUES_START_INDEX = 3;
var getCellTimeseries = (intArrays, options) => {
  const { minFrame, maxFrame, interval, sublayers } = options?.fourwings || {};
  const tileMinIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame));
  const tileMaxIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(maxFrame));
  const cells = [];
  const indexes = [];
  const dataLength = intArrays.length;
  for (let subLayerIndex = 0; subLayerIndex < dataLength; subLayerIndex++) {
    let cellNum = 0;
    let startFrame = 0;
    let endFrame = 0;
    let startIndex = 0;
    let endIndex = 0;
    let indexInCell = 0;
    const subLayerIntArray = intArrays[subLayerIndex];
    for (let i = 0; i < subLayerIntArray.length; i++) {
      const value = subLayerIntArray[i];
      if (indexInCell === CELL_NUM_INDEX) {
        startIndex = i;
        cellNum = value;
      } else if (indexInCell === CELL_START_INDEX) {
        startFrame = value;
      } else if (indexInCell === CELL_END_INDEX) {
        endFrame = value;
        const numCellValues = (endFrame - startFrame + 1) * sublayers;
        const startOffset = startIndex + CELL_VALUES_START_INDEX;
        endIndex = startOffset + numCellValues - 1;
        let cellIndex = indexes.findIndex((v) => v === cellNum);
        if (cellIndex === -1) {
          cells.push(new Array(dataLength).fill(null));
          indexes.push(cellNum);
          cellIndex = cells.length - 1;
        }
        for (let j = 0; j < numCellValues; j++) {
          const cellValue = subLayerIntArray[j + startOffset];
          if (cellValue !== NO_DATA_VALUE) {
            if (!cells[cellIndex]?.[subLayerIndex]) {
              cells[cellIndex][subLayerIndex] = new Array(
                tileMaxIntervalFrame - tileMinIntervalFrame
              ).fill(null);
            }
            cells[cellIndex][subLayerIndex][startFrame - tileMinIntervalFrame + Math.floor(j / sublayers)] = cellValue * SCALE_VALUE + OFFSET_VALUE;
          }
        }
        i = endIndex;
        indexInCell = -1;
      }
      indexInCell++;
    }
  }
  return { cells, indexes };
};
function readData(_, data, pbf) {
  data.push(pbf.readPackedVarint());
}
var parseFourwings = async (datasetsBuffer, options) => {
  debugger;
  const { buffersLength, cols, rows } = options?.fourwings || {};
  if (!buffersLength?.length) {
    return [];
  }
  let start = 0;
  return {
    cols,
    rows,
    ...getCellTimeseries(
      buffersLength.map((length, index) => {
        if (length === 0) {
          return [];
        }
        const buffer = datasetsBuffer.slice(
          start,
          index !== buffersLength.length ? start + length : void 0
        );
        start += length;
        return new import_pbf.default(buffer).readFields(readData, [])[0];
      }),
      options
    )
  };
};

// libs/deck-loaders/src/fourwings/fourwings-loader.ts
var FourwingsWorkerLoader = {
  name: "fourwings tiles",
  id: "fourwings",
  module: "fourwings",
  version: package_default?.version,
  extensions: ["pbf"],
  mimeTypes: ["application/x-protobuf", "application/octet-stream", "application/protobuf"],
  worker: true,
  category: "geometry",
  options: {
    fourwings: {}
  }
};
var FourwingsLoader = {
  ...FourwingsWorkerLoader,
  parse: parseFourwings,
  parseSync: parseFourwings,
  binary: true
};

// libs/deck-loaders/src/fourwings/workers/fourwings-worker.ts
createLoaderWorker(FourwingsLoader);
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
