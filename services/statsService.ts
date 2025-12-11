export type GameType = 'ORDERING' | 'CLINICAL' | 'VISUAL';

interface GameStats {
  history: number[]; // Last 20 attempts
  best: number;
}

const STORAGE_KEYS = {
  ORDERING: 'nm_stats_ordering',
  CLINICAL: 'nm_stats_clinical',
  VISUAL: 'nm_stats_visual'
};

const getStats = (type: GameType): GameStats => {
  const key = STORAGE_KEYS[type];
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  return { history: [], best: 0 };
};

export const saveGameResult = (type: GameType, value: number) => {
  const stats = getStats(type);
  
  // Update History (Keep last 20)
  stats.history.push(value);
  if (stats.history.length > 20) {
    stats.history.shift();
  }

  // Update Best
  // For Ordering, lower is better (time). For others, higher is better (score).
  if (type === 'ORDERING') {
    if (stats.best === 0 || value < stats.best) {
      stats.best = value;
    }
  } else {
    if (value > stats.best) {
      stats.best = value;
    }
  }

  localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(stats));
};

export const getBestScore = (type: GameType): number => {
  return getStats(type).best;
};

export const getHistory = (type: GameType): number[] => {
  return getStats(type).history;
};