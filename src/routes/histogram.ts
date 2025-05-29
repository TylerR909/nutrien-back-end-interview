import { Router } from "express";
import { projection, projectionCsvHeaderToSchemaCol } from "../db/schema/projection.js";
import { fail } from "../utils.js";
import { count } from "drizzle-orm";

const route = Router();

route.get("/:column/histogram", async (req, res) => {
  const columnName = req.params.column;

  const schemaColName =
    projectionCsvHeaderToSchemaCol[columnName] ??
    fail(`Unrecognized column name: ${columnName}. Options: ${Object.keys(projectionCsvHeaderToSchemaCol)}`);

  const data = await req.db
    .select({ key: projection[schemaColName], value: count() })
    .from(projection)
    .groupBy(projection[schemaColName]);

  res.status(200).send(data);
});

export const histogram = route;
