import { buildEmbedUrl } from '../utils/urlParser';
import { getSettings } from '../services/storage';

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
}

export default function VideoPlayer({ videoId, autoplay = false }: VideoPlayerProps) {
  const settings = getSettings();

  const params: Record<string, string> = {
    rel: '0',
    modestbranding: '1',
    nocookie: '1',
  };

  if (autoplay) {
    params.autoplay = '1';
  }

  // Education mode: disable related videos and suggestions
  if (settings.educationMode) {
    params.rel = '0';
    params.modestbranding = '1';
  }

  const embedUrl = buildEmbedUrl(videoId, params);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      <iframe
        src={embedUrl}
        title="Video player"
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
      />
    </div>
  );
}
