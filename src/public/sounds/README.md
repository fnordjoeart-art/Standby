# Suonerie StandBy+

## Istruzioni

Questa cartella deve contenere i file audio delle suonerie.

### File richiesti:

```
/public/sounds/
  ├── radar.mp3
  ├── apex.mp3
  ├── beacon.mp3
  ├── bulletin.mp3
  ├── chimes.mp3
  ├── circuit.mp3
  ├── constellation.mp3
  ├── cosmic.mp3
  ├── crystals.mp3
  ├── hillside.mp3
  ├── illuminate.mp3
  ├── night_owl.mp3
  ├── opening.mp3
  ├── playtime.mp3
  ├── presto.mp3
  ├── radiate.mp3
  ├── reflection.mp3
  ├── sencha.mp3
  ├── silk.mp3
  ├── slow_rise.mp3
  ├── stargaze.mp3
  ├── summit.mp3
  ├── twinkle.mp3
  └── uplift.mp3
```

### Dove trovare suonerie:

1. **Freesound.org** - Libreria di suoni gratuiti
   - https://freesound.org/search/?q=alarm

2. **Zapsplat.com** - Effetti sonori gratuiti
   - https://www.zapsplat.com/sound-effect-category/alarms/

3. **Pixabay Audio** - Audio royalty-free
   - https://pixabay.com/sound-effects/search/alarm/

4. **iOS-style ringtones**
   - Cerca "iOS alarm sounds" su archive.org
   - Alternative open-source su GitHub

### Specifiche tecniche:

- **Formato:** MP3 (preferito) o M4A
- **Bitrate:** 128-192 kbps
- **Durata:** 15-30 secondi
- **Fade-in:** Consigliato nei primi 1-2 secondi
- **Loop:** I file devono essere loopabili senza interruzioni

### Note legali:

⚠️ Assicurati che tutti i file audio siano:
- Royalty-free
- Utilizzabili commercialmente
- Con licenza compatibile (CC0, CC-BY, o simili)

### Placeholder temporaneo:

Durante lo sviluppo, puoi usare:
- Beep tones generati proceduralmente
- TTS (text-to-speech) come fallback
- Silent audio con vibrazione

### Build iOS:

Per la versione iOS, considera di usare le suonerie native tramite:
- `AVAudioSession` per suoni di sistema
- `UNNotificationSound` per notifiche personalizzate
