import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'lectures', label: 'Lectures', icon: 'videocam' },
    { id: 'notes', label: 'Notes', icon: 'description' },
    { id: 'analytics', label: 'Analytics', icon: 'insights' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.06)] border-t border-[#e5eeff]">
      <div className="h-16 max-w-4xl mx-auto px-space-xs grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
                isActive
                  ? 'text-[#0037b0] font-semibold scale-105'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-8 h-1 bg-[#0037b0] rounded-full" />
              )}
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
