import { useState } from 'react';
import { History as HistoryIcon, Trash2, AlertCircle } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { getHistory, removeFromHistory, clearHistory, isHistoryEnabled } from '../services/storage';

export default function HistoryPage() {
  const [history, setHistory] = useState(getHistory());
  const enabled = isHistoryEnabled();

  const handleRemove = (videoId: string) => {
    removeFromHistory(videoId);
    setHistory(getHistory());
  };

  const handleClear = () => {
    if (confirm('Clear all watch history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  if (!enabled) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <HistoryIcon size={32} className="mx-auto text-vt-text-muted/40 mb-3" />
        <h2 className="text-lg font-semibold text-vt-text mb-2">History Disabled</h2>
        <p className="text-sm text-vt-text-muted">
          Watch history is currently turned off. Enable it in Settings.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-vt-text flex items-center gap-2">
            <HistoryIcon size={20} className="text-vt-accent-light" />
            Watch History
          </h1>
          <p className="text-xs text-vt-text-muted mt-1">{history.length} videos</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 bg-vt-danger/10 text-vt-danger hover:bg-vt-danger/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={12} />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <HistoryIcon size={32} className="mx-auto text-vt-text-muted/40 mb-3" />
          <p className="text-vt-text-muted">No watch history yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {history.map(item => (
            <div key={item.videoId} className="flex items-center gap-2 group">
              <div className="flex-1">
                <VideoCard
                  video={{
                    videoId: item.videoId,
                    title: item.title,
                    channel: item.channel,
                    channelId: '',
                    thumbnail: item.thumbnail,
                  }}
                  layout="list"
                />
              </div>
              <button
                onClick={() => handleRemove(item.videoId)}
                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-vt-surface-2 rounded-lg transition-all"
                title="Remove from history"
              >
                <Trash2 size={14} className="text-vt-text-muted" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
