import runMigrations from "./runMigrations";

(async () => {
  if (!process.argv[2])
    throw new Error(
      // eslint-disable-next-line no-template-curly-in-string
      'You need to run the script like this: "node ./src/contentful-migration/index.ts ${PWD}"'
    );
  await runMigrations(require(`${process.argv[2]}/package.json`));
})();
