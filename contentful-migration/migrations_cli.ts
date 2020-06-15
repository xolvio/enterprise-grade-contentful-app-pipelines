#!/usr/bin/env node
import runMigrations from "./runMigrations";

(async () => {
  await runMigrations(require(`${process.cwd()}/migrations.json`));
})();
