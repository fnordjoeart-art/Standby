# Changelog - StandBy+

Tutte le modifiche significative al progetto saranno documentate in questo file.

## [Unreleased] - 2025-10-22

### ✨ Aggiunte

#### Audio e Sveglie
- **Sistema audio completo per sveglie**
  - 24 suonerie predefinite stile iOS (Radar, Apex, Beacon, Bulletin, Chimes, etc.)
  - Selezione suoneria personalizzata per ogni sveglia
  - Volume regolabile con slider (0-100%)
  - Fade-in automatico audio (3 secondi) per risveglio dolce
  - Vibrazione pattern iOS-style (se supportata dal dispositivo)
  
- **Funzionalità Snooze**
  - Snooze configurabile (default 5 minuti)
  - Schermata fullscreen quando la sveglia suona
  - Animazione bell icon pulsante
  - Barra volume live durante la riproduzione
  - Pulsanti grandi e touch-friendly
  - Gesture dismiss/snooze intuitive
  - Auto-stop dopo timeout

#### UI/UX
- **Logo originale StandBy+** in header al posto dell'icona campanella
- **Privacy Policy** linkabile con icona external link
  - Link: https://playserious.it/AppStorePrivacy
  - Testo descrittivo migliorato
  
- **Spaziamenti mobile ottimizzati**
  - Safe area iOS compliant su tutti i pannelli
  - Padding aumentati: `px-5 sm:px-8` invece di `px-4 sm:px-6`
  - Gap aumentati tra elementi: `gap-3 sm:gap-4` invece di `gap-2 sm:gap-3`
  - Icone e bottoni più grandi: min 40x40px (10x10 su mobile, 12x12 su tablet)
  - Elementi UI lontani dai bordi e dai limiti dello schermo
  
- **Gestione sfondi migliorata**
  - Pulsante elimina (X rosso) su ogni sfondo personalizzato
  - Possibilità di rimuovere video e immagini caricate
  - Cleanup automatico blob URL per ottimizzazione memoria

#### Documentazione
- **Widget iOS StandBy Mode** - Guida completa implementazione
  - `/docs/STANDBY_WIDGET.md` con codice Swift completo
  - Setup WidgetKit in Xcode
  - Small/Medium/Large widgets
  - Accessory widgets per Lock Screen
  - Live Activities per sveglia attiva
  - Always-On Display support
  - App Groups per condivisione dati
  - Sincronizzazione React ↔ Swift
  
- **Audio Ringtones** - Guida risorse audio
  - `/public/sounds/README.md`
  - Elenco siti per suonerie royalty-free
  - Specifiche tecniche (formato, bitrate, durata)
  - Note legali e licenze

### 🔧 Modifiche

- **Rimosso** riferimento "iPhone 14 Pro" dalla descrizione StandBy Mode
  - Ora dice genericamente "Supporta Always-On Display"
  
- **Unificata** interfaccia upload sfondi
  - Rimossa sezione duplicata "Importa i tuoi video"
  - UI più pulita e intuitiva
  - Un solo bottone upload per tipo (video/immagini)

- **Migliorata** gestione memoria
  - Blob URLs per video vengono revocati correttamente
  - Cleanup automatico in `useEffect` cleanup
  - Persistenza immagini in localStorage

### 🐛 Fix

- **Doppio bottone upload** sfondi rimosso
- **Spaziamenti** corretti su tutti i device iOS
- **Touch targets** aumentati per accessibilità (min 44pt Apple HIG)
- **Safe area** rispettata su iPhone con notch/Dynamic Island

### 📱 Componenti Creati

1. `/components/AlarmRinging.tsx` - Schermata sveglia attiva
2. `/components/RingtoneSelector.tsx` - Selettore suonerie
3. `/docs/STANDBY_WIDGET.md` - Guida widget iOS
4. `/public/sounds/README.md` - Guida audio
5. `/CHANGELOG.md` - Questo file

### ⚠️ Note Implementazione

**Audio Sveglie:**
- I file audio MP3 devono essere aggiunti manualmente in `/public/sounds/`
- Vedi `/public/sounds/README.md` per link a risorse gratuite
- Testing completo richiede build nativa iOS/Android

**Widget StandBy:**
- Richiede Xcode 15+ e Swift 5.9+
- iOS 17+ per StandBy Mode
- iOS 16.1+ per Always-On Display
- Vedi `/docs/STANDBY_WIDGET.md` per implementazione completa

**Safe Area:**
- Tutte le schermate usano classi `pt-safe`, `pb-safe`, `pl-safe`, `pr-safe`
- Compatibile con iPhone X e successivi (notch, Dynamic Island)
- Testato in portrait e landscape

### 🎯 Prossimi Step Consigliati

1. **Aggiungere file audio MP3** in `/public/sounds/`
2. **Testare su device reale** iOS/Android
3. **Implementare widget iOS** seguendo guida
4. **Build production** con `npm run build`
5. **Deploy Capacitor** con `npx cap sync`

---

## Versioni Future

### [1.1.0] - Pianificato

- Widget iOS StandBy Mode nativo
- Live Activities per sveglie
- Meteo integrato
- Più sfondi video predefiniti
- Import sfondi da Galleria iOS

### [1.2.0] - Pianificato

- Spotify integration
- Widget musicale
- Comandi vocali Siri
- Statistiche sonno (HealthKit)

---

**Formato:** [Keep a Changelog](https://keepachangelog.com/)  
**Versioning:** [Semantic Versioning](https://semver.org/)
