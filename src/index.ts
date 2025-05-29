import express from "express";
import { useDb } from "./db/useDb.js";
import { histogram } from "./routes/histogram.js";

const app = express();

/** MIDDLEWARE */
app.use(useDb);

/** ROUTES */
app.use(histogram);
app.get("/hello", (req, res) => {
  res.send("world\n");
});

/** BOOTUP */
const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => {
  console.log(`app listening on port ${SERVER_PORT}`);
});
