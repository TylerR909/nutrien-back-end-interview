import express, { Router } from "express";
import { db as _db } from "../db/index.js";
import { useDb } from "../db/useDb.js";
import { AnyPgTable } from "drizzle-orm/pg-core";

export const preloadSetupTestApp = (
  route: Router,
  /** Notify the preloader which drizzle schemas you're going to put under test so it can clean out the database between runs */
  schemasUsed: AnyPgTable[]
) => {
  return async () => {
    const ctx = await setupTestApp(route);

    /**
     * Delete all data at the start of each test so it can start with a new/fresh database. Doing
     * this at the beginning of tests means we can debug failing tests by connecting a database
     * client to see if we have the data we expect through the test.
     */
    for (const schema of schemasUsed) await ctx.db.delete(schema);

    return ctx;
  };
};

export const setupTestApp = async (route: Router) => {
  const app = express();

  /** Register middleware for all tests to use */
  app.use(useDb);

  /** Connect the passed-in router so it can be put under test */
  app.use(route);

  return { app, db: _db };
};
