var $corridorController;
(() => {
var __webpack_modules__ = ({
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
});

var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
        return cachedModule.exports;
    }

    var module = (__webpack_module_cache__[moduleId] = {
        exports: {}
    });

    __webpack_modules__[moduleId](
        module,
        module.exports,
        __webpack_require__
    );

    return module.exports;
}

(() => {
    __webpack_require__.d = (exports, definition) => {
        for (var key in definition) {
            if (
                __webpack_require__.o(definition, key) &&
                !__webpack_require__.o(exports, key)
            ) {
                Object.defineProperty(
                    exports,
                    key,
                    {
                        enumerable: true,
                        get: definition[key]
                    }
                );
            }
        }
    };
})();

(() => {
    __webpack_require__.o = (obj, prop) =>
        Object.prototype.hasOwnProperty.call(obj, prop);
})();

(() => {
    __webpack_require__.r = (exports) => {
        if (
            typeof Symbol !== "undefined" &&
            Symbol.toStringTag
        ) {
            Object.defineProperty(
                exports,
                Symbol.toStringTag,
                {
                    value: "Module"
                }
            );
        }

        Object.defineProperty(
            exports,
            "__esModule",
            {
                value: true
            }
        );
    };
})();

var __webpack_exports__ = {};

(() => {

__webpack_require__.r(__webpack_exports__);

__webpack_require__.d(__webpack_exports__, {
    route: () => (route),
    shouldRoute: () => (shouldRoute)
});

var _mercuryworkshop_rpc__rspack_import_0 =
    __webpack_require__("./packages/rpc/index.ts");


function makeId() {
    return Math.random()
        .toString(36)
        .substring(2, 10);
}


const cookieResolvers = {};


addEventListener("message", (e)=>{
    if (!e.data) return;
    if (typeof e.data != "object") return;

    if (
        e.data.$sw$setCookieDone &&
        typeof e.data.$sw$setCookieDone == "object"
    ) {
        const done =
            e.data.$sw$setCookieDone;

        const resolver =
            cookieResolvers[done.id];

        if (resolver) {
            resolver();
            delete cookieResolvers[done.id];
        }
    }

    if (
        e.data.$sw$initRemoteTransport &&
        typeof e.data.$sw$initRemoteTransport == "object"
    ) {
        const {
            port,
            prefix
        } =
            e.data.$sw$initRemoteTransport;

        const relevantcontroller =
            tabs.find(
                (tab)=>
                    new URL(prefix)
                        .pathname
                        .startsWith(tab.prefix)
            );

        if (!relevantcontroller) {
            console.error(
                "No relevant controller found for transport init"
            );
            return;
        }

        relevantcontroller.rpc.call(
            "initRemoteTransport",
            port,
            [port]
        );
    }
});


class ControllerReference {

    prefix;
    id;
    rpc;

    constructor(prefix, id, port){

        this.prefix = prefix;
        this.id = id;

        this.rpc =
            new _mercuryworkshop_rpc__rspack_import_0.RpcHelper(
                {
                    sendSetCookie:
                        async ({
                            cookies,
                            options
                        }) => {

                            const clients1 =
                                await self.clients.matchAll();

                            const ids = [];
                            const promises = [];

                            const isNavigation =
                                options?.destination === "document" ||
                                options?.destination === "iframe";

                            for (const client of clients1) {

                                const id =
                                    makeId();

                                ids.push(id);

                                client.postMessage({
                                    $controller$setCookie: {
                                        cookies,
                                        options,
                                        id
                                    }
                                });

                                if (!isNavigation) {

                                    promises.push(
                                        new Promise(
                                            (resolve)=>{
                                                cookieResolvers[id] =
                                                    ()=>resolve(id);
                                            }
                                        )
                                    );

                                }
                            }

                            if (promises.length > 0) {

                                let timeoutId;
                                let responded = false;

                                const timeoutPromise =
                                    new Promise(
                                        (resolve)=>{

                                            timeoutId =
                                                setTimeout(
                                                    ()=>{

                                                        if (!responded) {

                                                            const pending =
                                                                ids.filter(
                                                                    (id)=>
                                                                        cookieResolvers[id] !==
                                                                        undefined
                                                                );

                                                            console.error(
                                                                "timed out waiting for set cookie response (deadlock?): " +
                                                                `cookies=${cookies.length} clients=${clients1.length} ` +
                                                                `pending=${pending.length}/${ids.length} ` +
                                                                `clientUrls=${clients1.map((c)=>c.url).join(",")}`
                                                            );
                                                        }

                                                        resolve();

                                                    },
                                                    1000
                                                );

                                        }
                                    );

                                try {

                                    await Promise.race([
                                        timeoutPromise,

                                        Promise.any(
                                            promises
                                        )
                                            .then(()=>{
                                                responded = true;
                                            })
                                            .catch(()=>{})
                                    ]);

                                } finally {

                                    if (
                                        timeoutId !==
                                        undefined
                                    ) {
                                        clearTimeout(
                                            timeoutId
                                        );
                                    }

                                    for (
                                        const id
                                        of ids
                                    ) {
                                        delete cookieResolvers[id];
                                    }
                                }
                            }
                        }
                },

                "tabchannel-" + id,

                (data, transfer)=>{
                    port.postMessage(
                        data,
                        transfer
                    );
                }
            );

        port.onmessage =
            (e)=>{
                this.rpc.recieve(
                    e.data
                );
            };

        port.onmessageerror =
            console.error;

        this.rpc.call(
            "ready",
            undefined
        );
    }
}


const tabs = [];


/* =========================================================
   ENTRY SERVICE WORKER SELF-HEAL

   Browsers may terminate a service worker while it is idle.

   When it starts again, tabs[] is initially empty.

   If a proxied /~/sj/ request arrives during that window,
   Entry asks its browser clients to re-register their
   Corridor controller.
   ========================================================= */


function tabForPathname(pathname) {

    return tabs.find(
        (tab)=>
            pathname.startsWith(
                tab.prefix
            )
    );

}


let lastRevivePing = 0;


function requestRevive() {

    const now =
        Date.now();

    if (
        now - lastRevivePing <
        500
    ) {
        return;
    }

    lastRevivePing =
        now;

    console.warn(
        "[Entry] proxied request has no registered tab — requesting controller re-init"
    );

    clients
        .matchAll()
        .then((all)=>{

            for (
                const client
                of all
            ) {

                client.postMessage({
                    $controller$swrevive: {}
                });

            }

        });

}


/* =========================================================
   CONTROLLER REGISTRATION
   ========================================================= */


addEventListener(
    "message",
    (e)=>{

        if (!e.data) {
            return;
        }

        if (
            typeof e.data !=
            "object"
        ) {
            return;
        }

        if (
            !e.data.$controller$init
        ) {
            return;
        }

        if (
            typeof e.data.$controller$init !=
            "object"
        ) {
            return;
        }

        const init =
            e.data.$controller$init;

        const existing =
            tabs.findIndex(
                (t)=>
                    t.id ===
                    init.id
            );

        if (
            existing !==
            -1
        ) {

            tabs.splice(
                existing,
                1
            );

        }

        tabs.push(
            new ControllerReference(
                init.prefix,
                init.id,
                e.ports[0]
            )
        );

    }
);


/* =========================================================
   ROUTE DETECTION
   ========================================================= */


function shouldRoute(event) {

    const url =
        new URL(
            event.request.url
        );

    const tab =
        tabForPathname(
            url.pathname
        );

    const proxyBase =
        new URL(
            self.registration.scope
        ).pathname +
        "~/sj/";

    if (
        !tab &&
        url.pathname.startsWith(
            proxyBase
        )
    ) {

        requestRevive();

    }

    return (
        tab !== undefined
    );

}


/* =========================================================
   TOP LEVEL NAVIGATION DETECTION
   ========================================================= */


function isTopNavigation(event) {

    return (
        event.request.mode ===
            "navigate" ||

        event.request.destination ===
            "document" ||

        event.request.destination ===
            "iframe"
    );

}


/* =========================================================
   ENTRY ERROR PAGE
   ========================================================= */


function errorPage(detail) {

    const safe =
        String(
            detail ??
            "Unknown browser error"
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );


    const html =
`<!doctype html>
<html lang="en">

<head>

<meta charset="utf-8">

<meta
    name="viewport"
    content="width=device-width,initial-scale=1"
>

<title>Entry — Failed to load</title>

<link
    rel="preconnect"
    href="https://fonts.googleapis.com"
>

<link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Mrs+Saint+Delafield&display=swap"
    rel="stylesheet"
>

<style>

:root {
    --a: #2ff5c8;
    --a2: #17c9ff;
    --ar: 47,245,200;
    --a2r: 23,201,255;
    --tx: #e6fbf7;
    --mut: #7fa39d;
    --line: rgba(255,255,255,.08);
}

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    width: 100%;
    height: 100%;
    min-height: 100%;
}

body {
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 28px;

    overflow: hidden;

    background: #000;

    color: var(--tx);

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
}

.bg {
    position: fixed;
    inset: 0;

    overflow: hidden;

    pointer-events: none;

    background:
        radial-gradient(
            circle at 18% 100%,
            rgba(var(--ar),.19),
            transparent 42%
        ),
        radial-gradient(
            circle at 82% 100%,
            rgba(var(--a2r),.17),
            transparent 43%
        ),
        #000;
}

.bg::before {
    content: "";

    position: absolute;
    inset: 0;

    background-image:
        radial-gradient(
            rgba(255,255,255,.13) 1px,
            transparent 1.2px
        );

    background-size:
        20px 20px;

    -webkit-mask-image:
        linear-gradient(
            #000 0%,
            transparent 78%
        );

    mask-image:
        linear-gradient(
            #000 0%,
            transparent 78%
        );
}

.glow {
    position: absolute;

    left: 50%;
    bottom: -370px;

    width: 900px;
    height: 600px;

    transform:
        translateX(-50%);

    border-radius: 50%;

    background:
        radial-gradient(
            circle at 35% 40%,
            rgba(var(--ar),.5),
            transparent 55%
        ),
        radial-gradient(
            circle at 65% 35%,
            rgba(var(--a2r),.4),
            transparent 55%
        );

    filter:
        blur(65px);
}

.card {
    position: relative;

    z-index: 2;

    width:
        min(620px,100%);

    padding:
        34px;

    border:
        1px solid var(--line);

    border-radius:
        18px;

    background:
        rgba(0,0,0,.72);

    -webkit-backdrop-filter:
        blur(16px);

    backdrop-filter:
        blur(16px);

    box-shadow:
        0 30px 90px
        rgba(0,0,0,.75);

    text-align:
        center;
}

.logo {
    margin:
        -4px 0 6px;

    font:
        400 82px/1
        "Mrs Saint Delafield",
        cursive;

    color:
        #fff;

    text-shadow:
        0 0 22px
        rgba(var(--ar),.75),
        0 0 50px
        rgba(var(--a2r),.4);
}

.badge {
    display:
        inline-block;

    margin-bottom:
        19px;

    padding:
        5px 10px;

    border:
        1px solid
        rgba(var(--ar),.25);

    border-radius:
        999px;

    background:
        rgba(var(--ar),.06);

    color:
        var(--a);

    font-size:
        10px;

    font-weight:
        700;

    letter-spacing:
        .13em;

    text-transform:
        uppercase;
}

h1 {
    margin:
        0 0 9px;

    font-size:
        23px;

    font-weight:
        600;
}

.sub {
    margin:
        0 auto;

    max-width:
        450px;

    color:
        var(--mut);

    font-size:
        12px;

    line-height:
        1.65;
}

.error {
    margin-top:
        21px;

    padding:
        13px 14px;

    border:
        1px solid
        rgba(255,255,255,.07);

    border-radius:
        10px;

    background:
        rgba(255,255,255,.035);

    color:
        #b9d8d2;

    font:
        11px/1.55
        ui-monospace,
        SFMono-Regular,
        Menlo,
        Monaco,
        Consolas,
        monospace;

    text-align:
        left;

    overflow-wrap:
        anywhere;

    max-height:
        190px;

    overflow:
        auto;
}

.actions {
    display:
        flex;

    justify-content:
        center;

    gap:
        8px;

    margin-top:
        19px;
}

button {
    min-width:
        110px;

    height:
        38px;

    padding:
        0 16px;

    border:
        1px solid
        var(--line);

    border-radius:
        9px;

    background:
        rgba(255,255,255,.05);

    color:
        var(--tx);

    font:
        600 12px
        Inter,
        system-ui,
        sans-serif;

    cursor:
        pointer;
}

button:hover {
    border-color:
        rgba(var(--ar),.45);

    background:
        rgba(var(--ar),.07);
}

button.primary {
    border:
        0;

    background:
        linear-gradient(
            135deg,
            var(--a),
            var(--a2)
        );

    color:
        #00231d;
}

.foot {
    margin-top:
        19px;

    color:
        rgba(127,163,157,.65);

    font-size:
        10px;

    letter-spacing:
        .05em;
}

</style>

</head>


<body>

<div class="bg">
    <div class="glow"></div>
</div>


<main class="card">

    <div class="logo">
        entry
    </div>

    <div class="badge">
        Browser Error
    </div>

    <h1>
        Uh oh!
    </h1>

    <p class="sub">
        Something failed, and Entry couldn't load
        this page. You can try refreshing or go back
        to the previous page.
    </p>

    <div class="error">
        ${safe}
    </div>

    <div class="actions">

        <button
            type="button"
            onclick="history.back()"
        >
            Go back
        </button>

        <button
            type="button"
            class="primary"
            onclick="location.reload()"
        >
            Try again
        </button>

    </div>

    <div class="foot">
        entry · private browser
    </div>

</main>

</body>

</html>`;


    return new Response(
        html,
        {
            status: 200,

            headers: {

                "content-type":
                    "text/html; charset=utf-8",

                "cache-control":
                    "no-store"

            }
        }
    );

}


/* =========================================================
   WAIT FOR CONTROLLER RE-REGISTRATION
   ========================================================= */


const sleep =
    (ms) =>
        new Promise(
            (resolve)=>
                setTimeout(
                    resolve,
                    ms
                )
        );


async function tabAwaiting(
    pathname,
    timeoutMs = 2500
) {

    let tab =
        tabForPathname(
            pathname
        );

    if (tab) {
        return tab;
    }

    requestRevive();

    const deadline =
        Date.now() +
        timeoutMs;

    while (
        Date.now() <
        deadline
    ) {

        await sleep(
            100
        );

        tab =
            tabForPathname(
                pathname
            );

        if (tab) {
            return tab;
        }

    }

    return null;

}


/* =========================================================
   REQUEST ROUTING
   ========================================================= */


async function route(event) {

    try {

        const url =
            new URL(
                event.request.url
            );

        let tab =
            tabForPathname(
                url.pathname
            );

        if (!tab) {

            tab =
                await tabAwaiting(
                    url.pathname
                );

            if (!tab) {

                throw new Error(
                    "No Entry browser session exists for this tab. The service worker may have restarted."
                );

            }

        }


        const client =
            await clients.get(
                event.clientId
            );


        const rawheaders = [
            ...event.request.headers
        ];


        const response =
            await tab.rpc.call(
                "request",

                {

                    rawUrl:
                        event.request.url,

                    rawReferrer:
                        event.request.referrer,

                    destination:
                        event.request.destination,

                    mode:
                        event.request.mode,

                    referrer:
                        event.request.referrer,

                    method:
                        event.request.method,

                    body:
                        event.request.body,

                    cache:
                        event.request.cache,

                    forceCrossOriginIsolated:
                        false,

                    initialHeaders:
                        rawheaders,

                    rawClientUrl:
                        client
                            ? client.url
                            : undefined,

                    clientId:
                        event.clientId ||
                        event.resultingClientId

                },

                event.request.body instanceof ReadableStream ||
                event.request.body instanceof ArrayBuffer

                    ? [
                        event.request.body
                    ]

                    : undefined
            );


        if (
            isTopNavigation(event) &&
            (
                response.status === 0 ||
                response.status === 404 ||
                response.status >= 500
            )
        ) {

            console.warn(
                "[Entry] Page failed to load:",
                response.status,
                response.statusText
            );

            return errorPage(
                `${response.status}${
                    response.statusText
                        ? " " +
                          response.statusText
                        : ""
                }`
            );

        }


        return new Response(
            response.body,

            {
                status:
                    response.status,

                statusText:
                    response.statusText,

                headers:
                    response.headers
            }
        );


    } catch (e) {

        console.error(
            "[Entry] Service Worker error:",
            e
        );


        if (
            isTopNavigation(
                event
            )
        ) {

            return errorPage(
                e.message ||
                String(e)
            );

        }


        return new Response(
            "Internal Entry Service Worker Error: " +
            (
                e?.message ||
                String(e)
            ),

            {
                status: 500,

                headers: {
                    "content-type":
                        "text/plain; charset=utf-8",

                    "cache-control":
                        "no-store"
                }
            }
        );

    }

}


/* =========================================================
   FETCH ROUTER

   IMPORTANT:
   Entry's proxied pages use /~/sj/.

   We route an already-registered tab normally.

   We ALSO intercept /~/sj/ when tabs[] is temporarily empty
   after a browser/service-worker restart. route() then waits
   briefly for the Entry client to re-register.

   This prevents the request from falling through to Express.
   ========================================================= */


addEventListener(
    "fetch",
    (event)=>{

        const url =
            new URL(
                event.request.url
            );

        const proxyBase =
            new URL(
                self.registration.scope
            ).pathname +
            "~/sj/";


        if (
            shouldRoute(event) ||
            url.pathname.startsWith(
                proxyBase
            )
        ) {

            event.respondWith(
                route(
                    event
                )
            );

        }

    }
);


/* =========================================================
   SERVICE WORKER LIFECYCLE
   ========================================================= */


addEventListener(
    "install",
    ()=>{
        self.skipWaiting();
    }
);


addEventListener(
    "activate",
    (event)=>{

        event.waitUntil(
            clients.claim()
        );

    }
);


/* =========================================================
   REVIVE CONTROLLERS AFTER SERVICE WORKER START
   ========================================================= */


setTimeout(
    async ()=>{

        console.log(
            "[Entry] service worker activated, notifying clients to revive"
        );

        for (
            const client
            of
            (
                await clients.matchAll()
            )
        ) {

            client.postMessage({
                $controller$swrevive: {}
            });

        }

    },
    100
);


})();


$corridorController =
    __webpack_exports__;


})();

//# sourceMappingURL=controller.sw.js.map
