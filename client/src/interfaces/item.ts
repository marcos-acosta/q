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
});
export type TimeSpec = z.infer<typeof TimeSpecSchema>;

const QuotaSchema = z.object({
  duration_minutes: z.optional(z.number()),
  times: z.optional(z.number()),
  estimated_time_minutes: z.optional(z.number()),
  effort_type: z.nativeEnum(EffortType),
});
export type Quota = z.infer<typeof QuotaSchema>;
const DEFAULT_QUOTA: Quota = { times: 1, effort_type: EffortType.COMPLETION };

const LogSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  message: z.string(),
});
export type Log = z.infer<typeof LogSchema>;

const DateRangeSchema = z.tuple([z.string().date(), z.string().date()]);
export type DateRange = z.infer<typeof DateRangeSchema>;

const ProgressContributionSchema = z.object({
  timestamp: z.number(),
  contribution_times: z.optional(z.number()),
  contribution_minutes: z.optional(z.number()),
  contribution_type: z.nativeEnum(EffortType),
});
export type ProgressContribution = z.infer<typeof ProgressContributionSchema>;

const LoggedProgressSchema = z.object({
  date_range: DateRangeSchema,
  progress_contributions: z.array(ProgressContributionSchema),
});
export type LoggedProgress = z.infer<typeof LoggedProgressSchema>;

const ProgressSchema = z.object({
  logged_progress: z.array(LoggedProgressSchema),
});
export type Progress = z.infer<typeof ProgressSchema>;
const DEFAULT_PROGRESS: Progress = { logged_progress: [] };

const ItemSchema = z.object({
  name: z.string(),
  _id: z.string(),
  creation_spec: z.string(),
  creation_timestamp: z.number(),
  dependency_ids: z.array(z.string()).default([]),
  dependent_ids: z.array(z.string()).default([]),
  quota: QuotaSchema.default(DEFAULT_QUOTA),
  progress: ProgressSchema.default(DEFAULT_PROGRESS),
  time_spec: z.optional(TimeSpecSchema),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.P4),
  logs: z.array(LogSchema).default([]),
  tags: z.array(z.string()).default([]),
  is_goal: z.boolean().default(false),
  is_archived: z.boolean().default(false),
});
export type Item = z.infer<typeof ItemSchema>;

export { ItemSchema };
