import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const feedGrain = pgTable("feed_grains", {
  id: t.serial().primaryKey(),
  scGroupId: t.varchar().notNull(),
  yearId: t.varchar().notNull(),
  amount: t.varchar().notNull(),
});

export const feedGrainCsvHeaderToSchemaCol: Record<string, keyof typeof feedGrain.$inferInsert> = {
  SC_Group_ID: "scGroupId",
  Year_ID: "yearId",
  Amount: "amount",
};
