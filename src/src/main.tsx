import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';

// Configurazione StatusBar per iOS
if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: false });
  StatusBar.setStyle({ style: 'dark' });
  StatusBar.setBackgroundColor({ color: '#000000' });
}

// Funzione per prevenire il lock dello schermo (da chiamare quando necessario)
export const requestWakeLock = async (): Promise<any> => {
  if (!('wakeLock' in navigator)) {
    console.log('Wake Lock API not supported');
    return null;
  }

  try {
    const wakeLock = await (navigator as any).wakeLock.request('screen');
    console.log('Wake Lock acquired');
    
    // Re-acquire wake lock when visibility changes
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && wakeLock.released) {
        try {
          await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          // Silently fail if not allowed
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return wakeLock;
  } catch (err: any) {
    // Permission denied or not allowed - this is expected in some contexts
    if (err.name === 'NotAllowedError') {
      console.log('Wake Lock not allowed - user may need to interact first');
    } else {
      console.warn('Wake Lock request failed:', err.message);
    }
    return null;
  }
};

// Interface for Alarm
interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
  days: number[];
  vibration: boolean;
}

// Schedule alarm notifications
export const scheduleAlarmNotifications = async (alarms: Alarm[]) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Notifications only available on native platforms');
    return;
  }

  try {
    // Request permissions
    const permissionStatus = await LocalNotifications.requestPermissions();
    if (permissionStatus.display !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    // Cancel all existing notifications
    await LocalNotifications.cancel({ notifications: [] });

    // Schedule new notifications for enabled alarms
    const enabledAlarms = alarms.filter(a => a.enabled);
    
    const notifications = enabledAlarms.map((alarm, index) => {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      const alarmDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );

      // If alarm time has passed today, schedule for tomorrow
      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      return {
        id: parseInt(alarm.id) || index + 1,
        title: 'Sveglia StandBy+',
        body: alarm.label,
        schedule: { at: alarmDate },
        sound: 'default',
        attachments: undefined,
        actionTypeId: '',
        extra: {
          alarmId: alarm.id,
          vibration: alarm.vibration
        }
      };
    });

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log(`Scheduled ${notifications.length} alarm notifications`);
    }
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

export { Capacitor, StatusBar, LocalNotifications };
