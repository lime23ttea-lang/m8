import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import type { VideoResult } from '../types';

interface VideoCardProps {
  video: VideoResult;
  layout?: 'grid' | 'list';
}

export default function VideoCard({ video, layout = 'grid' }: VideoCardProps) {
  if (layout === 'list') {
    return (
      <Link
        to={`/watch/${video.videoId}`}
        className="flex gap-3 p-3 rounded-xl hover:bg-vt-surface-2 transition-colors group"
      >
        <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-vt-surface-2">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {video.duration && (
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
              {video.duration}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h3 className="text-sm font-medium text-vt-text line-clamp-2 group-hover:text-vt-accent-light transition-colors">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-vt-text-muted flex items-center gap-1">
            <User size={11} />
            {video.channel}
          </p>
          {video.publishedAt && (
            <p className="mt-0.5 text-xs text-vt-text-muted/70">
              {new Date(video.publishedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/watch/${video.videoId}`}
      className="group rounded-xl overflow-hidden hover:bg-vt-surface-2 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-vt-surface-2">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs font-medium rounded flex items-center gap-1">
            <Clock size={10} />
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-2.5 px-1">
        <h3 className="text-sm font-medium text-vt-text line-clamp-2 group-hover:text-vt-accent-light transition-colors leading-snug">
          {video.title}
        </h3>
        <p className="mt-1.5 text-xs text-vt-text-muted flex items-center gap-1">
          <User size={11} />
          {video.channel}
        </p>
        {video.publishedAt && (
          <p className="mt-0.5 text-xs text-vt-text-muted/60">
            {new Date(video.publishedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
}
