import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  unread: boolean;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md h-full bg-surface-container-high border-l border-outline-variant/30 shadow-2xl p-6 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">notifications</span>
            <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">
              Autonomous Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[12px] font-label-mono-sm">
          <button
            onClick={onMarkAllAsRead}
            className="text-primary hover:underline cursor-pointer"
          >
            Mark all read
          </button>
          <button
            onClick={onClear}
            className="text-on-surface-variant hover:text-error hover:underline cursor-pointer"
          >
            Clear alerts
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-body-sm bg-surface-container rounded-xl">
              No new alerts. Event orchestration is calm and on track.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                  item.unread
                    ? 'bg-surface-container-lowest border-primary/40 shadow-md'
                    : 'bg-surface-container-low border-outline-variant/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-[14px] text-on-surface font-semibold flex items-center gap-1.5">
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                    {item.title}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline">
                    {item.time}
                  </span>
                </div>
                <p className="text-[12px] font-body-sm text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
