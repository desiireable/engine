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
  load: () => (load)
});
/* import */ var _mercuryworkshop_rpc__rspack_import_0 = __webpack_require__("./packages/rpc/index.ts");
/* import */ var _symbols__rspack_import_1 = __webpack_require__("./packages/controller/src/symbols.ts");
/* import */ var _mercuryworkshop_corridor__rspack_import_2 = __webpack_require__("./packages/core/dist/corridor-external.mjs");



const MessagePort_postMessage = MessagePort.prototype.postMessage;
const postMessage = (port, data, transfer)=>{
    MessagePort_postMessage.call(port, data, transfer);
};
class RemoteTransport {
    port;
    readyResolve;
    readyPromise = new Promise((resolve)=>{
        this.readyResolve = resolve;
    });
    ready = false;
    async init() {
        await this.readyPromise;
        this.ready = true;
    }
    rpc;
    constructor(port){
        this.port = port;
        this.rpc = new _mercuryworkshop_rpc__rspack_import_0.RpcHelper({
            ready: async ()=>{
                this.readyResolve();
            }
        }, "transport", (data, transfer)=>{
            postMessage(port, data, transfer);
        });
        port.onmessageerror = (ev)=>{
            console.error("onmessageerror (this should never happen!)", ev);
        };
        port.onmessage = (ev)=>{
            this.rpc.recieve(ev.data);
        };
        port.start();
    }
    connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
        const channel = new MessageChannel();
        const port = channel.port1;
        console.warn("connecting");
        this.rpc.call("connect", {
            url: url.href,
            protocols,
            requestHeaders,
            port: channel.port2
        }, [
            channel.port2
        ]).then((response)=>{
            console.log(response);
            if (response.result === "success") {
                onopen(response.protocol, response.extensions);
            } else {
                onerror(response.error);
            }
        });
        port.onmessage = (ev)=>{
            const message = ev.data;
            if (message.type === "data") {
                onmessage(message.data);
            } else if (message.type === "close") {
                onclose(message.code, message.reason);
            }
        };
        port.onmessageerror = (ev)=>{
            console.error("onmessageerror (this should never happen!)", ev);
            onerror("Message error in transport port");
        };
        return [
            (data)=>{
                postMessage(port, {
                    type: "data",
                    data: data
                }, data instanceof ArrayBuffer ? [
                    data
                ] : []);
            },
            (code)=>{
                postMessage(port, {
                    type: "close",
                    code: code
                });
            }
        ];
    }
    async request(remote, method, body, headers, _signal) {
        return await this.rpc.call("request", {
            remote: remote.href,
            method,
            body,
            headers
        });
    }
    async sendSetCookie(cookies, options = {}) {
        await this.rpc.call("sendSetCookie", {
            cookies: cookies.map(({ url, cookie })=>({
                    url: url.href,
                    cookie
                })),
            options
        });
    }
}
const sw = navigator.serviceWorker.controller;
function load(init) {
    if (_mercuryworkshop_corridor__rspack_import_2.CORRIDORCLIENT in globalThis) {
        globalThis[_mercuryworkshop_corridor__rspack_import_2.CORRIDORCLIENT].syncDocumentInit({
            initHeaders: init.initHeaders,
            history: init.history,
            cookies: init.cookies
        });
        return;
    }
    if (!("WASM" in self)) {
        throw new Error("WASM not found in global scope!");
    }
    const wasm = Uint8Array.from(atob(self.WASM), (c)=>c.charCodeAt(0));
    delete self.WASM;
    (0,_mercuryworkshop_corridor__rspack_import_2.setWasm)(wasm);
    new ExecutionContextWrapper(globalThis, init);
}
function createFrameId() {
    return `${Array(8).fill(0).map(()=>Math.floor(Math.random() * 36).toString(36)).join("")}`;
}
class ExecutionContextWrapper {
    global;
    init;
    client;
    cookieJar;
    transport;
    handleServiceWorkerCookieMessage;
    constructor(global, init){
        this.global = global;
        this.init = init;
        const channel = new MessageChannel();
        this.transport = new RemoteTransport(channel.port1);
        sw?.postMessage({
            $sw$initRemoteTransport: {
                port: channel.port2,
                prefix: this.init.prefix.href
            }
        }, [
            channel.port2
        ]);
        this.cookieJar = new _mercuryworkshop_corridor__rspack_import_2.CookieJar();
        this.cookieJar.load(this.init.cookies);
        this.handleServiceWorkerCookieMessage = (event)=>{
            if (!event.data?.$controller$setCookie || typeof event.data.$controller$setCookie !== "object") {
                return;
            }
            const payload = event.data.$controller$setCookie;
            if (payload.options?.clear) {
                this.cookieJar.clear();
            }
            if (Array.isArray(payload.cookies)) {
                for (const cookie of payload.cookies){
                    if (typeof cookie?.url !== "string" || typeof cookie.cookie !== "string") {
                        continue;
                    }
                    try {
                        this.cookieJar.setCookies(cookie.cookie, new URL(cookie.url));
                    } catch  {
                        console.error("Failed to set cookie", cookie);
                    }
                }
            }
            if (typeof payload.id === "string") {
                const targetSw = navigator.serviceWorker?.controller ?? sw;
                targetSw?.postMessage({
                    $sw$setCookieDone: {
                        id: payload.id
                    }
                });
            }
        };
        navigator.serviceWorker?.addEventListener("message", this.handleServiceWorkerCookieMessage);
        this.injectCorridor();
    }
    injectCorridor() {
        const frame = this.global.frameElement;
        if (frame && !frame.name) {
            window.name = frame.name = createFrameId();
        }
        let controllerFrame = frame?.[_symbols__rspack_import_1.CONTROLLERFRAME];
        let isTopLevel = true;
        if (!controllerFrame) {
            isTopLevel = false;
            let currentwin = this.global.window;
            while(currentwin.parent !== currentwin){
                const currentclient = currentwin[_mercuryworkshop_corridor__rspack_import_2.CORRIDORCLIENT];
                if (!currentclient) {
                    currentwin = currentwin.parent.window;
                    continue;
                }
                const currentFrame = currentclient.descriptors.get("window.frameElement", currentwin);
                if (currentFrame && currentFrame[_symbols__rspack_import_1.CONTROLLERFRAME]) {
                    controllerFrame = currentFrame[_symbols__rspack_import_1.CONTROLLERFRAME];
                    break;
                }
                currentwin = currentwin.parent.window;
            }
        }
        const context = {
            config: this.init.sjconfig,
            prefix: this.init.prefix,
            cookieJar: this.cookieJar,
            interface: {
                getInjectScripts: this.init.yieldGetInjectScripts(this.init.config, this.init.sjconfig, this.init.prefix, this.cookieJar, this.init.codecEncode, this.init.codecDecode),
                codecEncode: this.init.codecEncode,
                codecDecode: this.init.codecDecode
            }
        };
        this.client = new _mercuryworkshop_corridor__rspack_import_2.CorridorClient(this.global, {
            context,
            transport: this.transport,
            sendSetCookie: async (cookies, options)=>{
                await this.transport.sendSetCookie(cookies, options);
            },
            shouldBlockMessageEvent: ()=>{
                return false;
            },
            hookSubcontext: (frameself)=>{
                const context = new ExecutionContextWrapper(frameself, {
                    ...this.init,
                    cookies: this.cookieJar.dump()
                });
                return context.client;
            },
            initHeaders: this.init.initHeaders,
            history: this.init.history
        });
        const frameInitContext = {
            window: this.global.window,
            client: this.client,
            isTopLevel
        };
        if (controllerFrame) _mercuryworkshop_corridor__rspack_import_2.Tap.dispatch(controllerFrame.hooks.init.pre, frameInitContext, {});
        this.client.hook();
        if (controllerFrame) _mercuryworkshop_corridor__rspack_import_2.Tap.dispatch(controllerFrame.hooks.init.post, frameInitContext, {});
    }
}

})();

$corridorController = __webpack_exports__;
})()
;
//# sourceMappingURL=controller.inject.js.map
