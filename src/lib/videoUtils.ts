export interface ParsedVideoEmbed {
  type: 'aparat' | 'youtube' | 'direct' | 'embed' | 'invalid';
  embedUrl: string;
}

export function parseVideoEmbedUrl(url: string): ParsedVideoEmbed {
  if (!url || typeof url !== 'string') {
    return { type: 'invalid', embedUrl: '' };
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return { type: 'invalid', embedUrl: '' };
  }

  // Aparat URL patterns
  if (trimmed.includes('aparat.com/video/video/embed/videohash/')) {
    return { type: 'aparat', embedUrl: trimmed };
  }
  const aparatMatch = trimmed.match(/aparat\.com\/v\/([a-zA-Z0-9_-]+)/);
  if (aparatMatch && aparatMatch[1]) {
    const hash = aparatMatch[1];
    return {
      type: 'aparat',
      embedUrl: `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame`
    };
  }

  // YouTube URL patterns
  if (trimmed.includes('youtube.com/embed/')) {
    return { type: 'youtube', embedUrl: trimmed };
  }
  const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}`
    };
  }

  // Direct video file link (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: 'direct', embedUrl: trimmed };
  }

  // Any other valid URL (e.g. Vimeo, custom embed)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return { type: 'embed', embedUrl: trimmed };
  }

  return { type: 'invalid', embedUrl: '' };
}
