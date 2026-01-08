
import { FocusHistoryItem, FocusStatus } from '../types';

const STORAGE_KEY = 'focus_history';

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const getFocusHistory = (): FocusHistoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFocusHistory = (history: FocusHistoryItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getSessionById = (id: string): FocusHistoryItem | undefined => {
  const history = getFocusHistory();
  return history.find(item => item.id === id);
};

export const addFocusSession = (goal: string): string => {
  const history = getFocusHistory();
  const today = getTodayDateString();
  const newId = generateId();

  history.push({
    id: newId,
    date: today,
    goal,
    status: 'pending'
  });
  
  saveFocusHistory(history);
  return newId;
};

export const updateSessionGoal = (id: string, newGoal: string) => {
  const history = getFocusHistory();
  const index = history.findIndex(item => item.id === id);

  if (index > -1) {
    history[index].goal = newGoal;
    saveFocusHistory(history);
    localStorage.setItem('daily_focus_goal', newGoal);
  }
};

export const markSessionCompleted = (id: string, remainingSeconds: number, totalSeconds: number) => {
  const history = getFocusHistory();
  const index = history.findIndex(item => item.id === id);

  if (index > -1) {
    history[index].status = 'completed';
    history[index].completedAt = Date.now();
    history[index].remainingSeconds = remainingSeconds;
    history[index].totalSeconds = totalSeconds;
    saveFocusHistory(history);
  }
};
