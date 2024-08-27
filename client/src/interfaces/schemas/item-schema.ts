import { Item, PriorityLevel, TimeUnit } from "../definitions/item";
import { z, ZodType } from "zod";

const TimeEffort = z.object({
  duration_minutes: z.number(),
});

const CompletionEffort = z.object({
  estimated_time_minutes: z.number(),
});

const Recurrence = z.object({
  frequency: z.number(),
  inverse_frequency: z.number(),
  unit: z.nativeEnum(TimeUnit),
});

const Planning = z.object({
  effort: z.optional(z.union([TimeEffort, CompletionEffort])),
  recurrence: z.optional(Recurrence),
});

const Log = z.object({
  id: z.string(),
  timestamp: z.number(),
  message: z.string(),
});

const Link = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string(),
});

const ItemSchema = z.object({
  name: z.string(),
  id: z.string(),
  dependency_ids: z.array(z.string()),
  dependent_ids: z.array(z.string()),
  planning: z.optional(Planning),
  logs: z.array(Log),
  links: z.array(Link),
  tags: z.array(z.string()),
  priority: z.optional(z.nativeEnum(PriorityLevel)),
  is_goal: z.optional(z.boolean()),
}) satisfies ZodType<Item>;

export { ItemSchema };
