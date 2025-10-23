import { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Check, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export interface Ringtone {
  id: string;
  name: string;
  url: string;
  duration: number; // secondi
  isCustom?: boolean;
}

// Suonerie predefinite (URL placeholder - da sostituire con file reali)
export const defaultRingtones: Ringtone[] = [
  { id: 'radar', name: 'Radar', url: '/sounds/radar.mp3', duration: 30 },
  { id: 'apex', name: 'Apex', url: '/sounds/apex.mp3', duration: 30 },
  { id: 'beacon', name: 'Beacon', url: '/sounds/beacon.mp3', duration: 30 },
  { id: 'bulletin', name: 'Bulletin', url: '/sounds/bulletin.mp3', duration: 30 },
  { id: 'chimes', name: 'Chimes', url: '/sounds/chimes.mp3', duration: 30 },
  { id: 'circuit', name: 'Circuit', url: '/sounds/circuit.mp3', duration: 30 },
  { id: 'constellation', name: 'Constellation', url: '/sounds/constellation.mp3', duration: 30 },
  { id: 'cosmic', name: 'Cosmic', url: '/sounds/cosmic.mp3', duration: 30 },
  { id: 'crystals', name: 'Crystals', url: '/sounds/crystals.mp3', duration: 30 },
  { id: 'hillside', name: 'Hillside', url: '/sounds/hillside.mp3', duration: 30 },
  { id: 'illuminate', name: 'Illuminate', url: '/sounds/illuminate.mp3', duration: 30 },
  { id: 'night_owl', name: 'Night Owl', url: '/sounds/night_owl.mp3', duration: 30 },
  { id: 'opening', name: 'Opening', url: '/sounds/opening.mp3', duration: 30 },
  { id: 'playtime', name: 'Playtime', url: '/sounds/playtime.mp3', duration: 30 },
  { id: 'presto', name: 'Presto', url: '/sounds/presto.mp3', duration: 30 },
  { id: 'radiate', name: 'Radiate', url: '/sounds/radiate.mp3', duration: 30 },
  { id: 'reflection', name: 'Reflection', url: '/sounds/reflection.mp3', duration: 30 },
  { id: 'sencha', name: 'Sencha', url: '/sounds/sencha.mp3', duration: 30 },
  { id: 'silk', name: 'Silk', url: '/sounds/silk.mp3', duration: 30 },
  { id: 'slow_rise', name: 'Slow Rise', url: '/sounds/slow_rise.mp3', duration: 30 },
  { id: 'stargaze', name: 'Stargaze', url: '/sounds/stargaze.mp3', duration: 30 },
  { id: 'summit', name: 'Summit', url: '/sounds/summit.mp3', duration: 30 },
  { id: 'twinkle', name: 'Twinkle', url: '/sounds/twinkle.mp3', duration: 30 },
  { id: 'uplift', name: 'Uplift', url: '/sounds/uplift.mp3', duration: 30 }
];

interface RingtoneSelectorProps {
  selectedRingtone: string;
  onSelectRingtone: (ringtoneId: string) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  accentColor: string;
  textColor: string;
  onClose: () => void;
}

export function RingtoneSelector({
  selectedRingtone,
  onSelectRingtone,
  volume,
  onVolumeChange,
  accentColor,
  textColor,
  onClose
}: RingtoneSelectorProps) {
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioFilesAvailable, setAudioFilesAvailable] = useState(false);
  const [customRingtones, setCustomRingtones] = useState<Ringtone[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if audio files are available
  useEffect(() => {
    const checkAudio = async () => {
      try {
        const response = await fetch('/sounds/radar.mp3', { method: 'HEAD' });
        setAudioFilesAvailable(response.ok);
      } catch {
        setAudioFilesAvailable(false);
      }
    };
    checkAudio();

    // Load custom ringtones from localStorage
    const savedCustom = localStorage.getItem('customRingtones');
    if (savedCustom) {
      try {
        setCustomRingtones(JSON.parse(savedCustom));
      } catch (e) {
        console.error('Error loading custom ringtones:', e);
      }
    }
  }, []);

  const handlePreview = (ringtone: Ringtone) => {
    if (!audioFilesAvailable) {
      toast.error('File audio non disponibili', {
        description: 'Aggiungi i file MP3 in /public/sounds/ per ascoltare l\'anteprima. Vedi /public/sounds/README.md',
        duration: 5000,
      });
      return;
    }

    // Stop current preview if any
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (previewingId === ringtone.id) {
      // Stop preview
      setPreviewingId(null);
      setAudio(null);
    } else {
      // Start new preview
      const newAudio = new Audio(ringtone.url);
      newAudio.volume = volume;
      
      newAudio.addEventListener('error', () => {
        toast.error('Errore riproduzione audio', {
          description: `Il file ${ringtone.name} non è stato trovato in /public/sounds/`,
          duration: 4000,
        });
        setPreviewingId(null);
      });

      newAudio.play().catch(err => {
        console.error('Error playing preview:', err);
        toast.error('Impossibile riprodurre audio', {
          description: 'Verifica che i file MP3 siano presenti in /public/sounds/',
          duration: 4000,
        });
        setPreviewingId(null);
      });
      
      // Auto stop after 5 seconds
      setTimeout(() => {
        if (newAudio) {
          newAudio.pause();
          setPreviewingId(null);
        }
      }, 5000);

      setAudio(newAudio);
      setPreviewingId(ringtone.id);
    }
  };

  const handleSelect = (ringtoneId: string) => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    setPreviewingId(null);
    onSelectRingtone(ringtoneId);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    onVolumeChange(vol);
    if (audio) {
      audio.volume = vol;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Formato non supportato', {
        description: 'Seleziona un file audio (MP3, M4A, WAV, etc.)',
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File troppo grande', {
        description: 'Il file audio deve essere massimo 5MB',
      });
      return;
    }

    // Create object URL
    const url = URL.createObjectURL(file);
    const customRingtone: Ringtone = {
      id: `custom_${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      url: url,
      duration: 30,
      isCustom: true
    };

    const updated = [...customRingtones, customRingtone];
    setCustomRingtones(updated);
    localStorage.setItem('customRingtones', JSON.stringify(updated));

    toast.success('Suoneria aggiunta', {
      description: `"${customRingtone.name}" importata con successo`,
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteCustom = (ringtoneId: string) => {
    const ringtone = customRingtones.find(r => r.id === ringtoneId);
    if (!ringtone) return;

    // Revoke object URL to free memory
    URL.revokeObjectURL(ringtone.url);

    const updated = customRingtones.filter(r => r.id !== ringtoneId);
    setCustomRingtones(updated);
    localStorage.setItem('customRingtones', JSON.stringify(updated));

    // If this was selected, reset to default
    if (selectedRingtone === ringtoneId) {
      onSelectRingtone('radar');
    }

    toast.success('Suoneria rimossa');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col landscape:flex-row"
      style={{ background: '#000000' }}
    >
      {/* Header */}
      <div className="pt-safe px-5 sm:px-8 pb-4 sm:pb-5 border-b landscape:pr-safe landscape:w-full landscape:max-w-sm landscape:border-r landscape:border-b-0" 
        style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Volume2 size={24} className="sm:w-7 sm:h-7" style={{ color: accentColor }} />
            <h1 className="text-2xl sm:text-3xl landscape:text-xl" style={{ color: textColor }}>Suoneria</h1>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-base sm:text-lg landscape:text-sm -mr-2"
            style={{ color: accentColor }}
          >
            Fine
          </Button>
        </div>

        {/* Volume Control */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Volume2 size={18} style={{ color: textColor }} className="opacity-60" />
            <span className="text-sm opacity-60" style={{ color: textColor }}>
              Volume
            </span>
            <span className="text-sm ml-auto" style={{ color: accentColor }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Warning se file audio non disponibili */}
        {!audioFilesAvailable && (
          <div 
            className="mt-4 p-3 rounded-xl flex items-start gap-2 text-xs"
            style={{ 
              background: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)'
            }}
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#ff9800' }} />
            <div style={{ color: textColor }} className="opacity-80">
              <p className="font-medium mb-1">File audio non disponibili</p>
              <p className="opacity-70 leading-relaxed">
                Puoi selezionare una suoneria, ma l'anteprima non funzionerà finché non aggiungi i file MP3 in <code className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>/public/sounds/</code>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lista suonerie */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-safe landscape:px-10 landscape:py-8">
        <div className="space-y-6 max-w-2xl mx-auto">
          
          {/* Sezione Custom Ringtones */}
          {customRingtones.length > 0 && (
            <div>
              <h3 className="text-sm opacity-50 mb-3 px-2" style={{ color: textColor }}>
                Le mie suonerie
              </h3>
              <div className="space-y-1">
                {customRingtones.map((ringtone) => {
                  const isSelected = selectedRingtone === ringtone.id;
                  const isPreviewing = previewingId === ringtone.id;

                  return (
                    <motion.div
                      key={ringtone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: isSelected ? accentColor + '15' : 'transparent',
                        border: `1px solid ${isSelected ? accentColor + '40' : 'transparent'}`
                      }}
                      onClick={() => handleSelect(ringtone.id)}
                    >
                      {/* Nome */}
                      <div className="flex-1 min-w-0">
                        <span 
                          className="text-base block truncate"
                          style={{ 
                            color: textColor,
                            fontWeight: isSelected ? '600' : '400'
                          }}
                        >
                          {ringtone.name}
                        </span>
                      </div>

                      {/* Preview button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(ringtone);
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-10 h-10 rounded-full p-0 flex-shrink-0"
                        style={{
                          background: isPreviewing ? accentColor + '20' : 'rgba(255, 255, 255, 0.05)',
                          color: isPreviewing ? accentColor : textColor
                        }}
                      >
                        {isPreviewing ? <Pause size={16} /> : <Play size={16} />}
                      </Button>

                      {/* Delete button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustom(ringtone.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-10 h-10 rounded-full p-0 flex-shrink-0"
                        style={{
                          background: 'rgba(255, 59, 48, 0.1)',
                          color: '#ff3b30'
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>

                      {/* Checkmark */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="flex-shrink-0"
                        >
                          <Check size={20} style={{ color: accentColor }} />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload button */}
          <div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 rounded-xl flex items-center justify-center gap-2 text-base"
              style={{
                background: accentColor + '15',
                border: `1px dashed ${accentColor}40`,
                color: accentColor
              }}
            >
              <Upload size={20} />
              <span>Importa dal tuo telefono</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-xs opacity-50 mt-2 px-2 text-center leading-relaxed" style={{ color: textColor }}>
              Seleziona file audio dalle cartelle del tuo dispositivo (Files, Downloads, iCloud Drive)<br />
              <span className="opacity-70">Formati: MP3, M4A, WAV • Max 5MB</span>
            </p>
          </div>

          {/* Sezione Default Ringtones */}
          <div>
            <h3 className="text-sm opacity-50 mb-3 px-2" style={{ color: textColor }}>
              Suonerie predefinite
            </h3>
            <div className="space-y-1">
              {defaultRingtones.map((ringtone) => {
            const isSelected = selectedRingtone === ringtone.id;
            const isPreviewing = previewingId === ringtone.id;

            return (
              <motion.div
                key={ringtone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer"
                style={{
                  background: isSelected ? accentColor + '15' : 'transparent',
                  border: `1px solid ${isSelected ? accentColor + '40' : 'transparent'}`
                }}
                onClick={() => handleSelect(ringtone.id)}
              >
                {/* Nome */}
                <div className="flex-1">
                  <span 
                    className="text-base"
                    style={{ 
                      color: textColor,
                      fontWeight: isSelected ? '600' : '400'
                    }}
                  >
                    {ringtone.name}
                  </span>
                </div>

                {/* Preview button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(ringtone);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 rounded-full p-0"
                  style={{
                    background: isPreviewing ? accentColor + '20' : 'rgba(255, 255, 255, 0.05)',
                    color: isPreviewing ? accentColor : textColor
                  }}
                >
                  {isPreviewing ? <Pause size={16} /> : <Play size={16} />}
                </Button>

                {/* Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check size={20} style={{ color: accentColor }} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
