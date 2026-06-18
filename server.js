const express = require("express");
const next = require("next");
const compression = require("compression");
const cors = require("cors");
require("dotenv").config();

const { Agent, setGlobalDispatcher } = require("undici");

setGlobalDispatcher(
  new Agent({
    connect: { timeout: 600000 }, // 10 min
    headersTimeout: 600000,
    bodyTimeout: 600000,
  }),
);

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.SERVER_PORT || "3000", 10);

const app = next({ dev });
const handle = app.getRequestHandler();

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(compression());

    server.use(
      cors({
        origin: "*",
      }),
    );

    server.use((_req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,PATCH",
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      );
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });

    server.all(/.*/, (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`🚀 Server ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error("💥 Express server failed to start:", ex.stack);
    process.exit(1);
  });
