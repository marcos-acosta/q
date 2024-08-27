export const ITEMS = [
  {
    name: "incorporate spend objectives into adp reranking",
    id: "a",
    dependency_ids: ["b"],
    dependent_ids: [],
    tags: ["google", "projects"],
    priority: "P0",
    logs: [],
    links: [],
  },
  {
    name: "add spend label into policy layer",
    id: "b",
    dependent_ids: ["a"],
    dependency_ids: [],
    planning: {
      effort: {
        estimated_time_minutes: 120,
      },
    },
    tags: ["policy layer"],
    priority: "P4",
    logs: [],
    links: [],
  },
  {
    name: "meet with a new googler",
    id: "c",
    dependency_ids: [],
    dependent_ids: [],
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
    logs: [],
    links: [],
  },
  {
    name: "practice piano",
    id: "d",
    dependency_ids: [],
    dependent_ids: [],
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
    logs: [],
    links: [],
  },
  {
    name: "practice new standard",
    id: "e",
    dependency_ids: ["f", "g"],
    dependent_ids: [],
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
    logs: [],
    links: [],
  },
  {
    name: "run through all scales",
    id: "f",
    dependency_ids: [],
    dependent_ids: ["e"],
    planning: {
      effort: {
        estimated_time_minutes: 45,
      },
    },
    tags: ["piano", "music"],
    logs: [],
    links: [],
  },
  {
    name: "transcribe one head of solo",
    id: "g",
    dependency_ids: [],
    dependent_ids: ["e"],
    planning: {
      effort: {
        estimated_time_minutes: 60,
      },
    },
    tags: ["piano", "music"],
    logs: [],
    links: [],
  },
  {
    name: "work on quartet arrangements",
    id: "h",
    dependency_ids: [],
    dependent_ids: [],
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
    logs: [],
    links: [],
  },
  {
    name: "have new arrangements",
    id: "i",
    dependency_ids: [],
    dependent_ids: [],
    planning: {
      recurrence: {
        frequency: 1,
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: ["quartet", "music"],
    priority: "P0",
    logs: [],
    links: [],
    is_goal: true,
  },
  {
    name: "sleep 9 hours",
    id: "j",
    dependency_ids: [],
    dependent_ids: [],
    planning: {
      recurrence: {
        frequency: 5,
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: ["wellness"],
    priority: "P2",
    logs: [],
    links: [],
    is_goal: true,
  },
  {
    name: "meet up with old friends",
    id: "k",
    dependency_ids: [],
    dependent_ids: [],
    planning: {
      recurrence: {
        frequency: 3,
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: ["social"],
    priority: "P1",
    logs: [],
    links: [],
    is_goal: true,
  },
  {
    name: "spend time with new faces",
    id: "l",
    dependency_ids: [],
    dependent_ids: [],
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
    logs: [],
    links: [],
    is_goal: true,
  },
  {
    name: "hang out with a new friend",
    id: "m",
    dependency_ids: [],
    dependent_ids: [],
    planning: {
      recurrence: {
        frequency: 2,
        inverse_frequency: 1,
        unit: "MONTH",
      },
    },
    tags: ["social"],
    priority: "P2",
    logs: [],
    links: [],
    is_goal: true,
  },
  {
    name: "do laundry",
    id: "n",
    dependency_ids: [],
    dependent_ids: [],
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
    logs: [],
    links: [],
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
