const {
  runMigrations,
  createEnvironmentFromSource,
} = require("@xolvio/contentful-pipelines");
require("dotenv").config();

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  if (dev) {
    //Run migrations before starting the server.
    console.log("Started DEV server, running migrations first...");
    await runMigrations([
      "src/components/Title",
      "src/components/Sections",
      "src/pages/index",
    ]); // Accepts second argument for overriding env variables defined in .env
  }

  await app.prepare();

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
})();
