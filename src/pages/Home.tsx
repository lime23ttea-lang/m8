import SearchBar from '../components/SearchBar';
import FilterSelector from '../components/FilterSelector';
import { Zap, Shield, Eye, GraduationCap } from 'lucide-react';
import { getHistory } from '../services/storage';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';

export default function Home() {
  const history = getHistory().slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-16">
      {/* Hero */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-vt-accent/10 text-vt-accent-light rounded-full text-xs font-medium mb-6">
          <Zap size={12} />
          Clean Video Experience
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-vt-text mb-4 tracking-tight">
          Watch videos.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vt-accent to-vt-accent-light">
            Nothing else.
          </span>
        </h1>
        <p className="text-vt-text-muted text-sm sm:text-base max-w-lg mx-auto">
          A distraction-free video viewer. No ads, no recommendations, no noise.
          Just the content you want to see.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <SearchBar autoFocus large />
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <FilterSelector />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="p-4 bg-vt-surface rounded-xl border border-vt-border">
          <Shield size={20} className="text-vt-accent-light mb-2" />
          <h3 className="text-sm font-medium text-vt-text">Safe Filtering</h3>
          <p className="text-xs text-vt-text-muted mt-1">Multiple safety levels to control what you see.</p>
        </div>
        <div className="p-4 bg-vt-surface rounded-xl border border-vt-border">
          <Eye size={20} className="text-vt-accent-light mb-2" />
          <Eye size={20} className="text-vt-accent-light mb-2 hidden" />
          <h3 className="text-sm font-medium text-vt-text">Zero Distractions</h3>
          <p className="text-xs text-vt-text-muted mt-1">No comments, no sidebars, no infinite feeds.</p>
        </div>
        <div className="p-4 bg-vt-surface rounded-xl border border-vt-border">
          <GraduationCap size={20} className="text-vt-accent-light mb-2" />
          <h3 className="text-sm font-medium text-vt-text">Education Mode</h3>
          <p className="text-xs text-vt-text-muted mt-1">Extra-strict filtering for learning environments.</p>
        </div>
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-vt-text-muted">Recently Watched</h2>
            <Link to="/history" className="text-xs text-vt-accent-light hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {history.map(item => (
              <VideoCard
                key={item.videoId}
                video={{
                  videoId: item.videoId,
                  title: item.title,
                  channel: item.channel,
                  channelId: '',
                  thumbnail: item.thumbnail,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
