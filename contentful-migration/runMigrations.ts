import createMigrationContentType from "./createMigrationContentType";
import { spawn } from "child_process";
import * as fs from "fs";
import { validatePaths } from "./helpers";

export default async function runMigrations(migrationPaths: string[]) {
  const paths = await validatePaths(migrationPaths);
  console.log("Running migrations for:", paths.join(", "));

  for (
    let migrationIndex = 0;
    migrationIndex < paths.length;
    migrationIndex++
  ) {
    const migration = paths[migrationIndex];
    await new Promise((resolve) => {
      const migrate = spawn(
        `${process.cwd()}/node_modules/.bin/ctf-migrate`,
        [
          "up",
          "-a",
          "-t",
          process.env.CONTENTFUL_MANAGEMENT_API,
          "-s",
          process.env.CONTENTFUL_SPACE_ID,
          "-e",
          process.env.CONTENTFUL_ENVIRONMENT_ID,
        ],
        {
          cwd: `${process.cwd()}/${migration}`,
          env: process.env,
        }
      );

      migrate.stdout.on("data", (stdout: string) => {
        console.log(stdout.toString());
      });
      migrate.stderr.on("data", (stderr: string) => {
        console.log(stderr.toString());
      });
      migrate.on("error", (err: any) => {
        console.log(err);
        resolve(false);
      });
      migrate.on("close", (code: number) => {
        console.log(
          `content-migration: child process exited with code ${code}`
        );
        resolve(code === 0);
      });
    });
  }
}
