import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const projection = pgTable("projections", {
  id: t.serial().primaryKey(),
  attribute: t.varchar().notNull(),
  commodity: t.varchar().notNull(),
  commodityType: t.varchar().notNull(),
  units: t.varchar().notNull(),
  yearType: t.varchar().notNull(),
  year: t.varchar().notNull(),
  value: t.varchar().notNull(),
});

export const projectionCsvHeaderToSchemaCol: Record<
  string,
  keyof typeof projection.$inferInsert
> = {
  Attribute: "attribute",
  Commodity: "commodity",
  CommodityType: "commodityType",
  Units: "units",
  YearType: "yearType",
  Year: "year",
  Value: "value",
};
