# StandBy+ — Sveglia da Comodino

App iOS premium con sfondi video loop, temi personalizzabili e supporto modalità StandBy.

## 🚀 Funzionalità

### MVP (v1.0)
- ✅ **Orologio Analogico e Digitale** - Tap per cambiare modalità
- ✅ **Temi Completamente Personalizzabili** - 4 preset + personalizzazione colori completa
- ✅ **Sfondi Video Loop** - Collezione integrata con video seamless
- ✅ **Sistema Sveglie** - Notifiche locali, ripetizioni settimanali, fade-in
- ✅ **Modalità StandBy** - Rilevamento automatico landscape + carica
- ✅ **Dimming Automatico** - Riduzione luminosità notturna (22:00-07:00)
- ✅ **Anti Burn-in** - Micro-movimento dell'orologio analogico
- ✅ **Risparmio Energetico** - Pausa video con batteria < 20%
- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **Wake Lock API** - Mantiene schermo acceso
- ✅ **Persistenza Locale** - Tutte le impostazioni salvate su localStorage
- ✅ **Privacy-First** - Zero tracking, dati solo on-device

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
├── capacitor.config.ts         # Config Capacitor
├── components/
│   ├── AnalogClock.tsx        # Orologio analogico con lancette animate
│   ├── DigitalClock.tsx       # Orologio digitale responsive
│   ├── AlarmManager.tsx       # Gestione sveglie + notifiche
│   ├── ThemeCustomizer.tsx    # Personalizzazione colori
│   ├── BackgroundSelector.tsx # Scelta sfondi video/immagini
│   ├── VideoBackground.tsx    # Player video con gestione batteria
│   └── Settings.tsx           # Pannello impostazioni
├── src/
│   └── main.tsx              # Init Capacitor + Wake Lock + Notifications
└── styles/
    └── globals.css           # Safe areas iOS + typography
```

## 🎨 Temi Predefiniti

1. **Apple Modern** (default) - Rosa neon (#FF2E91) + Blu ciano (#0FA3FF)
2. **Vintage '80** - Rosa pastello + Ciano neon
3. **Natura Relax** - Verde acqua + Oro
4. **Futuristico** - Verde neon + Viola

## 🔔 Sistema Sveglie

- Ripetizioni settimanali (selezione giorni)
- Vibrazione opzionale
- Notifiche locali native (Capacitor)
- Fade-in volume (preparato per implementazione audio)
- Anello colorato su orologio analogico per prossima sveglia

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

## 🚧 Roadmap Fase 2

- [ ] Widget Lock Screen (WidgetKit)
- [ ] Routine sveglia (meteo/agenda/quote)
- [ ] Challenge disattivazione (math/puzzle/QR)
- [ ] iCloud sync temi
- [ ] Pack premium sfondi (IAP)
- [ ] Import foto/video da libreria utente
- [ ] Audio ambient (white noise/mare/pioggia)
- [ ] Telemetry privacy-first (TelemetryDeck)

## 📄 Licenza

Copyright © 2025 StandBy+. All rights reserved.

---

**Bundle ID**: `com.playserious.standbyplus`  
**Target iOS**: 17+  
**Versione**: 1.0.0
