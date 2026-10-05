import React, { useState } from 'react';
import { Lecture } from '../../types';

interface LecturesScreenProps {
  lectures: Lecture[];
  onOpenUpload: (mode: 'file' | 'link') => void;
  onOpenLecture: (lec: Lecture) => void;
  onPublishDraft: (id: string) => void;
  onDeleteLecture: (id: string) => void;
  onGenerateQuiz: (lec: Lecture) => void;
  onToggleLectureOffline: (id: string) => void;
}

export const LecturesScreen: React.FC<LecturesScreenProps> = ({
  lectures,
  onOpenUpload,
  onOpenLecture,
  onPublishDraft,
  onDeleteLecture,
  onGenerateQuiz,
  onToggleLectureOffline,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'processing' | 'draft' | 'offline'>('all');
  const [courseFilter, setCourseFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const offlineCount = lectures.filter((l) => l.isOfflineAvailable).length;

  const filtered = lectures.filter((lec) => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'offline'
        ? !!lec.isOfflineAvailable
        : lec.status === filterStatus;

    const matchesCourse = courseFilter === 'All' || lec.courseCode.includes(courseFilter);
    const matchesSearch =
      lec.title.toLowerCase().includes(search.toLowerCase()) ||
      lec.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      (lec.unit && lec.unit.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesCourse && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full space-y-space-md max-w-2xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#213145] text-[#eaf1ff] px-4 py-2 rounded-xl text-xs font-medium shadow-lg z-50 transition-opacity flex items-center gap-1.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-[#85f8c4]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <section className="bg-[#eff4ff] rounded-xl p-space-md shadow-sm border border-[#dce9ff]/60 flex items-center justify-between">
        <div>
          <span className="font-label-sm text-xs font-semibold text-[#0037b0] block">
            Curriculum Management
          </span>
          <h2 className="font-headline-md text-xl font-bold text-[#0b1c30]">
            Course Lectures &amp; Video Streams
          </h2>
          <p className="font-body-sm text-xs text-[#434655]">
            4 Modules • Transcoded in 1080p • {offlineCount} Saved Offline
          </p>
        </div>
        <button
          onClick={() => onOpenUpload('file')}
          className="px-4 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#0037b0] text-white font-title-md text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Upload Lecture
        </button>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#434655] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lectures by topic, algorithm, or course..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white text-xs text-[#0b1c30] border border-[#e5eeff] focus:ring-1 focus:ring-[#0037b0] focus:outline-none shadow-sm"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white text-xs font-medium text-[#0b1c30] border border-[#e5eeff] focus:outline-none shadow-sm"
          >
            <option value="All">All Courses</option>
            <option value="CS-401">CS-401 (OS)</option>
            <option value="CS-201">CS-201 (Data Structures)</option>
          </select>
        </div>

        {/* Status segmented tabs with Offline option */}
        <div className="flex items-center gap-1 p-1 bg-[#eff4ff] rounded-xl border border-[#e5eeff] overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'All', count: lectures.length },
              { id: 'published', label: 'Published', count: lectures.filter((l) => l.status === 'published').length },
              { id: 'processing', label: 'Processing', count: lectures.filter((l) => l.status === 'processing').length },
              { id: 'draft', label: 'Drafts', count: lectures.filter((l) => l.status === 'draft').length },
              { id: 'offline', label: 'Offline Ready', count: offlineCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-white text-[#0037b0] shadow-sm'
                  : 'text-[#434655] hover:text-[#0b1c30]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  tab.id === 'offline' && tab.count > 0
                    ? 'bg-[#85f8c4]/50 text-[#004f35] font-bold'
                    : 'bg-[#dce1ff] text-[#001551]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Lectures Grid / Card List */}
      <section className="space-y-space-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white border border-[#e5eeff] text-[#565e74] text-xs">
            <span className="material-symbols-outlined text-[36px] text-[#c4c5d7] mb-2">
              videocam_off
            </span>
            <p className="font-semibold text-sm text-[#0b1c30]">No lectures found</p>
            <p className="mt-1">Try adjusting your filters or mark a lecture for offline access.</p>
          </div>
        ) : (
          filtered.map((lec) => (
            <div
              key={lec.id}
              className="bg-white rounded-xl p-space-md shadow-sm border border-[#e5eeff] hover:shadow-md transition-shadow flex flex-col space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 cursor-pointer" onClick={() => onOpenLecture(lec)}>
                  <span className="font-label-sm text-xs font-semibold text-[#0037b0]">
                    {lec.courseCode}
                  </span>
                  <h3 className="font-title-md text-base font-bold text-[#0b1c30] mt-0.5 hover:text-[#0037b0] transition-colors truncate">
                    {lec.title}
                  </h3>
                  <p className="text-xs text-[#565e74] line-clamp-2 mt-1 leading-relaxed">
                    {lec.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    {lec.isOfflineAvailable && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#85f8c4]/40 text-[#004f35] font-label-sm text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">offline_pin</span>
                        Offline
                      </span>
                    )}

                    {lec.status === 'published' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-label-sm text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004f35]" />
                        Published
                      </span>
                    )}
                    {lec.status === 'processing' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#5c647a] font-label-sm text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#565e74] animate-pulse" />
                        Processing
                      </span>
                    )}
                    {lec.status === 'draft' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#434655] font-label-sm text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#747686]" />
                        Draft
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#747686]">{lec.uploadedAgo}</span>
                </div>
              </div>

              {/* Meta metrics bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#434655] py-2 px-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#0037b0]">schedule</span>
                  {lec.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#004f35]">visibility</span>
                  {lec.views} views
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#565e74]">segment</span>
                  {lec.chapters.length} chapters
                </span>
                {lec.offlineSize && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#0037b0] font-mono">
                      <span className="material-symbols-outlined text-[16px]">folder_zip</span>
                      {lec.offlineSize}
                    </span>
                  </>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onGenerateQuiz(lec)}
                    className="px-3 py-1.5 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0037b0] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">quiz</span>
                    Generate Quiz
                  </button>

                  {/* Offline Action Button */}
                  <button
                    onClick={() => {
                      onToggleLectureOffline(lec.id);
                      showToast(
                        lec.isOfflineAvailable
                          ? `Removed '${lec.title}' from offline storage.`
                          : `Saved '${lec.title}' for offline access (${lec.offlineSize || '185 MB'} cached).`
                      );
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      lec.isOfflineAvailable
                        ? 'bg-[#85f8c4]/30 text-[#004f35] hover:bg-[#85f8c4]/50'
                        : 'bg-[#eff4ff] text-[#434655] hover:bg-[#e5eeff] hover:text-[#0037b0]'
                    }`}
                    title={lec.isOfflineAvailable ? 'Cached on device' : 'Make available offline'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {lec.isOfflineAvailable ? 'offline_pin' : 'download_for_offline'}
                    </span>
                    <span>{lec.isOfflineAvailable ? 'Saved Offline' : 'Mark Offline'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {lec.status === 'draft' && (
                    <button
                      onClick={() => onPublishDraft(lec.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0037b0] text-white text-xs font-semibold hover:bg-[#1d4ed8] flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">publish</span>
                      Publish
                    </button>
                  )}

                  <button
                    onClick={() => onOpenLecture(lec)}
                    className="px-3 py-1.5 rounded-lg text-[#0037b0] hover:bg-[#eff4ff] text-xs font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    Play
                  </button>

                  <button
                    onClick={() => onDeleteLecture(lec.id)}
                    aria-label="Delete"
                    className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
