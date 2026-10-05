import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertCircle, Loader2, Info } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import VideoCard from '../components/VideoCard';
import FilterSelector from '../components/FilterSelector';
import { searchVideos, isApiConfigured } from '../services/youtube';
import { getSettings, isBlocked, isChannelBlocked } from '../services/storage';
import type { VideoResult } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const settings = getSettings();
      const filters = {
        safeSearch: settings.filterMode === 'STRICT' ? 'strict' as const : settings.filterMode === 'SAFE' ? 'moderate' as const : 'none' as const,
        mode: settings.filterMode,
      };

      const videos = await searchVideos(searchQuery, filters);

      // Apply local blocklist filtering
      const filtered = videos.filter(v => {
        if (isBlocked(v.videoId)) return false;
        if (v.channelId && isChannelBlocked(v.channelId)) return false;
        return true;
      });

      setResults(filtered);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} initialValue={query} />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterSelector />
      </div>

      {/* API Notice */}
      {!isApiConfigured() && query && !loading && (
        <div className="mb-6 p-4 bg-vt-accent/10 border border-vt-accent/20 rounded-xl flex items-start gap-3">
          <Info size={18} className="text-vt-accent-light flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-vt-text font-medium">Search requires YouTube API configuration</p>
            <p className="text-xs text-vt-text-muted mt-1">
              To enable text search, set the <code className="text-vt-accent-light">VITE_YOUTUBE_API_KEY</code> environment variable with a YouTube Data API v3 key.
              In the meantime, you can still watch videos by pasting a YouTube URL in the search bar.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-vt-accent" />
          <span className="ml-2 text-vt-text-muted">Searching...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-vt-danger/10 border border-vt-danger/20 rounded-xl flex items-center gap-3 mb-6">
          <AlertCircle size={18} className="text-vt-danger" />
          <span className="text-sm text-vt-danger">{error}</span>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-xs text-vt-text-muted mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map(video => (
              <VideoCard key={video.videoId} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && query && results.length === 0 && isApiConfigured() && (
        <div className="text-center py-20">
          <Search size={32} className="mx-auto text-vt-text-muted/40 mb-3" />
          <p className="text-vt-text-muted">No results found for "{query}"</p>
        </div>
      )}

      {/* Initial state */}
      {!query && (
        <div className="text-center py-20">
          <Search size={32} className="mx-auto text-vt-text-muted/40 mb-3" />
          <p className="text-vt-text-muted">Enter a search term or paste a YouTube URL</p>
        </div>
      )}
    </div>
  );
}
