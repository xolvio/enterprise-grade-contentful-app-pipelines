import * as contentful from "contentful-management";
import { spawn } from "child_process";

const verifyPrerequisites = async () => {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API,
  });
  console.log("Got client");
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  console.log("Got space");
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT_ID
  );

  const migrationContentType = await environment
    .getContentType("migration")
    .catch(() => {});
  if (!migrationContentType) {
    console.log('"migration" content type missing, creating one...');
    await new Promise((resolve) => {
      const migrate = spawn(
        `${process.cwd()}/node_modules/.bin/ctf-migrate`,
        [
          "init",
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
        throw err;
      });
      migrate.on("close", (code: number) => {
        console.log(
          `content-migration migration type creation exited with: ${code}`
        );
        resolve(code === 0);
      });
    });
  }
};

export default verifyPrerequisites;
