var $corridorController;
(() => {
var __webpack_modules__ = ({
"./packages/controller/src/symbols.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CONTROLLERFRAME: () => (CONTROLLERFRAME)
});
const CONTROLLERFRAME = Symbol.for("controller frame handle");


},
"./packages/controller/src/version.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  VERSION: () => (VERSION),
  assertRuntimeCorridorVersion: () => (assertRuntimeCorridorVersion)
});
const VERSION = "0.0.14";
function assertVersionMatch(packageName, expected, actual) {
    if (expected !== actual) {
        throw new Error(`${packageName} version mismatch: this build expects ${expected}, but the loaded runtime is ${actual}`);
    }
}
function assertRuntimeCorridorVersion() {
    if (typeof $corridor === "undefined") {
        throw new Error("@mercuryworkshop/corridor is not loaded. Load corridor before the controller.");
    }
    assertVersionMatch("@mercuryworkshop/corridor", "2.0.67-alpha.2", $corridor.versionInfo.version);
}


},
"./packages/rpc/index.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  RpcHelper: () => (RpcHelper)
});
class RpcHelper {
    methods;
    id;
    sendRaw;
    counter = 0;
    promiseCallbacks = new Map();
    constructor(methods, id, sendRaw){
        this.methods = methods;
        this.id = id;
        this.sendRaw = sendRaw;
    }
    recieve(data) {
        if (data === undefined || data === null || typeof data !== "object") return;
        const dt = data[this.id];
        if (dt === undefined || dt === null || typeof dt !== "object") return;
        const type = dt.$type;
        if (type === "response") {
            const token = dt.$token;
            const data = dt.$data;
            const error = dt.$error;
            const cb = this.promiseCallbacks.get(token);
            if (!cb) return;
            this.promiseCallbacks.delete(token);
            if (error !== undefined) {
                cb.reject(new Error(error));
            } else {
                cb.resolve(data);
            }
        } else if (type === "request") {
            const method = dt.$method;
            const args = dt.$args;
            this.methods[method](args).then((r)=>{
                this.sendRaw({
                    [this.id]: {
                        $type: "response",
                        $token: dt.$token,
                        $data: r?.[0]
                    }
                }, r?.[1]);
            }).catch((err)=>{
                console.error(err);
                this.sendRaw({
                    [this.id]: {
                        $type: "response",
                        $token: dt.$token,
                        $error: err?.toString() || "Unknown error"
                    }
                }, []);
            });
        }
    }
    call(method, args, transfer = []) {
        const token = this.counter++;
        return new Promise((resolve, reject)=>{
            this.promiseCallbacks.set(token, {
                resolve,
                reject
            });
            this.sendRaw({
                [this.id]: {
                    $type: "request",
                    $method: method,
                    $args: args,
                    $token: token
                }
            }, transfer);
        });
    }
}


},
"./node_modules/.pnpm/@fastify+deepmerge@3.2.1/node_modules/@fastify/deepmerge/index.js"(module) {


// based on https://github.com/TehShrike/deepmerge
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const JSON_PROTO = Object.getPrototypeOf({})

function defaultIsMergeableObjectFactory () {
  return function defaultIsMergeableObject (value) {
    return typeof value === 'object' && value !== null && !(value instanceof RegExp) && !(value instanceof Date)
  }
}

function deepmergeConstructor (options) {
  function isNotPrototypeKey (value) {
    return (
      value !== 'constructor' &&
      value !== 'prototype' &&
      value !== '__proto__'
    )
  }

  function cloneArray (value) {
    let i = 0
    const il = value.length
    const result = new Array(il)
    for (i; i < il; ++i) {
      result[i] = clone(value[i])
    }
    return result
  }

  function cloneObject (target) {
    const result = {}

    if (cloneProtoObject && Object.getPrototypeOf(target) !== JSON_PROTO) {
      return cloneProtoObject(target)
    }

    const targetKeys = getKeys(target)
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      isNotPrototypeKey(key = targetKeys[i]) &&
        (result[key] = clone(target[key]))
    }
    return result
  }

  function concatArrays (target, source) {
    const tl = target.length
    const sl = source.length
    let i = 0
    const result = new Array(tl + sl)
    for (i; i < tl; ++i) {
      result[i] = clone(target[i])
    }
    for (i = 0; i < sl; ++i) {
      result[i + tl] = clone(source[i])
    }
    return result
  }

  const propertyIsEnumerable = Object.prototype.propertyIsEnumerable
  function getSymbolsAndKeys (value) {
    const result = Object.keys(value)
    const keys = Object.getOwnPropertySymbols(value)
    for (let i = 0, il = keys.length; i < il; ++i) {
      propertyIsEnumerable.call(value, keys[i]) && result.push(keys[i])
    }
    return result
  }

  const getKeys = options?.symbols
    ? getSymbolsAndKeys
    : Object.keys

  const cloneProtoObject = typeof options?.cloneProtoObject === 'function'
    ? options.cloneProtoObject
    : undefined

  const isMergeableObject = typeof options?.isMergeableObject === 'function'
    ? options.isMergeableObject
    : defaultIsMergeableObjectFactory()

  const onlyDefinedProperties = options?.onlyDefinedProperties === true

  function isPrimitive (value) {
    return typeof value !== 'object' || value === null
  }

  const mergeArray = options && typeof options.mergeArray === 'function'
    ? options.mergeArray({ clone, deepmerge: _deepmerge, getKeys, isMergeableObject })
    : concatArrays

  function clone (entry) {
    return isMergeableObject(entry)
      ? Array.isArray(entry)
        ? cloneArray(entry)
        : cloneObject(entry)
      : entry
  }

  function mergeObject (target, source) {
    const result = {}
    const targetKeys = getKeys(target)
    const sourceKeys = getKeys(source)
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      isNotPrototypeKey(key = targetKeys[i]) &&
      (sourceKeys.indexOf(key) === -1) &&
      (result[key] = clone(target[key]))
    }

    for (i = 0, il = sourceKeys.length; i < il; ++i) {
      if (!isNotPrototypeKey(key = sourceKeys[i])) {
        continue
      }

      if (key in target) {
        if (targetKeys.indexOf(key) !== -1) {
          if (cloneProtoObject && isMergeableObject(source[key]) && Object.getPrototypeOf(source[key]) !== JSON_PROTO) {
            result[key] = cloneProtoObject(source[key])
          } else {
            result[key] = _deepmerge(target[key], source[key])
          }
        }
      } else {
        if (onlyDefinedProperties && typeof source[key] === 'undefined') {
          continue
        }
        result[key] = clone(source[key])
      }
    }
    return result
  }

  function _deepmerge (target, source) {
    if (onlyDefinedProperties && typeof source === 'undefined') {
      return clone(target)
    }

    const sourceIsArray = Array.isArray(source)
    const targetIsArray = Array.isArray(target)

    if (isPrimitive(source)) {
      return source
    } else if (!isMergeableObject(target)) {
      return clone(source)
    } else if (sourceIsArray && targetIsArray) {
      return mergeArray(target, source)
    } else if (sourceIsArray !== targetIsArray) {
      return clone(source)
    } else {
      return mergeObject(target, source)
    }
  }

  function _deepmergeAll () {
    switch (arguments.length) {
      case 0:
        return {}
      case 1:
        return clone(arguments[0])
      case 2:
        return _deepmerge(arguments[0], arguments[1])
    }
    let result
    for (let i = 0, il = arguments.length; i < il; ++i) {
      result = _deepmerge(result, arguments[i])
    }
    return result
  }

  return options?.all
    ? _deepmergeAll
    : _deepmerge
}

module.exports = deepmergeConstructor
module.exports["default"] = deepmergeConstructor
module.exports.deepmerge = deepmergeConstructor

Object.defineProperty(module.exports, "isMergeableObject", ({
  get: defaultIsMergeableObjectFactory
}))


},
"./node_modules/.pnpm/@mercuryworkshop+proxy-relays@1.0.2/node_modules/@mercuryworkshop/proxy-relays/dist/index.mjs"(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ConduitCompatibleClient: () => (ConduitCompatibleClient),
  ConduitCompatibleWebSocket: () => (ConduitCompatibleWebSocket),
  ConduitResponse: () => (ConduitResponse)
});
const WebSocketFields = {
    CLOSED: WebSocket.CLOSED,
    CONNECTING: WebSocket.CONNECTING,
    OPEN: WebSocket.OPEN,
};
class ConduitCompatibleWebSocket extends EventTarget {
    transport;
    url;
    readyState = WebSocketFields.CONNECTING;
    extensions = "";
    protocol = "";
    _data;
    _close;
    constructor(remote, protocols, transport, requestHeaders) {
        super();
        this.transport = transport;
        this.url = remote.toString();
        if (!requestHeaders) {
            requestHeaders = [];
        }
        if (!protocols) {
            protocols = [];
        }
        if (typeof protocols === "string") {
            protocols = [protocols];
        }
        const onopen = (protocol, extensions) => {
            this.protocol = protocol;
            this.extensions = extensions;
            this.readyState = WebSocketFields.OPEN;
            const event = new Event("open");
            this.dispatchEvent(event);
        };
        const onmessage = async (payload) => {
            const event = new MessageEvent("message", { data: payload });
            this.dispatchEvent(event);
        };
        const onclose = (code, reason) => {
            this.readyState = WebSocketFields.CLOSED;
            const event = new CloseEvent("close", { code, reason });
            this.dispatchEvent(event);
        };
        const onerror = () => {
            this.readyState = WebSocketFields.CLOSED;
            const event = new Event("error");
            this.dispatchEvent(event);
        };
        (async () => {
            if (!transport.ready) {
                await transport.init();
            }
            const [_data, _close] = transport.connect(new URL(remote), protocols, requestHeaders, onopen, onmessage, onclose, onerror);
            this._data = _data;
            this._close = _close;
        })();
    }
    async send(data) {
        if (!this.transport.ready) {
            await this.transport.init();
        }
        if (this.readyState === WebSocketFields.CONNECTING) {
            throw new DOMException("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.");
        }
        // we can't check typeof Uint8Array here directly as it may come from another realm
        if (typeof data === "object" && "buffer" in data && data.buffer) {
            let _data = data;
            // this is neccesary in case the buffer is a slice of a larger array
            // in which case you risk edge cases such as sending an entire wasm memory buffer over the websocket
            data = _data.buffer.slice(_data.byteOffset, _data.byteOffset + _data.byteLength);
        }
        this._data(data);
    }
    close(code, reason) {
        this._close(code, reason);
    }
}

const validChars = "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
function validProtocol(protocol) {
    for (let i = 0; i < protocol.length; i++) {
        const char = protocol[i];
        if (!validChars.includes(char)) {
            return false;
        }
    }
    return true;
}
const wsProtocols = ["ws:", "wss:"];
const statusEmpty = [101, 204, 205, 304];
const statusRedirect = [301, 302, 303, 307, 308];
const nativeFetch = fetch;
function headersObjectToEntries(headers) {
    return [...headers];
}
/**
 * A Response with additional properties.
 */
class ConduitResponse extends Response {
    url;
    rawHeaders;
    redirected = false;
    static fromTransferrableResponse(resp, url) {
        const response = new ConduitResponse(statusEmpty.includes(resp.status) ? undefined : resp.body, {
            headers: new Headers(resp.headers),
            status: resp.status,
            statusText: resp.statusText,
        });
        response.url = url;
        response.redirected =
            resp.status >= 300 &&
                resp.status < 400 &&
                resp.headers["location"] !== undefined;
        response.rawHeaders = resp.headers;
        return response;
    }
    static fromNativeResponse(resp) {
        let body = statusEmpty.includes(resp.status) ? undefined : resp.body;
        const response = new ConduitResponse(body, {
            headers: resp.headers,
            status: resp.status,
            statusText: resp.statusText,
        });
        response.url = resp.url;
        response.rawHeaders = headersObjectToEntries(resp.headers);
        response.redirected = resp.redirected;
        return response;
    }
}
const defaultMaxRedirects = 20;
class ConduitCompatibleClient {
    transport;
    /**
     * Create a ConduitCompatibleClient using the provided transport. Calls to fetch and connect will wait for an implementation to be ready.
     */
    constructor(transport) {
        this.transport = transport;
    }
    createWebSocket(remote, protocols = [], requestHeaders) {
        try {
            remote = new URL(remote);
        }
        catch (err) {
            throw new DOMException(`Faiiled to construct 'WebSocket': The URL '${remote}' is invalid.`);
        }
        if (!wsProtocols.includes(remote.protocol))
            throw new DOMException(`Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${remote.protocol}' is not allowed.`);
        if (!Array.isArray(protocols))
            protocols = [protocols];
        protocols = protocols.map(String);
        for (const proto of protocols)
            if (!validProtocol(proto))
                throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${proto}' is invalid.`);
        requestHeaders = requestHeaders || [];
        const socket = new ConduitCompatibleWebSocket(remote, protocols, this.transport, requestHeaders);
        return socket;
    }
    async fetch(url, init) {
        if (!this.transport.ready) {
            await this.transport.init();
        }
        let maxRedirects = init?.maxRedirects || defaultMaxRedirects;
        const body = init?.body;
        const headers = init?.headers || [];
        const method = init?.method || "GET";
        const redirect = init?.redirect || "follow";
        let urlO = new URL(url);
        if (urlO.protocol.startsWith("blob:")) {
            const response = await nativeFetch(urlO);
            return ConduitResponse.fromNativeResponse(response);
        }
        for (let i = 0;; i++) {
            const resp = await this.transport.request(urlO, method, body, headers, undefined);
            const conduitresponse = ConduitResponse.fromTransferrableResponse(resp, urlO.toString());
            if (statusRedirect.includes(conduitresponse.status)) {
                switch (redirect) {
                    case "follow": {
                        const location = conduitresponse.headers.get("location");
                        if (maxRedirects > i && location !== null) {
                            urlO = new URL(location, urlO);
                            continue;
                        }
                        else
                            throw new TypeError("Failed to fetch");
                    }
                    case "error":
                        throw new TypeError("Failed to fetch");
                    case "manual":
                        return conduitresponse;
                }
            }
            else {
                return conduitresponse;
            }
        }
    }
}


//# sourceMappingURL=index.mjs.map


},
"./packages/core/dist/corridor-external.mjs"(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ConduitResponse: () => (ConduitResponse),
  CookieJar: () => (CookieJar),
  IncrementalHtmlRewriter: () => (IncrementalHtmlRewriter),
  Plugin: () => (Plugin),
  CORRIDORCLIENT: () => (CORRIDORCLIENT),
  CORRIDORCLIENTNAME: () => (CORRIDORCLIENTNAME),
  CorridorClient: () => (CorridorClient),
  CorridorFetchHandler: () => (CorridorFetchHandler),
  CorridorFetchTrackedClient: () => (CorridorFetchTrackedClient),
  CorridorHeaders: () => (CorridorHeaders),
  Tap: () => (Tap),
  createLocationProxy: () => (createLocationProxy),
  defaultConfig: () => (defaultConfig),
  defaultConfigDev: () => (defaultConfigDev),
  flagEnabled: () => (flagEnabled),
  getOwnPropertyDescriptorHandler: () => (getOwnPropertyDescriptorHandler),
  getRewriter: () => (getRewriter),
  getScriptBlockTypeString: () => (getScriptBlockTypeString),
  htmlRules: () => (htmlRules),
  isArchiveMimeType: () => (isArchiveMimeType),
  isAudioOrVideoMimeType: () => (isAudioOrVideoMimeType),
  isFontMimeType: () => (isFontMimeType),
  isHtmlMimeType: () => (isHtmlMimeType),
  isImageMimeType: () => (isImageMimeType),
  isInlineDisplayableMimeType: () => (isInlineDisplayableMimeType),
  isJavascriptMimeType: () => (isJavascriptMimeType),
  isJavascriptMimeTypeEssenceMatch: () => (isJavascriptMimeTypeEssenceMatch),
  isModuleScriptType: () => (isModuleScriptType),
  isScriptType: () => (isScriptType),
  isScriptableMimeType: () => (isScriptableMimeType),
  isXmlMimeType: () => (isXmlMimeType),
  isZipBasedMimeType: () => (isZipBasedMimeType),
  isdedicated: () => (isdedicated),
  isshared: () => (isshared),
  issw: () => (issw),
  iswindow: () => (iswindow),
  isworker: () => (isworker),
  parseMimeType: () => (parseMimeType),
  rewriteBlob: () => (rewriteBlob),
  rewriteCss: () => (rewriteCss),
  rewriteHtml: () => (rewriteHtml),
  rewriteJs: () => (rewriteJs),
  rewriteJsInner: () => (rewriteJsInner),
  rewriteSrcset: () => (rewriteSrcset),
  rewriteUrl: () => (rewriteUrl),
  rewriteWorkers: () => (rewriteWorkers),
  setWasm: () => (setWasm),
  unrewriteBlob: () => (unrewriteBlob),
  unrewriteCss: () => (unrewriteCss),
  unrewriteHtml: () => (unrewriteHtml),
  unrewriteUrl: () => (unrewriteUrl),
  versionInfo: () => (versionInfo)
});
// AUTO-GENERATED by ExternalStubPlugin — do not edit.
// Re-exports of globalThis.$corridor (set by the IIFE bundle).
const __external = /** @type {any} */ (globalThis).$corridor;
const {
	ConduitResponse,
	CookieJar,
	IncrementalHtmlRewriter,
	Plugin,
	CORRIDORCLIENT,
	CORRIDORCLIENTNAME,
	CorridorClient,
	CorridorFetchHandler,
	CorridorFetchTrackedClient,
	CorridorHeaders,
	Tap,
	createLocationProxy,
	defaultConfig,
	defaultConfigDev,
	flagEnabled,
	getOwnPropertyDescriptorHandler,
	getRewriter,
	getScriptBlockTypeString,
	htmlRules,
	isArchiveMimeType,
	isAudioOrVideoMimeType,
	isFontMimeType,
	isHtmlMimeType,
	isImageMimeType,
	isInlineDisplayableMimeType,
	isJavascriptMimeType,
	isJavascriptMimeTypeEssenceMatch,
	isModuleScriptType,
	isScriptType,
	isScriptableMimeType,
	isXmlMimeType,
	isZipBasedMimeType,
	isdedicated,
	isshared,
	issw,
	iswindow,
	isworker,
	parseMimeType,
	rewriteBlob,
	rewriteCss,
	rewriteHtml,
	rewriteJs,
	rewriteJsInner,
	rewriteSrcset,
	rewriteUrl,
	rewriteWorkers,
	setWasm,
	unrewriteBlob,
	unrewriteCss,
	unrewriteHtml,
	unrewriteUrl,
	versionInfo,
} = __external;


},

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Controller: () => (Controller),
  Frame: () => (Frame),
  ManagedPlugin: () => (ManagedPlugin),
  VERSION: () => (/* reexport safe */ _version__rspack_import_5.VERSION),
  assertRuntimeCorridorVersion: () => (/* reexport safe */ _version__rspack_import_5.assertRuntimeCorridorVersion),
  config: () => (config)
});
/* import */ var _mercuryworkshop_rpc__rspack_import_0 = __webpack_require__("./packages/rpc/index.ts");
/* import */ var _mercuryworkshop_proxy_relays__rspack_import_1 = __webpack_require__("./node_modules/.pnpm/@mercuryworkshop+proxy-relays@1.0.2/node_modules/@mercuryworkshop/proxy-relays/dist/index.mjs");
/* import */ var _fastify_deepmerge__rspack_import_2 = __webpack_require__("./node_modules/.pnpm/@fastify+deepmerge@3.2.1/node_modules/@fastify/deepmerge/index.js");
/* import */ var _fastify_deepmerge__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(_fastify_deepmerge__rspack_import_2);
/* import */ var _mercuryworkshop_corridor__rspack_import_3 = __webpack_require__("./packages/core/dist/corridor-external.mjs");
/* import */ var _symbols__rspack_import_4 = __webpack_require__("./packages/controller/src/symbols.ts");
/* import */ var _version__rspack_import_5 = __webpack_require__("./packages/controller/src/version.ts");








const config = {
    prefix: "/~/sj/",
    corridorPath: "/corridor/corridor.js",
    injectPath: "/controller/controller.inject.js",
    wasmPath: "/corridor/corridor.wasm",
    virtualWasmPath: "corridor.wasm.js",
    codec: {
        encode: (url)=>{
            if (!url) return url;
            return encodeURIComponent(url);
        },
        decode: (url)=>{
            if (!url) return url;
            return decodeURIComponent(url);
        }
    }
};
const corridorConfig = {
    flags: {
        ..._mercuryworkshop_corridor__rspack_import_3.defaultConfig.flags,
        allowFailedIntercepts: true
    },
    maskedfiles: [
        "inject.js",
        "corridor.wasm.js"
    ]
};
class ManagedPlugin extends _mercuryworkshop_corridor__rspack_import_3.Plugin {
    frame = null;
    dependencies = [];
    constructor(name, dependencies){
        super(name);
        this.dependencies = dependencies;
    }
    install(frame) {
        this.frame = frame;
    }
}
const COOKIE_DB_NAME = "__corridor_controller";
const COOKIE_STORE_NAME = "state";
const COOKIE_STATE_KEY = "cookies";
const BROADCASTCHANNEL_NAME = "__corridor_controller_channel";
let cookieDbPromise = null;
function parsePersistedCookieState(value) {
    if (typeof value !== "object" || value === null || typeof value.updatedAt !== "number" || !Number.isFinite(value.updatedAt) || typeof value.cookies !== "string") {
        return null;
    }
    return value;
}
function requestToPromise(request) {
    return new Promise((resolve, reject)=>{
        request.onsuccess = ()=>resolve(request.result);
        request.onerror = ()=>reject(request.error ?? new Error("IndexedDB request failed"));
    });
}
function transactionToPromise(transaction) {
    return new Promise((resolve, reject)=>{
        transaction.oncomplete = ()=>resolve();
        transaction.onabort = ()=>reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
        transaction.onerror = ()=>reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    });
}
function openCookieDatabase() {
    if (cookieDbPromise) {
        return cookieDbPromise;
    }
    cookieDbPromise = new Promise((resolve, reject)=>{
        const request = indexedDB.open(COOKIE_DB_NAME, 1);
        request.onupgradeneeded = ()=>{
            const db = request.result;
            if (!db.objectStoreNames.contains(COOKIE_STORE_NAME)) {
                db.createObjectStore(COOKIE_STORE_NAME);
            }
        };
        request.onsuccess = ()=>resolve(request.result);
        request.onerror = ()=>reject(request.error ?? new Error("Failed to open cookie database"));
    });
    return cookieDbPromise;
}
async function readCookieState() {
    try {
        const db = await openCookieDatabase();
        const transaction = db.transaction(COOKIE_STORE_NAME, "readonly");
        const store = transaction.objectStore(COOKIE_STORE_NAME);
        const value = await requestToPromise(store.get(COOKIE_STATE_KEY));
        await transactionToPromise(transaction);
        return parsePersistedCookieState(value);
    } catch (error) {
        console.error("Failed to read persisted controller cookies:", error);
        return null;
    }
}
async function writeCookieState(cookies, currentUpdatedAt) {
    try {
        const db = await openCookieDatabase();
        const transaction = db.transaction(COOKIE_STORE_NAME, "readwrite");
        const store = transaction.objectStore(COOKIE_STORE_NAME);
        const existing = parsePersistedCookieState(await requestToPromise(store.get(COOKIE_STATE_KEY)));
        const updatedAt = Math.max(Date.now(), currentUpdatedAt + 1, (existing?.updatedAt ?? 0) + 1);
        const state = {
            updatedAt,
            cookies
        };
        store.put(state, COOKIE_STATE_KEY);
        await transactionToPromise(transaction);
        return updatedAt;
    } catch (error) {
        console.error("Failed to persist controller cookies:", error);
        return currentUpdatedAt;
    }
}
function makeId() {
    return Math.random().toString(36).substring(2, 10);
}
const deepMerge = (0,_fastify_deepmerge__rspack_import_2.deepmerge)();
class Controller {
    init;
    id;
    config;
    corridorConfig;
    prefix;
    cookieJar = new _mercuryworkshop_corridor__rspack_import_3.CookieJar();
    frames = [];
    serviceWorkerController;
    guardServiceWorkerRevive = true;
    ready;
    readyResolve;
    isReady = false;
    rpc;
    port = null;
    transport;
    cookieUpdatedAt = 0;
    cookieSyncPromise = null;
    cookieSyncDirty = true;
    cookieSyncChannel = new BroadcastChannel(BROADCASTCHANNEL_NAME);
    wasmAlreadyFetched = false;
    wasmPayload = null;
    onTabChannelMessage = (e)=>{
        this.rpc.recieve(e.data);
    };
    onCookieSyncMessage = (event)=>{
        const updatedAt = typeof event.data === "object" && event.data !== null ? event.data.updatedAt : undefined;
        if (typeof updatedAt !== "number" || updatedAt <= this.cookieUpdatedAt) {
            return;
        }
        this.cookieSyncDirty = true;
        void this.loadSavedCookies();
    };
    async loadCorridorWasm() {
        if (this.wasmAlreadyFetched) {
            return;
        }
        const resp = await fetch(this.config.wasmPath);
        (0,_mercuryworkshop_corridor__rspack_import_3.setWasm)(await resp.arrayBuffer());
        this.wasmAlreadyFetched = true;
    }
    methods = {
        ready: async ()=>{
            this.readyResolve();
            setTimeout(()=>{
                this.guardServiceWorkerRevive = false;
            }, 5000);
        },
        request: async (data)=>{
            const path = new URL(data.rawUrl).pathname;
            const frame = this.frames.find((f)=>path.startsWith(f.prefix));
            if (!frame) throw new Error("No frame found for request");
            try {
                // doesn't actually *load* every request, but hold up requests until the promise finishes
                await this.loadSavedCookies();
                if (path === frame.prefix + this.config.virtualWasmPath) {
                    if (!this.wasmPayload) {
                        const resp = await fetch(this.config.wasmPath);
                        const buf = await resp.arrayBuffer();
                        const b64 = btoa(new Uint8Array(buf).reduce((data, byte)=>(data.push(String.fromCharCode(byte)), data), []).join(""));
                        this.wasmPayload = `self.WASM = '${b64}';`;
                    }
                    return [
                        {
                            body: this.wasmPayload,
                            status: 200,
                            statusText: "OK",
                            headers: [
                                [
                                    "Content-Type",
                                    "application/javascript"
                                ]
                            ]
                        },
                        []
                    ];
                }
                const sjheaders = _mercuryworkshop_corridor__rspack_import_3.CorridorHeaders.fromRawHeaders(data.initialHeaders);
                const fetchresponse = await frame.fetchHandler.handleFetch({
                    initialHeaders: sjheaders,
                    rawClientUrl: data.rawClientUrl ? new URL(data.rawClientUrl) : undefined,
                    rawUrl: new URL(data.rawUrl),
                    rawReferrer: data.rawReferrer,
                    rawDestination: data.destination,
                    method: data.method,
                    mode: data.mode,
                    referrer: data.referrer,
                    body: data.body,
                    cache: data.cache,
                    clientId: data.clientId
                });
                return [
                    {
                        body: fetchresponse.body,
                        status: fetchresponse.status,
                        statusText: fetchresponse.statusText,
                        headers: fetchresponse.headers.toRawHeaders()
                    },
                    fetchresponse.body instanceof ReadableStream || fetchresponse.body instanceof ArrayBuffer ? [
                        fetchresponse.body
                    ] : []
                ];
            } catch (e) {
                const reqcontext = {
                    rawrequest: data,
                    error: e
                };
                const reqprops = {
                    setResponse: undefined,
                    suppressError: false
                };
                await _mercuryworkshop_corridor__rspack_import_3.Tap.dispatch(frame.hooks.error.request, reqcontext, reqprops);
                if (!reqprops.suppressError) {
                    console.error("Error in controller request handler:", e);
                }
                if (reqprops.setResponse) {
                    return [
                        reqprops.setResponse,
                        []
                    ];
                }
                throw e;
            }
        },
        initRemoteTransport: async (port)=>{
            const rpc = new _mercuryworkshop_rpc__rspack_import_0.RpcHelper({
                request: async ({ remote, method, body, headers })=>{
                    const response = await this.transport.request(new URL(remote), method, body, headers, undefined);
                    return [
                        response,
                        [
                            response.body
                        ]
                    ];
                },
                sendSetCookie: async ({ cookies, options })=>{
                    await this.loadSavedCookies(true);
                    if (options?.clear) {
                        this.cookieJar.clear();
                    }
                    this.applyCookieSyncEntries(cookies);
                    await this.persistCookies();
                    await this.propagateCookieSync(cookies, options);
                },
                connect: async ({ url, protocols, requestHeaders, port })=>{
                    let resolve;
                    const promise = new Promise((res)=>resolve = res);
                    const [send, close] = this.transport.connect(new URL(url), protocols, requestHeaders, (protocol, extensions)=>{
                        resolve({
                            result: "success",
                            protocol: protocol,
                            extensions: extensions
                        });
                    }, (data)=>{
                        port.postMessage({
                            type: "data",
                            data: data
                        }, data instanceof ArrayBuffer ? [
                            data
                        ] : []);
                    }, (close, reason)=>{
                        port.postMessage({
                            type: "close",
                            code: close,
                            reason: reason
                        });
                    }, (error)=>{
                        resolve({
                            result: "failure",
                            error: error
                        });
                    });
                    port.onmessageerror = (ev)=>{
                        console.error("Transport port messageerror (this should never happen!)", ev);
                    };
                    port.onmessage = ({ data })=>{
                        if (data.type === "data") {
                            send(data.data);
                        } else if (data.type === "close") {
                            close(data.code, data.reason);
                        }
                    };
                    return [
                        await promise,
                        []
                    ];
                }
            }, "transport", (data, transfer)=>port.postMessage(data, transfer));
            port.onmessageerror = (ev)=>{
                console.error("Transport port messageerror (this should never happen!)", ev);
            };
            port.onmessage = (e)=>{
                rpc.recieve(e.data);
            };
            rpc.call("ready", undefined, []);
        }
    };
    constructor(init){
        this.init = init;
        (0,_version__rspack_import_5.assertRuntimeCorridorVersion)();
        this.id = makeId();
        this.config = deepMerge(config, init.config || {});
        this.corridorConfig = deepMerge(corridorConfig, _mercuryworkshop_corridor__rspack_import_3.defaultConfig);
        this.corridorConfig = deepMerge(this.corridorConfig, init.corridorConfig || {});
        this.prefix = this.config.prefix + this.id + "/";
        this.serviceWorkerController = init.serviceworker;
        this.ready = Promise.all([
            new Promise((resolve)=>{
                this.readyResolve = resolve;
            }),
            this.loadCorridorWasm(),
            this.loadSavedCookies(true)
        ]).then(()=>undefined);
        this.rpc = new _mercuryworkshop_rpc__rspack_import_0.RpcHelper(this.methods, "tabchannel-" + this.id, (data, transfer)=>{
            if (!this.port) {
                throw new Error("Port not found");
            }
            this.port.postMessage(data, transfer);
        });
        this.transport = init.transport;
        this.cookieSyncChannel.addEventListener("message", this.onCookieSyncMessage);
        this.setupMessagePort();
        // achroma: a new service worker (a deploy, or the browser restarting
        // it) takes over with an empty tab registry. Follow whichever worker
        // controls the page now and register with *that* one — otherwise the
        // handshake keeps going to the retired worker and every proxied load
        // fails with "no proxy session for this tab" until a refresh.
        navigator.serviceWorker.addEventListener("controllerchange", ()=>{
            if (navigator.serviceWorker.controller) {
                this.serviceWorkerController = navigator.serviceWorker.controller;
                this.setupMessagePort();
            }
        });
        navigator.serviceWorker.addEventListener("message", (e)=>{
            if (e.data?.$controller$setCookie && typeof e.data.$controller$setCookie === "object") {
                const payload = e.data.$controller$setCookie;
                if (payload.options?.clear) {
                    this.cookieJar.clear();
                }
                this.applyCookieSyncEntries(payload.cookies);
                if (typeof payload.id === "string") {
                    this.serviceWorkerController.postMessage({
                        $sw$setCookieDone: {
                            id: payload.id
                        }
                    });
                }
                return;
            }
            if (e.data.$controller$swrevive) {
                // if we just spawned the service worker, it will send this even though it's not actually dead
                // TODO: pretty jank, fix at some point
                if (this.guardServiceWorkerRevive) {
                    return;
                }
                this.setupMessagePort();
            }
        });
    }
    setupMessagePort() {
        if (this.port) {
            this.port.removeEventListener("message", this.onTabChannelMessage);
            try {
                this.port.close();
            } catch  {
            // ignore
            }
            this.port = null;
        }
        // achroma: always the worker controlling the page right now (see the
        // controllerchange listener in the constructor).
        if (navigator.serviceWorker.controller) {
            this.serviceWorkerController = navigator.serviceWorker.controller;
        }
        const channel = new MessageChannel();
        this.port = channel.port1;
        this.port.addEventListener("message", this.onTabChannelMessage);
        this.port.start();
        this.serviceWorkerController.postMessage({
            $controller$init: {
                prefix: this.prefix,
                id: this.id
            }
        }, [
            channel.port2
        ]);
    }
    // TODO: should this be a method on the cookie jar?
    applyCookieSyncEntries(cookies) {
        if (!Array.isArray(cookies)) {
            return;
        }
        for (const entry of cookies){
            if (typeof entry?.url !== "string" || typeof entry.cookie !== "string") {
                continue;
            }
            this.cookieJar.setCookies(entry.cookie, new URL(entry.url));
        }
    }
    async propagateCookieSync(cookies, options = {}) {
        if (!this.port) {
            return;
        }
        await this.rpc.call("sendSetCookie", {
            cookies,
            options
        });
    }
    async loadSavedCookies(force = false) {
        if (!force && !this.cookieSyncDirty) {
            return;
        }
        if (this.cookieSyncPromise) {
            return this.cookieSyncPromise;
        }
        this.cookieSyncPromise = (async ()=>{
            const persisted = await readCookieState();
            if (persisted && persisted.updatedAt > this.cookieUpdatedAt) {
                this.cookieJar.load(persisted.cookies);
                this.cookieUpdatedAt = persisted.updatedAt;
            }
            this.cookieSyncDirty = false;
        })().finally(()=>{
            this.cookieSyncPromise = null;
        });
        return this.cookieSyncPromise;
    }
    async persistCookies() {
        const updatedAt = await writeCookieState(this.cookieJar.dump(), this.cookieUpdatedAt);
        if (updatedAt <= this.cookieUpdatedAt) {
            return;
        }
        this.cookieUpdatedAt = updatedAt;
        this.cookieSyncDirty = false;
        this.cookieSyncChannel.postMessage({
            updatedAt
        });
    }
    useTransport(transport) {
        this.transport = transport;
        for (const frame of this.frames){
            frame.controller.transport = transport;
            frame.fetchHandler.client.transport = transport;
        }
    }
    createFrame(element, options = {}) {
        if (!this.ready) {
            throw new Error("Controller is not ready! Try awaiting controller.wait()");
        }
        element ??= document.createElement("iframe");
        const frame = new Frame(this, element, options);
        this.frames.push(frame);
        return frame;
    }
    async wait() {
        await this.ready;
    }
}
function base64Encode(text) {
    return btoa(new TextEncoder().encode(text).reduce((data, byte)=>(data.push(String.fromCharCode(byte)), data), []).join(""));
}
function yieldGetInjectScripts(config, sjconfig, prefix, cookieJar, codecEncode, codecDecode) {
    const getInjectScripts = (meta, handler, htmlcontext, script)=>{
        function base64Encode(text) {
            return btoa(new TextEncoder().encode(text).reduce((data, byte)=>(data.push(String.fromCharCode(byte)), data), []).join(""));
        }
        return [
            script(config.corridorPath),
            script(prefix.href + config.virtualWasmPath),
            script(config.injectPath),
            script("data:text/javascript;charset=utf-8;base64," + base64Encode(`
					document.querySelectorAll("script[corridor-injected]").forEach(script => script.remove());
					$corridorController.load({
						config: ${JSON.stringify(config)},
						sjconfig: ${JSON.stringify(sjconfig)},
						prefix: new URL("${prefix.href}"),
						cookies: ${JSON.stringify(cookieJar.dump())},
						yieldGetInjectScripts: ${yieldGetInjectScripts.toString()},
						codecEncode: ${codecEncode.toString()},
						codecDecode: ${codecDecode.toString()},
						initHeaders: ${JSON.stringify(htmlcontext.headers ?? [])},
						history: ${JSON.stringify(htmlcontext.history ?? [])},
					})
				`))
        ];
    };
    return getInjectScripts;
}
class Frame {
    controller;
    element;
    options;
    id;
    prefix;
    fetchHandler;
    hooks;
    get context() {
        return {
            config: this.controller.corridorConfig,
            prefix: new URL(this.prefix, location.href),
            cookieJar: this.controller.cookieJar,
            interface: {
                getInjectScripts: yieldGetInjectScripts(this.controller.config, this.controller.corridorConfig, new URL(this.prefix, location.href), this.controller.cookieJar, this.controller.config.codec.encode, this.controller.config.codec.decode),
                getWorkerInjectScripts: (meta, type, script)=>{
                    let str = "";
                    str += script(this.controller.config.corridorPath);
                    str += script(this.prefix + this.controller.config.virtualWasmPath);
                    str += script("data:text/javascript;charset=utf-8;base64," + base64Encode(`
					(()=>{
						const { CorridorClient, CookieJar, setWasm } = $corridor;

						setWasm(Uint8Array.from(atob(self.WASM), (c) => c.charCodeAt(0)));
						delete self.WASM;

						const sjconfig = ${JSON.stringify(this.controller.corridorConfig)};
						const prefix = new URL("${this.prefix}", location.href);

						const context = {
							config: sjconfig,
							prefix,
							interface: {
								codecEncode: ${this.controller.config.codec.encode.toString()},
								codecDecode: ${this.controller.config.codec.decode.toString()},
							},
						};

						const client = new CorridorClient(globalThis, {
							context,
							transport: null,
						});

						client.hook();
					})();
					`));
                    return str;
                },
                codecEncode: this.controller.config.codec.encode,
                codecDecode: this.controller.config.codec.decode
            }
        };
    }
    plugins = [];
    constructor(controller, element, options = {}){
        this.controller = controller;
        this.element = element;
        this.options = options;
        this.id = makeId();
        this.prefix = this.controller.prefix + this.id + "/";
        this.fetchHandler = new _mercuryworkshop_corridor__rspack_import_3.CorridorFetchHandler({
            crossOriginIsolated: self.crossOriginIsolated,
            context: this.context,
            transport: controller.transport,
            async sendSetCookie (cookies, options) {
                await controller.persistCookies();
                await controller.propagateCookieSync(cookies.map(({ url, cookie })=>({
                        url: url.href,
                        cookie
                    })), options);
            },
            async fetchBlobUrl (url) {
                return _mercuryworkshop_proxy_relays__rspack_import_1.ConduitResponse.fromNativeResponse(await fetch(url));
            },
            async fetchDataUrl (url) {
                return _mercuryworkshop_proxy_relays__rspack_import_1.ConduitResponse.fromNativeResponse(await fetch(url));
            }
        });
        this.hooks = {
            fetch: this.fetchHandler.hooks.fetch,
            init: _mercuryworkshop_corridor__rspack_import_3.Tap.create(),
            error: _mercuryworkshop_corridor__rspack_import_3.Tap.create()
        };
        element[_symbols__rspack_import_4.CONTROLLERFRAME] = this;
        this.plugins = options.plugins ?? [];
        for (const plugin of this.plugins){
            for (const dependency of plugin.dependencies){
                const dependencyPlugin = this.plugins.find((p)=>p.name === dependency);
                if (!dependencyPlugin) {
                    throw new Error(`Dependency ${dependency} not found for plugin ${plugin.name}`);
                }
            }
            plugin.install(this);
        }
    }
    getPlugin(name) {
        const plugin = this.plugins.find((p)=>p.name === name);
        if (!plugin) {
            throw new Error(`Plugin ${name} not found`);
        }
        return plugin;
    }
    back() {
        this.element.contentWindow?.history.back();
    }
    forward() {
        this.element.contentWindow?.history.forward();
    }
    reload() {
        this.element.contentWindow?.location.reload();
    }
    go(url) {
        const encoded = (0,_mercuryworkshop_corridor__rspack_import_3.rewriteUrl)(url, this.context, {
            //@ts-expect-error
            origin: new URL(location.href),
            //@ts-expect-error
            base: new URL(location.href)
        });
        this.element.src = encoded;
    }
}

})();

$corridorController = __webpack_exports__;
})()
;
//# sourceMappingURL=controller.api.js.map
