export interface VideoResult {
  videoId: string;
  title: string;
  channel: string;
  channelId: string;
  thumbnail: string;
  duration?: string;
  publishedAt?: string;
  description?: string;
}

export interface SearchFilters {
  safeSearch: 'strict' | 'moderate' | 'none';
  mode: 'SAFE' | 'EDUCATIONAL' | 'GENERAL' | 'STRICT';
}

export interface VideoReport {
  videoId: string;
  reason: string;
  reportedBy?: string;
  createdAt: string;
  status: 'REPORTED' | 'UNDER_REVIEW' | 'APPROVED' | 'BLOCKED';
}

export interface BlockedVideo {
  videoId: string;
  reason: string;
  reportedBy?: string;
  status: 'NORMAL' | 'FLAGGED' | 'UNDER_REVIEW' | 'BLOCKED';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface BlockedChannel {
  channelId: string;
  reason: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  reviewedAt?: string;
}

export interface HistoryItem {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  watchedAt: string;
  progress?: number;
}

export interface FavoriteItem {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  addedAt: string;
  list: 'favorites' | 'watch-later';
}

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export interface ServerStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  latency?: number;
}
