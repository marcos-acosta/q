export enum TimeUnit {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export interface CompletionEffort {
  estimated_time_minutes?: number;
  frequency?: number;
}

export interface TimeEffort {
  duration_minutes: number;
}

export interface Recurrence {
  inverse_frequency: number;
  unit: TimeUnit;
}

export interface Planning {
  completion_effort?: CompletionEffort;
  time_effort?: TimeEffort;
  recurrence?: Recurrence;
}

export interface Log {
  date: Date;
  message: string;
}

export interface Link {
  label: string;
  url: string;
}

export enum PriorityLevel {
  P0,
  P1,
  P2,
  P3,
  P4,
}

export interface Item {
  name: string;
  id: string;
  dependency_ids: string[];
  dependent_id?: string;
  planning?: Planning;
  logs: Log[];
  links: Link[];
  tags: string[];
  priority?: PriorityLevel;
  is_goal?: boolean;
  is_completed?: boolean;
}
