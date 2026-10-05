import type { VideoResult, SearchFilters } from '../types';
import { getThumbnailUrl } from '../utils/urlParser';

/**
 * YouTube Search Service
 * 
 * Uses YouTube Data API v3 when API key is configured.
 * Falls back to a demo mode when no key is available.
 * 
 * NOTE: To enable full search, configure YOUTUBE_API_KEY in environment.
 * This service uses the official YouTube Data API v3.
 */

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

function getSafeSearchParam(filters: SearchFilters): string {
  switch (filters.mode) {
    case 'STRICT':
      return 'strict';
    case 'EDUCATIONAL':
      return 'strict';
    case 'SAFE':
      return 'moderate';
    case 'GENERAL':
      return 'none';
    default:
      return filters.safeSearch;
  }
}

/**
 * Search YouTube videos using the official API.
 */
export async function searchVideos(
  query: string,
  filters: SearchFilters,
  maxResults: number = 20
): Promise<VideoResult[]> {
  if (!YOUTUBE_API_KEY) {
    console.info('[VibeTube] YouTube API key not configured. Search requires VITE_YOUTUBE_API_KEY.');
    return [];
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: String(maxResults),
      safeSearch: getSafeSearchParam(filters),
      key: YOUTUBE_API_KEY,
      videoEmbeddable: 'true',
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) return [];

    // Get video details (duration)
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    let durations: Record<string, string> = {};

    try {
      const detailsParams = new URLSearchParams({
        part: 'contentDetails',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      });
      const detailsResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${detailsParams.toString()}`);
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        detailsData.items?.forEach((item: any) => {
          durations[item.id] = formatDuration(item.contentDetails?.duration || '');
        });
      }
    } catch {
      // Duration is optional
    }

    return data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails?.high?.url || getThumbnailUrl(item.id.videoId),
      duration: durations[item.id.videoId] || undefined,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description,
    }));
  } catch (error) {
    console.error('[VibeTube] Search error:', error);
    throw error;
  }
}

/**
 * Get video details by ID.
 */
export async function getVideoDetails(videoId: string): Promise<VideoResult | null> {
  if (!YOUTUBE_API_KEY) {
    return {
      videoId,
      title: 'Video',
      channel: 'Unknown',
      channelId: '',
      thumbnail: getThumbnailUrl(videoId),
    };
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      id: videoId,
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params.toString()}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.items?.length) return null;

    const item = data.items[0];
    return {
      videoId: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails?.high?.url || getThumbnailUrl(videoId),
      duration: formatDuration(item.contentDetails?.duration || ''),
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description,
    };
  } catch {
    return null;
  }
}

/**
 * Format ISO 8601 duration to human readable format.
 */
function formatDuration(iso: string): string {
  if (!iso) return '';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Check if API is configured.
 */
export function isApiConfigured(): boolean {
  return !!YOUTUBE_API_KEY;
}
