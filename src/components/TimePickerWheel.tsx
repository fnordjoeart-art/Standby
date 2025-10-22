import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface TimePickerWheelProps {
  value: string; // formato "HH:MM"
  onChange: (value: string) => void;
  accentColor: string;
  textColor: string;
}

export function TimePickerWheel({ value, onChange, accentColor, textColor }: TimePickerWheelProps) {
  const [hours, minutes] = value.split(':').map(Number);
  const [selectedHour, setSelectedHour] = useState(hours);
  const [selectedMinute, setSelectedMinute] = useState(minutes);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 44;
  const VISIBLE_ITEMS = 5;

  // Genera array di ore (0-23)
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  // Genera array di minuti (0-59)
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    onChange(`${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`);
  }, [selectedHour, selectedMinute]);

  const handleScroll = (ref: HTMLDivElement, array: number[], setter: (val: number) => void) => {
    const scrollTop = ref.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, array.length - 1));
    setter(array[clampedIndex]);
    
    // Snap to position
    ref.scrollTo({
      top: clampedIndex * ITEM_HEIGHT,
      behavior: 'smooth'
    });
  };

  const renderWheel = (
    array: number[],
    selected: number,
    setter: (val: number) => void,
    ref: React.RefObject<HTMLDivElement>,
    label: string
  ) => {
    return (
      <div className="flex-1 relative">
        <div 
          ref={ref}
          className="overflow-y-scroll h-[220px] snap-y snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            clearTimeout((target as any).scrollTimeout);
            (target as any).scrollTimeout = setTimeout(() => {
              handleScroll(target, array, setter);
            }, 150);
          }}
        >
          {/* Padding superiore */}
          <div style={{ height: ITEM_HEIGHT * 2 }} />
          
          {array.map((value) => {
            const isSelected = value === selected;
            return (
              <div
                key={value}
                className="snap-center flex items-center justify-center transition-all duration-200"
                style={{
                  height: ITEM_HEIGHT,
                  fontSize: isSelected ? '32px' : '20px',
                  color: isSelected ? textColor : textColor + '40',
                  fontWeight: isSelected ? '600' : '400',
                  transform: isSelected ? 'scale(1)' : 'scale(0.8)',
                  opacity: isSelected ? 1 : 0.3
                }}
                onClick={() => {
                  setter(value);
                  ref.current?.scrollTo({
                    top: array.indexOf(value) * ITEM_HEIGHT,
                    behavior: 'smooth'
                  });
                }}
              >
                {value.toString().padStart(2, '0')}
              </div>
            );
          })}
          
          {/* Padding inferiore */}
          <div style={{ height: ITEM_HEIGHT * 2 }} />
        </div>

        {/* Indicatore centrale */}
        <div 
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            height: ITEM_HEIGHT,
            borderTop: `1px solid ${accentColor}40`,
            borderBottom: `1px solid ${accentColor}40`,
            background: `linear-gradient(to bottom, ${accentColor}10, transparent, ${accentColor}10)`
          }}
        />

        {/* Label */}
        <div 
          className="absolute text-sm"
          style={{
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            color: textColor + '60',
            fontWeight: '500',
            pointerEvents: 'none'
          }}
        >
          {label}
        </div>
      </div>
    );
  };

  // Inizializza lo scroll alla posizione corretta
  useEffect(() => {
    if (hourRef.current) {
      hourRef.current.scrollTop = selectedHour * ITEM_HEIGHT;
    }
    if (minuteRef.current) {
      minuteRef.current.scrollTop = selectedMinute * ITEM_HEIGHT;
    }
  }, []);

  return (
    <div 
      className="flex gap-4 relative"
      style={{
        height: '220px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '16px',
        padding: '0 12px',
        border: `1px solid ${accentColor}20`
      }}
    >
      {renderWheel(hoursArray, selectedHour, setSelectedHour, hourRef, 'ore')}
      
      {/* Separatore : */}
      <div 
        className="flex items-center justify-center text-3xl"
        style={{ 
          color: textColor,
          fontWeight: '600',
          width: '20px',
          paddingTop: '4px'
        }}
      >
        :
      </div>
      
      {renderWheel(minutesArray, selectedMinute, setSelectedMinute, minuteRef, 'min')}
      
      <style>{`
        .overflow-y-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
