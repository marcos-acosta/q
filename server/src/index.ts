import express from "express";
import { GOAL_LOGS, ITEMS } from "./fake_data";

const app = express();

app.get("/", (req, res) => {
  res.send("Yes, it's up.");
});

app.get("/goal_logs", (req, res) => {
  res.send(GOAL_LOGS);
});

app.get("/items", (req, res) => {
  res.send(ITEMS);
});

app.listen(3000, () => {
  console.log("Server is up.");
});
