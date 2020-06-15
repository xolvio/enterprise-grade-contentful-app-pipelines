import getComponentsForMigration, {
  getComponentsFromMigrationsFile,
  getPathToMigrationFiles,
  missingEnvError,
} from "../runMigrations";

import { spawn } from "child_process";
import verifyPrerequisites from "../verifyPrerequisites";

jest.mock("child_process");
jest.mock("../verifyPrerequisites");

import migrationsFile from "./migrations.json";

beforeEach(() => {
  process.env.CONTENTFUL_MANAGEMENT_API = "contentful-api-key";
  process.env.CONTENTFUL_SPACE_ID = "space-id";
  process.env.CONTENTFUL_ENVIRONMENT_ID = "environment-id";

  spawn.mockReturnValue({
    stdout: {
      on: jest.fn(),
    },
    stderr: {
      on: jest.fn(),
    },
    on: jest.fn((e, cb) => setTimeout(() => cb(0), 100)),
  });

  verifyPrerequisites.mockResolvedValue(true);
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test("Returns the list of all components to run migrations against", () => {
  expect(getComponentsFromMigrationsFile(migrationsFile))
    .toMatchInlineSnapshot(`
    Array [
      "Title",
      "Sections",
    ]
  `);
});

test("Returns the path to the migration scripts", () => {
  expect(getPathToMigrationFiles(migrationsFile)).toMatchInlineSnapshot(
    `"node_modules/xolvio-storybook-showcase/build/components"`
  );
});
test("Throws error if provided json does not have migrations key", () => {
  return getComponentsForMigration({ path: "" }).catch((e) => {
    expect(e).toEqual(
      new Error('Invalid JSON or "migrations" key not found in migrations.json')
    );
  });
});
test("Throws error if provided json does not have path key", () => {
  return getComponentsForMigration({ migrations: [] }).catch((e) => {
    expect(e).toEqual(
      new Error('Invalid JSON or "path" key not found in migrations.json')
    );
  });
});
test("Throws error if did not find any components to migrate", () => {
  return getComponentsForMigration({ migrations: [], path: "" }).catch((e) => {
    expect(e).toEqual(
      new Error("Did not find any components to migrate. Exiting...")
    );
  });
});
test("Checks if spawn was called with proper arguments", async () => {
  await getComponentsForMigration({
    migrations: ["Title", "Sections"],
    path: "node_modules/xolvio-storybook-showcase/build/components",
  });
  expect(spawn.mock.calls[0][0]).toMatch("/node_modules/.bin/ctf-migrate");
  expect(spawn.mock.calls[0][1]).toEqual([
    "up",
    "-c",
    "title",
    "-c",
    "sections",
    "-t",
    "contentful-api-key",
    "-s",
    "space-id",
    "-e",
    "environment-id",
  ]);
  expect(spawn.mock.calls[0][2].cwd).toMatch(
    "/node_modules/xolvio-storybook-showcase/build/components"
  );
});
test.each([
  "CONTENTFUL_MANAGEMENT_API",
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ENVIRONMENT_ID",
])("Throws error if %s environment variable not defined", (testEnv) => {
  delete process.env[testEnv];
  return getComponentsForMigration({ migrations: [] }).catch((e) => {
    expect(e).toEqual(missingEnvError(testEnv));
  });
});
