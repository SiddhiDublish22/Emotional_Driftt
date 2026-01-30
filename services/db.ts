
import { JournalEntry, User } from '../types';

const STORAGE_KEYS = {
  ENTRIES: 'ed_entries',
  USER: 'ed_user',
  THEME: 'ed_theme',
};

export const dbService = {
  getEntries: (): JournalEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return data ? JSON.parse(data) : [];
  },

  saveEntry: (entry: JournalEntry): void => {
    const entries = dbService.getEntries();
    const updatedEntries = [entry, ...entries];
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updatedEntries));
    dbService.updateStreak();
  },

  getUser: (): User => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) return JSON.parse(data);
    
    const newUser: User = {
      id: 'user-1',
      email: 'demo@example.com',
      name: 'Drift Explorer',
      streak: 0,
    };
    dbService.saveUser(newUser);
    return newUser;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  updateStreak: (): void => {
    const user = dbService.getUser();
    const entries = dbService.getEntries();
    if (entries.length === 0) return;

    const lastEntry = new Date(entries[0].timestamp);
    const today = new Date();
    
    // Simple streak logic
    const diffTime = Math.abs(today.getTime() - lastEntry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
    user.lastEntryDate = entries[0].timestamp;
    dbService.saveUser(user);
  },

  clearData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};
