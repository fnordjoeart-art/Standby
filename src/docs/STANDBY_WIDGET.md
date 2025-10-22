# Widget iOS StandBy Mode - Guida Implementazione

## Panoramica

Il widget StandBy per StandBy+ permetterà di visualizzare l'orologio e le sveglie attive quando l'iPhone è in modalità StandBy (iOS 17+).

## Requisiti

- **iOS 17.0+** per StandBy Mode
- **iOS 16.1+** per Always-On Display (iPhone 14 Pro/Pro Max, iPhone 15 Pro/Pro Max)
- **Xcode 15+**
- **Swift 5.9+**
- **WidgetKit framework**

## Architettura

```
ios/
├── App/
│   └── App/
│       ├── AppDelegate.swift
│       └── Info.plist
├── StandByWidget/
│   ├── StandByWidget.swift          # Widget principale
│   ├── StandByWidgetBundle.swift    # Bundle widget
│   ├── StandByWidgetProvider.swift  # Data provider
│   ├── StandByWidgetEntryView.swift # UI widget
│   └── Info.plist
└── Shared/
    ├── AlarmData.swift               # Modello dati condiviso
    └── UserDefaults+Shared.swift     # Storage condiviso
```

## Implementazione

### 1. Creare Widget Extension

In Xcode:
1. File > New > Target
2. Seleziona "Widget Extension"
3. Nome: "StandByWidget"
4. Include Configuration Intent: NO (per ora)
5. Crea

### 2. StandByWidget.swift

```swift
import WidgetKit
import SwiftUI

struct StandByWidget: Widget {
    let kind: String = "StandByWidget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            StandByWidgetEntryView(entry: entry)
                .containerBackground(.black, for: .widget)
        }
        .configurationDisplayName("StandBy+")
        .description("Orologio e sveglie in modalità StandBy")
        .supportedFamilies([
            .systemSmall,
            .systemMedium,
            .systemLarge,
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryInline
        ])
        // Ottimizzato per StandBy Mode
        .disfavoredLocations([.homeScreen], for: [.systemSmall])
    }
}
```

### 3. Provider (Data)

```swift
import WidgetKit

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> AlarmEntry {
        AlarmEntry(date: Date(), nextAlarm: nil, theme: .midnight)
    }
    
    func getSnapshot(in context: Context, completion: @escaping (AlarmEntry) -> ()) {
        let entry = AlarmEntry(date: Date(), nextAlarm: getNextAlarm(), theme: getTheme())
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [AlarmEntry] = []
        let currentDate = Date()
        
        // Aggiorna ogni minuto
        for minuteOffset in 0 ..< 60 {
            let entryDate = Calendar.current.date(byAdding: .minute, value: minuteOffset, to: currentDate)!
            let entry = AlarmEntry(date: entryDate, nextAlarm: getNextAlarm(), theme: getTheme())
            entries.append(entry)
        }
        
        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
    
    // Legge dati da UserDefaults condiviso con l'app
    private func getNextAlarm() -> AlarmData? {
        guard let sharedDefaults = UserDefaults(suiteName: "group.com.playserious.standbyplus"),
              let alarmsData = sharedDefaults.data(forKey: "alarms"),
              let alarms = try? JSONDecoder().decode([AlarmData].self, from: alarmsData) else {
            return nil
        }
        
        return alarms
            .filter { $0.enabled }
            .sorted { $0.time < $1.time }
            .first
    }
    
    private func getTheme() -> ThemeData {
        guard let sharedDefaults = UserDefaults(suiteName: "group.com.playserious.standbyplus"),
              let themeData = sharedDefaults.data(forKey: "theme"),
              let theme = try? JSONDecoder().decode(ThemeData.self, from: themeData) else {
            return ThemeData.midnight
        }
        return theme
    }
}

struct AlarmEntry: TimelineEntry {
    let date: Date
    let nextAlarm: AlarmData?
    let theme: ThemeData
}
```

### 4. Widget View

```swift
import SwiftUI
import WidgetKit

struct StandByWidgetEntryView: View {
    @Environment(\\.widgetFamily) var family
    var entry: Provider.Entry
    
    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        case .accessoryCircular:
            AccessoryCircularView(entry: entry)
        case .accessoryRectangular:
            AccessoryRectangularView(entry: entry)
        case .accessoryInline:
            AccessoryInlineView(entry: entry)
        @unknown default:
            EmptyView()
        }
    }
}

// Small Widget - Orologio minimal
struct SmallWidgetView: View {
    var entry: AlarmEntry
    
    var body: some View {
        VStack(spacing: 4) {
            Text(entry.date, style: .time)
                .font(.system(size: 48, weight: .ultraLight, design: .rounded))
                .foregroundColor(Color(hex: entry.theme.textPrimary))
            
            if let alarm = entry.nextAlarm {
                HStack(spacing: 4) {
                    Image(systemName: "bell.fill")
                        .font(.system(size: 10))
                    Text(alarm.time)
                        .font(.system(size: 12, weight: .medium))
                }
                .foregroundColor(Color(hex: entry.theme.primaryAccent))
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// Medium Widget - Orologio + prossima sveglia
struct MediumWidgetView: View {
    var entry: AlarmEntry
    
    var body: some View {
        HStack {
            // Orologio grande
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.date, style: .time)
                    .font(.system(size: 56, weight: .ultraLight, design: .rounded))
                    .foregroundColor(Color(hex: entry.theme.textPrimary))
                
                Text(entry.date, format: .dateTime.weekday(.wide))
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: entry.theme.textSecondary))
                    .opacity(0.6)
            }
            
            Spacer()
            
            // Prossima sveglia
            if let alarm = entry.nextAlarm {
                VStack(alignment: .trailing, spacing: 8) {
                    Image(systemName: "bell.fill")
                        .font(.system(size: 24))
                        .foregroundColor(Color(hex: entry.theme.primaryAccent))
                    
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(alarm.time)
                            .font(.system(size: 20, weight: .semibold, design: .rounded))
                        Text(alarm.label)
                            .font(.system(size: 12))
                            .opacity(0.7)
                    }
                    .foregroundColor(Color(hex: entry.theme.textPrimary))
                }
            }
        }
        .padding()
    }
}

// Large Widget - Orologio analogico + dettagli
struct LargeWidgetView: View {
    var entry: AlarmEntry
    
    var body: some View {
        VStack(spacing: 20) {
            // Orologio analogico
            AnalogClockWidget(date: entry.date, theme: entry.theme)
                .frame(width: 200, height: 200)
            
            // Ora digitale
            Text(entry.date, style: .time)
                .font(.system(size: 48, weight: .ultraLight, design: .rounded))
                .foregroundColor(Color(hex: entry.theme.textPrimary))
            
            // Prossima sveglia
            if let alarm = entry.nextAlarm {
                HStack(spacing: 12) {
                    Image(systemName: "bell.fill")
                    VStack(alignment: .leading, spacing: 4) {
                        Text(alarm.label)
                            .font(.system(size: 14, weight: .medium))
                        Text(alarm.time)
                            .font(.system(size: 18, weight: .semibold, design: .rounded))
                    }
                }
                .foregroundColor(Color(hex: entry.theme.primaryAccent))
            }
        }
        .padding()
    }
}

// Accessory Circular - Lock Screen
struct AccessoryCircularView: View {
    var entry: AlarmEntry
    
    var body: some View {
        ZStack {
            // Orologio analogico minimal
            AccessoryAnalogClock(date: entry.date)
            
            // Indicatore sveglia
            if entry.nextAlarm != nil {
                VStack {
                    Image(systemName: "bell.fill")
                        .font(.system(size: 8))
                    Spacer()
                }
            }
        }
    }
}

// Accessory Rectangular - Lock Screen
struct AccessoryRectangularView: View {
    var entry: AlarmEntry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(entry.date, style: .time)
                .font(.system(size: 24, weight: .semibold, design: .rounded))
            
            if let alarm = entry.nextAlarm {
                HStack(spacing: 4) {
                    Image(systemName: "bell.fill")
                        .font(.system(size: 10))
                    Text("\\(alarm.time) · \\(alarm.label)")
                        .font(.system(size: 12))
                }
            }
        }
    }
}

// Accessory Inline - Lock Screen
struct AccessoryInlineView: View {
    var entry: AlarmEntry
    
    var body: some View {
        if let alarm = entry.nextAlarm {
            Text("🔔 \\(alarm.time) · \\(alarm.label)")
        } else {
            Text(entry.date, style: .time)
        }
    }
}
```

### 5. Modelli Dati Condivisi

```swift
// AlarmData.swift
import Foundation

struct AlarmData: Codable, Identifiable {
    let id: String
    let time: String
    let label: String
    let enabled: Bool
    let days: [Int]
}

// ThemeData.swift
struct ThemeData: Codable {
    let background: String
    let surface: String
    let primaryAccent: String
    let secondaryAccent: String
    let textPrimary: String
    let textSecondary: String
    
    static let midnight = ThemeData(
        background: "#000000",
        surface: "#0A0A0A",
        primaryAccent: "#FF2E91",
        secondaryAccent: "#0FA3FF",
        textPrimary: "#FFFFFF",
        textSecondary: "#F0F0F0"
    )
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
```

### 6. App Group Setup

1. In Xcode, seleziona il target principale "App"
2. Signing & Capabilities > + Capability > App Groups
3. Aggiungi: `group.com.playserious.standbyplus`
4. Ripeti per il target "StandByWidget"

### 7. Condivisione Dati da React

Nel file `App.tsx`, aggiungi funzione per sincronizzare con widget:

```typescript
// Aggiungi in App.tsx dopo gli useEffect esistenti

// Sync data with iOS widget
useEffect(() => {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
    // Sync alarms
    const syncAlarms = async () => {
      try {
        const { Preferences } = await import('@capacitor/preferences');
        await Preferences.set({
          key: 'widget-alarms',
          value: JSON.stringify(alarms.filter(a => a.enabled))
        });
        
        // Trigger widget reload
        await Preferences.set({
          key: 'widget-update-trigger',
          value: Date.now().toString()
        });
      } catch (err) {
        console.error('Widget sync error:', err);
      }
    };
    
    syncAlarms();
  }
}, [alarms]);

// Sync theme
useEffect(() => {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
    const syncTheme = async () => {
      try {
        const { Preferences } = await import('@capacitor/preferences');
        await Preferences.set({
          key: 'widget-theme',
          value: JSON.stringify(theme)
        });
      } catch (err) {
        console.error('Widget theme sync error:', err);
      }
    };
    
    syncTheme();
  }
}, [theme]);
```

## StandBy Mode Ottimizzazioni

### Always-On Display

Per iPhone 14 Pro+ con Always-On:

```swift
// In StandByWidget.swift
.containerBackground(.black, for: .widget)
.widgetAccentable() // Permette tinting in Always-On
```

### Live Activities (iOS 16.1+)

Per mostrare sveglia attiva come Live Activity:

```swift
// AlarmActivity.swift
import ActivityKit

struct AlarmActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var alarmTime: String
        var alarmLabel: String
        var timeRemaining: TimeInterval
    }
    
    var alarmId: String
}

// Start Live Activity quando sveglia è attiva
func startAlarmActivity(alarm: AlarmData) {
    let attributes = AlarmActivityAttributes(alarmId: alarm.id)
    let contentState = AlarmActivityAttributes.ContentState(
        alarmTime: alarm.time,
        alarmLabel: alarm.label,
        timeRemaining: calculateTimeRemaining(alarm)
    )
    
    do {
        let activity = try Activity<AlarmActivityAttributes>.request(
            attributes: attributes,
            contentState: contentState,
            pushType: nil
        )
        print("Live Activity started: \\(activity.id)")
    } catch {
        print("Error starting Live Activity: \\(error)")
    }
}
```

## Testing

### Simulator

```bash
# Avvia simulator
xcrun simctl boot "iPhone 15 Pro"

# Trigger widget update
xcrun simctl launch booted com.playserious.standbyplus

# Enable StandBy mode (iOS 17+)
# Settings > StandBy > ON
# Ruota iPhone in landscape mentre è in carica
```

### Device Reale

1. Build su dispositivo reale
2. Abilita StandBy: Impostazioni > StandBy > ON
3. Metti iPhone in landscape mentre è in carica
4. Il widget apparirà automaticamente

## Checklist Pre-Release

- [ ] Widget funziona in StandBy mode
- [ ] Widget aggiorna ogni minuto
- [ ] Dati sincronizzati tra app e widget
- [ ] Tema applicato correttamente
- [ ] Prossima sveglia visualizzata
- [ ] Always-On Display ottimizzato (iPhone 14 Pro+)
- [ ] Live Activities per sveglia attiva
- [ ] Testato su iOS 17.0+
- [ ] Testato su vari modelli iPhone
- [ ] App Group configurato correttamente

## Risorse

- [WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [StandBy Mode Guidelines](https://developer.apple.com/design/human-interface-guidelines/standby)
- [Live Activities](https://developer.apple.com/documentation/activitykit)
- [App Groups](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_application-groups)

## Troubleshooting

**Widget non appare:**
- Verifica App Group sia configurato
- Controlla che StandBy sia abilitato
- Riavvia iPhone

**Dati non sincronizzati:**
- Verifica App Group name identico in app e widget
- Controlla che Preferences usi suiteName corretto
- Debug con Console.app su Mac

**Always-On non funziona:**
- Richiede iPhone 14 Pro o superiore
- Verifica iOS 16.1+
- Usa `.containerBackground(.black)`
