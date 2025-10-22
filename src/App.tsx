import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Maximize2, Minimize2, Bell } from 'lucide-react';
import { AnalogClock } from './components/AnalogClock';
import { DigitalClock } from './components/DigitalClock';
import { AlarmManager, type Alarm } from './components/AlarmManager';
import { ThemeCustomizer, type Theme } from './components/ThemeCustomizer';
import { Settings } from './components/Settings';
import { BackgroundSelector } from './components/BackgroundSelector';
import { VideoBackground } from './components/VideoBackground';
import { AlarmRinging } from './components/AlarmRinging';
import { RingtoneSelector } from './components/RingtoneSelector';
import { Button } from './components/ui/button';
import { requestWakeLock, scheduleAlarmNotifications } from './src/main';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import logoImage from 'figma:asset/e4d0e2c9a7c1437ba1be2558ec7bf5aa318ea050.png';

interface Background {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnail: string;
  name: string;
}

const defaultTheme: Theme = {
  background: '#000000',
  surface: '#0A0A0A',
  primaryAccent: '#FF2E91',
  secondaryAccent: '#0FA3FF',
  textPrimary: '#FFFFFF',
  textSecondary: '#F0F0F0'
};

export default function App() {
  // State management
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('standby-theme');
    if (saved) {
      const parsedTheme = JSON.parse(saved);
      // Aggiorna il vecchio colore grigio (#020202) al nuovo nero puro (#000000)
      if (parsedTheme.background === '#020202') {
        parsedTheme.background = '#000000';
      }
      return parsedTheme;
    }
    return defaultTheme;
  });

  const [clockMode, setClockMode] = useState<'analog' | 'digital'>(() => {
    return (localStorage.getItem('standby-clock-mode') as 'analog' | 'digital') || 'digital';
  });

  const [background, setBackground] = useState<Background | null>(() => {
    const saved = localStorage.getItem('standby-background');
    return saved ? JSON.parse(saved) : null;
  });

  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('standby-alarms');
    return saved ? JSON.parse(saved) : [];
  });

  const [brightness, setBrightness] = useState(() => {
    return parseInt(localStorage.getItem('standby-brightness') || '80');
  });

  const [autoDimming, setAutoDimming] = useState(() => {
    return localStorage.getItem('standby-auto-dimming') !== 'false';
  });

  const [parallax, setParallax] = useState(() => {
    return localStorage.getItem('standby-parallax') !== 'false';
  });

  const [antiBurnIn, setAntiBurnIn] = useState(() => {
    return localStorage.getItem('standby-anti-burn-in') !== 'false';
  });

  const [energySaving, setEnergySaving] = useState(() => {
    return localStorage.getItem('standby-energy-saving') === 'true';
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAlarms, setShowAlarms] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [showRingtones, setShowRingtones] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [deviceSize, setDeviceSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [ringtone, setRingtone] = useState(() => {
    return localStorage.getItem('standby-ringtone') || 'radar';
  });
  const [ringtoneVolume, setRingtoneVolume] = useState(() => {
    return parseFloat(localStorage.getItem('standby-ringtone-volume') || '0.7');
  });

  // Detect device size
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceSize('mobile');
      } else if (width < 1024) {
        setDeviceSize('tablet');
      } else {
        setDeviceSize('desktop');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Request wake lock on user interaction
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!wakeLock) {
        const lock = await requestWakeLock();
        setWakeLock(lock);
      }
    };

    // Try to acquire wake lock after first user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [wakeLock]);

  // Schedule alarm notifications when alarms change
  const updateAlarmNotifications = useCallback(async (updatedAlarms: Alarm[]) => {
    setAlarms(updatedAlarms);
    await scheduleAlarmNotifications(updatedAlarms);
    
    const enabledCount = updatedAlarms.filter(a => a.enabled).length;
    if (enabledCount > 0) {
      toast.success(`${enabledCount} ${enabledCount === 1 ? 'sveglia attiva' : 'sveglie attive'}`);
    }
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('standby-theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('standby-clock-mode', clockMode);
  }, [clockMode]);

  useEffect(() => {
    localStorage.setItem('standby-background', JSON.stringify(background));
  }, [background]);

  useEffect(() => {
    localStorage.setItem('standby-alarms', JSON.stringify(alarms));
    // Re-schedule notifications when alarms change
    scheduleAlarmNotifications(alarms);
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem('standby-ringtone', ringtone);
  }, [ringtone]);

  useEffect(() => {
    localStorage.setItem('standby-ringtone-volume', ringtoneVolume.toString());
  }, [ringtoneVolume]);

  useEffect(() => {
    localStorage.setItem('standby-brightness', brightness.toString());
  }, [brightness]);

  useEffect(() => {
    localStorage.setItem('standby-auto-dimming', autoDimming.toString());
  }, [autoDimming]);

  useEffect(() => {
    localStorage.setItem('standby-parallax', parallax.toString());
  }, [parallax]);

  useEffect(() => {
    localStorage.setItem('standby-anti-burn-in', antiBurnIn.toString());
  }, [antiBurnIn]);

  useEffect(() => {
    localStorage.setItem('standby-energy-saving', energySaving.toString());
  }, [energySaving]);

  // Detect landscape orientation for StandBy mode
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Auto-dimming based on time
  useEffect(() => {
    if (!autoDimming) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      // Dim between 22:00 and 07:00
      if (hour >= 22 || hour < 7) {
        setBrightness(30);
      } else {
        setBrightness(80);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [autoDimming]);

  // Parallax effect based on device orientation
  useEffect(() => {
    if (!parallax) {
      setParallaxOffset({ x: 0, y: 0 });
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        // beta: front-to-back tilt (-180 to 180)
        // gamma: left-to-right tilt (-90 to 90)
        const beta = event.beta;
        const gamma = event.gamma;
        
        // Normalize to -1 to 1 range and apply smoothing
        const x = Math.max(-15, Math.min(15, gamma / 6));
        const y = Math.max(-15, Math.min(15, (beta - 45) / 6));
        
        setParallaxOffset({ x, y });
      }
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y } = event.accelerationIncludingGravity;
        if (x !== null && y !== null) {
          // Subtle parallax based on device tilt
          const offsetX = Math.max(-15, Math.min(15, x * 1.5));
          const offsetY = Math.max(-15, Math.min(15, y * 1.5));
          setParallaxOffset({ x: offsetX, y: offsetY });
        }
      }
    };

    // Request permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS devices or older iOS
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [parallax]);

  // Check alarms every minute
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;
        if (alarm.time !== currentTime) return;

        // Check if alarm should ring today
        const shouldRing = alarm.days.length === 0 || alarm.days.includes(currentDay);
        
        if (shouldRing) {
          setRingingAlarm(alarm);
          toast.info(`Sveglia: ${alarm.label}`);
        }
      });
    };

    // Check immediately
    checkAlarms();

    // Check every minute
    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [alarms]);

  // Handle alarm snooze
  const handleAlarmSnooze = () => {
    if (!ringingAlarm) return;

    const snoozeMinutes = ringingAlarm.snoozeMinutes || 5;
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + snoozeMinutes * 60000);
    const snoozeTimeString = `${snoozeTime.getHours().toString().padStart(2, '0')}:${snoozeTime.getMinutes().toString().padStart(2, '0')}`;

    // Create temporary snooze alarm
    const snoozeAlarm: Alarm = {
      id: `snooze-${Date.now()}`,
      time: snoozeTimeString,
      enabled: true,
      label: `Snooze: ${ringingAlarm.label}`,
      days: [],
      vibration: ringingAlarm.vibration,
      ringtone: ringingAlarm.ringtone,
      snoozeMinutes: ringingAlarm.snoozeMinutes
    };

    setAlarms([...alarms, snoozeAlarm]);
    setRingingAlarm(null);
    toast.success(`Sveglia rimandata di ${snoozeMinutes} minuti`);
  };

  // Handle alarm dismiss
  const handleAlarmDismiss = () => {
    setRingingAlarm(null);
    toast.success('Sveglia spenta');
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Reset all settings
  const resetSettings = () => {
    if (confirm('Sei sicuro di voler resettare tutte le impostazioni?')) {
      setTheme(defaultTheme);
      setClockMode('digital');
      setBackground(null);
      setAlarms([]);
      setBrightness(80);
      setAutoDimming(true);
      setParallax(true);
      setAntiBurnIn(true);
      setEnergySaving(false);
      localStorage.clear();
      toast.success('Impostazioni ripristinate');
    }
  };

  // Calculate responsive clock size
  const getClockSize = () => {
    if (isLandscape) {
      return deviceSize === 'mobile' ? 180 : 220;
    }
    if (deviceSize === 'mobile') return 280;
    if (deviceSize === 'tablet') return 350;
    return 400;
  };

  // Get next alarm
  const getNextAlarm = (): Alarm | undefined => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const enabledAlarms = alarms.filter(a => a.enabled);
    
    return enabledAlarms.find(alarm => {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const alarmTime = hours * 60 + minutes;
      
      if (alarm.days.length === 0) {
        return alarmTime > currentTime;
      }
      
      return alarm.days.includes(currentDay) && alarmTime > currentTime;
    });
  };

  const nextAlarm = getNextAlarm();

  return (
    <>
      <Toaster position="top-center" />
      <div 
        className="relative w-full h-full overflow-hidden transition-opacity duration-500"
        style={{ 
          background: theme.background,
          opacity: brightness / 100
        }}
      >
        {/* Video/Image Background */}
        {background && background.url && background.id !== 'none' && (
          <VideoBackground
            videoUrl={background.type === 'video' ? background.url : undefined}
            imageUrl={background.type === 'image' ? background.url : undefined}
            parallax={parallax}
            parallaxOffset={parallaxOffset}
          />
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Top Bar - Only show in portrait */}
          {!isLandscape && (
            <motion.div 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              className="pt-safe px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <img 
                  src={logoImage} 
                  alt="StandBy+ Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
                <h1 className="text-xl sm:text-2xl" style={{ color: theme.textPrimary }}>StandBy+</h1>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                {alarms.filter(a => a.enabled).length > 0 && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setShowAlarms(true)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center relative"
                    style={{ background: theme.primaryAccent + '20' }}
                  >
                    <Bell size={18} className="sm:w-5 sm:h-5" style={{ color: theme.primaryAccent }} />
                    <span 
                      className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: theme.primaryAccent, color: '#000' }}
                    >
                      {alarms.filter(a => a.enabled).length}
                    </span>
                  </motion.button>
                )}
                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full hidden sm:flex"
                  style={{ color: theme.primaryAccent }}
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  style={{ color: theme.primaryAccent }}
                >
                  <SettingsIcon size={20} className="sm:w-5 sm:h-5" />
                </Button>
              </div>
            </motion.div>
          )}

        {/* Clock Display */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8">
          <motion.div
            animate={parallax ? { 
              x: parallaxOffset.x, 
              y: parallaxOffset.y 
            } : { x: 0, y: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 100, 
              damping: 20 
            }}
          >
            <AnimatePresence mode="wait">
              {clockMode === 'analog' ? (
                <motion.div
                  key="analog"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setClockMode('digital')}
                  className="cursor-pointer touch-none"
                >
                  <AnalogClock
                    accentColor={theme.primaryAccent}
                    textColor={theme.textPrimary}
                    alarmHour={nextAlarm ? parseInt(nextAlarm.time.split(':')[0]) : undefined}
                    size={getClockSize()}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="digital"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setClockMode('analog')}
                  className="cursor-pointer touch-none w-full max-w-4xl"
                >
                  <DigitalClock
                    textColor={theme.textPrimary}
                    accentColor={theme.primaryAccent}
                    showSeconds={!energySaving}
                    isLandscape={isLandscape}
                    deviceSize={deviceSize}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Next Alarm Indicator */}
        {nextAlarm && !isLandscape && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            className="pb-safe px-6 sm:px-8 py-4 sm:py-5 text-center mb-2"
          >
            <div className="flex items-center justify-center gap-2">
              <Bell size={14} style={{ color: theme.primaryAccent }} />
              <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                Prossima sveglia: {nextAlarm.time} - {nextAlarm.label}
              </p>
            </div>
          </motion.div>
        )}

        {/* StandBy Mode Indicator */}
        {isLandscape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="absolute top-6 left-6 px-3 py-1 rounded-full text-xs"
            style={{ 
              background: theme.primaryAccent + '40',
              color: theme.textPrimary,
              border: `1px solid ${theme.primaryAccent}`
            }}
          >
            StandBy Mode
          </motion.div>
        )}

        {/* Settings Icon in Landscape */}
        {isLandscape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-6 right-6"
          >
            <Button
              onClick={() => setShowSettings(true)}
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full"
              style={{ 
                color: theme.primaryAccent,
                background: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              <SettingsIcon size={22} />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showSettings && (
          <Settings
            textColor={theme.textPrimary}
            accentColor={theme.primaryAccent}
            onClose={() => setShowSettings(false)}
            brightness={brightness}
            onBrightnessChange={setBrightness}
            autoDimming={autoDimming}
            onAutoDimmingChange={setAutoDimming}
            parallax={parallax}
            onParallaxChange={setParallax}
            antiBurnIn={antiBurnIn}
            onAntiBurnInChange={setAntiBurnIn}
            energySaving={energySaving}
            onEnergySavingChange={setEnergySaving}
            onOpenThemes={() => {
              setShowSettings(false);
              setShowThemes(true);
            }}
            onOpenAlarms={() => {
              setShowSettings(false);
              setShowAlarms(true);
            }}
            onOpenBackgrounds={() => {
              setShowSettings(false);
              setShowBackgrounds(true);
            }}
            onOpenRingtones={() => {
              setShowSettings(false);
              setShowRingtones(true);
            }}
            onReset={resetSettings}
          />
        )}

        {showAlarms && (
          <AlarmManager
            textColor={theme.textPrimary}
            accentColor={theme.primaryAccent}
            onClose={() => setShowAlarms(false)}
            onAlarmsChange={updateAlarmNotifications}
            initialAlarms={alarms}
          />
        )}

        {showThemes && (
          <ThemeCustomizer
            theme={theme}
            onThemeChange={setTheme}
            onClose={() => setShowThemes(false)}
          />
        )}

        {showRingtones && (
          <RingtoneSelector
            selectedRingtone={ringtone}
            onSelectRingtone={setRingtone}
            volume={ringtoneVolume}
            onVolumeChange={setRingtoneVolume}
            accentColor={theme.primaryAccent}
            textColor={theme.textPrimary}
            onClose={() => setShowRingtones(false)}
          />
        )}

        {showBackgrounds && (
          <BackgroundSelector
            textColor={theme.textPrimary}
            accentColor={theme.primaryAccent}
            onClose={() => setShowBackgrounds(false)}
            onSelectBackground={setBackground}
            currentBackground={background}
          />
        )}

        {ringingAlarm && (
          <AlarmRinging
            alarm={ringingAlarm}
            onSnooze={handleAlarmSnooze}
            onDismiss={handleAlarmDismiss}
            accentColor={theme.primaryAccent}
            textColor={theme.textPrimary}
            ringtone={`/sounds/${ringingAlarm.ringtone || ringtone}.mp3`}
            volume={ringtoneVolume}
          />
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
