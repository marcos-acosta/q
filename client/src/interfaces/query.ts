import { z } from "zod";

export enum BooleanItemField {
  RECURRING,
  DURATION_BASED,
  ARCHIVED,
  COMPLETED,
}

export enum QuantifiableItemField {
  DUE_DATE,
  CREATION_DATE,
  PRIORITY,
}

export enum Comparator {
  LEQ,
  LT,
  EQ,
  GT,
  GTEQ,
}

const BooleanMatcherSchema = z.object({
  field: z.nativeEnum(BooleanItemField),
  negated: z.boolean().default(false),
});
export type BooleanMatcher = z.infer<typeof BooleanMatcherSchema>;

const QuantifierMatcherSchema = z.object({
  field: z.nativeEnum(QuantifiableItemField),
  comparison_value: z.union([z.string(), z.number()]),
  comparator: z.nativeEnum(Comparator),
});
export type QuantifierMatcher = z.infer<typeof QuantifierMatcherSchema>;

const KeywordMatcherSchema = z.object({
  keyword: z.string(),
  negated: z.boolean().default(false),
});
export type KeywordMatcher = z.infer<typeof KeywordMatcherSchema>;

export const QuerySchema = z.object({
  keywords: z.array(KeywordMatcherSchema).default([]),
  boolean_matchers: z.array(BooleanMatcherSchema).default([]),
  quantifier_matchers: z.array(QuantifierMatcherSchema).default([]),
  tag_matchers: z.array(KeywordMatcherSchema).default([]),
});
export type Query = z.infer<typeof QuerySchema>;

export const NamedQuerySchema = z.object({
  query: QuerySchema,
  query_name: z.string(),
  id: z.string(),
  creation_timestamp: z.number(),
});
export type NamedQuery = z.infer<typeof NamedQuerySchema>;
