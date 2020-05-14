import getComponentsForMigration, {
  getComponentsFromMigrationsFile,
  missingEnvError,
} from "../runMigrations";

import { spawn } from "child_process";
import { copy, ensureDir, remove } from "fs-extra";
import verifyPrerequisites from "../verifyPrerequisites";
import getDirectories from "../getDirectories";

jest.mock("child_process");
jest.mock("fs-extra");
jest.mock("../getDirectories");
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

  copy.mockReturnValue({
    catch: jest.fn(),
  });
  ensureDir.mockReturnValue(jest.fn);
  verifyPrerequisites.mockResolvedValue(true);
  remove.mockReturnValue(jest.fn);
  getDirectories.mockReturnValue([
    "stageContentful",
    "responsiveMediaContentful",
  ]);
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
test("Throws error if provided json is of a wrong shape", () => {
  return getComponentsForMigration({}).catch((e) => {
    expect(e).toEqual(
      new Error('Invalid JSON or "migrations" key not found in migrations.json')
    );
  });
});
test("Throws error if did not find any components to migrate", () => {
  return getComponentsForMigration({ migrations: [] }).catch((e) => {
    expect(e).toEqual(
      new Error("Did not find any components to migrate. Exiting...")
    );
  });
});
test("Checks if spawn was called with proper arguments", async () => {
  await getComponentsForMigration({
    migrations: ["Title", "Sections"],
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
