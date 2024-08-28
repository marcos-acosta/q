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

const TimeEffortSchema = z.object({
  duration_minutes: z.number(),
});
export type TimeEffort = z.infer<typeof TimeEffortSchema>;

const CompletionEffortSchema = z.object({
  estimated_time_minutes: z.number(),
});
export type CompletionEffort = z.infer<typeof CompletionEffortSchema>;

const RecurrenceSchema = z.object({
  frequency: z.number(),
  inverse_frequency: z.number(),
  unit: z.nativeEnum(TimeUnit),
});
export type Recurrence = z.infer<typeof RecurrenceSchema>;

const PlanningSchema = z.object({
  effort: z.optional(z.union([TimeEffortSchema, CompletionEffortSchema])),
  recurrence: z.optional(RecurrenceSchema),
});
export type Planning = z.infer<typeof PlanningSchema>;

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
  planning: z.optional(PlanningSchema),
  logs: z.array(LogSchema).default([]),
  links: z.array(LinkSchema).default([]),
  tags: z.array(z.string()).default([]),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.P4),
  is_goal: z.optional(z.boolean()),
});
export type Item = z.infer<typeof ItemSchema>;

export { ItemSchema };
