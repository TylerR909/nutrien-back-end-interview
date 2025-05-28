import express from "express";

const app = express();

app.get("/hello", (req, res) => {
  res.send("world\n");
});

const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => {
  console.log(`app listening on port ${SERVER_PORT}`);
});
