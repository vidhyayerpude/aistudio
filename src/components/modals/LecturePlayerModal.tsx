import React, { useState } from 'react';
import { Lecture } from '../../types';

interface LecturePlayerModalProps {
  lecture: Lecture | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLecture?: (updated: Lecture) => void;
  onGenerateQuiz?: (lecture: Lecture) => void;
  onToggleOffline?: (id: string) => void;
}

export const LecturePlayerModal: React.FC<LecturePlayerModalProps> = ({
  lecture,
  isOpen,
  onClose,
  onUpdateLecture,
  onGenerateQuiz,
  onToggleOffline,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'transcript' | 'details'>('chapters');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<'published' | 'processing' | 'draft'>('published');
  const [currentPlayTime, setCurrentPlayTime] = useState('04:15');

  React.useEffect(() => {
    if (lecture) {
      setEditTitle(lecture.title);
      setEditStatus(lecture.status);
    }
  }, [lecture]);

  if (!isOpen || !lecture) return null;

  const handleSaveEdit = () => {
    if (onUpdateLecture) {
      onUpdateLecture({
        ...lecture,
        title: editTitle,
        status: editStatus,
      });
    }
    setIsEditing(false);
  };

  const filteredTranscript = lecture.transcript.filter((t) =>
    t.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-xs text-[#0037b0] font-semibold block truncate">
                {lecture.courseCode}
              </span>
              {lecture.isOfflineAvailable && (
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-[#85f8c4]/40 text-[#004f35] font-label-sm text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">offline_pin</span>
                  Offline Ready
                </span>
              )}
            </div>
            <h3 className="font-headline-sm text-base sm:text-lg text-[#0b1c30] truncate">
              {lecture.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onToggleOffline && (
              <button
                onClick={() => onToggleOffline(lecture.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  lecture.isOfflineAvailable
                    ? 'bg-[#85f8c4]/30 text-[#004f35] hover:bg-[#85f8c4]/50'
                    : 'bg-white text-[#434655] hover:text-[#0037b0] border border-[#c4c5d7]'
                }`}
                title={lecture.isOfflineAvailable ? 'Stored in device offline cache' : 'Save for offline classroom playback'}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {lecture.isOfflineAvailable ? 'offline_pin' : 'download_for_offline'}
                </span>
                <span className="hidden sm:inline">
                  {lecture.isOfflineAvailable ? 'Cached Offline' : 'Save Offline'}
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

        {/* Video Player Canvas / Simulation */}
        <div className="relative bg-[#0b1c30] aspect-video w-full flex flex-col justify-between overflow-hidden group">
          {/* Top Video Overlay Bar */}
          <div className="p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-10">
            <span className="text-xs font-medium truncate max-w-xs">{lecture.title}</span>
            <div className="flex items-center gap-2">
              {lecture.isOfflineAvailable && (
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Offline Stream ({lecture.offlineSize || '185 MB'})
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-black/50 text-[11px] font-mono">1080p WebStream</span>
            </div>
          </div>

          {/* Central Play/Pause Watermark */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-[#1d4ed8]/90 hover:bg-[#0037b0] text-white flex items-center justify-center shadow-lg transition-transform transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[36px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-1.5 text-white z-10">
            {/* Scrubber */}
            <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
              <div className="bg-[#1d4ed8] h-full rounded-full w-2/5" />
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[#85f8c4]">
                  <span className="material-symbols-outlined text-[20px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <span className="font-mono text-[11px]">
                  {currentPlayTime} / {lecture.duration}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onGenerateQuiz?.(lecture)}
                  className="px-2 py-0.5 rounded bg-[#1d4ed8] hover:bg-[#0037b0] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">quiz</span>
                  Create Quiz from Video
                </button>
                <span className="material-symbols-outlined text-[18px] cursor-pointer">volume_up</span>
                <span className="material-symbols-outlined text-[18px] cursor-pointer">fullscreen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[#e5eeff] bg-[#f8f9ff] px-4">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'chapters'
                ? 'border-[#0037b0] text-[#0037b0]'
                : 'border-transparent text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
            Curriculum Chapters ({lecture.chapters.length})
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'transcript'
                ? 'border-[#0037b0] text-[#0037b0]'
                : 'border-transparent text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">subtitles</span>
            AI Transcript &amp; Search
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'details'
                ? 'border-[#0037b0] text-[#0037b0]'
                : 'border-transparent text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Metadata &amp; Offline
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[260px] text-[#0b1c30]">
          {activeTab === 'chapters' && (
            <div className="space-y-2">
              {lecture.chapters.map((ch, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentPlayTime(ch.time)}
                  className="p-2.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex items-center justify-between hover:bg-[#eff4ff] hover:border-[#b7c4ff] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#dce1ff] text-[#0037b0] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-title-md text-xs font-medium text-[#0b1c30]">
                      {ch.title}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#0037b0] font-semibold bg-white px-2 py-0.5 rounded border border-[#d3e4fe]">
                    {ch.time}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2 text-[#747686] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder="Search keywords inside audio transcript..."
                  className="w-full h-8 pl-9 pr-3 rounded-lg border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#0037b0]"
                />
              </div>

              <div className="space-y-2">
                {filteredTranscript.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="p-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] text-xs text-[#434655] leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#434655] mb-1">
                      Lecture Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-[#c4c5d7] text-xs text-[#0b1c30]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#434655] mb-1">
                      Publication Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-lg border border-[#c4c5d7] text-xs text-[#0b1c30]"
                    >
                      <option value="published">Published (Visible to all students)</option>
                      <option value="processing">Processing (AI Transcribing)</option>
                      <option value="draft">Draft (Private to Instructor)</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#565e74] hover:bg-[#e5eeff]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-1.5 rounded-lg bg-[#0037b0] text-white text-xs font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#747686]">Status</span>
                      <p className="font-semibold text-xs capitalize text-[#0b1c30]">{lecture.status}</p>
                    </div>
                    <div>
                      <span className="text-xs text-[#747686]">Duration</span>
                      <p className="font-semibold text-xs text-[#0b1c30]">{lecture.duration}</p>
                    </div>
                    <div>
                      <span className="text-xs text-[#747686]">Offline Cache</span>
                      <p className="font-semibold text-xs text-[#004f35]">
                        {lecture.isOfflineAvailable ? `Cached (${lecture.offlineSize || '185 MB'})` : 'Not cached'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#e5eeff] text-[#0037b0] text-xs font-semibold flex items-center gap-1 hover:bg-[#dce9ff]"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-[#434655] pt-2 border-t border-[#e5eeff] leading-relaxed">
                    {lecture.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-[#e5eeff] bg-[#eff4ff] flex items-center justify-between">
          <span className="text-xs text-[#565e74]">
            Enrolled Cohort: <strong className="text-[#0b1c30]">Semester IV (1,420 students)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-title-md text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
