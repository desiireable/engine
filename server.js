const express = require("express");
const path = require("path");

const app = express();

const PORT =
  process.env.PORT ||
  process.env.SERVER_PORT ||
  3000;


/* =========================================================
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
    engine: "entry",
    browser: "/browse",
    timestamp: new Date().toISOString()
  });
});


/* =========================================================
   STATIC ENGINE FILES

   Serves:

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
   ROOT PAGE
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

<title>Entry Engine</title>

<style>

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

  display: flex;
  align-items: center;
  justify-content: center;

  background: #000;

  color: #fff;

  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

main {
  width: min(
    90%,
    600px
  );

  text-align: center;
}

h1 {
  margin:
    0
    0
    10px;

  font-size: 32px;
}

p {
  margin:
    8px
    0;

  opacity: 0.7;
}

code {
  display: inline-block;

  margin-top: 16px;

  padding:
    10px
    14px;

  border-radius: 10px;

  background: #111;

  color: #2ff5c8;
}

.status {
  margin-top: 24px;

  font-size: 14px;

  opacity: 0.55;
}

</style>

</head>


<body>

<main>

<h1>
Entry Engine
</h1>

<p>
Engine server is online.
</p>

<p>
Corridor browser endpoint:
</p>

<code>
/browse?url=...
</code>

<div class="status">
Server running successfully
</div>

</main>

</body>

</html>
  `);
});


/* =========================================================
   404
   ========================================================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.originalUrl
  });
});


/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use((err, req, res, next) => {
  console.error(
    "Entry Engine Error:",
    err
  );

  if (
    res.headersSent
  ) {
    return next(err);
  }

  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV ===
      "development"
        ? err.message
        : undefined
  });
});


/* =========================================================
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
      "Entry Engine"
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
      "================================"
    );
  }
);
