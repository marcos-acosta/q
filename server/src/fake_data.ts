export const ITEMS = [
  {
    name: "incorporate spend objectives into adp reranking",
    id: "a",
    creation_timestamp: 1724812240,
    dependency_ids: ["b"],
    tags: ["google", "projects"],
    planning: {
      priority: "P0",
      time_priority: {
        amount: 2,
        unit: "MONTHS",
      },
    },
  },
  {
    name: "add spend label into policy layer",
    id: "b",
    creation_timestamp: 1724812240,
    dependent_ids: ["a"],
    planning: {
      estimated_completion_time_minutes: 120,
    },
    tags: ["policy layer"],
  },
  {
    name: "meet with a new googler",
    id: "c",
    creation_timestamp: 1724812240,
    planning: {
      estimated_completion_time_minutes: 30,
      time_priority: {
        frequency: 1,
        inverse_frequency: 1,
        unit: "WEEK",
      },
      priority: "P3",
    },
    tags: ["google"],
    is_goal: true,
  },
  {
    name: "practice piano",
    id: "d",
    creation_timestamp: 1724812240,
    planning: {
      duration_minutes: 15 * 60,
      time_priority: {
        frequency: 1,
        inverse_frequency: 1,
        unit: "WEEK",
      },
      priority: "P1",
    },
    tags: ["piano", "music"],
    is_goal: true,
  },
  {
    name: "practice new standard",
    id: "e",
    creation_timestamp: 1724812240,
    dependency_ids: ["f", "g"],
    planning: {
      duration_minutes: 60,
      time_priority: {
        frequency: 1,
        inverse_frequency: 1,
        unit: "WEEK",
      },
      priority: "P3",
    },
    tags: ["piano", "music"],
    is_goal: true,
  },
  {
    name: "run through all scales",
    id: "f",
    creation_timestamp: 1724812240,
    dependent_ids: ["e"],
    planning: {
      duration_minutes: 45,
    },
    tags: ["piano", "music"],
  },
  {
    name: "transcribe one head of solo",
    id: "g",
    creation_timestamp: 1724812240,
    dependent_ids: ["e"],
    planning: {
      estimated_completion_time_minutes: 60,
    },
    tags: ["piano", "music"],
  },
  {
    name: "work on quartet arrangements",
    id: "h",
    creation_timestamp: 1724812240,
    planning: {
      duration_minutes: 15 * 60,
      time_priority: {
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
      time_priority: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
      },
      priority: "P0",
    },
    tags: ["quartet", "music"],
    is_goal: true,
  },
  {
    name: "sleep 9 hours",
    id: "j",
    creation_timestamp: 1724812240,
    planning: {
      time_priority: {
        frequency: 5,
        inverse_frequency: 1,
        unit: "WEEK",
      },
      priority: "P2",
    },
    tags: ["wellness"],
    is_goal: true,
  },
  {
    name: "meet up with old friends",
    id: "k",
    creation_timestamp: 1724812240,
    planning: {
      time_priority: {
        frequency: 3,
        inverse_frequency: 2,
        unit: "WEEK",
      },
      priority: "P1",
    },
    tags: ["social"],
    is_goal: true,
  },
  {
    name: "spend time with new faces",
    id: "l",
    creation_timestamp: 1724812240,
    planning: {
      duration_minutes: 6 * 60,
      time_priority: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
      },
      priority: "P2",
    },
    tags: ["social"],
    is_goal: true,
  },
  {
    name: "hang out with a new friend",
    id: "m",
    creation_timestamp: 1724812240,
    planning: {
      time_priority: {
        frequency: 2,
        inverse_frequency: 1,
        unit: "MONTH",
      },
      priority: "P2",
    },
    tags: ["social"],
    is_goal: true,
  },
  {
    name: "do laundry",
    id: "n",
    creation_timestamp: 1724812240,
    planning: {
      estimated_completion_time_minutes: 105,
      time_priority: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
        preferred_days: "su",
      },
      priority: "P1",
    },
    tags: ["errands"],
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
