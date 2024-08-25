import express from "express";
import { FAKE_DATA } from "./fake_data";

const app = express();

const ACTIONS = [
  {
    action_name: "call ethan",
    action_id: "a",
    tags: ["quartet"],
    blocking: ["d"],
    scheduling: {
      time_minutes: 15,
    },
  },
  {
    action_name: "laundry",
    action_id: "b",
    tags: ["errands"],
    scheduling: {
      time_minutes: 105,
      recurrence: {
        frequency: 2,
        unit: "WEEK",
      },
      days: "su",
    },
  },
  {
    action_name: "get binder clip from office",
    action_id: "c",
    tags: ["errands", "apartment"],
  },
  {
    action_name: "schedule next quartet meeting",
    action_id: "d",
    tags: ["quartet"],
    dependencies: ["a"],
  },
  {
    action_name: "do 20 pull-ups after work",
    action_id: "e",
    tags: ["fitness"],
    scheduling: {
      recurrence: {
        frequency: 1,
        unit: "DAY",
      },
      days: "mtwrf",
    },
  },
  {
    action_name: "practice piano",
    action_id: "z",
    tags: ["musicality"],
    scheduling: {
      time_minutes: 600,
      recurrence: {
        frequency: 1,
        unit: "WEEK",
      },
    },
  },
  {
    action_name: "work on quartet arrangements",
    action_id: "y",
    tags: ["quartet"],
    scheduling: {
      time_minutes: 600,
      recurrence: {
        frequency: 1,
        unit: "WEEK",
      },
    },
  },
  {
    action_name: "spend time with new people",
    action_id: "x",
    tags: ["social"],
    scheduling: {
      time_minutes: 360,
      recurrence: {
        frequency: 2,
        unit: "WEEK",
      },
    },
  },
  {
    action_name: "something",
    action_id: "w",
  },
];

const GOALS = [
  {
    goal_name: "meet up with two new friends",
    goal_id: "p",
    tags: ["social"],
    scheduling: {
      recurrence: {
        frequency: 1,
        unit: "MONTH",
      },
    },
  },
  {
    goal_name: "arrange a new tune for the quartet",
    goal_id: "q",
    tags: ["quartet"],
    scheduling: {
      recurrence: {
        frequency: 2,
        unit: "WEEK",
      },
    },
  },
];

app.get("/", (req, res) => {
  res.send("Yes, it's up.");
});

app.get("/actions", (req, res) => {
  res.send(ACTIONS);
});

app.get("/goals", (req, res) => {
  res.send(GOALS);
});

app.get("/items", (req, res) => {
  res.send(FAKE_DATA);
});

app.listen(3000, () => {
  console.log("Server is up.");
});
