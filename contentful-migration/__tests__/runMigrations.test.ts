import getComponentsForMigration from "../runMigrations";

import { spawn } from "child_process";
import createMigrationContentType from "../createMigrationContentType";
import { missingEnvError } from "../helpers";

jest.mock("child_process");
jest.mock("../createMigrationContentType");
//jest.mock("../helpers/getCwd");

const listOfMigrations = ["__tests__/TestComponent"];

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

  createMigrationContentType.mockResolvedValue(true);
  //getCwd.mockReturnValue('')
  // console.log("MICHAL: getCwd()", getCwd());
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test("Throws error if provided empty list of migration paths", () => {
  return getComponentsForMigration([]).catch((e) => {
    expect(e).toEqual(new Error("Migration paths cannot be empty."));
  });
});

test("Throws error if did not provide migration paths as function argument", () => {
  return getComponentsForMigration().catch((e) => {
    expect(e).toEqual(new Error("Migration paths need to be provided"));
  });
});

test("Runs migrations only for the paths which contain migration scripts", async () => {
  const oneGoodOneBad = [...listOfMigrations, "this/path/doesnot/exist"];
  await getComponentsForMigration(oneGoodOneBad);

  listOfMigrations.forEach((migration, i) => {
    expect(spawn.mock.calls[i][2].cwd).toMatch(migration);
  });

  expect(spawn.mock.calls.length).toEqual(1);
});

test("Checks if spawn was called with proper arguments", async () => {
  await getComponentsForMigration(listOfMigrations);

  listOfMigrations.forEach((migration, i) => {
    const migrationPathSplit = migration.split("/");
    const contentTypeName = migrationPathSplit[migrationPathSplit.length - 1];
    expect(spawn.mock.calls[i][0]).toMatch("/node_modules/.bin/ctf-migrate");
    expect(spawn.mock.calls[i][1]).toEqual([
      "up",
      "-a",
      "-t",
      "contentful-api-key",
      "-s",
      "space-id",
      "-e",
      "environment-id",
    ]);
    expect(spawn.mock.calls[i][2].cwd).toMatch(migration);
  });

  expect(spawn.mock.calls.length).toEqual(listOfMigrations.length);
});
test.each([
  "CONTENTFUL_MANAGEMENT_API",
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ENVIRONMENT_ID",
])("Throws error if %s environment variable not defined", (testEnv) => {
  delete process.env[testEnv];
  return getComponentsForMigration(listOfMigrations).catch((e) => {
    expect(e).toEqual(missingEnvError(testEnv));
  });
});
