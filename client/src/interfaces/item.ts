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

export enum EffortType {
  COMPLETION = "COMPLETION",
  DURATION = "DURATION",
}

const RecurrenceSchema = z.object({
  inverse_frequency: z.number(),
  unit: z.nativeEnum(TimeUnit),
  start_date: z.string().date(),
});
export type Recurrence = z.infer<typeof RecurrenceSchema>;

const UrgencySchema = z.object({
  expected_completion_date: z.optional(z.string().date()),
  hard_deadline: z.optional(z.string().date()),
});
export type Urgency = z.infer<typeof UrgencySchema>;

const TimeSpecSchema = z.object({
  recurrence: z.optional(RecurrenceSchema),
  urgency: z.optional(UrgencySchema),
  estimated_time_effort_minutes: z.optional(z.number()),
  required_time_effort_minutes: z.optional(z.number()),
  required_number_of_completions: z.optional(z.number()),
});
export type TimeSpec = z.infer<typeof TimeSpecSchema>;

const LogSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  message: z.string(),
});
export type Log = z.infer<typeof LogSchema>;

const DateRangeSchema = z.object({
  start_date_inclusive: z.string().date(),
  end_date_exclusive: z.string().date(),
});
export type DateRange = z.infer<typeof DateRangeSchema>;

const ProgressSchema = z.object({
  timestamp: z.number(),
  contribution_times: z.optional(z.number()),
  contribution_minutes: z.optional(z.number()),
});
export type Progress = z.infer<typeof ProgressSchema>;

const ItemSchema = z.object({
  name: z.string(),
  id: z.string(),
  creation_spec: z.string(),
  creation_timestamp: z.number(),
  effort_type: z.nativeEnum(EffortType).default(EffortType.COMPLETION),
  dependency_ids: z.array(z.string()).default([]),
  dependent_ids: z.array(z.string()).default([]),
  progress: z.array(ProgressSchema).default([]),
  time_spec: z.optional(TimeSpecSchema),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.P4),
  logs: z.array(LogSchema).default([]),
  tags: z.array(z.string()).default([]),
  is_goal: z.boolean().default(false),
  is_archived: z.boolean().default(false),
});
export type Item = z.infer<typeof ItemSchema>;

export { ItemSchema };
