import React, { useState } from 'react';
import { NoteDocument } from '../../types';

interface PdfViewerModalProps {
  note: NoteDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (id: string) => void;
  onToggleOffline?: (id: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  note,
  isOpen,
  onClose,
  onDownload,
  onToggleOffline,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !note) return null;

  const handleDownloadClick = () => {
    onDownload?.(note.id);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-sm sm:text-base text-[#0b1c30] truncate">
                  {note.title}
                </h3>
                {note.isOfflineAvailable && (
                  <span className="px-2 py-0.2 rounded-full bg-[#85f8c4]/40 text-[#004f35] font-label-sm text-[10px] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">offline_pin</span>
                    Offline Ready
                  </span>
                )}
              </div>
              <p className="font-body-sm text-xs text-[#565e74] truncate">
                {note.subject} • {note.size} • {note.downloads} downloads
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onToggleOffline && (
              <button
                onClick={() => onToggleOffline(note.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  note.isOfflineAvailable
                    ? 'bg-[#85f8c4]/30 text-[#004f35] hover:bg-[#85f8c4]/50'
                    : 'bg-white text-[#434655] hover:text-[#0037b0] border border-[#c4c5d7]'
                }`}
                title={note.isOfflineAvailable ? 'Saved in device offline storage' : 'Save note for offline viewing'}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {note.isOfflineAvailable ? 'offline_pin' : 'download_for_offline'}
                </span>
                <span className="hidden sm:inline">
                  {note.isOfflineAvailable ? 'Offline Saved' : 'Save Offline'}
                </span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#747686] hover:bg-[#e5eeff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-2.5 px-4 bg-[#f8f9ff] border-b border-[#e5eeff] flex items-center justify-between text-xs text-[#0b1c30]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-[#e5eeff] disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="font-medium">
              Page {currentPage} of {note.pagesCount}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(note.pagesCount, p + 1))}
              disabled={currentPage >= note.pagesCount}
              className="p-1 rounded hover:bg-[#e5eeff] disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
              className="p-1 rounded hover:bg-[#e5eeff]"
              title="Zoom out"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_out</span>
            </button>
            <span className="font-mono text-xs">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(175, z + 25))}
              className="p-1 rounded hover:bg-[#e5eeff]"
              title="Zoom in"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_in</span>
            </button>
          </div>
        </div>

        {/* Document Sheet Preview Body */}
        <div className="p-6 overflow-y-auto bg-[#eff4ff]/60 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-lg bg-white rounded-xl shadow-md border border-[#c4c5d7]/50 p-6 sm:p-8 space-y-4 min-h-[460px] transition-transform duration-150"
          >
            {/* Sheet Title Bar */}
            <div className="border-b-2 border-[#0037b0] pb-3">
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#0037b0] font-bold">
                DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING
              </span>
              <h2 className="font-headline-sm text-base font-bold text-[#0b1c30] mt-1">
                {note.title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
              </h2>
              <p className="text-xs text-[#565e74] mt-0.5">
                Instructor: Prof. Arvind • Semester IV • {note.unit}
              </p>
            </div>

            {/* Note Executive Summary */}
            <div className="space-y-2">
              <h4 className="font-title-md text-xs font-semibold text-[#0037b0] uppercase tracking-wide">
                Key Curriculum Summary (Page {currentPage})
              </h4>
              <p className="text-xs text-[#434655] leading-relaxed bg-[#f8f9ff] p-3 rounded-lg border border-[#e5eeff]">
                {note.summary}
              </p>
            </div>

            {/* Key Invariants / Points */}
            <div className="space-y-2">
              <h4 className="font-title-md text-xs font-semibold text-[#0b1c30]">
                Core Formulations &amp; Exam Checklist:
              </h4>
              <ul className="space-y-2 text-xs text-[#434655]">
                {note.previewPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Document Watermark Footer */}
            <div className="pt-6 border-t border-[#e5eeff] flex justify-between items-center text-[10px] text-[#747686]">
              <span>Vidhya Portal Official Academic Repository</span>
              <span>Doc ID: {note.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5eeff] bg-[#eff4ff] flex items-center justify-between">
          <div>
            {downloadSuccess ? (
              <span className="text-xs font-semibold text-[#004f35] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Downloaded to local device storage!
              </span>
            ) : note.isOfflineAvailable ? (
              <span className="text-xs font-semibold text-[#004f35] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">offline_pin</span>
                Cached for offline classroom projection
              </span>
            ) : (
              <span className="text-xs text-[#565e74]">
                PDF document verified &amp; virus-scanned.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#565e74] hover:bg-[#e5eeff]"
            >
              Close
            </button>
            <button
              onClick={handleDownloadClick}
              className="px-5 py-2.5 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-title-md text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download PDF ({note.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
