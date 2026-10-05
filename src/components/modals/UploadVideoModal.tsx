import React, { useState } from 'react';
import { Lecture } from '../../types';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartUpload: (lectureInfo: Partial<Lecture>, fileDetails: { name: string; sizeMb: number }) => void;
  mode?: 'file' | 'link';
}

export const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  isOpen,
  onClose,
  onStartUpload,
  mode = 'file',
}) => {
  const [activeMode, setActiveMode] = useState<'file' | 'link'>(mode);
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('Operating Systems (CS-401)');
  const [unit, setUnit] = useState('Unit 3: Concurrency & Synchronization');
  const [duration, setDuration] = useState('45 mins');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (selectedFileName ? selectedFileName.replace(/\.[^/.]+$/, '') : 'New Lecture Video');
    const finalFile = selectedFileName || (linkUrl ? 'Cloud_Stream_Recording.mp4' : 'Lecture_Recording.mp4');

    onStartUpload(
      {
        title: finalTitle,
        courseCode,
        unit,
        duration: duration || '45 mins',
        status: 'processing',
        processingStep: 'Generating AI Transcripts',
        processingQuality: 'Encoding 1080p WebStream',
        uploadedAgo: 'Just now',
        views: 0,
        questionsCount: 0,
        description: `Lecture on ${finalTitle} recorded for ${courseCode}.`,
        chapters: [
          { time: '00:00', title: 'Session Overview' },
          { time: '12:30', title: 'Core Mechanics & Proofs' },
          { time: '28:40', title: 'Implementation Examples' }
        ],
        transcript: [
          'Lecture stream initiated. Transcribing audio feed and syncing with slide presentation timestamps.'
        ]
      },
      {
        name: finalFile,
        sizeMb: 420
      }
    );
    onClose();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-xl rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dce1ff] text-[#0037b0] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
                Publish Video Lecture
              </h3>
              <p className="font-body-sm text-body-sm text-[#434655]">
                Upload recording to encode in 1080p and generate AI transcripts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#747686] hover:bg-[#e5eeff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-3 flex gap-2 border-b border-[#e5eeff] bg-[#f8f9ff]">
          <button
            onClick={() => setActiveMode('file')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeMode === 'file'
                ? 'border-[#0037b0] text-[#0037b0]'
                : 'border-transparent text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">file_upload</span>
            Upload MP4 / MKV File
          </button>
          <button
            onClick={() => setActiveMode('link')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeMode === 'link'
                ? 'border-[#0037b0] text-[#0037b0]'
                : 'border-transparent text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
            Import from Cloud / YouTube
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-[#0b1c30]">
          {activeMode === 'file' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-[#0037b0] bg-[#eff4ff]'
                  : selectedFileName
                  ? 'border-[#006948] bg-[#85f8c4]/10'
                  : 'border-[#c4c5d7] bg-[#f8f9ff] hover:bg-[#eff4ff]'
              }`}
              onClick={() => document.getElementById('video-file-input')?.click()}
            >
              <input
                id="video-file-input"
                type="file"
                accept="video/mp4,video/mkv,video/webm"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="w-12 h-12 mx-auto rounded-full bg-[#dce1ff] text-[#0037b0] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[28px]">
                  {selectedFileName ? 'check' : 'video_call'}
                </span>
              </div>
              <h4 className="font-title-md text-sm text-[#0b1c30]">
                {selectedFileName || 'Drag and drop video recording here'}
              </h4>
              <p className="font-body-sm text-xs text-[#565e74] mt-1">
                {selectedFileName ? 'File attached. Click to change' : 'or click to browse from your device'}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#e5eeff] text-[#565e74] font-label-sm text-[11px]">
                Supports MP4, MKV, WebM up to 4GB
              </span>
            </div>
          ) : (
            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Video Cloud URL (YouTube Unlisted, Zoom Cloud, Google Drive)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#747686] text-[20px]">
                  link
                </span>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    if (!title && e.target.value) {
                      setTitle('Imported Cloud Video Lecture');
                    }
                  }}
                  placeholder="https://youtu.be/... or https://zoom.us/rec/play/..."
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#0037b0] focus:outline-none"
                />
              </div>
              <p className="font-body-sm text-[11px] text-[#565e74] mt-1">
                Vidhya will ingest video frames, extract audio channels, and auto-transcribe chapters.
              </p>
            </div>
          )}

          <div>
            <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
              Lecture Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Memory Management: Page Replacement Algorithms"
              className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#0037b0] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Course &amp; Cohort
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:outline-none"
              >
                <option value="Operating Systems (CS-401)">Operating Systems (CS-401)</option>
                <option value="Computer Science (CS-201)">Computer Science (CS-201)</option>
                <option value="Computer Architecture (CS-302)">Computer Architecture (CS-302)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Estimated Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45 mins"
                className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:outline-none"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
              Curriculum Unit / Module
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. Unit 3: Concurrency Control"
              className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#e5eeff] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#565e74] hover:bg-[#e5eeff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#0037b0] text-white font-title-md text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">upload</span>
              Start Transcoding &amp; Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
