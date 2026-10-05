import React, { useState } from 'react';
import { NoteDocument } from '../../types';

interface UploadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: NoteDocument) => void;
}

export const UploadPdfModal: React.FC<UploadPdfModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Operating Systems (CS-401)');
  const [unit, setUnit] = useState('Unit 3: Concurrency Control');
  const [summary, setSummary] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.1 MB');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDocName = fileName || (title ? `${title.replace(/\s+/g, '_')}.pdf` : 'Course_Notes.pdf');

    const newDoc: NoteDocument = {
      id: `note-${Date.now()}`,
      title: finalDocName.endsWith('.pdf') ? finalDocName : `${finalDocName}.pdf`,
      size: fileSize,
      downloads: 0,
      subject,
      unit,
      uploadedAgo: 'Just now',
      pagesCount: 14,
      summary: summary || 'Comprehensive study companion and revision cheat sheet for upcoming midterm examinations.',
      previewPoints: [
        'Curated exam cheat notes and formula reference guide',
        'Solved university past paper problems and step-by-step algorithms',
        'Key definitions, invariants, and edge cases to review'
      ]
    };

    onAddDocument(newDoc);
    onClose();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
                Add Revision Notes / PDF
              </h3>
              <p className="font-body-sm text-body-sm text-[#434655]">
                Upload downloadable PDF study material for enrolled cohorts
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-[#0b1c30]">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('pdf-file-input')?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                : fileName
                ? 'border-[#006948] bg-[#85f8c4]/15'
                : 'border-[#c4c5d7] bg-[#f8f9ff] hover:bg-[#eff4ff]'
            }`}
          >
            <input
              id="pdf-file-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-10 h-10 mx-auto rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-1.5">
              <span className="material-symbols-outlined text-[22px]">
                {fileName ? 'check' : 'note_add'}
              </span>
            </div>
            <p className="font-title-md text-xs font-semibold text-[#0b1c30]">
              {fileName || 'Drag PDF notes or click to browse'}
            </p>
            <span className="font-label-sm text-[11px] text-[#565e74] mt-0.5 block">
              Maximum document size: 50MB per PDF
            </span>
          </div>

          <div>
            <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
              Document Display Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. OS_Unit_3_Revision_Notes.pdf"
              className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#0037b0] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Associated Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:outline-none"
              >
                <option value="Operating Systems (CS-401)">Operating Systems (CS-401)</option>
                <option value="Computer Science (CS-201)">Computer Science (CS-201)</option>
                <option value="Computer Architecture (CS-302)">Computer Architecture (CS-302)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Unit / Module
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Unit 3: Concurrency"
                className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
              Brief Overview / Topics Covered
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Key summaries, formula proofs, and past exam questions included in this PDF..."
              className="w-full p-2.5 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0037b0]"
            />
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2.5 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-title-md text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Add Document to Cohort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
