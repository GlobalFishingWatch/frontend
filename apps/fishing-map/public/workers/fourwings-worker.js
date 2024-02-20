'use strict';

var Pbf = require('pbf');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Pbf__default = /*#__PURE__*/_interopDefaultLegacy(Pbf);

function getTransferList(object) {
  let recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let transfers = arguments.length > 2 ? arguments[2] : undefined;
  const transfersSet = transfers || new Set();
  if (!object) ; else if (isTransferable(object)) {
    transfersSet.add(object);
  } else if (isTransferable(object.buffer)) {
    transfersSet.add(object.buffer);
  } else if (ArrayBuffer.isView(object)) ; else if (recursive && typeof object === 'object') {
    for (const key in object) {
      getTransferList(object[key], recursive, transfersSet);
    }
  }
  return transfers === undefined ? Array.from(transfersSet) : [];
}
function isTransferable(object) {
  if (!object) {
    return false;
  }
  if (object instanceof ArrayBuffer) {
    return true;
  }
  if (typeof MessagePort !== 'undefined' && object instanceof MessagePort) {
    return true;
  }
  if (typeof ImageBitmap !== 'undefined' && object instanceof ImageBitmap) {
    return true;
  }
  if (typeof OffscreenCanvas !== 'undefined' && object instanceof OffscreenCanvas) {
    return true;
  }
  return false;
}

function getParentPort() {
  let parentPort;
  try {
    eval('globalThis.parentPort = require(\'worker_threads\').parentPort');
    parentPort = globalThis.parentPort;
  } catch {}
  return parentPort;
}
const onMessageWrapperMap = new Map();
class WorkerBody {
  static inWorkerThread() {
    return typeof self !== 'undefined' || Boolean(getParentPort());
  }
  static set onmessage(onMessage) {
    function handleMessage(message) {
      const parentPort = getParentPort();
      const {
        type,
        payload
      } = parentPort ? message : message.data;
      onMessage(type, payload);
    }
    const parentPort = getParentPort();
    if (parentPort) {
      parentPort.on('message', handleMessage);
      parentPort.on('exit', () => console.debug('Node worker closing'));
    } else {
      globalThis.onmessage = handleMessage;
    }
  }
  static addEventListener(onMessage) {
    let onMessageWrapper = onMessageWrapperMap.get(onMessage);
    if (!onMessageWrapper) {
      onMessageWrapper = message => {
        if (!isKnownMessage(message)) {
          return;
        }
        const parentPort = getParentPort();
        const {
          type,
          payload
        } = parentPort ? message : message.data;
        onMessage(type, payload);
      };
    }
    const parentPort = getParentPort();
    if (parentPort) {
      console.error('not implemented');
    } else {
      globalThis.addEventListener('message', onMessageWrapper);
    }
  }
  static removeEventListener(onMessage) {
    const onMessageWrapper = onMessageWrapperMap.get(onMessage);
    onMessageWrapperMap.delete(onMessage);
    const parentPort = getParentPort();
    if (parentPort) {
      console.error('not implemented');
    } else {
      globalThis.removeEventListener('message', onMessageWrapper);
    }
  }
  static postMessage(type, payload) {
    const data = {
      source: 'loaders.gl',
      type,
      payload
    };
    const transferList = getTransferList(payload);
    const parentPort = getParentPort();
    if (parentPort) {
      parentPort.postMessage(data, transferList);
    } else {
      globalThis.postMessage(data, transferList);
    }
  }
}
function isKnownMessage(message) {
  const {
    type,
    data
  } = message;
  return type === 'message' && data && typeof data.source === 'string' && data.source.startsWith('loaders.gl');
}

let requestId = 0;
function createLoaderWorker(loader) {
  if (!WorkerBody.inWorkerThread()) {
    return;
  }
  WorkerBody.onmessage = async (type, payload) => {
    switch (type) {
      case 'process':
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
              parse: parseOnMainThread
            }
          });
          WorkerBody.postMessage('done', {
            result
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '';
          WorkerBody.postMessage('error', {
            error: message
          });
        }
        break;
    }
  };
}
function parseOnMainThread(arrayBuffer, options) {
  return new Promise((resolve, reject) => {
    const id = requestId++;
    const onMessage = (type, payload) => {
      if (payload.id !== id) {
        return;
      }
      switch (type) {
        case 'done':
          WorkerBody.removeEventListener(onMessage);
          resolve(payload.result);
          break;
        case 'error':
          WorkerBody.removeEventListener(onMessage);
          reject(payload.error);
          break;
      }
    };
    WorkerBody.addEventListener(onMessage);
    const payload = {
      id,
      input: arrayBuffer,
      options
    };
    WorkerBody.postMessage('process', payload);
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
    throw new Error("Could not load data with ".concat(loader.name, " loader"));
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$a =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var objectGetOwnPropertyDescriptor = {};

var fails$9 = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var fails$8 = fails$9;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails$8(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});

var fails$7 = fails$9;

var functionBindNative = !fails$7(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var NATIVE_BIND$1 = functionBindNative;

var call$5 = Function.prototype.call;

var functionCall = NATIVE_BIND$1 ? call$5.bind(call$5) : function () {
  return call$5.apply(call$5, arguments);
};

var objectPropertyIsEnumerable = {};

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var createPropertyDescriptor$2 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var NATIVE_BIND = functionBindNative;

var FunctionPrototype$1 = Function.prototype;
var call$4 = FunctionPrototype$1.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype$1.bind.bind(call$4, call$4);

var functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call$4.apply(fn, arguments);
  };
};

var uncurryThis$9 = functionUncurryThis;

var toString$1 = uncurryThis$9({}.toString);
var stringSlice$1 = uncurryThis$9(''.slice);

var classofRaw = function (it) {
  return stringSlice$1(toString$1(it), 8, -1);
};

var uncurryThis$8 = functionUncurryThis;
var fails$6 = fails$9;
var classof = classofRaw;

var $Object$2 = Object;
var split = uncurryThis$8(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails$6(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object$2('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object$2(it);
} : $Object$2;

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
var isNullOrUndefined$2 = function (it) {
  return it === null || it === undefined;
};

var isNullOrUndefined$1 = isNullOrUndefined$2;

var $TypeError$5 = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible$2 = function (it) {
  if (isNullOrUndefined$1(it)) throw new $TypeError$5("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings
var IndexedObject$1 = indexedObject;
var requireObjectCoercible$1 = requireObjectCoercible$2;

var toIndexedObject$3 = function (it) {
  return IndexedObject$1(requireObjectCoercible$1(it));
};

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var isCallable$a = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};

var isCallable$9 = isCallable$a;

var isObject$5 = function (it) {
  return typeof it == 'object' ? it !== null : isCallable$9(it);
};

var global$9 = global$a;
var isCallable$8 = isCallable$a;

var aFunction = function (argument) {
  return isCallable$8(argument) ? argument : undefined;
};

var getBuiltIn$2 = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global$9[namespace]) : global$9[namespace] && global$9[namespace][method];
};

var uncurryThis$7 = functionUncurryThis;

var objectIsPrototypeOf = uncurryThis$7({}.isPrototypeOf);

var engineUserAgent = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

var global$8 = global$a;
var userAgent = engineUserAgent;

var process = global$8.process;
var Deno = global$8.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version$1;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version$1 = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version$1 && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version$1 = +match[1];
  }
}

var engineV8Version = version$1;

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = engineV8Version;
var fails$5 = fails$9;
var global$7 = global$a;

var $String$3 = global$7.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$5(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String$3(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL$1 = symbolConstructorDetection;

var useSymbolAsUid = NATIVE_SYMBOL$1
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var getBuiltIn$1 = getBuiltIn$2;
var isCallable$7 = isCallable$a;
var isPrototypeOf = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

var $Object$1 = Object;

var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn$1('Symbol');
  return isCallable$7($Symbol) && isPrototypeOf($Symbol.prototype, $Object$1(it));
};

var $String$2 = String;

var tryToString$1 = function (argument) {
  try {
    return $String$2(argument);
  } catch (error) {
    return 'Object';
  }
};

var isCallable$6 = isCallable$a;
var tryToString = tryToString$1;

var $TypeError$4 = TypeError;

// `Assert: IsCallable(argument) is true`
var aCallable$1 = function (argument) {
  if (isCallable$6(argument)) return argument;
  throw new $TypeError$4(tryToString(argument) + ' is not a function');
};

var aCallable = aCallable$1;
var isNullOrUndefined = isNullOrUndefined$2;

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod$1 = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};

var call$3 = functionCall;
var isCallable$5 = isCallable$a;
var isObject$4 = isObject$5;

var $TypeError$3 = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive$1 = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable$5(fn = input.toString) && !isObject$4(val = call$3(fn, input))) return val;
  if (isCallable$5(fn = input.valueOf) && !isObject$4(val = call$3(fn, input))) return val;
  if (pref !== 'string' && isCallable$5(fn = input.toString) && !isObject$4(val = call$3(fn, input))) return val;
  throw new $TypeError$3("Can't convert object to primitive value");
};

var sharedStore = {exports: {}};

var global$6 = global$a;

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$2 = Object.defineProperty;

var defineGlobalProperty$3 = function (key, value) {
  try {
    defineProperty$2(global$6, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global$6[key] = value;
  } return value;
};

var globalThis$1 = global$a;
var defineGlobalProperty$2 = defineGlobalProperty$3;

var SHARED = '__core-js_shared__';
var store$3 = sharedStore.exports = globalThis$1[SHARED] || defineGlobalProperty$2(SHARED, {});

(store$3.versions || (store$3.versions = [])).push({
  version: '3.36.0',
  mode: 'global',
  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.36.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

var store$2 = sharedStore.exports;

var shared$3 = function (key, value) {
  return store$2[key] || (store$2[key] = value || {});
};

var requireObjectCoercible = requireObjectCoercible$2;

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject$2 = function (argument) {
  return $Object(requireObjectCoercible(argument));
};

var uncurryThis$6 = functionUncurryThis;
var toObject$1 = toObject$2;

var hasOwnProperty = uncurryThis$6({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject$1(it), key);
};

var uncurryThis$5 = functionUncurryThis;

var id = 0;
var postfix = Math.random();
var toString = uncurryThis$5(1.0.toString);

var uid$2 = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

var global$5 = global$a;
var shared$2 = shared$3;
var hasOwn$6 = hasOwnProperty_1;
var uid$1 = uid$2;
var NATIVE_SYMBOL = symbolConstructorDetection;
var USE_SYMBOL_AS_UID = useSymbolAsUid;

var Symbol$1 = global$5.Symbol;
var WellKnownSymbolsStore = shared$2('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

var wellKnownSymbol$1 = function (name) {
  if (!hasOwn$6(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn$6(Symbol$1, name)
      ? Symbol$1[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var call$2 = functionCall;
var isObject$3 = isObject$5;
var isSymbol$1 = isSymbol$2;
var getMethod = getMethod$1;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol = wellKnownSymbol$1;

var $TypeError$2 = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive$1 = function (input, pref) {
  if (!isObject$3(input) || isSymbol$1(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call$2(exoticToPrim, input, pref);
    if (!isObject$3(result) || isSymbol$1(result)) return result;
    throw new $TypeError$2("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

var toPrimitive = toPrimitive$1;
var isSymbol = isSymbol$2;

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey$2 = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var global$4 = global$a;
var isObject$2 = isObject$5;

var document$1 = global$4.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$2(document$1) && isObject$2(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};

var DESCRIPTORS$7 = descriptors;
var fails$4 = fails$9;
var createElement = documentCreateElement;

// Thanks to IE8 for its funny defineProperty
var ie8DomDefine = !DESCRIPTORS$7 && !fails$4(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});

var DESCRIPTORS$6 = descriptors;
var call$1 = functionCall;
var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
var createPropertyDescriptor$1 = createPropertyDescriptor$2;
var toIndexedObject$2 = toIndexedObject$3;
var toPropertyKey$1 = toPropertyKey$2;
var hasOwn$5 = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$6 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject$2(O);
  P = toPropertyKey$1(P);
  if (IE8_DOM_DEFINE$1) try {
    return $getOwnPropertyDescriptor$1(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn$5(O, P)) return createPropertyDescriptor$1(!call$1(propertyIsEnumerableModule$1.f, O, P), O[P]);
};

var objectDefineProperty = {};

var DESCRIPTORS$5 = descriptors;
var fails$3 = fails$9;

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
var v8PrototypeDefineBug = DESCRIPTORS$5 && fails$3(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});

var isObject$1 = isObject$5;

var $String$1 = String;
var $TypeError$1 = TypeError;

// `Assert: Type(argument) is Object`
var anObject$2 = function (argument) {
  if (isObject$1(argument)) return argument;
  throw new $TypeError$1($String$1(argument) + ' is not an object');
};

var DESCRIPTORS$4 = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var anObject$1 = anObject$2;
var toPropertyKey = toPropertyKey$2;

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
objectDefineProperty.f = DESCRIPTORS$4 ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject$1(O);
  P = toPropertyKey(P);
  anObject$1(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject$1(O);
  P = toPropertyKey(P);
  anObject$1(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var DESCRIPTORS$3 = descriptors;
var definePropertyModule$2 = objectDefineProperty;
var createPropertyDescriptor = createPropertyDescriptor$2;

var createNonEnumerableProperty$2 = DESCRIPTORS$3 ? function (object, key, value) {
  return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var makeBuiltIn$2 = {exports: {}};

var DESCRIPTORS$2 = descriptors;
var hasOwn$4 = hasOwnProperty_1;

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS$2 && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn$4(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$2 || (DESCRIPTORS$2 && getDescriptor(FunctionPrototype, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var uncurryThis$4 = functionUncurryThis;
var isCallable$4 = isCallable$a;
var store$1 = sharedStore.exports;

var functionToString = uncurryThis$4(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable$4(store$1.inspectSource)) {
  store$1.inspectSource = function (it) {
    return functionToString(it);
  };
}

var inspectSource$1 = store$1.inspectSource;

var global$3 = global$a;
var isCallable$3 = isCallable$a;

var WeakMap$1 = global$3.WeakMap;

var weakMapBasicDetection = isCallable$3(WeakMap$1) && /native code/.test(String(WeakMap$1));

var shared$1 = shared$3;
var uid = uid$2;

var keys = shared$1('keys');

var sharedKey$1 = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys$3 = {};

var NATIVE_WEAK_MAP = weakMapBasicDetection;
var global$2 = global$a;
var isObject = isObject$5;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$2;
var hasOwn$3 = hasOwnProperty_1;
var shared = sharedStore.exports;
var sharedKey = sharedKey$1;
var hiddenKeys$2 = hiddenKeys$3;

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$1 = global$2.TypeError;
var WeakMap = global$2.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError$1('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys$2[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn$3(it, STATE)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$1(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn$3(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn$3(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var uncurryThis$3 = functionUncurryThis;
var fails$2 = fails$9;
var isCallable$2 = isCallable$a;
var hasOwn$2 = hasOwnProperty_1;
var DESCRIPTORS$1 = descriptors;
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var inspectSource = inspectSource$1;
var InternalStateModule = internalState;

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$1 = Object.defineProperty;
var stringSlice = uncurryThis$3(''.slice);
var replace = uncurryThis$3(''.replace);
var join = uncurryThis$3([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS$1 && !fails$2(function () {
  return defineProperty$1(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn$2(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS$1) defineProperty$1(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$2(options, 'arity') && value.length !== options.arity) {
    defineProperty$1(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn$2(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS$1) defineProperty$1(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn$2(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn$1(function toString() {
  return isCallable$2(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');

var isCallable$1 = isCallable$a;
var definePropertyModule$1 = objectDefineProperty;
var makeBuiltIn = makeBuiltIn$2.exports;
var defineGlobalProperty$1 = defineGlobalProperty$3;

var defineBuiltIn$1 = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable$1(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty$1(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule$1.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

var objectGetOwnPropertyNames = {};

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
var mathTrunc = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

var trunc = mathTrunc;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
var toIntegerOrInfinity$2 = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex$1 = function (index, length) {
  var integer = toIntegerOrInfinity$1(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

var toIntegerOrInfinity = toIntegerOrInfinity$2;

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength$1 = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var toLength = toLength$1;

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
var lengthOfArrayLike$1 = function (obj) {
  return toLength(obj.length);
};

var toIndexedObject$1 = toIndexedObject$3;
var toAbsoluteIndex = toAbsoluteIndex$1;
var lengthOfArrayLike = lengthOfArrayLike$1;

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject$1($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var uncurryThis$2 = functionUncurryThis;
var hasOwn$1 = hasOwnProperty_1;
var toIndexedObject = toIndexedObject$3;
var indexOf = arrayIncludes.indexOf;
var hiddenKeys$1 = hiddenKeys$3;

var push = uncurryThis$2([].push);

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn$1(hiddenKeys$1, key) && hasOwn$1(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn$1(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys$2 = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var internalObjectKeys$1 = objectKeysInternal;
var enumBugKeys$1 = enumBugKeys$2;

var hiddenKeys = enumBugKeys$1.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys$1(O, hiddenKeys);
};

var objectGetOwnPropertySymbols = {};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

var getBuiltIn = getBuiltIn$2;
var uncurryThis$1 = functionUncurryThis;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
var anObject = anObject$2;

var concat$1 = uncurryThis$1([].concat);

// all object keys, includes non-enumerable and symbols
var ownKeys$1 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
  return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
};

var hasOwn = hasOwnProperty_1;
var ownKeys = ownKeys$1;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var definePropertyModule = objectDefineProperty;

var copyConstructorProperties$1 = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

var fails$1 = fails$9;
var isCallable = isCallable$a;

var replacement = /#|\.prototype\./;

var isForced$1 = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails$1(detection)
    : !!detection;
};

var normalize = isForced$1.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced$1.data = {};
var NATIVE = isForced$1.NATIVE = 'N';
var POLYFILL = isForced$1.POLYFILL = 'P';

var isForced_1 = isForced$1;

var global$1 = global$a;
var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty = createNonEnumerableProperty$2;
var defineBuiltIn = defineBuiltIn$1;
var defineGlobalProperty = defineGlobalProperty$3;
var copyConstructorProperties = copyConstructorProperties$1;
var isForced = isForced_1;

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$1;
  } else if (STATIC) {
    target = global$1[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = global$1[TARGET] && global$1[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

var internalObjectKeys = objectKeysInternal;
var enumBugKeys = enumBugKeys$2;

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys$1 = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

var DESCRIPTORS = descriptors;
var uncurryThis = functionUncurryThis;
var call = functionCall;
var fails = fails$9;
var objectKeys = objectKeys$1;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var toObject = toObject$2;
var IndexedObject = indexedObject;

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol('assign detection');
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

var $ = _export;
var assign = objectAssign;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});

var name = "@globalfishingwatch/deck-loaders";
var version = "0.0.1";
var description = "";
var main = "index.js";
var typings = "src/index.d.ts";
var license = "MIT";
var author = "satellitestudio <contact@satellitestud.io>";
var repository = {
	type: "git",
	url: "git+https://github.com/GlobalFishingWatch/frontend.git"
};
var dependencies = {
	pbf: "^3.2.1"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	main: main,
	typings: typings,
	license: license,
	author: author,
	repository: repository,
	dependencies: dependencies
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const CONFIG_BY_INTERVAL = {
  HOUR: {
    getTime: frame => {
      return frame * 1000 * 60 * 60;
    },
    getIntervalFrame: timestamp => {
      return timestamp / (1000 * 60 * 60);
    }
  },
  DAY: {
    getTime: frame => {
      return frame * 1000 * 60 * 60 * 24;
    },
    getIntervalFrame: timestamp => {
      return timestamp / (1000 * 60 * 60 * 24);
    }
  },
  MONTH: {
    getTime: frame => {
      const year = Math.floor(frame / 12);
      const month = frame % 12;
      return new Date(year, month, 1).getTime();
    },
    getIntervalFrame: timestamp => {
      const date = new Date(timestamp);
      return date.getFullYear() * 12 + date.getMonth();
    }
  },
  YEAR: {
    getTime: frame => {
      return new Date(frame, 0, 1).getTime();
    },
    getIntervalFrame: timestamp => {
      const date = new Date(timestamp);
      return date.getFullYear();
    }
  }
};

// TODO make this dynamic to get the data from the header
// const NO_DATA_VALUE = 0
const NO_DATA_VALUE = 4294967295;
// export const SCALE_VALUE = 0.01
const SCALE_VALUE = 1;
const OFFSET_VALUE = 0;
const CELL_NUM_INDEX = 0;
const CELL_START_INDEX = 1;
const CELL_END_INDEX = 2;
const CELL_VALUES_START_INDEX = 3;
// eslint-disable-next-line max-statements
const getCellTimeseries = (intArrays, options) => {
  var _a;
  const {
    minFrame,
    interval,
    sublayers
  } = (options === null || options === void 0 ? void 0 : options.fourwings) || {};
  // TODO ensure we use the UTC dates here to avoid the .ceil
  const tileMinIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame));
  // const sublayerCount = sublayers.length
  const cells = [];
  const indexes = [];
  const startFrames = [];
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
        // startFrame = getDateInIntervalResolution(value, interval)
      } else if (indexInCell === CELL_END_INDEX) {
        // endFrame = getDateInIntervalResolution(value, interval)
        endFrame = value;
        const numCellValues = (endFrame - startFrame + 1) * sublayers;
        const startOffset = startIndex + CELL_VALUES_START_INDEX;
        endIndex = startOffset + numCellValues - 1;
        // eslint-disable-next-line no-loop-func
        let cellIndex = indexes.findIndex(v => v === cellNum);
        if (cellIndex === -1) {
          cells.push(new Array(dataLength));
          indexes.push(cellNum);
          startFrames.push(startFrame - tileMinIntervalFrame);
          cellIndex = cells.length - 1;
        }
        for (let j = 0; j < numCellValues; j++) {
          // const subLayerIndex = j % sublayers
          const cellValue = subLayerIntArray[j + startOffset];
          // eslint-disable-next-line max-depth
          if (cellValue !== NO_DATA_VALUE) {
            // eslint-disable-next-line max-depth
            if (!((_a = cells[cellIndex]) === null || _a === void 0 ? void 0 : _a[subLayerIndex])) {
              cells[cellIndex][subLayerIndex] = new Array(numCellValues);
            }
            cells[cellIndex][subLayerIndex][Math.floor(j / sublayers)] = cellValue * SCALE_VALUE + OFFSET_VALUE;
          }
        }
        i = endIndex;
        // TODO make this clearer, probably using enum of string for what indexInCell means
        indexInCell = -1;
      }
      indexInCell++;
    }
  }
  return {
    cells,
    indexes,
    startFrames
  };
};
function readData(_, data, pbf) {
  data.push(pbf.readPackedVarint());
}
const parseFourwings = (datasetsBuffer, options) => __awaiter(void 0, void 0, void 0, function* () {
  const {
    buffersLength,
    cols,
    rows
  } = (options === null || options === void 0 ? void 0 : options.fourwings) || {};
  if (!(buffersLength === null || buffersLength === void 0 ? void 0 : buffersLength.length)) {
    return [];
  }
  let start = 0;
  return Object.assign({
    cols,
    rows
  }, getCellTimeseries(buffersLength.map((length, index) => {
    if (length === 0) {
      return [];
    }
    const buffer = datasetsBuffer.slice(start, index !== buffersLength.length ? start + length : undefined);
    start += length;
    return new Pbf__default["default"](buffer).readFields(readData, [])[0];
  }), options));
});

/**
 * Worker loader for the 4wings tile format
 */
const FourwingsWorkerLoader = {
  name: 'fourwings tiles',
  id: 'fourwings',
  module: 'fourwings',
  version: packageJson === null || packageJson === void 0 ? void 0 : packageJson.version,
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream', 'application/protobuf'],
  worker: true,
  category: 'geometry',
  options: {
    fourwings: {}
  }
};
/**
 * Loader for the 4wings tile format
 */
const FourwingsLoader = Object.assign(Object.assign({}, FourwingsWorkerLoader), {
  parse: parseFourwings,
  parseSync: parseFourwings,
  binary: true
});

createLoaderWorker(FourwingsLoader);
