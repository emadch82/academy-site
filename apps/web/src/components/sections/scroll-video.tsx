'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      video.currentTime = 0;
      setVideoDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    return () => video.removeEventListener('loadedmetadata', handleLoaded);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || videoDuration === 0) return;
    video.currentTime = latest * videoDuration;
  });

  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [1, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.95, 1, 1, 0.95]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 0.3, 0.3, 0.7]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.1], ["1rem", "0rem"]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "300vh" }}>
      {/* Sticky Video Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale, opacity }} className="w-full h-full relative">
          {/* Video */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ borderRadius: "inherit" }}
          >
            <source src="/motion/VIRA_language_institute_animation_1080p_202607281703_gwr_video_mvp.mp4" type="video/mp4" />
          </video>

          {/* Gradient Overlay */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70 pointer-events-none"
          />

          {/* Text Overlay */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="text-center px-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
              >
                آموزشگاه زبان
                <br />
                <span className="bg-gradient-to-l from-primary via-blue-400 to-secondary bg-clip-text text-transparent drop-shadow-none">
                  ویرا
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 max-w-xl mx-auto drop-shadow-lg"
              >
                با اسکرول کردن، انیمیشن موشن ما رو تماشا کنید
              </motion.p>

              {/* Scroll hint */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-8"
              >
                <div className="w-8 h-12 rounded-full border-2 border-white/40 flex justify-center pt-2 mx-auto">
                  <div className="w-1 h-3 rounded-full bg-white/70 animate-bounce" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full bg-gradient-to-r from-primary to-secondary origin-left"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
