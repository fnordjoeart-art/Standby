# Testing Guide - StandBy+

Guida completa per testare tutte le funzionalità dell'app.

## 🧪 Test Checklist

### ✅ UI/UX Base

#### Logo e Header
- [ ] Logo StandBy+ visibile in header portrait
- [ ] Logo ha dimensioni corrette (40x40px mobile, 48x48px tablet)
- [ ] Spaziatura adeguata dai bordi (min 20px)
- [ ] Icona notifiche (campanella) visibile solo se ci sono sveglie attive
- [ ] Badge numero sveglie aggiornato correttamente
- [ ] Icona Settings sempre visibile in alto a destra
- [ ] Tutti gli elementi rispettano safe area iOS (notch, Dynamic Island)

#### Spaziamenti Mobile
- [ ] Padding laterali corretti su tutti i pannelli (20px mobile, 32px tablet)
- [ ] Gap tra elementi min 12px mobile, 16px tablet
- [ ] Bottoni min 40x40px (touch target Apple HIG)
- [ ] Testo leggibile (min 14px mobile, 16px tablet)
- [ ] Nessun elemento attaccato ai bordi dello schermo

### ⏰ Orologio

#### Orologio Analogico
- [ ] Visualizza ora corretta
- [ ] Lancette ruotano smoothly
- [ ] Tap per switch a digitale
- [ ] Dimensioni responsive:
  - [ ] Mobile portrait: 280px
  - [ ] Mobile landscape: 180px
  - [ ] Tablet: 350px
  - [ ] Desktop: 400px
- [ ] Anti burn-in: micro-movimento ogni X secondi
- [ ] Anello sveglia visibile quando c'è prossima sveglia

#### Orologio Digitale
- [ ] Formato 24h
- [ ] Aggiorna ogni secondo (in modalità normale)
- [ ] Aggiorna ogni minuto (in energy saving)
- [ ] Font size responsive
- [ ] Tap per switch ad analogico
- [ ] Data visibile sotto orario

### 🔔 Sveglie

#### Creazione/Modifica
- [ ] Tap "+" crea nuova sveglia
- [ ] Time Picker a rotella funziona
- [ ] Scroll smooth su rotella ore/minuti
- [ ] Selezione giorni settimana funziona
- [ ] Toggle giorni visualmente chiaro
- [ ] Label modificabile
- [ ] Vibrazione toggle funziona
- [ ] Suoneria selezionabile
- [ ] Salvataggio corretto

#### Gestione Sveglie
- [ ] Lista sveglie visibile
- [ ] Toggle on/off funziona
- [ ] Elimina sveglia funziona
- [ ] Badge aggiornato correttamente
- [ ] Prossima sveglia mostrata in basso schermo principale
- [ ] Persistenza localStorage (reload browser)

#### Audio Sveglie
- [ ] Pannello suonerie apre correttamente
- [ ] 24 suonerie elencate
- [ ] Preview audio 5 secondi funziona
- [ ] Preview si ferma automaticamente dopo 5s
- [ ] Slider volume funziona (0-100%)
- [ ] Volume applicato correttamente
- [ ] Selezione suoneria salvata
- [ ] Icona checkmark su suoneria selezionata

#### Sveglia Attiva (Ringing)
- [ ] Schermata fullscreen quando suona
- [ ] Audio parte con fade-in (3 secondi)
- [ ] Animazione bell icon pulsante
- [ ] Barra volume live visibile
- [ ] Vibrazione iOS pattern (se supportata)
- [ ] Pulsante "Stop" funziona
- [ ] Pulsante "Snooze (5 min)" funziona
- [ ] Snooze crea sveglia temporanea +5 min
- [ ] Sveglia si ferma dopo timeout
- [ ] Audio si interrompe completamente su dismiss

### 🎨 Temi

#### Preset
- [ ] 6 temi predefiniti disponibili
- [ ] Tap su preset applica tema immediatamente
- [ ] Preview live funziona
- [ ] Colori corretti per ogni tema:
  - [ ] Midnight (default)
  - [ ] Neon Nights
  - [ ] Ocean Breeze
  - [ ] Sunset Glow
  - [ ] Forest Dream
  - [ ] Natura

#### Personalizzazione
- [ ] Color picker apre correttamente
- [ ] Input hex funziona
- [ ] Cambio colore si riflette live
- [ ] 6 parametri personalizzabili:
  - [ ] Background
  - [ ] Surface
  - [ ] Primary Accent
  - [ ] Secondary Accent
  - [ ] Text Primary
  - [ ] Text Secondary
- [ ] Reset a default funziona
- [ ] Persistenza localStorage

### 🖼️ Sfondi

#### Video
- [ ] Tab Video funziona
- [ ] Upload video custom funziona (max 100MB)
- [ ] 4 video predefiniti mostrati
- [ ] Video loop seamless
- [ ] Preview video on hover (desktop)
- [ ] Selezione applica immediatamente
- [ ] Pulsante X per eliminare custom video
- [ ] Elimina libera memoria (blob URL revoked)
- [ ] Opzione "Nessuno" funziona

#### Immagini
- [ ] Tab Immagini funziona
- [ ] Upload immagine custom funziona (max 10MB)
- [ ] 4 immagini predefinite mostrate
- [ ] Preview immagine
- [ ] Selezione applica immediatamente
- [ ] Pulsante X per eliminare custom immagine
- [ ] Persistenza in localStorage

#### Gestione Batteria
- [ ] Video pausa automatica se batteria < 20%
- [ ] Toast notifica quando video pausa per batteria
- [ ] Video riprende quando ricarica

### ⚙️ Impostazioni

#### Display
- [ ] Slider luminosità funziona (0-100%)
- [ ] Valore percentuale aggiorna live
- [ ] Auto-dimming toggle funziona
- [ ] Dimming attivo 22:00-07:00
- [ ] Anti burn-in toggle funziona
- [ ] Energy saving toggle funziona
- [ ] Parallax toggle funziona (solo mobile con accelerometro)

#### Navigazione
- [ ] Tap "Sveglie" apre pannello sveglie
- [ ] Tap "Suonerie" apre pannello suonerie
- [ ] Tap "Sfondi" apre pannello sfondi
- [ ] Tap "Aspetto" apre pannello temi
- [ ] Tutte le transizioni smooth

#### Info
- [ ] Versione app mostrata correttamente
- [ ] Informazioni StandBy Mode:
  - [ ] NON menziona "iPhone 14 Pro"
  - [ ] Dice genericamente "Always-On Display"
- [ ] Privacy Policy:
  - [ ] Testo descrittivo presente
  - [ ] Link https://playserious.it/AppStorePrivacy
  - [ ] Link apre in nuova tab
  - [ ] Icona external link visibile

#### Reset
- [ ] Pulsante "Reset Impostazioni"
- [ ] Conferma richiesta
- [ ] Reset ripristina tema default
- [ ] Reset mantiene sveglie (non le cancella)

### 📱 Responsive

#### Portrait Mobile
- [ ] Header visibile con logo
- [ ] Orologio centrato
- [ ] Prossima sveglia in basso
- [ ] Tutti i pannelli scrollabili
- [ ] Safe area rispettata

#### Landscape Mobile (StandBy Mode)
- [ ] Header nascosto
- [ ] Badge "StandBy Mode" visibile top-left
- [ ] Settings icon visibile top-right
- [ ] Orologio centrato più piccolo
- [ ] Layout ottimizzato per comodino

#### Tablet
- [ ] Layout 2 colonne dove appropriato
- [ ] Font size più grandi
- [ ] Icone più grandi
- [ ] Touch targets min 44x44pt

#### Desktop
- [ ] Fullscreen toggle visibile
- [ ] Fullscreen funziona (F11 o bottone)
- [ ] Mouse hover states
- [ ] Layout max-width per leggibilità

### 🔋 Performance

#### Memory
- [ ] Nessun memory leak con video loop
- [ ] Blob URLs revocati correttamente
- [ ] LocalStorage non cresce indefinitamente
- [ ] Video custom eliminati liberano memoria

#### Battery
- [ ] Wake Lock attivo quando in landscape
- [ ] Video pausa con batteria bassa
- [ ] Energy saving riduce aggiornamenti orologio
- [ ] Dimming riduce luminosità di notte

#### Animation
- [ ] Tutte le animazioni smooth (60fps)
- [ ] Nessun lag su transizioni
- [ ] Parallax non causa lag (se attivo)
- [ ] Anti burn-in movement impercettibile

### 🌐 Capacitor (Build Nativa)

⚠️ **Questi test richiedono build iOS/Android**

#### iOS
- [ ] Notifiche locali funzionano
- [ ] Suoni sveglia riproducibili
- [ ] Vibrazione funziona
- [ ] Safe area corretta (notch, Dynamic Island)
- [ ] StandBy Mode rilevato quando in landscape + carica
- [ ] Battery API funziona
- [ ] Wake Lock mantiene schermo acceso
- [ ] App non va in background durante uso

#### Android
- [ ] Notifiche locali funzionano
- [ ] Suoni sveglia riproducibili
- [ ] Vibrazione funziona
- [ ] Safe area gestita correttamente
- [ ] Battery API funziona
- [ ] Wake Lock mantiene schermo acceso

## 🐛 Bug Known / To Fix

Nessun bug critico noto al momento.

## ⚠️ Limitazioni Browser

Quando testi in browser (non build nativa):

- ❌ Notifiche locali NON funzionano (require Capacitor)
- ⚠️ Suoni sveglia NON funzionano (file MP3 non presenti per default)
  - L'app mostra un warning arancione
  - Puoi comunque selezionare le suonerie
  - Aggiungi i file MP3 in `/public/sounds/` per testare l'audio
  - Vedi `/public/sounds/README.md` per link risorse
- ❌ Vibrazione NON funziona su desktop
- ⚠️ Battery API potrebbe non essere disponibile
- ⚠️ Wake Lock potrebbe non funzionare
- ⚠️ Accelerometro non disponibile su desktop

### Testing Audio Suonerie

Per testare le suonerie:
1. Scarica file MP3 da fonti royalty-free (vedi `/public/sounds/README.md`)
2. Rinomina i file come indicato (es: `radar.mp3`, `apex.mp3`, etc.)
3. Posiziona i file in `/public/sounds/`
4. Ricarica l'app - il warning sparirà
5. Testa preview audio nel pannello Suonerie

## 📊 Test Results Template

Copia e compila durante il testing:

```
# Test Session - [Data]
Device: [iPhone 15 Pro / Samsung Galaxy S23 / iPad Pro / etc]
OS: [iOS 17.2 / Android 14 / etc]
Build: [Native / Browser]

## Risultati

### UI/UX: ✅ / ⚠️ / ❌
- Logo: 
- Spaziamenti: 
- Safe Area: 

### Orologio: ✅ / ⚠️ / ❌
- Analogico: 
- Digitale: 
- Switch: 

### Sveglie: ✅ / ⚠️ / ❌
- Creazione: 
- Audio: 
- Ringing: 
- Snooze: 

### Temi: ✅ / ⚠️ / ❌
- Preset: 
- Custom: 

### Sfondi: ✅ / ⚠️ / ❌
- Video: 
- Immagini: 
- Delete: 

### Settings: ✅ / ⚠️ / ❌
- Display: 
- Privacy: 

### Performance: ✅ / ⚠️ / ❌
- Memory: 
- Battery: 
- FPS: 

## Note
[Aggiungi note qui]
```

## 🚀 Quick Test Commands

### Browser Testing
```bash
npm run dev
# Apri http://localhost:5173
# Testa funzionalità base
```

### iOS Testing
```bash
npm run build
npx cap sync ios
npx cap open ios
# Build in Xcode
# Test su Simulator o device reale
```

### Android Testing
```bash
npm run build
npx cap sync android
npx cap open android
# Build in Android Studio
# Test su Emulator o device reale
```

---

**Happy Testing! 🧪**
