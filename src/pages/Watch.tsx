import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flag, Heart, Clock, AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import ReportModal from '../components/ReportModal';
import { isValidVideoId } from '../utils/urlParser';
import { getVideoDetails } from '../services/youtube';
import { addToHistory, addToFavorites, removeFromFavorites, isFavorite, addToWatchLater, removeFromWatchLater, getWatchLater, isBlocked, getBlocklist } from '../services/storage';
import type { VideoResult } from '../types';

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoResult | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [inWatchLater, setInWatchLater] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    if (!videoId || !isValidVideoId(videoId)) {
      navigate('/');
      return;
    }

    // Check blocklist
    if (isBlocked(videoId)) {
      setBlocked(true);
      const blocklist = getBlocklist();
      const entry = blocklist.find(v => v.videoId === videoId);
      setBlockReason(entry?.reason || 'Content not available');
      return;
    }

    // Load video details
    loadVideo(videoId);

    // Check favorites/watch later
    setIsFav(isFavorite(videoId));
    setInWatchLater(getWatchLater().some(w => w.videoId === videoId));
  }, [videoId]);

  const loadVideo = async (id: string) => {
    const details = await getVideoDetails(id);
    if (details) {
      setVideo(details);
      // Add to history
      addToHistory({
        videoId: details.videoId,
        title: details.title,
        thumbnail: details.thumbnail,
        channel: details.channel,
        watchedAt: new Date().toISOString(),
      });
    } else {
      // Fallback: create minimal video data for embed
      setVideo({
        videoId: id,
        title: 'Video',
        channel: 'Unknown',
        channelId: '',
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      });
      addToHistory({
        videoId: id,
        title: 'Video',
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        channel: 'Unknown',
        watchedAt: new Date().toISOString(),
      });
    }
  };

  const toggleFavorite = () => {
    if (!videoId || !video) return;
    if (isFav) {
      removeFromFavorites(videoId);
      setIsFav(false);
    } else {
      addToFavorites({
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channel: video.channel,
      });
      setIsFav(true);
    }
  };

  const toggleWatchLater = () => {
    if (!videoId || !video) return;
    if (inWatchLater) {
      removeFromWatchLater(videoId);
      setInWatchLater(false);
    } else {
      addToWatchLater({
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channel: video.channel,
      });
      setInWatchLater(true);
    }
  };

  // Blocked content screen
  if (blocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-vt-danger/15 flex items-center justify-center mx-auto mb-4">
          <Shield size={28} className="text-vt-danger" />
        </div>
        <h2 className="text-xl font-semibold text-vt-text mb-2">Content Unavailable</h2>
        <p className="text-vt-text-muted text-sm mb-2">
          This content is not available on this platform.
        </p>
        {blockReason && (
          <p className="text-xs text-vt-text-muted/70 mb-6">
            Reason: {blockReason}
          </p>
        )}
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-vt-surface-2 hover:bg-vt-border rounded-lg text-sm text-vt-text transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!videoId) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Player */}
      <div className="animate-fade-in">
        <VideoPlayer videoId={videoId} />
      </div>

      {/* Video Info */}
      <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-lg sm:text-xl font-semibold text-vt-text leading-tight">
          {video?.title || 'Loading...'}
        </h1>

        <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
          {/* Channel */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vt-surface-2 flex items-center justify-center text-xs text-vt-text-muted font-medium">
              {video?.channel?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-vt-text">{video?.channel}</p>
              {video?.publishedAt && (
                <p className="text-xs text-vt-text-muted">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFav ? 'bg-vt-accent/15 text-vt-accent-light' : 'bg-vt-surface-2 text-vt-text-muted hover:text-vt-text'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={toggleWatchLater}
              className={`p-2 rounded-lg transition-colors ${
                inWatchLater ? 'bg-vt-accent/15 text-vt-accent-light' : 'bg-vt-surface-2 text-vt-text-muted hover:text-vt-text'
              }`}
              title={inWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}
            >
              <Clock size={16} />
            </button>
            <button
              onClick={() => setShowReport(true)}
              className="p-2 rounded-lg bg-vt-surface-2 text-vt-text-muted hover:text-vt-danger transition-colors"
              title="Report video"
            >
              <Flag size={16} />
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-vt-surface-2 text-vt-text-muted hover:text-vt-text transition-colors"
              title="Open on YouTube"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Description */}
        {video?.description && (
          <div className="mt-4 p-3 bg-vt-surface rounded-xl border border-vt-border">
            <p className="text-sm text-vt-text-muted whitespace-pre-wrap line-clamp-4">
              {video.description}
            </p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReport && videoId && (
        <ReportModal videoId={videoId} onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}
