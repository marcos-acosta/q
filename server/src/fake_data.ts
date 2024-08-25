export const FAKE_DATA = [
  {
    name: "incorporate spend objectives into adp reranking",
    id: "a",
    sub_item_ids: ["b"],
    tags: {
      explicit_tags: ["google", "projects"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P0",
      inherited_priorities: [],
    },
  },
  {
    name: "add spend label into policy layer",
    id: "b",
    parent_item: "a",
    planning: {
      completion_effort: {
        estimated_time_minutes: 120,
      },
    },
    tags: {
      explicit_tags: ["policy layer"],
      inherited_tags: ["google", "projects"],
    },
    priority: {
      inherited_priorities: ["P0"],
    },
  },
  {
    name: "meet with a new googler",
    id: "c",
    planning: {
      completion_effort: {
        estimated_time_minutes: 30,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["google"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P3",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "practice piano",
    id: "d",
    planning: {
      time_effort: {
        duration_minutes: 15 * 60,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["piano", "musicality"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P1",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "learn a new standard",
    id: "e",
    sub_item_ids: ["f", "g"],
    planning: {
      recurrence: {
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["piano", "musicality"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P3",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "run through all scales",
    id: "f",
    parent_item: "e",
    planning: {
      completion_effort: {
        estimated_time_minutes: 45,
      },
    },
    tags: {
      explicit_tags: [],
      inherited_tags: ["piano", "musicality"],
    },
    priority: {
      inherited_priorities: ["P3"],
    },
  },
  {
    name: "transcribe one head of solo",
    id: "g",
    parent_item: "e",
    planning: {
      completion_effort: {
        estimated_time_minutes: 60,
      },
    },
    tags: {
      explicit_tags: [],
      inherited_tags: ["piano", "musicality"],
    },
    priority: {
      inherited_priorities: ["P3"],
    },
  },
  {
    name: "work on quartet arrangements",
    id: "h",
    planning: {
      time_effort: {
        duration_minutes: 15 * 60,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["quartet", "musicality"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P0",
      inherited_priorities: [],
    },
  },
  {
    name: "have new arrangements",
    id: "i",
    planning: {
      completion_effort: {
        frequency: 1,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["quartet", "musicality"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P0",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "sleep 9 hours",
    id: "j",
    planning: {
      completion_effort: {
        frequency: 5,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["wellness"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P2",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "meet up with old friends",
    id: "k",
    planning: {
      completion_effort: {
        frequency: 3,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["social"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P1",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "spend time with new faces",
    id: "l",
    planning: {
      time_effort: {
        duration_minutes: 6 * 60,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["social"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P2",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "hang out with a new friend",
    id: "m",
    planning: {
      completion_effort: {
        frequency: 2,
      },
      recurrence: {
        inverse_frequency: 1,
        unit: "MONTH",
      },
    },
    tags: {
      explicit_tags: ["social"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P2",
      inherited_priorities: [],
    },
    is_goal: true,
  },
  {
    name: "do laundry",
    id: "n",
    planning: {
      completion_effort: {
        estimated_time_minutes: 105,
        frequency: 1,
      },
      recurrence: {
        inverse_frequency: 2,
        unit: "WEEK",
      },
    },
    tags: {
      explicit_tags: ["errands"],
      inherited_tags: [],
    },
    priority: {
      explicit_priority: "P1",
      inherited_priorities: [],
    },
  },
];
