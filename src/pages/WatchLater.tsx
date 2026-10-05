import { useState } from 'react';
import { Clock } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { getWatchLater, removeFromWatchLater } from '../services/storage';

export default function WatchLaterPage() {
  const [list, setList] = useState(getWatchLater());

  const handleRemove = (videoId: string) => {
    removeFromWatchLater(videoId);
    setList(getWatchLater());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-vt-text flex items-center gap-2">
          <Clock size={20} className="text-vt-accent-light" />
          Watch Later
        </h1>
        <p className="text-xs text-vt-text-muted mt-1">{list.length} videos</p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20">
          <Clock size={32} className="mx-auto text-vt-text-muted/40 mb-3" />
          <p className="text-vt-text-muted">Watch Later is empty</p>
          <p className="text-xs text-vt-text-muted mt-1">Save videos to watch them later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map(item => (
            <div key={item.videoId} className="relative group">
              <VideoCard
                video={{
                  videoId: item.videoId,
                  title: item.title,
                  channel: item.channel,
                  channelId: '',
                  thumbnail: item.thumbnail,
                }}
              />
              <button
                onClick={() => handleRemove(item.videoId)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-vt-danger/80"
                title="Remove"
              >
                <Clock size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
