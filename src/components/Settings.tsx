import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Image, 
  Sun, 
  Battery,
  Info,
  RotateCcw,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface SettingsProps {
  textColor: string;
  accentColor: string;
  onClose: () => void;
  brightness: number;
  onBrightnessChange: (value: number) => void;
  autoDimming: boolean;
  onAutoDimmingChange: (value: boolean) => void;
  parallax: boolean;
  onParallaxChange: (value: boolean) => void;
  antiBurnIn: boolean;
  onAntiBurnInChange: (value: boolean) => void;
  energySaving: boolean;
  onEnergySavingChange: (value: boolean) => void;
  onOpenThemes: () => void;
  onOpenAlarms: () => void;
  onOpenBackgrounds: () => void;
  onOpenRingtones: () => void;
  onReset: () => void;
}

export function Settings({
  textColor,
  accentColor,
  onClose,
  brightness,
  onBrightnessChange,
  autoDimming,
  onAutoDimmingChange,
  parallax,
  onParallaxChange,
  antiBurnIn,
  onAntiBurnInChange,
  energySaving,
  onEnergySavingChange,
  onOpenThemes,
  onOpenAlarms,
  onOpenBackgrounds,
  onOpenRingtones,
  onReset
}: SettingsProps) {
  const [showInfo, setShowInfo] = useState(false);

  const SettingsRow = ({ 
    icon: Icon, 
    label, 
    value, 
    onClick, 
    showChevron = true 
  }: { 
    icon: any; 
    label: string; 
    value?: string; 
    onClick: () => void;
    showChevron?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon size={20} className="sm:w-6 sm:h-6" style={{ color: accentColor }} />
        <span className="text-sm sm:text-base" style={{ color: textColor }}>{label}</span>
      </div>
      {value && <span className="text-xs sm:text-sm opacity-50" style={{ color: textColor }}>{value}</span>}
      {showChevron && <ChevronRight size={18} className="sm:w-5 sm:h-5" style={{ color: textColor, opacity: 0.3 }} />}
    </button>
  );

  const ToggleRow = ({ 
    icon: Icon, 
    label, 
    checked, 
    onChange 
  }: { 
    icon: any; 
    label: string; 
    checked: boolean; 
    onChange: (value: boolean) => void;
  }) => (
    <div
      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon size={20} className="sm:w-6 sm:h-6" style={{ color: accentColor }} />
        <span className="text-sm sm:text-base" style={{ color: textColor }}>{label}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  if (showInfo) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ 
          background: '#000000'
        }}
      >
        <div className="pt-safe px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Info size={24} className="sm:w-7 sm:h-7" style={{ color: accentColor }} />
              <h1 className="text-2xl sm:text-3xl landscape:text-xl" style={{ color: textColor }}>Info</h1>
            </div>
            <Button
              onClick={() => setShowInfo(false)}
              variant="ghost"
              className="text-base sm:text-lg landscape:text-sm"
              style={{ color: accentColor }}
            >
              Chiudi
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-safe landscape:px-8">
          <div className="landscape:max-w-4xl landscape:mx-auto">
          <div 
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${accentColor}40`
            }}
          >
            <h2 className="text-xl sm:text-2xl mb-2" style={{ color: textColor }}>StandBy+</h2>
            <p className="text-xs sm:text-sm opacity-70 mb-3 sm:mb-4" style={{ color: textColor }}>
              Versione 1.0.0
            </p>
            <p className="text-xs sm:text-sm opacity-50 leading-relaxed" style={{ color: textColor }}>
              Sveglia da comodino premium con sfondi video, temi personalizzabili e supporto modalità StandBy per iPhone.
            </p>
          </div>

          <div 
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 className="text-base sm:text-lg mb-2 sm:mb-3" style={{ color: textColor }}>Modalità StandBy</h3>
            <p className="text-xs sm:text-sm opacity-70 leading-relaxed mb-2 sm:mb-3" style={{ color: textColor }}>
              Per attivare la modalità StandBy:
            </p>
            <ul className="text-xs sm:text-sm opacity-70 leading-relaxed space-y-1.5 sm:space-y-2" style={{ color: textColor }}>
              <li>1. Collega l'iPhone in carica</li>
              <li>2. Ruota il dispositivo in orizzontale</li>
              <li>3. L'app manterrà lo schermo acceso</li>
              <li>4. Supporta Always-On Display</li>
            </ul>
          </div>

          <div 
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 className="text-base sm:text-lg mb-2 sm:mb-3" style={{ color: textColor }}>Privacy</h3>
            <p className="text-xs sm:text-sm opacity-70 leading-relaxed mb-3" style={{ color: textColor }}>
              Tutti i tuoi dati rimangono sul dispositivo. Nessuna informazione viene condivisa o inviata a server esterni. 
              I media che importi restano privati e sicuri.
            </p>
            <a 
              href="https://playserious.it/AppStorePrivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm inline-flex items-center gap-1 hover:underline"
              style={{ color: accentColor }}
            >
              Leggi la Privacy Policy completa
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ 
        background: '#000000'
      }}
    >
      <div className="pt-safe px-5 sm:px-8 pb-4 sm:pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <SettingsIcon size={24} className="sm:w-7 sm:h-7" style={{ color: accentColor }} />
            <h1 className="text-2xl sm:text-3xl landscape:text-xl" style={{ color: textColor }}>Impostazioni</h1>
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
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-safe space-y-4 sm:space-y-6 landscape:px-10 landscape:py-6">
        <div className="landscape:grid landscape:grid-cols-2 landscape:gap-6 landscape:max-w-6xl landscape:mx-auto landscape:space-y-0">
        {/* Colonna sinistra in landscape */}
        <div className="space-y-4 sm:space-y-6">
          {/* Sezione Principale */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
              Principale
            </h3>
            <SettingsRow icon={Bell} label="Sveglie" onClick={onOpenAlarms} />
            <SettingsRow icon={Volume2} label="Suonerie" onClick={onOpenRingtones} />
            <SettingsRow icon={Image} label="Sfondi" onClick={onOpenBackgrounds} />
            <SettingsRow icon={Palette} label="Aspetto" onClick={onOpenThemes} />
          </div>

          {/* Luminosità */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
              Schermo
            </h3>
          <div
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Sun size={20} className="sm:w-6 sm:h-6" style={{ color: accentColor }} />
              <Label className="text-sm sm:text-base" style={{ color: textColor }}>Luminosità</Label>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={([value]) => onBrightnessChange(value)}
              min={10}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <ToggleRow 
            icon={Sun} 
            label="Dimming Automatico" 
            checked={autoDimming} 
            onChange={onAutoDimmingChange} 
          />
          </div>
        </div>

        {/* Colonna destra in landscape */}
        <div className="space-y-4 sm:space-y-6">
          {/* Avanzate */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
              Avanzate
            </h3>
            <ToggleRow 
              icon={Image} 
              label="Parallax" 
              checked={parallax} 
              onChange={onParallaxChange} 
            />
            <ToggleRow 
              icon={SettingsIcon} 
              label="Anti Burn-in" 
              checked={antiBurnIn} 
              onChange={onAntiBurnInChange} 
            />
            <ToggleRow 
              icon={Battery} 
              label="Risparmio Energetico" 
              checked={energySaving} 
              onChange={onEnergySavingChange} 
            />
          </div>

          {/* Info */}
          <div className="space-y-2 sm:space-y-3 pb-4">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider opacity-50 px-2" style={{ color: textColor }}>
              Altro
            </h3>
            <SettingsRow icon={Info} label="Informazioni" onClick={() => setShowInfo(true)} />
            <SettingsRow 
              icon={RotateCcw} 
              label="Reset Impostazioni" 
              onClick={onReset}
              showChevron={false}
            />
          </div>
        </div>

        </div>
      </div>
    </motion.div>
  );
}
