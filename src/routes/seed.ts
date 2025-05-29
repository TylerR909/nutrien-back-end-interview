import { count, getTableName } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import fs from "fs";
import { Router } from "express";
import { db } from "../db/index.js";
import { projection, projectionCsvHeaderToSchemaCol } from "../db/schema/projection.js";
import { fail } from "../utils.js";
import Papa from "papaparse";

const route = Router();

/** `curl -X POST localhost:3000/seed` to seed the database with CSV data */
route.post("/seed", async (req, res) => {
  await seedFromSchema(projection, "Projection2021.csv", projectionCsvHeaderToSchemaCol);

  res.sendStatus(200);
});

const seedFromSchema = async <T extends PgTable>(
  /** A schema object such as `const user = pgTable("users")` */
  schema: T,
  /** A CSV File, presumably ending in `.csv` but not enforced. For simplicity, assumes any file is at the Root of the project. */
  csvFilename: string,
  /** A map of CSV Headers to Schema Keys, such as `{ "First Name": "firstName" }` */
  csvHeaderToSchemaKeyMap: Record<string, keyof T["$inferInsert"]>
) => {
  const data = await db.select({ count: count() }).from(schema as PgTable);
  if (data[0].count > 0) {
    console.warn(`${getTableName(schema)} table is not empty. Rejecting import.`); // reset docker volumes with `docker-compose down -v`
    return;
  }

  // Depends on Docker Workdir being `/app` for now. Also presumes csvFilename exists at the project root.
  const absoluteFilename = `/app/${csvFilename}`;
  if (!fs.existsSync(absoluteFilename)) fail(`${absoluteFilename} was not found`);

  const keyMapPairs = Object.entries(csvHeaderToSchemaKeyMap) as [string, string][];

  return new Promise<void>((resolve, reject) => {
    Papa.parse(fs.createReadStream(absoluteFilename), {
      header: true,
      skipEmptyLines: true,
      worker: true,
      beforeFirstChunk: () => {
        console.log(`Streaming in ${csvFilename} now...`);
      },
      step: async (row, parser) => {
        try {
          parser.pause(); // Pause parsing to insert data synchronously

          // Converts row.data and the { FirstName: "firstName" } map to something like
          // `{ firstName: row.data['FirstName'] }` --> `{ firstName: "John" }`
          const insertBlob = keyMapPairs.reduce(
            (acc, [Header, schemaCol]) => ({
              ...acc,
              [schemaCol]: (row.data as any)[Header] ?? fail(`Failed to derive ${schemaCol} from ${row.data}`),
            }),
            {} as Record<string, string>
          );

          await db.insert(schema).values(insertBlob as any);
        } finally {
          parser.resume(); // resume parsing
        }
      },
      complete: () => {
        console.log(`${csvFilename} import completed`);
        resolve();
      },
      error: (error, file) => {
        file.close();
        console.error(error.message);
        reject();
      },
    });
  });
};

export const seed = route;
