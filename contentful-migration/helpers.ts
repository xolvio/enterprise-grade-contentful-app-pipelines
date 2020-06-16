import fs from "fs";
import createMigrationContentType from "./createMigrationContentType";

export const validatePaths = async (paths: string[]): Promise<string[]> => {
  if (!paths) throw new Error("Migration paths need to be provided");
  if (!paths.length) throw new Error("Migration paths cannot be empty.");
  if (!paths?.length)
    throw new Error("Did not find any components to migrate. Exiting...");

  checkForMissingEnvVars([
    "CONTENTFUL_MANAGEMENT_API",
    "CONTENTFUL_SPACE_ID",
    "CONTENTFUL_ENVIRONMENT_ID",
  ]);

  await createMigrationContentType();

  return validateMigrationPaths(paths);
};

const validateMigrationPaths = (paths: string[]) =>
  paths.filter((p) => fs.existsSync(`${p}/migrations`));

export const checkForMissingEnvVars = (environmentVarsToCheck: string[]) => {
  for (const env of environmentVarsToCheck)
    if (!process.env[env]) throw missingEnvError(env);
};

export const missingEnvError = (missingEnv: string) =>
  new Error(
    `${missingEnv} environment variable is missing. Make sure it's defined before running the script`
  );
