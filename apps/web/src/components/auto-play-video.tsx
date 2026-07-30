'use client';

import { useRef, useEffect, useState } from 'react';

export function AutoPlayVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(!!poster);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const tryPlay = () => {
      const rect = video.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('canplay', tryPlay);
    if (video.readyState >= 3) tryPlay();
    window.addEventListener('scroll', tryPlay, { passive: true });
    return () => window.removeEventListener('scroll', tryPlay);
  }, []);

  return (
    <div className={className} style={{ width: '100%', overflow: 'hidden', borderRadius: '1rem', position: 'relative' }}>
      <video
        ref={ref}
        loop
        muted
        autoPlay
        playsInline
        preload="auto"
        onCanPlay={() => setShowPoster(false)}
        style={{ width: '100%', display: 'block', aspectRatio: '16 / 9', objectFit: 'cover' }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {showPoster && poster && (
        <img
          src={poster}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}
