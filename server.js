
const express = require("express");
const path = require("path");

const app = express();

const PORT =
  process.env.PORT ||
  process.env.SERVER_PORT ||
  3000;

const ENGINE_NAME = "Achroma Sub Engine 1";
const ENGINE_ID = "achroma-sub-engine-1";

/* =========================================================
   ACHROMA SUB ENGINE 1
   CORS
   ========================================================= */

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://userivet.net"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Range"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* =========================================================
   CACHE / SERVICE WORKER HEADERS
   ========================================================= */

app.use((req, res, next) => {
  if (
    req.path.endsWith(".sw.js") ||
    req.path.includes("/controller/")
  ) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
  }

  next();
});

/* =========================================================
   BROWSER RUNNER

   Example:
   /browse?url=https%3A%2F%2Fexample.com
   ========================================================= */

app.get("/browse", (req, res) => {
  res.sendFile(
    path.join(__dirname, "browse.html")
  );
});

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    engine: ENGINE_ID,
    name: ENGINE_NAME,
    browser: "/browse",
    timestamp: new Date().toISOString()
  });
});

/* =========================================================
   STATIC ENGINE FILES

   /controller/controller.sw.js
   /controller/controller.inject.js
   /controller/controller.api.js

   /corridor/corridor.js
   /corridor/corridor.wasm

   /transport/index.js

   /browse.html
   ========================================================= */

app.use(
  express.static(
    path.join(__dirname),
    {
      extensions: ["html"],

      setHeaders(res, filePath) {

        /*
         * WASM
         */

        if (
          filePath.endsWith(".wasm")
        ) {
          res.setHeader(
            "Content-Type",
            "application/wasm"
          );
        }

        /*
         * JavaScript
         */

        if (
          filePath.endsWith(".js")
        ) {
          res.setHeader(
            "Content-Type",
            "application/javascript; charset=utf-8"
          );
        }

        /*
         * Service Worker
         */

        if (
          filePath.endsWith(".sw.js")
        ) {
          res.setHeader(
            "Service-Worker-Allowed",
            "/"
          );

          res.setHeader(
            "Cache-Control",
            "no-store, no-cache, must-revalidate"
          );
        }
      }
    }
  )
);

/* =========================================================
   ACHROMA SUB ENGINE 1
   ROOT INTERFACE
   ========================================================= */

app.get("/", (req, res) => {
  res.type("html").send(`
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<meta
  name="theme-color"
  content="#080808"
>

<meta
  name="description"
  content="Achroma Sub Engine 1 browser infrastructure."
>

<title>Achroma Sub Engine 1</title>

<style>
:root {
  color-scheme: dark;

  --background: #080808;
  --surface: #111111;
  --surface-hover: #1a1a1a;

  --text: #f5f5f5;
  --muted: #929292;
  --subtle: #666666;
  --border: #303030;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  width: 100%;
  min-height: 100%;
}

body {
  min-height: 100vh;

  background: var(--background);
  color: var(--text);

  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  -webkit-font-smoothing: antialiased;
}

main {
  width: 100%;
  max-width: 900px;

  padding: 88px 48px;

  margin: 0;

  text-align: left;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 12px;

  margin-bottom: 72px;
}

.brand-mark {
  width: 24px;
  height: 24px;

  flex-shrink: 0;

  background: #ffffff;
}

.brand-name {
  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.eyebrow {
  margin-bottom: 20px;

  color: var(--muted);

  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.15em;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 24px;

  font-size: clamp(36px, 6vw, 64px);
  font-weight: 600;

  letter-spacing: -0.055em;
  line-height: 1.1;
}

.description {
  max-width: 500px;

  margin: 0 0 32px;

  color: var(--muted);

  font-size: 15px;
  line-height: 1.75;
}

.actions {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  flex-wrap: wrap;

  gap: 12px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 44px;

  padding: 12px 20px;

  border: 1px solid var(--border);
  border-radius: 0;

  background: var(--surface);
  color: var(--text);

  font-family: inherit;
  font-size: 13px;
  font-weight: 500;

  text-decoration: none;

  cursor: pointer;

  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.button:hover {
  background: var(--surface-hover);
  border-color: #555555;
}

.button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}

.button-primary {
  background: #f5f5f5;
  color: #080808;
  border-color: #f5f5f5;
}

.button-primary:hover {
  background: #d9d9d9;
  border-color: #d9d9d9;
}

.divider {
  width: 100%;
  height: 1px;

  margin: 64px 0 24px;

  background: var(--border);
}

.status {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 10px;

  color: var(--muted);

  font-size: 12px;
  font-weight: 500;

  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-dot {
  width: 7px;
  height: 7px;

  flex-shrink: 0;

  background: #ffffff;
}

.system-info {
  display: grid;
  grid-template-columns: 130px 1fr;

  gap: 12px 24px;

  margin-top: 36px;

  font-size: 12px;
}

.system-label {
  color: var(--subtle);
}

.system-value {
  color: #d0d0d0;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Consolas,
    monospace;

  overflow-wrap: anywhere;
}

footer {
  margin-top: 72px;

  color: var(--subtle);

  font-size: 11px;
  letter-spacing: 0.03em;
}

@media (max-width: 600px) {
  main {
    padding: 48px 24px;
  }

  .brand {
    margin-bottom: 52px;
  }

  .divider {
    margin-top: 48px;
  }

  .system-info {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .system-value {
    margin-bottom: 12px;
  }

  footer {
    margin-top: 48px;
  }
}
</style>
</head>

<body>

<main>

  <header class="brand">
    <div
      class="brand-mark"
      aria-hidden="true"
    ></div>

    <div class="brand-name">
      Achroma Sub Engine 1
    </div>
  </header>

  <section aria-labelledby="page-title">

    <div class="eyebrow">
      Engine Interface / 01
    </div>

    <h1 id="page-title">
      Achroma<br>
      Sub Engine 1.
    </h1>

    <p class="description">
      Monochrome browsing infrastructure.
      Engine initialized and ready for requests.
    </p>

    <div class="actions">

      <a
        class="button button-primary"
        href="/browse"
      >
        Launch Browser &rarr;
      </a>

      <a
        class="button"
        href="/health"
      >
        Engine Health
      </a>

    </div>

  </section>

  <div
    class="divider"
    role="separator"
  ></div>

  <section aria-label="Engine status">

    <div class="status">
      <span
        class="status-dot"
        aria-hidden="true"
      ></span>

      Engine Online
    </div>

    <div class="system-info">

      <div class="system-label">
        Engine
      </div>

      <div class="system-value">
        achroma-sub-engine-1
      </div>

      <div class="system-label">
        Browser Endpoint
      </div>

      <div class="system-value">
        /browse?url=...
      </div>

      <div class="system-label">
        Health Endpoint
      </div>

      <div class="system-value">
        /health
      </div>

      <div class="system-label">
        Status
      </div>

      <div class="system-value">
        Operational
      </div>

    </div>

  </section>

  <footer>
    Achroma Sub Engine 1 / System Operational
  </footer>

</main>

</body>
</html>
  `);
});

/* =========================================================
   ACHROMA SUB ENGINE 1
   404 HANDLER
   ========================================================= */

app.use((req, res) => {
  res.status(404).json({
    engine: ENGINE_ID,
    error: "Resource not found",
    path: req.originalUrl
  });
});

/* =========================================================
   ACHROMA SUB ENGINE 1
   ERROR HANDLER
   ========================================================= */

app.use((err, req, res, next) => {
  console.error(
    `${ENGINE_NAME} Error:`,
    err
  );

  if (
    res.headersSent
  ) {
    return next(err);
  }

  res.status(500).json({
    engine: ENGINE_ID,
    error: "Internal engine error",
    message:
      process.env.NODE_ENV ===
      "development"
        ? err.message
        : undefined
  });
});

/* =========================================================
   ACHROMA SUB ENGINE 1
   START SERVER
   ========================================================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "================================"
    );

    console.log(
      ENGINE_NAME
    );

    console.log(
      `Listening on port ${PORT}`
    );

    console.log(
      "Browser endpoint: /browse"
    );

    console.log(
      "Health endpoint: /health"
    );

    console.log(
      "Status: ONLINE"
    );

    console.log(
      "================================"
    );
  }
);
