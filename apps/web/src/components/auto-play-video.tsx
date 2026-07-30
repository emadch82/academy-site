'use client';

import { useRef, useEffect, useState } from 'react';

export function AutoPlayVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const onCanPlay = () => setReady(true);
    video.addEventListener('canplay', onCanPlay);
    if (video.readyState >= 3) setReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  return (
    <div className={`relative ${className || ''}`}>
      {poster && !ready && (
        <img src={poster} alt="" className="w-full h-full object-cover" />
      )}
      <video
        ref={ref}
        loop
        muted
        playsInline
        preload="metadata"
        className={`w-full h-full object-cover ${ready ? '' : 'absolute inset-0 opacity-0'}`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
