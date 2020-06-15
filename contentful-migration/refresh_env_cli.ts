#!/usr/bin/env node
// Refreshes the QA environment on Contentful
import * as contentful from "contentful-management";
import { checkForMissingEnvVars } from "./runMigrations";

export const refresh_env_cli = async () => {
  checkForMissingEnvVars([
    "CONTENTFUL_SOURCE_ENVIRONMENT",
    "CONTENTFUL_SPACE_ID",
    "CONTENTFUL_MANAGEMENT_API",
    "CONTENTFUL_TARGET_ENVIRONMENT",
  ]);
  console.log("##### Deleting QA Contentful environment #####");
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API,
  });
  console.log("Got client");
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  console.log("Got space");
  const environment = await space
    .getEnvironment(process.env.CONTENTFUL_TARGET_ENVIRONMENT)
    .catch(console.log);
  if (environment) {
    console.log("Got environment");
    await environment.delete();
    console.log("Deleted the old environment");
  }

  const sourceEnv = process.env.CONTENTFUL_SOURCE_ENVIRONMENT || "master";
  console.log(
    `##### Creating QA Contentful environment from ${sourceEnv} env snapshot #####`
  );
  const newEnv = await space
    .createEnvironmentWithId(
      process.env.CONTENTFUL_TARGET_ENVIRONMENT,
      { name: "QA environment" },
      sourceEnv
    )
    .catch(console.log);
  if (newEnv)
    console.log(
      `Created the ${process.env.CONTENTFUL_TARGET_ENVIRONMENT_ID} environment`
    );
};

(async () => {
  await refresh_env_cli();
})();
