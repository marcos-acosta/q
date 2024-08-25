export interface Recurrence {
  frequency: number;
  unit: "DAY" | "WEEK" | "MONTH";
}

export interface Scheduling {
  days: string;
  time_minutes: number;
  recurrence: Recurrence;
}

export interface Action {
  action_name: string;
  action_id: string;
  tags: string[];
  dependencies: string[];
  scheduling: Scheduling;
}
