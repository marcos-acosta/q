export interface GoalAmount {
  quantity?: number;
  duration_minutes?: number;
}

export interface GoalLog {
  item_id: string;
  date: Date;
  amount: GoalAmount;
}
