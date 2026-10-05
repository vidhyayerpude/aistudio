import React from 'react';
import { Lecture, NoteDocument } from '../../types';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectures: Lecture[];
  notes: NoteDocument[];
  isOfflineSimulated: boolean;
  onToggleSimulateOffline: () => void;
  onToggleLectureOffline: (id: string) => void;
  onToggleNoteOffline: (id: string) => void;
  onClearAllOffline: () => void;
  onOpenLecture: (lec: Lecture) => void;
  onOpenNote: (note: NoteDocument) => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  lectures,
  notes,
  isOfflineSimulated,
  onToggleSimulateOffline,
  onToggleLectureOffline,
  onToggleNoteOffline,
  onClearAllOffline,
  onOpenLecture,
  onOpenNote,
}) => {
  if (!isOpen) return null;

  const offlineLectures = lectures.filter((l) => l.isOfflineAvailable);
  const offlineNotes = notes.filter((n) => n.isOfflineAvailable);

  // Approximate total MB
  const totalMb =
    offlineLectures.length * 170 +
    offlineNotes.reduce((acc, curr) => acc + parseFloat(curr.size || '2.0'), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-xl rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0037b0] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">offline_pin</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-base text-[#0b1c30]">
                Offline Teaching Library
              </h3>
              <p className="font-body-sm text-xs text-[#434655]">
                Cached lecture videos, slide transcripts &amp; PDF notes for disconnected classrooms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#747686] hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Storage Summary & Offline Simulator Bar */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#e5eeff] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-[#747686] font-medium">Local Browser Cache</span>
              <p className="font-headline-sm text-base font-bold text-[#0037b0]">
                {totalMb.toFixed(1)} MB Stored
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#434655]">
                {offlineLectures.length} Lectures • {offlineNotes.length} Notes
              </span>
              <button
                onClick={onClearAllOffline}
                disabled={offlineLectures.length === 0 && offlineNotes.length === 0}
                className="px-2.5 py-1 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors disabled:opacity-40"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Test Offline Mode Simulator Switch */}
          <div className="p-3 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isOfflineSimulated ? 'text-[#ba1a1a]' : 'text-[#004f35]'
                }`}
              >
                {isOfflineSimulated ? 'wifi_off' : 'wifi'}
              </span>
              <div>
                <p className="text-xs font-semibold text-[#0b1c30]">
                  {isOfflineSimulated ? 'Simulating Disconnected Hall' : 'Online Campus Wi-Fi Mode'}
                </p>
                <p className="text-[11px] text-[#565e74]">
                  {isOfflineSimulated
                    ? 'Only offline-cached lecture videos & notes are playable'
                    : 'Toggle to test how this app works without classroom internet'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleSimulateOffline}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isOfflineSimulated
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#0037b0] hover:bg-[#dce9ff]'
              }`}
            >
              {isOfflineSimulated ? 'Exit Offline Simulation' : 'Test Offline Mode'}
            </button>
          </div>
        </div>

        {/* Content Lists */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-[#0b1c30]">
          {/* Offline Lectures Section */}
          <div className="space-y-2">
            <h4 className="font-title-md text-xs font-semibold text-[#0037b0] flex items-center gap-1.5 uppercase tracking-wide">
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              Offline Lecture Streams ({offlineLectures.length})
            </h4>

            {offlineLectures.length === 0 ? (
              <p className="text-xs text-[#747686] italic p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                No lectures currently marked for offline access. Click the download icon on any lecture card to cache.
              </p>
            ) : (
              <div className="space-y-1.5">
                {offlineLectures.map((lec) => (
                  <div
                    key={lec.id}
                    className="p-2.5 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between hover:border-[#b7c4ff] transition-colors"
                  >
                    <div
                      className="min-w-0 pr-2 cursor-pointer"
                      onClick={() => {
                        onClose();
                        onOpenLecture(lec);
                      }}
                    >
                      <h5 className="font-title-md text-xs font-semibold text-[#0b1c30] truncate hover:text-[#0037b0]">
                        {lec.title}
                      </h5>
                      <span className="text-[10px] text-[#565e74]">
                        {lec.courseCode} • {lec.offlineSize || '185 MB'} • Cached for offline
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenLecture(lec);
                        }}
                        className="px-2 py-1 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[11px] text-[#0037b0] font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                        Play
                      </button>
                      <button
                        onClick={() => onToggleLectureOffline(lec.id)}
                        className="p-1 rounded text-[#747686] hover:text-[#ba1a1a] transition-colors"
                        title="Remove from offline cache"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offline Notes Section */}
          <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
            <h4 className="font-title-md text-xs font-semibold text-[#ba1a1a] flex items-center gap-1.5 uppercase tracking-wide">
              <span className="material-symbols-outlined text-[16px]">description</span>
              Offline Revision Notes &amp; Cheat Sheets ({offlineNotes.length})
            </h4>

            {offlineNotes.length === 0 ? (
              <p className="text-xs text-[#747686] italic p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                No notes currently pinned for offline review. Click the offline pin on any note card to save.
              </p>
            ) : (
              <div className="space-y-1.5">
                {offlineNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-xl bg-white border border-[#e5eeff] flex items-center justify-between hover:border-[#b7c4ff] transition-colors"
                  >
                    <div
                      className="min-w-0 pr-2 cursor-pointer"
                      onClick={() => {
                        onClose();
                        onOpenNote(note);
                      }}
                    >
                      <h5 className="font-title-md text-xs font-semibold text-[#0b1c30] truncate hover:text-[#0037b0]">
                        {note.title}
                      </h5>
                      <span className="text-[10px] text-[#565e74]">
                        {note.subject} • {note.size} • Verified offline
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenNote(note);
                        }}
                        className="px-2 py-1 rounded bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[11px] text-[#ba1a1a] font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Read
                      </button>
                      <button
                        onClick={() => onToggleNoteOffline(note.id)}
                        className="p-1 rounded text-[#747686] hover:text-[#ba1a1a] transition-colors"
                        title="Remove from offline cache"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-[#e5eeff] bg-[#eff4ff] flex items-center justify-between">
          <span className="text-[11px] text-[#565e74]">
            Data stored safely in your device browser cache.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
