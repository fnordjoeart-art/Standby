import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface DigitalClockProps {
  textColor: string;
  accentColor: string;
  showSeconds?: boolean;
  isLandscape?: boolean;
  deviceSize?: 'mobile' | 'tablet' | 'desktop';
}

export function DigitalClock({ 
  textColor, 
  accentColor, 
  showSeconds = true,
  isLandscape = false,
  deviceSize = 'mobile'
}: DigitalClockProps) {
  const [time, setTime] = useState(new Date());
  const [burnInOffset, setBurnInOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Anti burn-in: subtle random movement every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setBurnInOffset({
        x: Math.random() * 6 - 3,
        y: Math.random() * 6 - 3
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const formatDate = () => {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${days[time.getDay()]}, ${time.getDate()} ${months[time.getMonth()]}`;
  };

  // Responsive font sizes
  const getTimeSize = () => {
    if (isLandscape) {
      return deviceSize === 'mobile' ? 'text-[80px]' : 'text-[100px]';
    }
    if (deviceSize === 'mobile') return 'text-[100px] sm:text-[120px]';
    if (deviceSize === 'tablet') return 'text-[140px]';
    return 'text-[180px]';
  };

  const getSecondsSize = () => {
    if (isLandscape) {
      return deviceSize === 'mobile' ? 'text-[40px]' : 'text-[50px]';
    }
    if (deviceSize === 'mobile') return 'text-[50px] sm:text-[60px]';
    if (deviceSize === 'tablet') return 'text-[70px]';
    return 'text-[90px]';
  };

  const getDateSize = () => {
    if (isLandscape) return 'text-base sm:text-lg';
    if (deviceSize === 'mobile') return 'text-lg sm:text-xl';
    if (deviceSize === 'tablet') return 'text-2xl';
    return 'text-3xl';
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center gap-2 sm:gap-4"
      animate={{ x: burnInOffset.x, y: burnInOffset.y }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    >
      <div className={`flex items-center ${isLandscape ? 'gap-1' : 'gap-2'}`}>
        <motion.span
          key={hours}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${getTimeSize()} tracking-tighter leading-none`}
          style={{ 
            color: textColor,
            textShadow: `0 0 40px ${accentColor}40`,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {hours}
        </motion.span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`${getTimeSize()} leading-none`}
          style={{ color: accentColor }}
        >
          :
        </motion.span>
        <motion.span
          key={minutes}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${getTimeSize()} tracking-tighter leading-none`}
          style={{ 
            color: textColor,
            textShadow: `0 0 40px ${accentColor}40`,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {minutes}
        </motion.span>
        {showSeconds && (
          <>
            <motion.span
              className={`${getSecondsSize()} opacity-50 leading-none`}
              style={{ color: textColor }}
            >
              :
            </motion.span>
            <motion.span
              key={seconds}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.7, y: 0 }}
              className={`${getSecondsSize()} tracking-tighter leading-none`}
              style={{ 
                color: textColor,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {seconds}
            </motion.span>
          </>
        )}
      </div>
      {!isLandscape && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className={`${getDateSize()} tracking-wide text-center px-4`}
          style={{ color: textColor }}
        >
          {formatDate()}
        </motion.div>
      )}
    </motion.div>
  );
}
