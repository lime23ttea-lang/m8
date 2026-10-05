import type { HistoryItem, FavoriteItem, BlockedVideo, BlockedChannel, VideoReport } from '../types';

/**
 * Local Storage Service
 * Manages client-side data persistence for V1.
 * Will be replaced by backend API in future versions.
 */

const KEYS = {
  HISTORY: 'vibetube_history',
  FAVORITES: 'vibetube_favorites',
  WATCH_LATER: 'vibetube_watch_later',
  BLOCKLIST: 'vibetube_blocklist',
  BLOCKED_CHANNELS: 'vibetube_blocked_channels',
  REPORTS: 'vibetube_reports',
  SETTINGS: 'vibetube_settings',
  HISTORY_ENABLED: 'vibetube_history_enabled',
};

// History
export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: HistoryItem): void {
  const enabled = localStorage.getItem(KEYS.HISTORY_ENABLED);
  if (enabled === 'false') return;

  const history = getHistory();
  const existing = history.findIndex(h => h.videoId === item.videoId);
  if (existing >= 0) {
    history.splice(existing, 1);
  }
  history.unshift({ ...item, watchedAt: new Date().toISOString() });
  // Keep max 100 items
  if (history.length > 100) history.pop();
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

export function removeFromHistory(videoId: string): void {
  const history = getHistory().filter(h => h.videoId !== videoId);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.setItem(KEYS.HISTORY, JSON.stringify([]));
}

export function isHistoryEnabled(): boolean {
  return localStorage.getItem(KEYS.HISTORY_ENABLED) !== 'false';
}

export function setHistoryEnabled(enabled: boolean): void {
  localStorage.setItem(KEYS.HISTORY_ENABLED, String(enabled));
}

// Favorites
export function getFavorites(): FavoriteItem[] {
  try {
    const data = localStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToFavorites(item: Omit<FavoriteItem, 'addedAt' | 'list'>): void {
  const favorites = getFavorites();
  if (favorites.some(f => f.videoId === item.videoId)) return;
  favorites.unshift({
    ...item,
    list: 'favorites',
    addedAt: new Date().toISOString(),
  });
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
}

export function removeFromFavorites(videoId: string): void {
  const favorites = getFavorites().filter(f => f.videoId !== videoId);
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
}

export function isFavorite(videoId: string): boolean {
  return getFavorites().some(f => f.videoId === videoId);
}

// Watch Later
export function getWatchLater(): FavoriteItem[] {
  try {
    const data = localStorage.getItem(KEYS.WATCH_LATER);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToWatchLater(item: Omit<FavoriteItem, 'addedAt' | 'list'>): void {
  const list = getWatchLater();
  if (list.some(f => f.videoId === item.videoId)) return;
  list.unshift({
    ...item,
    list: 'watch-later',
    addedAt: new Date().toISOString(),
  });
  localStorage.setItem(KEYS.WATCH_LATER, JSON.stringify(list));
}

export function removeFromWatchLater(videoId: string): void {
  const list = getWatchLater().filter(f => f.videoId !== videoId);
  localStorage.setItem(KEYS.WATCH_LATER, JSON.stringify(list));
}

// Blocklist (local)
export function getBlocklist(): BlockedVideo[] {
  try {
    const data = localStorage.getItem(KEYS.BLOCKLIST);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToBlocklist(video: BlockedVideo): void {
  const list = getBlocklist();
  if (list.some(v => v.videoId === video.videoId)) return;
  list.push(video);
  localStorage.setItem(KEYS.BLOCKLIST, JSON.stringify(list));
}

export function isBlocked(videoId: string): boolean {
  return getBlocklist().some(v => v.videoId === videoId && v.status === 'BLOCKED');
}

// Blocked Channels (local)
export function getBlockedChannels(): BlockedChannel[] {
  try {
    const data = localStorage.getItem(KEYS.BLOCKED_CHANNELS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isChannelBlocked(channelId: string): boolean {
  return getBlockedChannels().some(c => c.channelId === channelId && c.status === 'BLOCKED');
}

// Reports (local)
export function getReports(): VideoReport[] {
  try {
    const data = localStorage.getItem(KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addReport(report: VideoReport): void {
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
}

export function getReportCount(videoId: string): number {
  return getReports().filter(r => r.videoId === videoId).length;
}

// Settings
export interface AppSettings {
  educationMode: boolean;
  filterMode: 'SAFE' | 'EDUCATIONAL' | 'GENERAL' | 'STRICT';
  activeServer: string;
}

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      educationMode: false,
      filterMode: 'GENERAL',
      activeServer: 'server-a',
    };
  } catch {
    return {
      educationMode: false,
      filterMode: 'GENERAL',
      activeServer: 'server-a',
    };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}
