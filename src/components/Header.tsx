import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  unreadCount: number;
  offlineCount: number;
  isOffline: boolean;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenOfflineManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadCount,
  offlineCount,
  isOffline,
  onOpenNotifications,
  onOpenProfile,
  onOpenOfflineManager,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'lectures':
        return 'Course Lectures';
      case 'notes':
        return 'Revision Notes';
      case 'analytics':
        return 'Cohort Analytics';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5eeff]/80">
      <div className="h-16 max-w-4xl mx-auto px-margin-mobile flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0 flex-1">
          <img
            alt="Vidhya Instructor Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XkraSRIPqNJfAGlhjbWiT7KIhb4KSb6IG65S6IsMLayDz2SlKpXuwX-lLYrBS7zfgBHe18izmZvzNZOUUBeQvSAGs1QEe8AkKi8tnpOxanRsh5InlUI9yxHn5m8Ae4JLEK6aa470E7WLPFm2o4OxKVDCzQIoQBi6O6IDTNnlhoOLYZcTHg_mrQJGX0C8Xl1lGGrxQsgPTQ4GhgLSObLL0VLZGOXIVIoz4kF1wcrfIwClq0N6G9zQPaYd8z"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-[#434655] leading-none truncate">
              Vidhya Portal
            </span>
            <h1 className="font-headline-sm text-headline-sm text-[#0b1c30] leading-tight truncate">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenOfflineManager}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              isOffline
                ? 'bg-[#ba1a1a] text-white shadow-xs animate-pulse'
                : offlineCount > 0
                ? 'bg-[#e5eeff] text-[#0037b0] hover:bg-[#dce9ff]'
                : 'text-[#434655] hover:bg-[#eff4ff]'
            }`}
            title="Offline Teaching Materials & Local Storage"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isOffline ? 'wifi_off' : 'offline_pin'}
            </span>
            <span className="hidden sm:inline">
              {isOffline ? 'Offline' : `Offline (${offlineCount})`}
            </span>
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center text-[#434655] hover:text-[#0037b0] rounded-xl transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-[#f8f9ff] animate-pulse" />
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="Instructor Profile"
            className="w-8 h-8 rounded-full bg-[#0037b0] text-[#ffffff] flex items-center justify-center shadow-sm hover:brightness-110 active:scale-95 transition-all"
            title="Professor Arvind • CS Dept"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
