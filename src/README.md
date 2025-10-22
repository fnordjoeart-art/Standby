# StandBy+ — Sveglia da Comodino

App iOS premium con sfondi video loop, temi personalizzabili, audio sveglie avanzate e supporto modalità StandBy.

## 🚀 Funzionalità

### MVP (v1.0)
- ✅ **Orologio Analogico e Digitale** - Tap per cambiare modalità
- ✅ **Temi Completamente Personalizzabili** - 6 preset + personalizzazione colori completa
- ✅ **Sfondi Video Loop** - Collezione integrata con video seamless + upload custom
- ✅ **Sistema Sveglie Completo**
  - Time Picker a rotella stile iOS
  - Notifiche locali native
  - Ripetizioni settimanali
  - 24 suonerie stile iOS (Radar, Apex, Beacon, etc.)
  - Volume regolabile con fade-in automatico (3s)
  - Vibrazione iOS-style
  - Snooze configurabile (default 5 min)
  - Schermata fullscreen quando suona
- ✅ **Modalità StandBy** - Rilevamento automatico landscape + carica
- ✅ **Dimming Automatico** - Riduzione luminosità notturna (22:00-07:00)
- ✅ **Anti Burn-in** - Micro-movimento dell'orologio analogico
- ✅ **Risparmio Energetico** - Pausa video con batteria < 20%
- ✅ **Responsive Design** - Mobile, tablet, desktop con safe area iOS
- ✅ **Wake Lock API** - Mantiene schermo acceso
- ✅ **Persistenza Locale** - Tutte le impostazioni salvate su localStorage
- ✅ **Privacy-First** - Zero tracking, dati solo on-device ([Privacy Policy](https://playserious.it/AppStorePrivacy))

## 📱 Stack Tecnologico

- **Framework**: React 18 + TypeScript
- **Mobile**: Capacitor 6 (iOS + Android)
- **Animazioni**: Motion (Framer Motion)
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Capacitor Local Notifications

## 🛠️ Setup & Build

### Installazione
```bash
npm install
```

### Dev Mode (Browser)
```bash
npm run dev
```

### Build per iOS
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

### Build per Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## 📐 Architettura

```
/
├── App.tsx                     # Main app con logica centrale
├── capacitor.config.ts         # Config Capacitor (bundle: com.playserious.standbyplus)
├── CHANGELOG.md                # Changelog dettagliato modifiche
├── components/
│   ├── AnalogClock.tsx        # Orologio analogico con lancette animate
│   ├── DigitalClock.tsx       # Orologio digitale responsive
│   ├── AlarmManager.tsx       # Gestione sveglie + notifiche
│   ├── AlarmRinging.tsx       # Schermata sveglia attiva con audio
│   ├── RingtoneSelector.tsx   # Selezione 24 suonerie + volume
│   ├── TimePickerWheel.tsx    # Time picker rotella stile iOS
│   ├── ThemeCustomizer.tsx    # Personalizzazione colori (6 preset)
│   ├── BackgroundSelector.tsx # Upload/selezione sfondi video/immagini
│   ├── VideoBackground.tsx    # Player video con gestione batteria
│   └── Settings.tsx           # Pannello impostazioni completo
├── docs/
│   └── STANDBY_WIDGET.md      # Guida implementazione widget iOS nativo
├── public/
│   └── sounds/
│       └── README.md          # Guida risorse audio suonerie
├── src/
│   └── main.tsx              # Init Capacitor + Wake Lock + Notifications
└── styles/
    └── globals.css           # Safe areas iOS + typography
```

## 🎨 Temi Predefiniti

1. **Midnight** (default) - Rosa neon (#FF2E91) + Blu ciano (#0FA3FF)
2. **Neon Nights** - Rosa elettrico + Ciano neon
3. **Ocean Breeze** - Turchese + Blu oceano
4. **Sunset Glow** - Arancio + Rosa corallo
5. **Forest Dream** - Verde smeraldo + Lime
6. **Natura** - Verde acqua + Viola profondo

Ogni tema include personalizzazione completa di:
- Background e Surface
- Primary e Secondary Accent
- Text Primary e Secondary

## 🔔 Sistema Sveglie

### Gestione Sveglie
- Time Picker a rotella stile iOS (interfaccia nativa)
- Ripetizioni settimanali (selezione singoli giorni)
- Etichette personalizzabili per ogni sveglia
- Toggle on/off rapido
- Notifiche locali native (Capacitor)
- Anello colorato su orologio analogico per prossima sveglia

### Audio e Suonerie
- 24 suonerie predefinite stile iOS:
  - Radar, Apex, Beacon, Bulletin, Chimes
  - Circuit, Constellation, Cosmic, Crystals
  - Hillside, Illuminate, Night Owl, Opening
  - Playtime, Presto, Radiate, Reflection
  - Sencha, Silk, Slow Rise, Stargaze
  - Summit, Twinkle, Uplift
- Volume regolabile con slider (0-100%)
- Fade-in automatico 3 secondi
- Preview audio 5 secondi per ogni suoneria
- Vibrazione iOS-style pattern

### Snooze e Dismissal
- Snooze configurabile (default 5 minuti)
- Schermata fullscreen quando suona
- Animazione bell icon pulsante
- Barra volume live
- Pulsanti touch-friendly grandi
- Gesture intuitive dismiss/snooze

## 🌐 Modalità StandBy

L'app rileva automaticamente:
- Orientamento landscape
- Dispositivo in carica (tramite Battery API quando disponibile)
- Layout ottimizzato per comodino
- Wake Lock per mantenere schermo acceso

## 🎯 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Dimensioni orologio adattive:
- Mobile portrait: 280px
- Mobile landscape: 180px
- Tablet: 350px
- Desktop: 400px

## 🔐 Privacy

- Nessun tracking o analytics
- Nessun dato inviato a server esterni
- LocalStorage per persistenza impostazioni
- Media files restano on-device
- Zero PII (Personally Identifiable Information)
- Privacy Policy completa: [playserious.it/AppStorePrivacy](https://playserious.it/AppStorePrivacy)

## 📦 Dipendenze Principali

```json
{
  "@capacitor/core": "^6.0.0",
  "@capacitor/ios": "^6.0.0",
  "@capacitor/android": "^6.0.0",
  "@capacitor/local-notifications": "^6.0.0",
  "@capacitor/status-bar": "^6.0.0",
  "@capacitor/haptics": "^6.0.0",
  "react": "^18.2.0",
  "motion": "latest",
  "lucide-react": "latest"
}
```

## 🚧 Roadmap

### Fase 2 (v1.1) - In Pianificazione
- [ ] **Widget iOS StandBy Mode** - Widget nativo per Lock Screen ([Guida completa](/docs/STANDBY_WIDGET.md))
  - Widget piccolo/medio/grande
  - Accessory widgets per Lock Screen
  - Live Activities per sveglia attiva
  - Always-On Display optimization
- [ ] Routine sveglia (meteo/agenda/quote)
- [ ] Challenge disattivazione (math/puzzle/QR)
- [ ] Import foto/video da libreria iOS

### Fase 3 (v1.2) - Futuro
- [ ] iCloud sync temi e impostazioni
- [ ] Pack premium sfondi (IAP)
- [ ] Audio ambient (white noise/mare/pioggia)
- [ ] Spotify integration
- [ ] HealthKit statistiche sonno
- [ ] Comandi vocali Siri

## 📝 Note Implementazione

### File Audio Suonerie
I file audio MP3 delle suonerie devono essere aggiunti manualmente in `/public/sounds/`.  
Vedi `/public/sounds/README.md` per:
- Link a risorse royalty-free
- Specifiche tecniche (formato, bitrate, durata)
- Note legali e licenze

### Widget iOS
Per implementare il widget nativo StandBy Mode:
1. Leggi la guida completa: `/docs/STANDBY_WIDGET.md`
2. Richiede Xcode 15+ e Swift 5.9+
3. iOS 17+ per StandBy Mode
4. iOS 16.1+ per Always-On Display

## 📄 Licenza

Copyright © 2025 StandBy+. All rights reserved.

---

**Bundle ID**: `com.playserious.standbyplus`  
**Target iOS**: 17+  
**Versione**: 1.0.0
