import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Clock, Bell, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { TimePickerWheel } from './TimePickerWheel';

export interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
  days: number[]; // 0 = Domenica, 1 = Lunedì, etc.
  vibration: boolean;
  ringtone?: string; // ID della suoneria
  snoozeMinutes?: number; // Durata snooze in minuti
}

interface AlarmManagerProps {
  textColor: string;
  accentColor: string;
  onClose: () => void;
  onAlarmsChange: (alarms: Alarm[]) => void;
  initialAlarms: Alarm[];
}

export function AlarmManager({ textColor, accentColor, onClose, onAlarmsChange, initialAlarms }: AlarmManagerProps) {
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  const addAlarm = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: '08:00',
      enabled: true,
      label: 'Sveglia',
      days: [],
      vibration: true,
      ringtone: 'radar',
      snoozeMinutes: 5
    };
    const updated = [...alarms, newAlarm];
    setAlarms(updated);
    onAlarmsChange(updated);
    setIsAdding(false);
  };

  const deleteAlarm = (id: string) => {
    const updated = alarms.filter(a => a.id !== id);
    setAlarms(updated);
    onAlarmsChange(updated);
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    setAlarms(updated);
    onAlarmsChange(updated);
  };

  const toggleDay = (alarmId: string, day: number) => {
    const updated = alarms.map(a => {
      if (a.id === alarmId) {
        const days = a.days.includes(day)
          ? a.days.filter(d => d !== day)
          : [...a.days, day].sort();
        return { ...a, days };
      }
      return a;
    });
    setAlarms(updated);
    onAlarmsChange(updated);
  };

  const updateTime = (id: string, time: string) => {
    const updated = alarms.map(a => 
      a.id === id ? { ...a, time } : a
    );
    setAlarms(updated);
    onAlarmsChange(updated);
  };

  const updateLabel = (id: string, label: string) => {
    const updated = alarms.map(a => 
      a.id === id ? { ...a, label } : a
    );
    setAlarms(updated);
    onAlarmsChange(updated);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col landscape:flex-row"
      style={{ 
        background: '#000000'
      }}
    >
      {/* Header con safe area */}
      <div className="pt-safe px-5 sm:px-8 pb-4 sm:pb-5 landscape:pr-safe landscape:w-full landscape:max-w-sm landscape:border-r landscape:flex landscape:flex-col" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="flex items-center justify-between landscape:pb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Bell size={24} className="sm:w-7 sm:h-7" style={{ color: accentColor }} />
            <h1 className="text-2xl sm:text-3xl landscape:text-xl" style={{ color: textColor }}>Sveglie</h1>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-base sm:text-lg landscape:text-sm"
            style={{ color: accentColor }}
          >
            Fine
          </Button>
        </div>
        
        {/* Pulsante aggiungi in landscape header */}
        <div className="hidden landscape:block landscape:mt-auto">
          <Button
            onClick={addAlarm}
            className="w-full h-12 rounded-xl text-base"
            style={{ 
              background: accentColor,
              color: '#000'
            }}
          >
            <Plus size={20} className="mr-2" />
            Aggiungi Sveglia
          </Button>
        </div>
      </div>

      {/* Lista sveglie */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-safe landscape:px-10 landscape:py-8">
        <div className="landscape:grid landscape:grid-cols-2 landscape:gap-4 landscape:max-w-6xl landscape:mx-auto">
          <AnimatePresence>
          {alarms.map((alarm) => (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-4 sm:mb-6 landscape:mb-0 p-4 sm:p-6 landscape:p-5 rounded-2xl sm:rounded-3xl landscape:rounded-2xl"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${alarm.enabled ? accentColor + '40' : 'rgba(255, 255, 255, 0.1)'}`
              }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <button
                  onClick={() => setEditingAlarmId(alarm.id)}
                  className="text-4xl sm:text-5xl flex items-center gap-2 hover:opacity-80 transition-opacity"
                  style={{ 
                    color: textColor,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: '300',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {alarm.time}
                  <ChevronRight size={28} className="opacity-40" />
                </button>
                <Switch
                  checked={alarm.enabled}
                  onCheckedChange={() => toggleAlarm(alarm.id)}
                />
              </div>

              {/* Time Picker Wheel - mostrato quando si clicca sull'orario */}
              <AnimatePresence>
                {editingAlarmId === alarm.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <TimePickerWheel
                      value={alarm.time}
                      onChange={(time) => updateTime(alarm.id, time)}
                      accentColor={accentColor}
                      textColor={textColor}
                    />
                    <Button
                      onClick={() => setEditingAlarmId(null)}
                      className="w-full mt-3 h-10 rounded-xl text-sm"
                      style={{ 
                        background: accentColor,
                        color: '#000'
                      }}
                    >
                      Conferma
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                type="text"
                value={alarm.label}
                onChange={(e) => updateLabel(alarm.id, e.target.value)}
                className="mb-3 sm:mb-4 bg-transparent border-none p-0 text-base sm:text-lg"
                style={{ color: textColor }}
                placeholder="Nome sveglia"
              />

              <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                {daysOfWeek.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(alarm.id, i)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm transition-all"
                    style={{
                      background: alarm.days.includes(i) ? accentColor : 'rgba(255, 255, 255, 0.1)',
                      color: alarm.days.includes(i) ? '#000' : textColor + '80',
                      fontWeight: alarm.days.includes(i) ? '600' : '400'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <button
                onClick={() => deleteAlarm(alarm.id)}
                className="flex items-center gap-2 text-xs sm:text-sm opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: textColor }}
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                Elimina
              </button>
            </motion.div>
          ))}

          {alarms.length === 0 && (
            <div className="text-center py-20 opacity-50 landscape:col-span-2" style={{ color: textColor }}>
              <Clock size={48} className="mx-auto mb-4" />
              <p className="text-xl">Nessuna sveglia impostata</p>
            </div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pulsante aggiungi - nascosto in landscape */}
      <div className="p-4 sm:p-6 pb-safe border-t landscape:hidden" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Button
          onClick={addAlarm}
          className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl text-base sm:text-lg"
          style={{ 
            background: accentColor,
            color: '#000'
          }}
        >
          <Plus size={20} className="sm:w-6 sm:h-6 mr-2" />
          Aggiungi Sveglia
        </Button>
      </div>
    </motion.div>
  );
}
