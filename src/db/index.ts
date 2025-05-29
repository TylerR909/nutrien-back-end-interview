import { drizzle } from "drizzle-orm/node-postgres";
import { fail } from "../utils.js";

// Should be present via docker-compose.yml
const DATABASE_URL =
  process.env.DATABASE_URL ?? fail("DATABASE_URL must be provided");

export const db = drizzle(DATABASE_URL, {
  // Auto-converts js-idiomatic entity.firstName to db-idiomatic `first_name` columns
  casing: "snake_case",
});
