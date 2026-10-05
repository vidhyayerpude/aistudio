import React, { useState } from 'react';
import { NoteDocument } from '../../types';

interface NotesScreenProps {
  notes: NoteDocument[];
  onOpenUploadPdf: () => void;
  onOpenPdf: (note: NoteDocument) => void;
  onDeleteNote?: (id: string) => void;
  onToggleNoteOffline: (id: string) => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({
  notes,
  onOpenUploadPdf,
  onOpenPdf,
  onDeleteNote,
  onToggleNoteOffline,
}) => {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [onlyOffline, setOnlyOffline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const offlineNotesCount = notes.filter((n) => n.isOfflineAvailable).length;

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.unit.toLowerCase().includes(search.toLowerCase());

    const matchesCourse = courseFilter === 'All' || n.subject.includes(courseFilter);
    const matchesOffline = !onlyOffline || !!n.isOfflineAvailable;

    return matchesSearch && matchesCourse && matchesOffline;
  });

  const totalDownloads = notes.reduce((acc, curr) => acc + curr.downloads, 0);

  return (
    <div className="flex flex-col w-full space-y-space-md max-w-2xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#213145] text-[#eaf1ff] px-4 py-2 rounded-xl text-xs font-medium shadow-lg z-50 transition-opacity flex items-center gap-1.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-[#85f8c4]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-[#eff4ff] rounded-xl p-space-md shadow-sm border border-[#dce9ff]/60 flex items-center justify-between">
        <div>
          <span className="font-label-sm text-xs font-semibold text-[#ba1a1a] block">
            Academic Repository
          </span>
          <h2 className="font-headline-md text-xl font-bold text-[#0b1c30]">
            Revision Notes &amp; Cheat Sheets
          </h2>
          <p className="font-body-sm text-xs text-[#434655]">
            {notes.length} Study Guides • {offlineNotesCount} Cached for Offline Review
          </p>
        </div>
        <button
          onClick={onOpenUploadPdf}
          className="px-4 py-2.5 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-title-md text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Add PDF Notes
        </button>
      </section>

      {/* Search and Filters */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#434655] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes, formula sheets, or unit topics..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white text-xs text-[#0b1c30] border border-[#e5eeff] focus:ring-1 focus:ring-[#0037b0] focus:outline-none shadow-sm"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white text-xs font-medium text-[#0b1c30] border border-[#e5eeff] focus:outline-none shadow-sm"
          >
            <option value="All">All Subjects</option>
            <option value="CS-401">CS-401 (OS)</option>
            <option value="CS-201">CS-201 (Data Structures)</option>
          </select>
        </div>

        {/* Offline Filter Button */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setOnlyOffline(!onlyOffline)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              onlyOffline
                ? 'bg-[#ba1a1a] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {onlyOffline ? 'offline_pin' : 'filter_list'}
            </span>
            <span>Only Offline Notes ({offlineNotesCount})</span>
          </button>
          <span className="text-[11px] text-[#747686]">
            {totalDownloads} total student downloads
          </span>
        </div>
      </section>

      {/* Notes List */}
      <section className="space-y-space-xs">
        {filteredNotes.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white border border-[#e5eeff] text-[#565e74] text-xs">
            <span className="material-symbols-outlined text-[36px] text-[#c4c5d7] mb-2">
              description
            </span>
            <p className="font-semibold text-sm text-[#0b1c30]">No documents found</p>
            <p className="mt-1">Try a different search term or mark a note for offline reading.</p>
          </div>
        ) : (
          filteredNotes.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-space-md shadow-sm border border-[#e5eeff] hover:shadow-md transition-shadow flex flex-col space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex items-start gap-3 min-w-0 cursor-pointer"
                  onClick={() => onOpenPdf(doc)}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">description</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-xs font-semibold text-[#0037b0]">
                        {doc.subject}
                      </span>
                      {doc.isOfflineAvailable && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-[#85f8c4]/40 text-[#004f35] font-label-sm text-[10px] font-semibold">
                          <span className="material-symbols-outlined text-[12px]">offline_pin</span>
                          Offline Ready
                        </span>
                      )}
                    </div>
                    <h3 className="font-title-md text-sm sm:text-base font-bold text-[#0b1c30] truncate hover:text-[#0037b0] transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-[#565e74] line-clamp-2 mt-0.5 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#85f8c4]/30 text-[#004f35] font-label-sm text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    {doc.downloads}
                  </span>
                  <span className="text-[11px] text-[#747686]">{doc.uploadedAgo}</span>
                </div>
              </div>

              {/* Preview Invariant checklist */}
              <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
                <span className="font-label-sm text-[11px] font-semibold text-[#434655]">
                  Topics &amp; Formula Highlights ({doc.pagesCount} Pages):
                </span>
                <ul className="text-xs text-[#565e74] space-y-0.5 pl-4 list-disc">
                  {doc.previewPoints.slice(0, 2).map((pt, i) => (
                    <li key={i} className="line-clamp-1">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-xs text-[#565e74]">{doc.size} PDF Document</span>

                <div className="flex items-center gap-2">
                  {/* Mark Offline button */}
                  <button
                    onClick={() => {
                      onToggleNoteOffline(doc.id);
                      showToast(
                        doc.isOfflineAvailable
                          ? `Removed '${doc.title}' from offline notes.`
                          : `Saved '${doc.title}' for offline reading.`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      doc.isOfflineAvailable
                        ? 'bg-[#85f8c4]/30 text-[#004f35] hover:bg-[#85f8c4]/50'
                        : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff] hover:text-[#0037b0]'
                    }`}
                    title={doc.isOfflineAvailable ? 'Stored locally for offline access' : 'Make available offline'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {doc.isOfflineAvailable ? 'offline_pin' : 'download_for_offline'}
                    </span>
                    <span>{doc.isOfflineAvailable ? 'Saved Offline' : 'Mark Offline'}</span>
                  </button>

                  <button
                    onClick={() => onOpenPdf(doc)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0037b0] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Preview
                  </button>

                  <button
                    onClick={() => onOpenPdf(doc)}
                    className="px-3 py-1.5 rounded-lg bg-[#0037b0] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Download
                  </button>

                  {onDeleteNote && (
                    <button
                      onClick={() => onDeleteNote(doc.id)}
                      className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                      title="Delete document"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
