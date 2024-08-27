export enum TimeUnit {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export interface CompletionEffort {
  estimated_time_minutes: number;
}

export interface TimeEffort {
  duration_minutes: number;
}

export interface Recurrence {
  frequency: number;
  inverse_frequency: number;
  unit: TimeUnit;
}

export interface Planning {
  effort?: CompletionEffort | TimeEffort;
  recurrence?: Recurrence;
}

export interface Log {
  timestamp: number;
  id: string;
  message: string;
}

export interface Link {
  label: string;
  id: string;
  url: string;
}

export enum PriorityLevel {
  P0 = "P0",
  P1 = "P1",
  P2 = "P2",
  P3 = "P3",
  P4 = "P4",
}

export interface Item {
  name: string;
  id: string;
  dependency_ids: string[];
  dependent_ids: string[];
  planning?: Planning;
  logs: Log[];
  links: Link[];
  tags: string[];
  priority?: PriorityLevel;
  is_goal?: boolean;
}
