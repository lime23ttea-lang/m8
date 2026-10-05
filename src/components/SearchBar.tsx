import { useState, useRef, useEffect } from 'react';
import { Search, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { extractVideoId } from '../utils/urlParser';

interface SearchBarProps {
  autoFocus?: boolean;
  large?: boolean;
  onSearch?: (query: string) => void;
  initialValue?: string;
}

export default function SearchBar({ autoFocus = false, large = false, onSearch, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [isUrl, setIsUrl] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    // Detect if input looks like a URL or video ID
    const videoId = extractVideoId(value);
    setIsUrl(!!videoId);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    const videoId = extractVideoId(trimmed);
    if (videoId) {
      navigate(`/watch/${videoId}`);
    } else {
      if (onSearch) {
        onSearch(trimmed);
      } else {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center ${large ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}>
        <div className="absolute left-4 text-vt-text-muted">
          {isUrl ? <LinkIcon size={large ? 20 : 16} /> : <Search size={large ? 20 : 16} />}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isUrl ? "YouTube URL detected — press Enter" : "Search videos or paste YouTube URL..."}
          className={`w-full bg-vt-surface-2 border border-vt-border rounded-xl
            text-vt-text placeholder:text-vt-text-muted/60
            focus:outline-none focus:border-vt-accent/50 focus:ring-2 focus:ring-vt-accent/20
            transition-all ${large ? 'pl-12 pr-14 py-4 text-lg' : 'pl-11 pr-12 py-3 text-sm'}`}
        />
        <button
          type="submit"
          className={`absolute right-2 bg-vt-accent hover:bg-vt-accent-light text-white rounded-lg
            flex items-center justify-center transition-colors ${large ? 'p-3' : 'p-2'}`}
        >
          <ArrowRight size={large ? 20 : 16} />
        </button>

        {/* URL detection badge */}
        {isUrl && (
          <div className="absolute -top-8 left-4 px-2 py-0.5 bg-vt-accent/20 text-vt-accent-light text-xs rounded-md animate-fade-in">
            ✓ YouTube URL detected
          </div>
        )}
      </div>
    </form>
  );
}
