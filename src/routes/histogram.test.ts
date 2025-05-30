import { histogram } from "./histogram.js";
import request from "supertest";
import { db as _db } from "../db/index.js";
import { projection } from "../db/schema/projection.js";
import { preloadSetupTestApp } from "../tests/setupTestApp.js";

describe("histogram router", () => {
  const setupTest = preloadSetupTestApp(histogram, [projection]);

  it("can search by commodity", async () => {
    const { app, db } = await setupTest();
    // Given 2 rice and 1 barley projections
    await newProjection(db, { commodity: "Rice" });
    await newProjection(db, { commodity: "Rice" });
    await newProjection(db, { commodity: "Barley" });
    // When we GET by Commodity
    const result = await request(app).get("/Commodity/histogram");
    // Then we get the summary of our results
    expect(result.body).toMatchObject([
      { key: "Rice", value: 2 },
      { key: "Barley", value: 1 },
    ]);
  });

  it("can search by Year", async () => {
    const { app, db } = await setupTest();
    // Given 1 and 2 similar projections by Year
    await newProjection(db, { year: "2019/20" });
    await newProjection(db, { year: "2020/21" });
    await newProjection(db, { year: "2020/21" });
    // When we GET by Year
    const result = await request(app).get("/Year/histogram");
    // Then we get the summary of our results
    expect(result.body).toMatchObject([
      { key: "2019/20", value: 1 },
      { key: "2020/21", value: 2 },
    ]);
  });

  it("handles errors gracefully", async () => {
    const { app } = await setupTest();
    // When we typo, for instance a lowercase Year
    const result = await request(app).get("/year/histogram");
    // Then we get an error that directs us to a solution
    expect(result.error).toMatch(
      "Unrecognized columns name: year. Options: Attribute,Commodity,CommodityType,Units,YearType,Year,Value"
    );
  });
});

const newProjection = async (db: typeof _db, values: Partial<typeof projection.$inferInsert>) => {
  const _vals: typeof projection.$inferInsert = {
    attribute: "Harvested acres",
    commodity: "Rice",
    commodityType: "Crops",
    units: "Thousand acres",
    yearType: "Market year",
    year: "2019/20",
    value: "2472",
    ...values,
  };
  return db.insert(projection).values(_vals).returning();
};
