import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';

export interface Theme {
  background: string;
  surface: string;
  primaryAccent: string;
  secondaryAccent: string;
  textPrimary: string;
  textSecondary: string;
}

const defaultTheme: Theme = {
  background: '#000000',
  surface: '#0A0A0A',
  primaryAccent: '#FF2E91',
  secondaryAccent: '#0FA3FF',
  textPrimary: '#FFFFFF',
  textSecondary: '#F0F0F0'
};

interface ThemeCustomizerProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onClose: () => void;
}

export function ThemeCustomizer({ theme, onThemeChange, onClose }: ThemeCustomizerProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(theme);

  const updateColor = (key: keyof Theme, value: string) => {
    const updated = { ...currentTheme, [key]: value };
    setCurrentTheme(updated);
    onThemeChange(updated);
  };

  const resetTheme = () => {
    setCurrentTheme(defaultTheme);
    onThemeChange(defaultTheme);
  };

  const presets = [
    { name: 'Apple Modern', theme: defaultTheme },
    { 
      name: 'Vintage', 
      theme: {
        background: '#1a0a2e',
        surface: '#16213e',
        primaryAccent: '#ff6b9d',
        secondaryAccent: '#00ffff',
        textPrimary: '#ffffff',
        textSecondary: '#e4e4e4'
      }
    },
    { 
      name: 'Natura', 
      theme: {
        background: '#0d1b2a',
        surface: '#1b263b',
        primaryAccent: '#4ecdc4',
        secondaryAccent: '#f7b801',
        textPrimary: '#ffffff',
        textSecondary: '#e0fbfc'
      }
    },
    { 
      name: 'Futuristico', 
      theme: {
        background: '#000000',
        surface: '#0a0e27',
        primaryAccent: '#00ff88',
        secondaryAccent: '#7000ff',
        textPrimary: '#ffffff',
        textSecondary: '#b8b8ff'
      }
    }
  ];

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="mb-4 sm:mb-6">
      <Label className="block mb-2 text-xs sm:text-sm" style={{ color: currentTheme.textSecondary }}>
        {label}
      </Label>
      <div className="flex items-center gap-2 sm:gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl cursor-pointer border-2"
          style={{ borderColor: currentTheme.primaryAccent }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm uppercase tracking-wider"
          style={{
            background: currentTheme.surface,
            color: currentTheme.textPrimary,
            border: `1px solid ${currentTheme.primaryAccent}40`
          }}
        />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ 
        background: currentTheme.background
      }}
    >
      <div className="pt-safe px-5 sm:px-8 pb-4 sm:pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Palette size={24} className="sm:w-7 sm:h-7" style={{ color: currentTheme.primaryAccent }} />
            <h1 className="text-2xl sm:text-3xl landscape:text-xl" style={{ color: currentTheme.textPrimary }}>Aspetto</h1>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-base sm:text-lg landscape:text-sm -mr-2"
            style={{ color: currentTheme.primaryAccent }}
          >
            Fine
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-safe landscape:px-10 landscape:py-6">
        <div className="landscape:max-w-6xl landscape:mx-auto landscape:grid landscape:grid-cols-2 landscape:gap-8">
        {/* Colonna sinistra */}
        <div className="space-y-6 sm:space-y-8">
          {/* Preset */}
          <div className="mb-6 sm:mb-8 landscape:mb-0">
            <h3 className="text-base sm:text-lg mb-3 sm:mb-4" style={{ color: currentTheme.textPrimary }}>Temi Predefiniti</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setCurrentTheme(preset.theme);
                    onThemeChange(preset.theme);
                  }}
                  className="p-3 sm:p-4 landscape:p-3 rounded-xl sm:rounded-2xl landscape:rounded-xl text-left transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${preset.theme.primaryAccent}20, ${preset.theme.secondaryAccent}20)`,
                    border: `2px solid ${preset.theme.primaryAccent}40`
                  }}
                >
                  <div className="flex gap-1.5 sm:gap-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 landscape:w-5 landscape:h-5 rounded-full" style={{ background: preset.theme.primaryAccent }} />
                    <div className="w-5 h-5 sm:w-6 sm:h-6 landscape:w-5 landscape:h-5 rounded-full" style={{ background: preset.theme.secondaryAccent }} />
                  </div>
                  <div className="text-xs sm:text-sm landscape:text-xs" style={{ color: currentTheme.textPrimary }}>{preset.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview - visibile solo in landscape qui */}
          <div className="hidden landscape:block">
            <div 
              className="p-4 sm:p-6 landscape:p-5 rounded-2xl sm:rounded-3xl landscape:rounded-2xl"
              style={{ 
                background: currentTheme.surface,
                border: `1px solid ${currentTheme.primaryAccent}40`
              }}
            >
              <div className="text-center">
                <div className="text-4xl sm:text-6xl landscape:text-4xl mb-2" style={{ color: currentTheme.textPrimary }}>12:34</div>
                <div className="text-xs sm:text-sm landscape:text-xs mb-3 sm:mb-4 landscape:mb-3" style={{ color: currentTheme.textSecondary }}>Preview Tema</div>
                <div className="flex gap-2 justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 landscape:w-10 landscape:h-10 rounded-full" style={{ background: currentTheme.primaryAccent }} />
                  <div className="w-10 h-10 sm:w-12 sm:h-12 landscape:w-10 landscape:h-10 rounded-full" style={{ background: currentTheme.secondaryAccent }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonna destra - Personalizzazione */}
        <div className="mb-6 sm:mb-8 landscape:mb-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg" style={{ color: currentTheme.textPrimary }}>Personalizza</h3>
            <Button
              onClick={resetTheme}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              style={{ color: currentTheme.primaryAccent }}
            >
              <RotateCcw size={14} className="sm:w-4 sm:h-4" />
              Reset
            </Button>
          </div>

          <ColorPicker 
            label="Sfondo" 
            value={currentTheme.background} 
            onChange={(v) => updateColor('background', v)} 
          />
          <ColorPicker 
            label="Superficie" 
            value={currentTheme.surface} 
            onChange={(v) => updateColor('surface', v)} 
          />
          <ColorPicker 
            label="Accento Primario" 
            value={currentTheme.primaryAccent} 
            onChange={(v) => updateColor('primaryAccent', v)} 
          />
          <ColorPicker 
            label="Accento Secondario" 
            value={currentTheme.secondaryAccent} 
            onChange={(v) => updateColor('secondaryAccent', v)} 
          />
          <ColorPicker 
            label="Testo Primario" 
            value={currentTheme.textPrimary} 
            onChange={(v) => updateColor('textPrimary', v)} 
          />
          <ColorPicker 
            label="Testo Secondario" 
            value={currentTheme.textSecondary} 
            onChange={(v) => updateColor('textSecondary', v)} 
          />
        </div>

        {/* Preview - visibile solo in portrait */}
        <div className="landscape:hidden">
          <div 
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4"
            style={{ 
              background: currentTheme.surface,
              border: `1px solid ${currentTheme.primaryAccent}40`
            }}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-2" style={{ color: currentTheme.textPrimary }}>12:34</div>
              <div className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: currentTheme.textSecondary }}>Preview Tema</div>
              <div className="flex gap-2 justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" style={{ background: currentTheme.primaryAccent }} />
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" style={{ background: currentTheme.secondaryAccent }} />
              </div>
            </div>
          </div>
        </div>
        
        </div>
      </div>
    </motion.div>
  );
}
