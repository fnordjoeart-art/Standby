import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface VideoBackgroundProps {
  videoUrl?: string;
  imageUrl?: string;
  blur?: number;
  opacity?: number;
  parallax?: boolean;
  parallaxOffset?: { x: number; y: number };
}

export function VideoBackground({ 
  videoUrl, 
  imageUrl, 
  blur = 0, 
  opacity = 1,
  parallax = false,
  parallaxOffset = { x: 0, y: 0 }
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Monitor battery level
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(battery.level * 100);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
      });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    // Reset states when video URL changes
    setHasError(false);
    setIsLoading(true);
    console.log('Loading video:', videoUrl);

    // Handle video loaded and ready to play
    const handleCanPlay = () => {
      console.log('Video can play');
      setHasError(false);
      setIsLoading(false);
      if (batteryLevel >= 20) {
        video.play().catch((err) => {
          console.error('Video play error:', err);
          setHasError(true);
          setIsLoading(false);
        });
      }
    };

    // Handle video errors
    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setHasError(true);
      setIsLoading(false);
    };

    // Handle when video starts playing
    const handlePlaying = () => {
      console.log('Video is playing');
      setIsLoading(false);
      setIsPlaying(true);
    };

    // Pause video if battery is low and not charging
    if (batteryLevel < 20) {
      video.pause();
      setIsPlaying(false);
    } else if (!isPlaying && !hasError) {
      video.play().catch((err) => {
        console.error('Video play error:', err);
        setHasError(true);
      });
      setIsPlaying(true);
    }

    // Loop video seamlessly
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch((err) => {
        console.error('Video play error:', err);
        setHasError(true);
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    
    // Try to load the video
    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl, batteryLevel, isPlaying, hasError]);

  if (imageUrl && !videoUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={parallax ? { 
          opacity,
          x: -parallaxOffset.x * 0.3,
          y: -parallaxOffset.y * 0.3,
          scale: 1.05
        } : { 
          opacity,
          x: 0,
          y: 0,
          scale: 1
        }}
        transition={{ 
          opacity: { duration: 1 },
          x: { type: 'spring', stiffness: 100, damping: 20 },
          y: { type: 'spring', stiffness: 100, damping: 20 },
          scale: { type: 'spring', stiffness: 100, damping: 20 }
        }}
        className="absolute"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          width: parallax ? '110%' : '100%',
          height: parallax ? '110%' : '100%',
          left: parallax ? '-5%' : '0',
          top: parallax ? '-5%' : '0'
        }}
      />
    );
  }

  if (videoUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={parallax ? {
          opacity,
          x: -parallaxOffset.x * 0.3,
          y: -parallaxOffset.y * 0.3,
          scale: 1.05
        } : {
          opacity,
          x: 0,
          y: 0,
          scale: 1
        }}
        transition={{
          opacity: { duration: 1 },
          x: { type: 'spring', stiffness: 100, damping: 20 },
          y: { type: 'spring', stiffness: 100, damping: 20 },
          scale: { type: 'spring', stiffness: 100, damping: 20 }
        }}
        className="absolute overflow-hidden"
        style={{
          width: parallax ? '110%' : '100%',
          height: parallax ? '110%' : '100%',
          left: parallax ? '-5%' : '0',
          top: parallax ? '-5%' : '0'
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          style={{
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Overlay caricamento */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-white text-center px-4">
              <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2 mx-auto"></div>
              <p className="text-sm opacity-70">Caricamento...</p>
            </div>
          </div>
        )}
        
        {/* Overlay per errore caricamento */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center px-4">
              <p className="text-base opacity-70">Impossibile caricare il video</p>
              <p className="text-xs opacity-50 mt-1">Verifica la connessione</p>
            </div>
          </div>
        )}
        
        {/* Overlay per batteria bassa */}
        {batteryLevel < 20 && !isPlaying && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <p className="text-lg opacity-70">Video in pausa</p>
              <p className="text-sm opacity-50">Batteria bassa</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return null;
}
