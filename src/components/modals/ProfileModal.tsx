import React, { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTerm: string;
  onSwitchTerm: (term: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeTerm,
  onSwitchTerm,
}) => {
  const [selectedTerm, setSelectedTerm] = useState(activeTerm);
  const [officeHours, setOfficeHours] = useState('Tuesday & Thursday, 3:00 PM – 5:00 PM');
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSwitchTerm(selectedTerm);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <h3 className="font-headline-sm text-base text-[#0b1c30]">
            Instructor Profile &amp; Preferences
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#747686] hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#0b1c30]">
          {/* Profile Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSCdzSLZmpyKXtaykrGOGwz0AT4fYli1_eVa6LxV1a_sKSaCiXjjK3aVYgooY0d1vOBnDKlXi6hjXVT9z_LMNIXTyo9HL6U9jadv070WxFzUjAD8oUR8KBwVfekoCIyVYzR5Vqipyluso73e0kABy_t4ZgBhMy0zmGtdv2DRIfKlNflvys0EIiZYSd2cAgmA1ymqoz37f3V8VBqd692_bMWmAjCpeob0o6CYCV9qiyS6lPzlICZ4Qrxg"
              alt="Prof. Arvind"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#1d4ed8]"
            />
            <div>
              <h4 className="font-title-md text-sm font-bold text-[#0b1c30]">
                Prof. Arvind Raghavan
              </h4>
              <p className="text-xs text-[#565e74]">
                Senior Faculty • Systems &amp; Algorithms Division
              </p>
              <p className="text-[11px] text-[#0037b0] font-medium mt-0.5">
                Dept. of Computer Science &amp; Engineering
              </p>
            </div>
          </div>

          {/* Academic Term Switcher */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#434655]">
              Active Academic Semester
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs font-medium text-[#0b1c30] focus:ring-2 focus:ring-[#0037b0] focus:outline-none"
            >
              <option value="Spring Term 2025">Spring Term 2025 (Active • 1,420 students)</option>
              <option value="Fall Term 2024">Fall Term 2024 (Archived • 1,380 students)</option>
              <option value="Summer Term 2025">Summer Term 2025 (Upcoming)</option>
            </select>
          </div>

          {/* Office Hours */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#434655]">
              Virtual &amp; Physical Office Hours
            </label>
            <input
              type="text"
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30]"
            />
          </div>

          {/* System Preferences */}
          <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
            <h5 className="text-xs font-semibold text-[#434655]">Instructor Automation Rules</h5>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] cursor-pointer">
              <span className="text-xs text-[#0b1c30]">Auto-generate AI Transcripts on Upload</span>
              <input
                type="checkbox"
                checked={autoTranscribe}
                onChange={(e) => setAutoTranscribe(e.target.checked)}
                className="w-4 h-4 text-[#0037b0] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] cursor-pointer">
              <span className="text-xs text-[#0b1c30]">Notify me on new Student Doubt Queries</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#0037b0] rounded"
              />
            </label>
          </div>

          {savedSuccess && (
            <div className="p-2 text-center text-xs font-semibold text-[#004f35] bg-[#85f8c4]/30 rounded-lg">
              Preferences updated successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5eeff] bg-[#eff4ff] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#565e74] hover:bg-[#e5eeff]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white text-xs font-semibold"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
