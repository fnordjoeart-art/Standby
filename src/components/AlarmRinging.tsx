import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Bell, Volume2, X, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import type { Alarm } from './AlarmManager';

interface AlarmRingingProps {
  alarm: Alarm;
  onSnooze: () => void;
  onDismiss: () => void;
  accentColor: string;
  textColor: string;
  ringtone: string;
  volume: number;
}

export function AlarmRinging({ 
  alarm, 
  onSnooze, 
  onDismiss, 
  accentColor, 
  textColor,
  ringtone,
  volume 
}: AlarmRingingProps) {
  const [currentVolume, setCurrentVolume] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fade-in audio
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(ringtone);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    // Add error handler
    audioRef.current.addEventListener('error', (e) => {
      console.error('Error loading alarm audio:', e);
      // Continue without audio - visual alarm still works
    });

    // Start playing
    audioRef.current.play().catch(err => {
      console.error('Error playing alarm:', err);
      // Continue without audio - visual alarm still works
    });

    // Fade in over 3 seconds
    const fadeDuration = 3000;
    const steps = 30;
    const stepDuration = fadeDuration / steps;
    const volumeStep = volume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (audioRef.current && currentStep < steps) {
        currentStep++;
        const newVolume = Math.min(volumeStep * currentStep, volume);
        audioRef.current.volume = newVolume;
        setCurrentVolume(newVolume);
      } else if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    }, stepDuration);

    // Vibration pattern (if supported)
    if ('vibrate' in navigator && alarm.vibration) {
      // Pattern: vibrate 1s, pause 0.5s, repeat
      const vibratePattern = setInterval(() => {
        navigator.vibrate([1000, 500]);
      }, 1500);

      return () => {
        clearInterval(vibratePattern);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [ringtone, volume, alarm.vibration]);

  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
    onDismiss();
  };

  const handleSnooze = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
    onSnooze();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-safe"
      style={{
        background: 'rgba(0, 0, 0, 0.98)',
      }}
    >
      <div className="flex flex-col items-center justify-center px-8 sm:px-10 w-full max-w-md">
        {/* Bell Icon animato */}
        <motion.div
          animate={{
            rotate: [0, -15, 15, -15, 15, 0],
            scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="mb-8"
        >
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: accentColor + '20',
              border: `2px solid ${accentColor}`
            }}
          >
            <Bell size={48} style={{ color: accentColor }} />
          </div>
        </motion.div>

        {/* Orario */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div 
            className="text-7xl sm:text-8xl tracking-tight"
            style={{ 
              color: textColor,
              fontWeight: '200',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {alarm.time}
          </div>
        </motion.div>

        {/* Label sveglia */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 text-center"
        >
          <p 
            className="text-2xl mb-2"
            style={{ color: textColor }}
          >
            {alarm.label}
          </p>
          {alarm.days.length > 0 && (
            <p 
              className="text-sm opacity-60"
              style={{ color: textColor }}
            >
              {alarm.days.map(d => ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'][d]).join(', ')}
            </p>
          )}
        </motion.div>

        {/* Volume indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 mb-12 w-full max-w-xs"
        >
          <Volume2 size={20} style={{ color: textColor }} className="opacity-60" />
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: accentColor,
                width: `${(currentVolume / volume) * 100}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(currentVolume / volume) * 100}%` }}
            />
          </div>
          <span 
            className="text-sm opacity-60 min-w-[3ch]"
            style={{ color: textColor }}
          >
            {Math.round((currentVolume / volume) * 100)}%
          </span>
        </motion.div>

        {/* Bottoni azione */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full"
        >
          {/* Stop */}
          <Button
            onClick={handleDismiss}
            className="w-full h-16 rounded-2xl text-lg"
            style={{
              background: accentColor,
              color: '#000'
            }}
          >
            <X size={24} className="mr-2" />
            Stop
          </Button>

          {/* Snooze */}
          <Button
            onClick={handleSnooze}
            variant="outline"
            className="w-full h-14 rounded-2xl text-base"
            style={{
              borderColor: textColor + '30',
              color: textColor,
              background: 'transparent'
            }}
          >
            <Clock size={20} className="mr-2" />
            Snooze (5 min)
          </Button>
        </motion.div>

        {/* Gesture hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-center"
          style={{ color: textColor }}
        >
          Scorri verso l'alto per rimandare
        </motion.div>
      </div>
    </motion.div>
  );
}
