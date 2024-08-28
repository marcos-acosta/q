export const ITEMS = [
  {
    name: "incorporate spend objectives into adp reranking",
    id: "a",
    creation_timestamp: 1724812240,
    dependency_ids: ["b"],
    tags: ["google", "projects"],
    priority: "P0",
  },
  {
    name: "add spend label into policy layer",
    id: "b",
    creation_timestamp: 1724812240,
    dependent_ids: ["a"],
    planning: {
      effort: {
        estimated_time_minutes: 120,
      },
    },
    tags: ["policy layer"],
  },
  {
    name: "meet with a new googler",
    id: "c",
    creation_timestamp: 1724812240,
    planning: {
      effort: {
        estimated_time_minutes: 30,
      },
      recurrence: {
        frequency: 1,
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: ["google"],
    priority: "P3",
    is_goal: true,
  },
  {
    name: "practice piano",
    id: "d",
    creation_timestamp: 1724812240,
    planning: {
      effort: {
        duration_minutes: 15 * 60,
      },
      recurrence: {
        frequency: 1,
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: ["piano", "music"],
    priority: "P1",
    is_goal: true,
  },
  {
    name: "practice new standard",
    id: "e",
    creation_timestamp: 1724812240,
    dependency_ids: ["f", "g"],
    planning: {
      effort: {
        duration_minutes: 60,
      },
      recurrence: {
        frequency: 1,
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: ["piano", "music"],
    priority: "P3",
    is_goal: true,
  },
  {
    name: "run through all scales",
    id: "f",
    creation_timestamp: 1724812240,
    dependent_ids: ["e"],
    planning: {
      effort: {
        estimated_time_minutes: 45,
      },
    },
    tags: ["piano", "music"],
  },
  {
    name: "transcribe one head of solo",
    id: "g",
    creation_timestamp: 1724812240,
    dependent_ids: ["e"],
    planning: {
      effort: {
        estimated_time_minutes: 60,
      },
    },
    tags: ["piano", "music"],
  },
  {
    name: "work on quartet arrangements",
    id: "h",
    creation_timestamp: 1724812240,
    planning: {
      effort: {
        duration_minutes: 15 * 60,
      },
      recurrence: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: ["quartet", "music"],
  },
  {
    name: "have new arrangements",
    id: "i",
    creation_timestamp: 1724812240,
    planning: {
      recurrence: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: ["quartet", "music"],
    priority: "P0",
    is_goal: true,
  },
  {
    name: "sleep 9 hours",
    id: "j",
    creation_timestamp: 1724812240,
    planning: {
      recurrence: {
        frequency: 5,
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: ["wellness"],
    priority: "P2",
    is_goal: true,
  },
  {
    name: "meet up with old friends",
    id: "k",
    creation_timestamp: 1724812240,
    planning: {
      recurrence: {
        frequency: 3,
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: ["social"],
    priority: "P1",
    is_goal: true,
  },
  {
    name: "spend time with new faces",
    id: "l",
    creation_timestamp: 1724812240,
    planning: {
      effort: {
        duration_minutes: 6 * 60,
      },
      recurrence: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: ["social"],
    priority: "P2",
    is_goal: true,
  },
  {
    name: "hang out with a new friend",
    id: "m",
    creation_timestamp: 1724812240,
    planning: {
      recurrence: {
        frequency: 2,
        inverse_frequency: 1,
        unit: "MONTH",
      },
    },
    tags: ["social"],
    priority: "P2",
    is_goal: true,
  },
  {
    name: "do laundry",
    id: "n",
    creation_timestamp: 1724812240,
    planning: {
      effort: {
        estimated_time_minutes: 105,
      },
      recurrence: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: ["errands"],
    priority: "P1",
  },
];

export const GOAL_LOGS = {
  j: [
    { date: new Date(2024, 7, 22), amount: { count: 1 } },
    { date: new Date(2024, 7, 23), amount: { count: 1 } },
  ],
  l: [
    { date: new Date(2024, 7, 20), amount: { duration_minutes: 60 } },
    { date: new Date(2024, 7, 23), amount: { duration_minutes: 30 } },
  ],
};
