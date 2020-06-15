import verifyPrerequisites from "./verifyPrerequisites";
import { spawn } from "child_process";

type MigrationsJson = {
  migrations: string[];
  path: string;
};

export default async function runMigrations(migrationsJson: MigrationsJson) {
  checkForMissingEnvVars([
    "CONTENTFUL_MANAGEMENT_API",
    "CONTENTFUL_SPACE_ID",
    "CONTENTFUL_ENVIRONMENT_ID",
  ]);

  if (!migrationsJson.hasOwnProperty("migrations"))
    throw new Error(
      'Invalid JSON or "migrations" key not found in migrations.json'
    );

  if (!migrationsJson.hasOwnProperty("path"))
    throw new Error('Invalid JSON or "path" key not found in migrations.json');
  const componentsToMigrate = getComponentsFromMigrationsFile(migrationsJson);
  console.log("MICHAL: componentsToMigrate", componentsToMigrate);

  if (!componentsToMigrate?.length)
    throw new Error("Did not find any components to migrate. Exiting...");

  await verifyPrerequisites();
  await asyncMigrate(componentsToMigrate, migrationsJson.path);
}

export const checkForMissingEnvVars = (environmentVarsToCheck: string[]) => {
  for (const env of environmentVarsToCheck)
    if (!process.env[env]) throw missingEnvError(env);
};

export const getComponentsFromMigrationsFile = ({
  migrations,
}: MigrationsJson) => migrations;

export const getPathToMigrationFiles = ({ path }: MigrationsJson) => path;

export const missingEnvError = (missingEnv: string) =>
  new Error(
    `${missingEnv} environment variable is missing. Make sure it's defined before running the script`
  );

async function asyncMigrate(
  componentsToMigrate: any[],
  pathToMigrationScripts: string
) {
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
        cwd: `${process.cwd()}/${pathToMigrationScripts}`,
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
      console.log(`content-migration: child process exited with code ${code}`);
      resolve(code === 0);
    });
  });
}
