import React, { useState } from 'react';
import { Lecture, NoteDocument, UploadProgress } from '../../types';

interface DashboardScreenProps {
  lectures: Lecture[];
  notes: NoteDocument[];
  pendingQueriesCount: number;
  activeTerm: string;
  uploadProgress: UploadProgress | null;
  isOfflineMode: boolean;
  onOpenLiveDoubt: () => void;
  onOpenGenerateQuiz: () => void;
  onOpenQueries: () => void;
  onOpenUploadVideo: (mode: 'file' | 'link') => void;
  onOpenUploadPdf: () => void;
  onOpenLecture: (lecture: Lecture) => void;
  onOpenPdf: (note: NoteDocument) => void;
  onPublishDraft: (id: string) => void;
  onDeleteLecture: (id: string) => void;
  onToggleUploadPause: () => void;
  onCancelUpload: () => void;
  onToggleLectureOffline: (id: string) => void;
  onToggleNoteOffline: (id: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  lectures,
  notes,
  pendingQueriesCount,
  activeTerm,
  uploadProgress,
  isOfflineMode,
  onOpenLiveDoubt,
  onOpenGenerateQuiz,
  onOpenQueries,
  onOpenUploadVideo,
  onOpenUploadPdf,
  onOpenLecture,
  onOpenPdf,
  onPublishDraft,
  onDeleteLecture,
  onToggleUploadPause,
  onCancelUpload,
  onToggleLectureOffline,
  onToggleNoteOffline,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [onlyOffline, setOnlyOffline] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const filteredLectures = lectures.filter((lec) => {
    const matchesSearch =
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lec.unit && lec.unit.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject =
      selectedSubject === 'All Subjects' ||
      (selectedSubject === 'Operating Systems (CS-401)' && lec.courseCode.includes('CS-401')) ||
      (selectedSubject === 'Data Structures & Algorithms (CS-201)' &&
        (lec.courseCode.includes('CS-201') || lec.courseCode.includes('Computer Science')));

    const matchesOffline = !onlyOffline || !!lec.isOfflineAvailable;

    return matchesSearch && matchesSubject && matchesOffline;
  });

  const filteredNotes = notes.filter((doc) => {
    return !onlyOffline || !!doc.isOfflineAvailable;
  });

  const offlineLecturesCount = lectures.filter((l) => l.isOfflineAvailable).length;
  const offlineNotesCount = notes.filter((n) => n.isOfflineAvailable).length;

  return (
    <div className="flex flex-col w-full space-y-space-md max-w-2xl mx-auto">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#213145] text-[#eaf1ff] px-4 py-2 rounded-xl text-xs font-medium shadow-lg z-50 transition-opacity flex items-center gap-1.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-[#85f8c4]">check_circle</span>
          {feedbackToast}
        </div>
      )}

      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="p-3 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-between text-xs font-medium shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">wifi_off</span>
            <span>
              <strong>Offline Mode Active:</strong> Operating without Wi-Fi. Accessing {offlineLecturesCount} lectures and {offlineNotesCount} notes cached on device.
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
            Local Storage
          </span>
        </div>
      )}

      {/* Welcome & Profile Summary */}
      <section className="flex flex-col bg-[#eff4ff] rounded-xl p-space-md shadow-sm relative overflow-hidden border border-[#dce9ff]/60">
        <div className="flex items-start justify-between gap-space-sm mb-space-sm relative z-10">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-label-sm text-label-sm mb-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004f35] animate-pulse" />
              {activeTerm}
            </span>
            <h2 className="font-headline-md text-headline-md text-[#0b1c30] truncate">
              Welcome back, Prof. Arvind
            </h2>
            <p className="font-body-sm text-body-sm text-[#434655] truncate">
              Computer Science Department • Semester IV
            </p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-sm bg-[#d3e4fe] ring-2 ring-white">
            <img
              className="w-full h-full object-cover"
              alt="Prof. Arvind"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSCdzSLZmpyKXtaykrGOGwz0AT4fYli1_eVa6LxV1a_sKSaCiXjjK3aVYgooY0d1vOBnDKlXi6hjXVT9z_LMNIXTyo9HL6U9jadv070WxFzUjAD8oUR8KBwVfekoCIyVYzR5Vqipyluso73e0kABy_t4ZgBhMy0zmGtdv2DRIfKlNflvys0EIiZYSd2cAgmA1ymqoz37f3V8VBqd692_bMWmAjCpeob0o6CYCV9qiyS6lPzlICZ4Qrxg"
            />
          </div>
        </div>

        {/* Quick Stat Chips (Horizontal Scroll) */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 pt-1 -mx-space-md px-space-md no-scrollbar">
          <div className="flex items-center gap-2 bg-[#ffffff] py-1.5 px-3 rounded-xl flex-shrink-0 shadow-sm border border-[#e5eeff]">
            <span
              className="material-symbols-outlined text-[18px] text-[#0037b0]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              groups
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#0b1c30] leading-tight tabular-nums">
                1,420
              </span>
              <span className="font-label-sm text-label-sm text-[#434655]">Active Students</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#ffffff] py-1.5 px-3 rounded-xl flex-shrink-0 shadow-sm border border-[#e5eeff]">
            <span
              className="material-symbols-outlined text-[18px] text-[#004f35]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_circle
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#0b1c30] leading-tight tabular-nums">
                {lectures.filter((l) => l.status === 'published').length + 32}
              </span>
              <span className="font-label-sm text-label-sm text-[#434655]">Published Lectures</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#ffffff] py-1.5 px-3 rounded-xl flex-shrink-0 shadow-sm border border-[#e5eeff]">
            <span
              className="material-symbols-outlined text-[18px] text-[#565e74]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              menu_book
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#0b1c30] leading-tight tabular-nums">
                {notes.length + 15}
              </span>
              <span className="font-label-sm text-label-sm text-[#434655]">Notes Shared</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#ffffff] py-1.5 px-3 rounded-xl flex-shrink-0 shadow-sm border border-[#e5eeff]">
            <span
              className="material-symbols-outlined text-[18px] text-[#0037b0]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              offline_pin
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#0b1c30] leading-tight tabular-nums">
                {offlineLecturesCount + offlineNotesCount}
              </span>
              <span className="font-label-sm text-label-sm text-[#434655]">Offline Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Instructor Action Hub */}
      <section className="flex flex-col gap-space-xs">
        <div className="grid grid-cols-3 gap-space-xs">
          <button
            onClick={onOpenLiveDoubt}
            className="flex flex-col items-center justify-center p-space-sm bg-[#ffffff] rounded-xl shadow-sm hover:bg-[#e5eeff] transition-colors text-center group border border-[#e5eeff] active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#001551] mb-1 group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">podcasts</span>
            </div>
            <span className="font-label-md text-label-md text-[#0b1c30] leading-tight line-clamp-2">
              Live Doubt Session
            </span>
          </button>

          <button
            onClick={onOpenGenerateQuiz}
            className="flex flex-col items-center justify-center p-space-sm bg-[#ffffff] rounded-xl shadow-sm hover:bg-[#e5eeff] transition-colors text-center group border border-[#e5eeff] active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#5c647a] mb-1 group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">quiz</span>
            </div>
            <span className="font-label-md text-label-md text-[#0b1c30] leading-tight line-clamp-2">
              Generate Quiz
            </span>
          </button>

          <button
            onClick={onOpenQueries}
            className="flex flex-col items-center justify-center p-space-sm bg-[#ffffff] rounded-xl shadow-sm hover:bg-[#e5eeff] transition-colors text-center relative group border border-[#e5eeff] active:scale-95"
          >
            {pendingQueriesCount > 0 && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-[#ffffff] font-label-sm text-[10px] font-semibold leading-none shadow-sm">
                {pendingQueriesCount}
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] mb-1 group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">forum</span>
            </div>
            <span className="font-label-md text-label-md text-[#0b1c30] leading-tight line-clamp-2">
              Student Queries
            </span>
          </button>
        </div>
      </section>

      {/* Interactive Drag & Drop / Tap Upload Section */}
      <section className="flex flex-col bg-[#ffffff] rounded-xl p-space-md shadow-sm space-y-space-md border border-[#e5eeff]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
              Publish Video Lecture
            </h3>
            <p className="font-body-sm text-body-sm text-[#434655]">
              Streamed automatically to enrolled cohorts
            </p>
          </div>
          <span className="material-symbols-outlined text-[#0037b0] text-[24px]">cloud_upload</span>
        </div>

        {/* Dropzone Area */}
        <div
          onClick={() => onOpenUploadVideo('file')}
          className="relative rounded-xl p-space-lg flex flex-col items-center justify-center text-center cursor-pointer bg-[#eff4ff] hover:bg-[#e5eeff] transition-all group overflow-hidden border border-[#dce9ff]"
          id="dropzone"
        >
          <div className="w-12 h-12 rounded-full bg-[#0037b0]/10 flex items-center justify-center text-[#0037b0] mb-space-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[28px]">video_call</span>
          </div>
          <h4 className="font-title-md text-title-md text-[#0b1c30]">Upload New Video Lecture</h4>
          <p className="font-body-sm text-body-sm text-[#434655] mt-1">
            Tap to select or drag video lecture recording
          </p>
          <div className="mt-space-sm inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d3e4fe] text-[#434655] font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px]">hd</span>
            MP4, MKV up to 4GB
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-space-xs">
          <button
            onClick={() => onOpenUploadVideo('file')}
            className="flex-1 py-2.5 px-space-md rounded-xl bg-[#1d4ed8] text-[#ffffff] font-title-md text-title-md flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">file_upload</span>
            Select Video File
          </button>
          <button
            onClick={() => onOpenUploadVideo('link')}
            className="py-2.5 px-space-md rounded-xl bg-[#e5eeff] text-[#0b1c30] font-title-md text-title-md flex items-center justify-center gap-2 hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">link</span>
            Paste Cloud / YouTube Link
          </button>
        </div>

        {/* Live In-Progress Transcoding/Upload Card */}
        {uploadProgress && uploadProgress.status !== 'cancelled' && (
          <div className="bg-[#eff4ff] rounded-xl p-space-md flex flex-col space-y-2 relative shadow-sm border border-[#dce9ff]">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#0037b0]/10 text-[#0037b0] flex items-center justify-center flex-shrink-0">
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      uploadProgress.status === 'uploading' ? 'animate-spin' : ''
                    }`}
                  >
                    slow_motion_video
                  </span>
                </div>
                <div className="min-w-0">
                  <h5 className="font-title-md text-title-md text-[#0b1c30] truncate">
                    {uploadProgress.fileName}
                  </h5>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-[#434655]">
                    <span>{uploadProgress.progress}% uploaded</span>
                    <span>•</span>
                    <span className="text-[#0037b0] font-semibold">
                      {uploadProgress.status === 'paused' ? 'Paused' : uploadProgress.eta}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={onToggleUploadPause}
                  aria-label={uploadProgress.status === 'paused' ? 'Resume Upload' : 'Pause Upload'}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#434655] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
                  title={uploadProgress.status === 'paused' ? 'Resume' : 'Pause'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {uploadProgress.status === 'paused' ? 'play_arrow' : 'pause'}
                  </span>
                </button>
                <button
                  onClick={onCancelUpload}
                  aria-label="Cancel Upload"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                  title="Cancel Upload"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#d3e4fe] rounded-full h-2 overflow-hidden relative">
              <div
                className="bg-[#0037b0] h-full rounded-full transition-all duration-300 relative"
                style={{ width: `${uploadProgress.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-label-sm text-[#434655]">
              <span className="tabular-nums">
                {uploadProgress.uploadedMb} MB of {uploadProgress.totalMb} MB
              </span>
              <span className="flex items-center gap-1 text-[#004f35] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004f35] animate-pulse" />
                {uploadProgress.step}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Content Management Section: Subjects & Lectures */}
      <section className="flex flex-col space-y-space-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
              Course Content &amp; Lectures
            </h3>
            <span className="font-label-sm text-label-sm text-[#434655]">4 Modules</span>
          </div>
          <p className="font-body-sm text-body-sm text-[#434655]">
            Manage curriculum videos, processing queues, and analytics
          </p>
        </div>

        {/* Search, Course Filter, and Offline Toggle */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-space-xs">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#434655] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, topics, or tags..."
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#ffffff] text-[#0b1c30] placeholder:text-[#434655]/70 font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-[#0037b0] shadow-sm border border-[#e5eeff]"
              />
            </div>
            <div className="relative flex-shrink-0">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full sm:w-auto h-10 px-3 pr-8 rounded-xl bg-[#ffffff] text-[#0b1c30] font-label-md text-label-md appearance-none shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0037b0] cursor-pointer border border-[#e5eeff]"
              >
                <option>All Subjects</option>
                <option>Operating Systems (CS-401)</option>
                <option>Data Structures &amp; Algorithms (CS-201)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#434655] pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Quick Offline Filter Switch */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setOnlyOffline(!onlyOffline)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                onlyOffline
                  ? 'bg-[#0037b0] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {onlyOffline ? 'offline_pin' : 'filter_list'}
              </span>
              <span>Only Available Offline ({offlineLecturesCount})</span>
            </button>
            <span className="text-[11px] text-[#747686]">
              Showing {filteredLectures.length} of {lectures.length} lectures
            </span>
          </div>
        </div>

        {/* Lectures List Cards */}
        <div className="flex flex-col space-y-space-xs">
          {filteredLectures.map((lec) => {
            const isProcessing = lec.status === 'processing';
            const isDraft = lec.status === 'draft';
            const isPublished = lec.status === 'published';

            return (
              <div
                key={lec.id}
                className="bg-[#ffffff] rounded-xl p-space-md shadow-sm flex flex-col space-y-space-xs hover:shadow-md transition-shadow border border-[#e5eeff] group"
              >
                <div className="flex items-start justify-between gap-space-sm">
                  <div
                    className="flex flex-col min-w-0 cursor-pointer"
                    onClick={() => onOpenLecture(lec)}
                  >
                    <span className="font-label-sm text-label-sm text-[#0037b0] font-semibold truncate">
                      {lec.courseCode}
                    </span>
                    <h4 className="font-title-md text-title-md text-[#0b1c30] mt-0.5 truncate hover:text-[#0037b0] transition-colors">
                      {lec.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Offline badge */}
                    {lec.isOfflineAvailable && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#85f8c4]/40 text-[#004f35] font-label-sm text-[11px] font-semibold"
                        title="Downloaded & verified for offline playback"
                      >
                        <span className="material-symbols-outlined text-[14px]">offline_pin</span>
                        Offline
                      </span>
                    )}

                    {isPublished && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-label-sm text-label-sm flex-shrink-0 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004f35]" />
                        Published
                      </span>
                    )}
                    {isProcessing && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#5c647a] font-label-sm text-label-sm flex-shrink-0 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#565e74] animate-pulse" />
                        Processing
                      </span>
                    )}
                    {isDraft && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#434655] font-label-sm text-label-sm flex-shrink-0 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#747686]" />
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-[#434655] pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {lec.duration}
                  </span>

                  {isPublished && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        {lec.views} views
                      </span>
                      {lec.helpfulPercentage ? (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                            {lec.helpfulPercentage}% helpful
                          </span>
                        </>
                      ) : (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                            {lec.questionsCount} questions
                          </span>
                        </>
                      )}
                    </>
                  )}

                  {isProcessing && (
                    <>
                      <span>•</span>
                      <span className="text-[#565e74] font-medium">
                        {lec.processingStep || 'Generating AI Transcripts'}
                      </span>
                    </>
                  )}

                  {isDraft && (
                    <>
                      <span>•</span>
                      <span>Unpublished notes attached</span>
                    </>
                  )}
                </div>

                {/* Footer Strip */}
                <div className="flex items-center justify-between pt-2 border-t-0 bg-[#eff4ff] -mx-space-md -mb-space-md px-space-md py-2 rounded-b-xl mt-2 border-t border-[#e5eeff]/80">
                  <span className="font-label-sm text-label-sm text-[#434655]">
                    {isProcessing
                      ? lec.processingQuality || 'Encoding 720p/1080p'
                      : lec.unit || lec.uploadedAgo}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Offline toggle button */}
                    <button
                      onClick={() => {
                        onToggleLectureOffline(lec.id);
                        showToast(
                          lec.isOfflineAvailable
                            ? `Removed '${lec.title}' from offline storage.`
                            : `Marked '${lec.title}' for offline access (${lec.offlineSize || '185 MB'} cached).`
                        );
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        lec.isOfflineAvailable
                          ? 'bg-[#85f8c4]/30 text-[#004f35] hover:bg-[#85f8c4]/50'
                          : 'text-[#434655] hover:bg-[#e5eeff]'
                      }`}
                      title={lec.isOfflineAvailable ? 'Stored locally for offline access' : 'Make available offline'}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {lec.isOfflineAvailable ? 'offline_pin' : 'download_for_offline'}
                      </span>
                      <span className="hidden sm:inline">
                        {lec.isOfflineAvailable ? 'Offline Ready' : 'Make Offline'}
                      </span>
                    </button>

                    {isPublished && (
                      <>
                        <button
                          onClick={() => onOpenLecture(lec)}
                          className="px-2.5 py-1 rounded-lg text-[#0037b0] hover:bg-[#e5eeff] font-label-md text-label-md flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => onOpenLecture(lec)}
                          className="px-2.5 py-1 rounded-lg text-[#434655] hover:bg-[#e5eeff] font-label-md text-label-md flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">monitoring</span>
                          Analytics
                        </button>
                        <button
                          onClick={() => {
                            onDeleteLecture(lec.id);
                            showToast('Lecture removed from curriculum.');
                          }}
                          aria-label="Delete lecture"
                          className="p-1 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors"
                          title="Delete lecture"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </>
                    )}

                    {isProcessing && (
                      <button
                        onClick={() => onOpenLecture(lec)}
                        className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff] font-label-md text-label-md flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">settings</span>
                        Manage
                      </button>
                    )}

                    {isDraft && (
                      <button
                        onClick={() => {
                          onPublishDraft(lec.id);
                          showToast('Lecture published to cohort successfully!');
                        }}
                        className="px-3 py-1 rounded-lg bg-[#0037b0] text-[#ffffff] font-label-md text-label-md flex items-center gap-1 shadow-sm active:scale-95 transition-all hover:bg-[#1d4ed8]"
                      >
                        <span className="material-symbols-outlined text-[16px]">publish</span>
                        Publish Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upload PDF Revision Notes Section */}
      <section className="flex flex-col bg-[#ffffff] rounded-xl p-space-md shadow-sm space-y-space-md border border-[#e5eeff]">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
              Revision Notes &amp; Cheat Sheets
            </h3>
            <p className="font-body-sm text-body-sm text-[#434655] truncate">
              Provide downloadable study companion materials ({offlineNotesCount} offline cached)
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#0037b0] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
          </div>
        </div>

        {/* Quick Document Upload Prompt */}
        <div
          onClick={onOpenUploadPdf}
          className="bg-[#eff4ff] rounded-xl p-space-md flex flex-col items-center justify-center text-center hover:bg-[#e5eeff] transition-colors cursor-pointer group border border-[#dce9ff]"
        >
          <span className="material-symbols-outlined text-[32px] text-[#0037b0] group-hover:-translate-y-0.5 transition-transform mb-1">
            note_add
          </span>
          <p className="font-title-md text-title-md text-[#0b1c30]">
            Drag PDF notes or click to browse
          </p>
          <span className="font-label-sm text-label-sm text-[#434655] mt-0.5">
            Maximum document size: 50MB per PDF
          </span>
        </div>

        {/* Attached Documents List */}
        <div className="flex flex-col space-y-space-xs">
          {filteredNotes.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors border border-[#dce9ff]/60"
            >
              <div
                className="flex items-center gap-3 min-w-0 cursor-pointer"
                onClick={() => onOpenPdf(doc)}
              >
                <div className="w-10 h-10 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">description</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-title-md text-title-md text-[#0b1c30] truncate hover:text-[#0037b0] transition-colors">
                      {doc.title}
                    </p>
                    {doc.isOfflineAvailable && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#85f8c4]/40 text-[#004f35] font-label-sm text-[10px] font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">offline_pin</span>
                        Offline
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-[#434655]">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span className="text-[#004f35] font-medium">
                      {doc.downloads} downloads
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Offline toggle for note */}
                <button
                  onClick={() => {
                    onToggleNoteOffline(doc.id);
                    showToast(
                      doc.isOfflineAvailable
                        ? `Removed '${doc.title}' from offline notes.`
                        : `Saved '${doc.title}' for offline reading.`
                    );
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    doc.isOfflineAvailable
                      ? 'text-[#004f35] bg-[#85f8c4]/30'
                      : 'text-[#434655] hover:text-[#0037b0] hover:bg-[#dce9ff]'
                  }`}
                  title={doc.isOfflineAvailable ? 'Stored locally for offline access' : 'Save for offline access'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {doc.isOfflineAvailable ? 'offline_pin' : 'download_for_offline'}
                  </span>
                </button>

                <button
                  onClick={() => onOpenPdf(doc)}
                  aria-label="Download Document"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#434655] hover:text-[#0037b0] transition-colors"
                  title="View & Download"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
                <button
                  onClick={() => onOpenPdf(doc)}
                  aria-label="Document Options"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#434655] hover:text-[#0b1c30] transition-colors"
                  title="Document details"
                >
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Primary Add PDF CTA */}
        <button
          onClick={onOpenUploadPdf}
          className="w-full py-2.5 px-space-md rounded-xl bg-[#e5eeff] text-[#0037b0] font-title-md text-title-md flex items-center justify-center gap-2 hover:bg-[#dce9ff] transition-colors active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>+ Add New PDF
          Document
        </button>
      </section>
    </div>
  );
};
