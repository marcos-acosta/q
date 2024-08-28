import { z } from "zod";

export enum PriorityLevel {
  P0 = "P0",
  P1 = "P1",
  P2 = "P2",
  P3 = "P3",
  P4 = "P4",
}

export enum TimeUnit {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

const RecurrenceSchema = z.object({
  frequency: z.number(),
  inverse_frequency: z.number(),
  unit: z.nativeEnum(TimeUnit),
  preferred_days: z.optional(z.string()),
});
export type Recurrence = z.infer<typeof RecurrenceSchema>;

const UrgencySchema = z.object({
  amount: z.number(),
  unit: z.nativeEnum(TimeUnit),
});
export type Urgency = z.infer<typeof UrgencySchema>;
const DEFAULT_URGENCY: Urgency = { unit: TimeUnit.YEAR, amount: 5 };

const PlanningSchema = z.object({
  duration_minutes: z.optional(z.number()),
  estimated_completion_time_minutes: z.optional(z.number()),
  time_priority: z
    .union([RecurrenceSchema, UrgencySchema])
    .default(DEFAULT_URGENCY),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.P4),
});
export type Planning = z.infer<typeof PlanningSchema>;
const DEFAULT_PLANNING: Planning = {
  time_priority: DEFAULT_URGENCY,
  priority: PriorityLevel.P4,
};

const LogSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  message: z.string(),
});
export type Log = z.infer<typeof LogSchema>;

const LinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string(),
});
export type Link = z.infer<typeof LinkSchema>;

const ItemSchema = z.object({
  name: z.string(),
  id: z.string(),
  creation_timestamp: z.number(),
  dependency_ids: z.array(z.string()).default([]),
  dependent_ids: z.array(z.string()).default([]),
  planning: PlanningSchema.default(DEFAULT_PLANNING),
  logs: z.array(LogSchema).default([]),
  links: z.array(LinkSchema).default([]),
  tags: z.array(z.string()).default([]),
  is_goal: z.optional(z.boolean()),
});
export type Item = z.infer<typeof ItemSchema>;

export { ItemSchema };
