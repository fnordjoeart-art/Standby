import { useEffect, useState } from 'react';

interface AnalogClockProps {
  accentColor: string;
  textColor: string;
  alarmHour?: number;
  size?: number;
}

export function AnalogClock({ accentColor, textColor, alarmHour, size = 300 }: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calcolo angoli - partono da 12 (in alto)
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = (minutes * 6) + (seconds * 0.1);
  const secondAngle = seconds * 6;

  // Anti burn-in: leggero movimento random ogni minuto
  const [burnInOffset, setBurnInOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      setBurnInOffset({
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Centro dell'orologio
  const centerX = 150;
  const centerY = 150;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        style={{
          transform: `translate(${burnInOffset.x}px, ${burnInOffset.y}px)`,
          transition: 'transform 2s ease-in-out'
        }}
      >
        <svg width={size} height={size} viewBox="0 0 300 300">
          {/* Cerchio esterno */}
          <circle
            cx={centerX}
            cy={centerY}
            r="145"
            fill="none"
            stroke={textColor}
            strokeWidth="1"
            opacity="0.1"
          />
          
          {/* Indicatori ore */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = centerX + Math.cos(angle) * 130;
            const y1 = centerY + Math.sin(angle) * 130;
            const x2 = centerX + Math.cos(angle) * 140;
            const y2 = centerY + Math.sin(angle) * 140;
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={textColor}
                strokeWidth={i % 3 === 0 ? "3" : "2"}
                opacity="0.8"
              />
            );
          })}

          {/* Anello sveglia */}
          {alarmHour !== undefined && (
            <circle
              cx={centerX}
              cy={centerY}
              r="120"
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              strokeDasharray={`${(360 / 12) * 1} ${360 - (360 / 12) * 1}`}
              strokeDashoffset={-((alarmHour % 12) * 30 - 90)}
              opacity="0.6"
              style={{
                filter: `drop-shadow(0 0 10px ${accentColor})`
              }}
            />
          )}

          {/* Lancetta ore */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - 70}
            stroke={textColor}
            strokeWidth="6"
            strokeLinecap="round"
            transform={`rotate(${hourAngle}, ${centerX}, ${centerY})`}
            style={{
              transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          />

          {/* Lancetta minuti */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - 100}
            stroke={textColor}
            strokeWidth="4"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle}, ${centerX}, ${centerY})`}
            style={{
              transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          />

          {/* Lancetta secondi */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - 110}
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${secondAngle}, ${centerX}, ${centerY})`}
            style={{
              transition: 'transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          />

          {/* Centro */}
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill={accentColor}
            style={{
              filter: `drop-shadow(0 0 8px ${accentColor})`
            }}
          />
        </svg>
      </div>
    </div>
  );
}
