export const ITEMS = [
  {
    name: "incorporate spend objectives into adp reranking",
    id: "a",
    dependency_ids: ["b"],
    tags: ["google", "projects"],
    priority: "P0",
  },
  {
    name: "add spend label into policy layer",
    id: "b",
    dependent_id: "a",
    dependency_ids: [],
    planning: {
      completion_effort: {
        estimated_time_minutes: 120,
      },
    },
    tags: ["policy layer"],
  },
  {
    name: "meet with a new googler",
    id: "c",
    dependency_ids: [],
    planning: {
      completion_effort: {
        estimated_time_minutes: 30,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: 1, // WEEK
      },
    },
    tags: ["google"],
    priority: "P3",
    is_goal: true,
  },
  {
    name: "practice piano",
    id: "d",
    dependency_ids: [],
    planning: {
      time_effort: {
        duration_minutes: 15 * 60,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: 1, // WEEK
      },
    },
    tags: ["piano", "music"],
    priority: "P1",
    is_goal: true,
  },
  {
    name: "practice new standard",
    id: "e",
    dependency_ids: ["f", "g"],
    planning: {
      time_effort: {
        duration_minutes: 60,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: 1, // WEEK
      },
    },
    tags: ["piano", "music"],
    priority: "P3",
    is_goal: true,
  },
  {
    name: "run through all scales",
    id: "f",
    dependent_id: "e",
    dependency_ids: [],
    planning: {
      completion_effort: {
        estimated_time_minutes: 45,
      },
    },
    tags: ["piano", "music"],
    is_completed: true,
  },
  {
    name: "transcribe one head of solo",
    id: "g",
    dependent_id: "e",
    dependency_ids: [],
    planning: {
      completion_effort: {
        estimated_time_minutes: 60,
      },
    },
    tags: ["piano", "music"],
    is_completed: true,
  },
  {
    name: "work on quartet arrangements",
    id: "h",
    dependency_ids: [],
    planning: {
      time_effort: {
        duration_minutes: 15 * 60,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: 1, // WEEK
      },
    },
    tags: ["quartet", "music"],
    priority: "P0",
  },
  {
    name: "have new arrangements",
    id: "i",
    dependency_ids: [],
    planning: {
      completion_effort: {
        frequency: 1,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: 1, // WEEK
      },
    },
    tags: ["quartet", "music"],
    priority: "P0",
    is_goal: true,
  },
  {
    name: "sleep 9 hours",
    id: "j",
    dependency_ids: [],
    planning: {
      completion_effort: {
        frequency: 5,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: 1, // WEEK
      },
    },
    tags: ["wellness"],
    priority: "P2",
    is_goal: true,
  },
  {
    name: "meet up with old friends",
    id: "k",
    dependency_ids: [],
    planning: {
      completion_effort: {
        frequency: 3,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: 1, // WEEK
      },
    },
    tags: ["social"],
    priority: "P1",
    is_goal: true,
  },
  {
    name: "spend time with new faces",
    id: "l",
    dependency_ids: [],
    planning: {
      time_effort: {
        duration_minutes: 6 * 60,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: 1, // WEEK
      },
    },
    tags: ["social"],
    priority: "P2",
    is_goal: true,
  },
  {
    name: "hang out with a new friend",
    id: "m",
    dependency_ids: [],
    planning: {
      completion_effort: {
        frequency: 2,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: 2, // MONTH
      },
    },
    tags: ["social"],
    priority: "P2",
    is_goal: true,
  },
  {
    name: "do laundry",
    id: "n",
    dependency_ids: [],
    planning: {
      completion_effort: {
        estimated_time_minutes: 105,
        frequency: 1,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: 1, // WEEK
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
