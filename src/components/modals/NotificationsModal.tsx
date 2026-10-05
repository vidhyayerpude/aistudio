import React from 'react';
import { NotificationItem } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-[#0037b0]">notifications</span>
            <h3 className="font-headline-sm text-base text-[#0b1c30]">
              Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#747686] hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-4 py-2 bg-[#f8f9ff] border-b border-[#e5eeff] flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-[#0037b0] hover:underline disabled:opacity-40 font-medium"
          >
            Mark all as read
          </button>
          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="text-[#ba1a1a] hover:underline disabled:opacity-40 font-medium"
          >
            Clear all
          </button>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#747686]">
              <span className="material-symbols-outlined text-[32px] text-[#c4c5d7] mb-1">
                notifications_off
              </span>
              <p>No new notifications right now.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-colors ${
                  item.read
                    ? 'bg-white border-[#e5eeff] text-[#434655]'
                    : 'bg-[#eff4ff] border-[#b7c4ff] text-[#0b1c30] shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#ba1a1a] flex-shrink-0" />
                    )}
                    <h4 className="font-title-md text-xs font-semibold text-[#0b1c30]">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#747686] flex-shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-[#565e74] mt-1 pl-3.5 leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-4 border-t border-[#e5eeff] bg-[#eff4ff] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0037b0] text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
