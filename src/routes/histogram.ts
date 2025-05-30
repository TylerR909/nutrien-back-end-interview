import { Router } from "express";
import { fail } from "../utils.js";
import { count } from "drizzle-orm";
import { feedGrain, feedGrainCsvHeaderToSchemaCol } from "../db/schema/feedGrain.js";
import { projection, projectionCsvHeaderToSchemaCol } from "../db/schema/projection.js";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

const route = Router();

route.get("/:type/:column/histogram", async (req, res) => {
  const type = req.params.type; // 'feedGrain' 'projection'
  const columnName = req.params.column;

  const [schema, keyMap] =
    typeToSchemaInfo[type] ?? fail(`unknown type ${type}. Expected one of ${Object.keys(typeToSchemaInfo)}`);

  const schemaColName =
    keyMap[columnName] ?? fail(`Unrecognized column name: ${columnName}. Options: ${Object.keys(keyMap)}`);

  const data = await req.db
    .select({ key: schema[schemaColName], value: count() })
    .from(schema)
    .groupBy(schema[schemaColName]);

  res.status(200).send(data);
});

type SchemaTuple = [schema: PgTableWithColumns<any>, keyMap: Record<string, string>];

const typeToSchemaInfo: Record<string, SchemaTuple> = {
  projection: [projection, projectionCsvHeaderToSchemaCol],
  feedGrain: [feedGrain, feedGrainCsvHeaderToSchemaCol],
};

export const histogram = route;
