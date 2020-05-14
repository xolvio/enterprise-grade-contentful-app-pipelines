import util from "util";
import fs from "fs";
import fse from "fs-extra";
import getDirectories from "./getDirectories";
import verifyPrerequisites from "./verifyPrerequisites";
import { spawn } from "child_process";

const readFile = util.promisify(fs.readFile);

type MigrationsJson = {
  migrations: string[];
};

export default async function runMigrations(migrationsJson: MigrationsJson) {
  if (!process.env.CONTENTFUL_MANAGEMENT_API)
    throw missingEnvError("CONTENTFUL_MANAGEMENT_API");
  if (!process.env.CONTENTFUL_SPACE_ID)
    throw missingEnvError("CONTENTFUL_SPACE_ID");
  if (!process.env.CONTENTFUL_ENVIRONMENT_ID)
    throw missingEnvError("CONTENTFUL_ENVIRONMENT_ID");

  if (!migrationsJson || (migrationsJson && !migrationsJson.migrations))
    throw new Error(
      'Invalid JSON or "migrations" key not found in migrations.json'
    );
  const componentsToMigrate = getComponentsFromMigrationsFile(migrationsJson);
  console.log("MICHAL: componentsToMigrate", componentsToMigrate);

  if (!componentsToMigrate || !componentsToMigrate.length)
    throw new Error("Did not find any components to migrate. Exiting...");

  await verifyPrerequisites();
  await asyncMigrate(componentsToMigrate);
}

export const getComponentsFromMigrationsFile = ({
  migrations,
}: MigrationsJson) => migrations;

export const missingEnvError = (missingEnv: string) =>
  new Error(
    `${missingEnv} environment variable is missing. Make sure it's defined before running the script`
  );

async function asyncMigrate(componentsToMigrate: any[]) {
  console.log("Grouping all of the migrations together");

  //Will include only the components which actually have the migrations
  console.log(
    "Running migrations against following components:",
    componentsToMigrate.join(", ")
  );
  await new Promise((resolve) => {
    const migrate = spawn(
      `${process.cwd()}/node_modules/.bin/ctf-migrate`,
      [
        "up",
        ...componentsToMigrate
          .map((c) => c.toLowerCase())
          .reduce((acc: string[], next: string) => [...acc, "-c", next], []),
        "-t",
        process.env.CONTENTFUL_MANAGEMENT_API,
        "-s",
        process.env.CONTENTFUL_SPACE_ID,
        "-e",
        process.env.CONTENTFUL_ENVIRONMENT_ID,
      ],
      {
        cwd: process.cwd(),
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
      console.log(`CWD: ${process.cwd()}`);
      console.log(err);
      resolve(false);
    });
    migrate.on("close", (code: number) => {
      console.log(`content-migration: child process exited with code ${code}`);
      resolve(code === 0);
    });
  });

  await fse.remove(`${process.cwd()}/migrations`);
}
