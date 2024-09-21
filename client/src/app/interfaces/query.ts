import { z } from "zod";
import { TimeUnit } from "./item";

export enum BooleanItemField {
  RECURRING = "RECURRING",
  DURATION_BASED = "DURATION_BASED",
  ARCHIVED = "ARCHIVED",
  COMPLETED = "COMPLETED",
}

export enum QuantifiableItemField {
  PRIORITY = "PRIORITY",
}

export enum DateField {
  DUE_DATE = "DUE_DATE",
  CREATION_DATE = "CREATION_DATE",
}

export enum Comparator {
  LTEQ = "LTEQ",
  LT = "LT",
  EQ = "EQ",
  GT = "GT",
  GTEQ = "GTEQ",
}

const BooleanMatcherSchema = z.object({
  field: z.nativeEnum(BooleanItemField),
  negated: z.boolean().default(false),
});
export type BooleanMatcher = z.infer<typeof BooleanMatcherSchema>;

const comparableTypeSchema = z.union([z.string(), z.number(), z.date()]);
export type QueryComparableType = z.infer<typeof comparableTypeSchema>;

export const QuantifierMatcherSchema = z.object({
  field: z.nativeEnum(QuantifiableItemField),
  comparison_value: comparableTypeSchema,
  comparator: z.nativeEnum(Comparator),
});
export type QuantifierMatcher = z.infer<typeof QuantifierMatcherSchema>;

const KeywordMatcherSchema = z.object({
  keyword: z.string(),
  negated: z.boolean().default(false),
});
export type KeywordMatcher = z.infer<typeof KeywordMatcherSchema>;

const TimeRangeSchema = z.object({
  amount: z.number(),
  unit: z.nativeEnum(TimeUnit),
});
export type TimeRange = z.infer<typeof TimeRangeSchema>;

const DateMatcherSchema = z.object({
  time_range: z.optional(TimeRangeSchema),
  date: z.optional(z.coerce.date()),
  comparator: z.nativeEnum(Comparator),
  field: z.nativeEnum(DateField),
});
export type DateMatcher = z.infer<typeof DateMatcherSchema>;

export const QuerySchema = z.object({
  keywords: z.array(KeywordMatcherSchema).default([]),
  boolean_matchers: z.array(BooleanMatcherSchema).default([]),
  quantifier_matchers: z.array(QuantifierMatcherSchema).default([]),
  tag_matchers: z.array(KeywordMatcherSchema).default([]),
  date_matchers: z.array(DateMatcherSchema).default([]),
});
export type Query = z.infer<typeof QuerySchema>;

export const NamedQuerySchema = z.object({
  query: QuerySchema,
  query_name: z.string(),
  creation_spec: z.string(),
  id: z.string(),
  creation_timestamp: z.number(),
});
export type NamedQuery = z.infer<typeof NamedQuerySchema>;
