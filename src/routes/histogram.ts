import { Router } from "express";
import { projection } from "../db/schema/projection.js";

const route = Router();

route.get("/:column/histogram", async (req, res) => {
  const columnName = req.params.column;

  console.log({ columnName });

  await req.db.select().from(projection);

  res.sendStatus(200);
});

export const histogram = route;
