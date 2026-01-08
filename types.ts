
export type FocusStatus = 'pending' | 'completed';

export interface FocusHistoryItem {
  id: string; // Unique identifier
  date: string; // YYYY-MM-DD
  goal: string;
  status: FocusStatus;
  completedAt?: number;
  totalSeconds?: number;
  remainingSeconds?: number;
}

export interface GoalData {
  id: string;
  goal: string;
  durationMinutes: number;
  startTime: number;
}
