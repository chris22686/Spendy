import { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Bell, Check, X, Clock, CheckCircle } from 'lucide-react';
import { requestNotificationPermission, scheduleAppNotifications } from '../utils/notifications';

export default function NotificationModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const { notificationSettings = {}, paydaySettings } = state;

  const [notifyOnPayday, setNotifyOnPayday] = useState(notificationSettings.notifyOnPayday ?? true);
  const [notifyDaily, setNotifyDaily] = useState(notificationSettings.notifyDaily ?? true);
  const [dailyReminderTime, setDailyReminderTime] = useState(notificationSettings.dailyReminderTime || '20:00');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNotifyOnPayday(notificationSettings.notifyOnPayday ?? true);
      setNotifyDaily(notificationSettings.notifyDaily ?? true);
      setDailyReminderTime(notificationSettings.dailyReminderTime || '20:00');
      document.body.dataset.modalOpen = 'true';
    }
    return () => {
      delete document.body.dataset.modalOpen;
    };
  }, [isOpen, notificationSettings]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();

    const updated = {
      notifyOnPayday: Boolean(notifyOnPayday),
      notifyDaily: Boolean(notifyDaily),
      dailyReminderTime: dailyReminderTime || '20:00',
    };

    if (updated.notifyOnPayday || updated.notifyDaily) {
      await requestNotificationPermission();
    }

    dispatch({
      type: 'UPDATE_NOTIFICATION_SETTINGS',
      payload: updated,
    });

    await scheduleAppNotifications(updated, paydaySettings);

    setSavedMsg('Notification preferences updated!');
    setTimeout(() => {
      setSavedMsg('');
      onClose();
    }, 1100);
  };

  const paySchedule = paydaySettings?.schedule || 'twice_month';
  const payDays = paydaySettings?.payDays || [1, 15];

  return (
    <div className="fixed inset-0 bg-[#000000]/55 backdrop-blur-xs z-50 overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center animate-fade-in">
      <div
        className="my-auto w-full max-w-md bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 modal-card-safe overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#eaf4ee] text-[#1b4332] flex items-center justify-center shadow-xs">
              <Bell size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#14261c] tracking-tight">Notification Settings</h2>
              <p className="text-xs text-[#718578]">Payday alerts & daily reminders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7d8f84] hover:text-[#14261c] p-1.5 rounded-lg hover:bg-[#f8f7f2] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {savedMsg && (
          <div className="flex items-center gap-2 p-3 bg-[#eaf4ee] border border-[#cce3d5] rounded-xl text-xs font-bold text-[#1b4332]">
            <CheckCircle size={16} />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Payday Notifications */}
          <div
            onClick={() => setNotifyOnPayday(!notifyOnPayday)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              notifyOnPayday
                ? 'border-[#1b4332] bg-[#eaf4ee]'
                : 'border-[#e4dfd3] bg-[#f8f7f2] hover:bg-[#ece8df]'
            }`}
          >
            <span className="text-2xl mt-0.5">💰</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#14261c]">Notify me on payday</p>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    notifyOnPayday ? 'bg-[#1b4332] text-white' : 'border border-[#dcd7cb] bg-white'
                  }`}
                >
                  {notifyOnPayday && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
              <p className="text-xs text-[#6e8074] mt-1 leading-relaxed">
                Receive an alert every time you get paid{' '}
                {paySchedule === 'twice_month'
                  ? `(Day ${payDays[0] || 1} & Day ${payDays[1] || 15})`
                  : paySchedule === 'weekly'
                  ? '(every Friday)'
                  : `(Day ${payDays[0] || 1})`}{' '}
                to record your paycheck.
              </p>
            </div>
          </div>

          {/* Daily Tracking Reminder */}
          <div
            onClick={() => setNotifyDaily(!notifyDaily)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              notifyDaily
                ? 'border-[#1b4332] bg-[#eaf4ee]'
                : 'border-[#e4dfd3] bg-[#f8f7f2] hover:bg-[#ece8df]'
            }`}
          >
            <span className="text-2xl mt-0.5">⏰</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#14261c]">Notify me once per day</p>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    notifyDaily ? 'bg-[#1b4332] text-white' : 'border border-[#dcd7cb] bg-white'
                  }`}
                >
                  {notifyDaily && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
              <p className="text-xs text-[#6e8074] mt-1 leading-relaxed">
                Daily reminder to log your daily spending and keep your budget up to date.
              </p>
            </div>
          </div>

          {/* Daily Reminder Time Picker */}
          {notifyDaily && (
            <div className="p-3.5 sm:p-4 bg-[#f8f7f2] border border-[#e4dfd3] rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#55695e] uppercase tracking-wider">
                  <Clock size={14} />
                  <span>Reminder Time:</span>
                </div>
                <input
                  type="time"
                  value={dailyReminderTime}
                  onChange={(e) => setDailyReminderTime(e.target.value || '20:00')}
                  className="bg-white border border-[#dcd7cb] text-[#14261c] font-black text-sm px-3 py-1.5 rounded-xl shadow-2xs focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-[#718578] font-semibold">Quick select:</span>
                {[
                  { label: '09:00', value: '09:00' },
                  { label: '14:00', value: '14:00' },
                  { label: '20:00', value: '20:00' },
                  { label: '21:30', value: '21:30' },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setDailyReminderTime(preset.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dailyReminderTime === preset.value
                        ? 'bg-[#1b4332] text-white shadow-xs'
                        : 'bg-white border border-[#dcd7cb] text-[#65776c] hover:bg-[#eae6db]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#f1ede3] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e4dfd3] text-xs font-semibold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs font-extrabold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
