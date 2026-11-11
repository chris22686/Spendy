import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Request notification permissions across Native (Capacitor) and Web
 */
export async function requestNotificationPermission() {
  try {
    if (Capacitor.isNativePlatform()) {
      const check = await LocalNotifications.checkPermissions();
      if (check.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        return req.display === 'granted';
      }
      return true;
    }
  } catch (err) {
    console.warn('Native notification permission error:', err);
  }

  // Web browser fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const res = await Notification.requestPermission();
        return res === 'granted';
      }
    } catch (e) {
      console.warn('Web notification permission error:', e);
    }
  }

  return false;
}

/**
 * Schedule or update scheduled notifications based on settings
 */
export async function scheduleAppNotifications(notificationSettings, paydaySettings) {
  if (!notificationSettings) return;

  const {
    notifyOnPayday = true,
    notifyDaily = true,
    dailyReminderTime = '20:00',
  } = notificationSettings;

  try {
    if (Capacitor.isNativePlatform()) {
      // 1. Cancel previously scheduled notifications
      try {
        const pending = await LocalNotifications.getPending();
        if (pending && pending.notifications && pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }
      } catch (err) {
        console.warn('Failed to clear pending notifications:', err);
      }

      const list = [];

      // 2. Schedule Daily Expense Reminder
      if (notifyDaily && dailyReminderTime) {
        const [hStr, mStr] = dailyReminderTime.split(':');
        const hour = parseInt(hStr, 10) || 20;
        const minute = parseInt(mStr, 10) || 0;

        list.push({
          id: 1001,
          title: 'Daily Spending Check-In 💰',
          body: "Take 30 seconds to log today's expenses in Spendy and stay on track!",
          schedule: {
            on: {
              hour,
              minute,
            },
            repeats: true,
            allowWhileIdle: true,
          },
          sound: 'beep.wav',
          smallIcon: 'ic_launcher',
        });
      }

      // 3. Schedule Payday Notifications
      if (notifyOnPayday && paydaySettings) {
        const { schedule = 'twice_month', payDays = [1, 15] } = paydaySettings;

        if (schedule === 'weekly') {
          // Weekly: Friday morning at 09:00
          list.push({
            id: 2001,
            title: "🎉 It's Payday!",
            body: "Your weekly payday is here! Open Spendy to record your earnings.",
            schedule: {
              on: {
                weekday: 6, // Friday in Capacitor LocalNotifications (1=Sun, 6=Fri)
                hour: 9,
                minute: 0,
              },
              repeats: true,
              allowWhileIdle: true,
            },
            sound: 'beep.wav',
            smallIcon: 'ic_launcher',
          });
        } else {
          // Monthly or Twice a month
          const daysToSchedule = Array.isArray(payDays) && payDays.length > 0 ? payDays : [1, 15];
          daysToSchedule.forEach((d, idx) => {
            const dayNum = Math.min(31, Math.max(1, parseInt(d, 10) || 1));
            list.push({
              id: 2001 + idx,
              title: "🎉 It's Payday!",
              body: "Your paycheck is here! Check in on Spendy to update your live balance.",
              schedule: {
                on: {
                  day: dayNum,
                  hour: 9,
                  minute: 0,
                },
                repeats: true,
                allowWhileIdle: true,
              },
              sound: 'beep.wav',
              smallIcon: 'ic_launcher',
            });
          });
        }
      }

      if (list.length > 0) {
        await LocalNotifications.schedule({ notifications: list });
      }
    }
  } catch (err) {
    console.warn('Failed to schedule notifications:', err);
  }
}
