import React, { useState } from 'react';
import { StudentQuery } from '../../types';

interface StudentQueriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  queries: StudentQuery[];
  onResolveQuery: (id: string, replyText: string) => void;
}

export const StudentQueriesModal: React.FC<StudentQueriesModalProps> = ({
  isOpen,
  onClose,
  queries,
  onResolveQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(queries[0]?.id || null);

  if (!isOpen) return null;

  const pendingQueries = queries.filter((q) => q.status === 'pending');
  const resolvedQueries = queries.filter((q) => q.status === 'resolved');

  const displayedQueries = activeTab === 'pending' ? pendingQueries : resolvedQueries;
  const currentQuery = queries.find((q) => q.id === selectedQueryId) || displayedQueries[0];

  const handleSendReply = (id: string) => {
    const text = replyDrafts[id]?.trim() || 'Reviewed. This concept is covered in Lecture slide 14.';
    onResolveQuery(id, text);
    setReplyDrafts((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dce9ff] text-[#0037b0] flex items-center justify-center relative">
              <span className="material-symbols-outlined text-[24px]">forum</span>
              {pendingQueries.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold">
                  {pendingQueries.length}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
                Student Inquiries &amp; Doubts
              </h3>
              <p className="font-body-sm text-body-sm text-[#434655]">
                Direct questions submitted on published video timestamps &amp; notes
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

        {/* Status Filter Bar */}
        <div className="px-4 py-2.5 bg-[#f8f9ff] border-b border-[#e5eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'pending'
                  ? 'bg-[#0037b0] text-white shadow-sm'
                  : 'bg-white text-[#434655] hover:bg-[#eff4ff]'
              }`}
            >
              <span>Pending Review</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {pendingQueries.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'resolved'
                  ? 'bg-[#0037b0] text-white shadow-sm'
                  : 'bg-white text-[#434655] hover:bg-[#eff4ff]'
              }`}
            >
              <span>Resolved</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {resolvedQueries.length}
              </span>
            </button>
          </div>
          <span className="text-xs text-[#747686] font-medium hidden sm:inline">
            Avg. Professor Response Time: 4.2 hrs
          </span>
        </div>

        {/* Main Master-Detail Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[380px]">
          {/* List Sidebar */}
          <div className="w-full md:w-5/12 border-r border-[#e5eeff] overflow-y-auto p-3 space-y-2 bg-[#f8f9ff]">
            {displayedQueries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#565e74]">
                <span className="material-symbols-outlined text-[32px] text-[#747686] mb-1">done_all</span>
                <p>No queries in this category.</p>
              </div>
            ) : (
              displayedQueries.map((q) => {
                const isSelected = currentQuery?.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQueryId(q.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white border-[#0037b0] shadow-sm ring-1 ring-[#0037b0]'
                        : 'bg-white border-[#e5eeff] hover:border-[#b7c4ff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-title-md text-xs font-semibold text-[#0b1c30] truncate">
                        {q.studentName}
                      </span>
                      <span className="text-[10px] text-[#747686] flex-shrink-0">{q.timestamp}</span>
                    </div>
                    <span className="text-[10px] text-[#0037b0] font-medium block truncate mb-1">
                      {q.course}
                    </span>
                    <p className="text-xs text-[#434655] line-clamp-2 leading-relaxed">
                      {q.question}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Detailed Question & Response Pane */}
          <div className="w-full md:w-7/12 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto bg-white">
            {currentQuery ? (
              <div className="space-y-4">
                {/* Student Info */}
                <div className="flex items-start justify-between pb-3 border-b border-[#e5eeff]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#dae2fd] text-[#0037b0] font-bold text-sm flex items-center justify-center">
                      {currentQuery.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-title-md text-sm font-semibold text-[#0b1c30]">
                        {currentQuery.studentName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#565e74]">
                        <span>Roll: {currentQuery.rollNo}</span>
                        <span>•</span>
                        <span>{currentQuery.course}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#747686]">{currentQuery.timestamp}</span>
                </div>

                {/* Context badge */}
                <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#d3e4fe] flex items-center gap-2 text-xs text-[#0037b0]">
                  <span className="material-symbols-outlined text-[18px]">play_lesson</span>
                  <span className="truncate">Reference: {currentQuery.lectureContext}</span>
                </div>

                {/* Question body */}
                <div className="space-y-2">
                  <h5 className="font-title-md text-xs text-[#565e74] uppercase tracking-wide">
                    Student Question:
                  </h5>
                  <p className="text-sm text-[#0b1c30] leading-relaxed bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
                    {currentQuery.question}
                  </p>
                </div>

                {/* Code snippet if any */}
                {currentQuery.codeSnippet && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#565e74]">
                      Attached Code Segment:
                    </span>
                    <pre className="p-3 rounded-xl bg-[#0b1c30] text-emerald-400 font-mono text-xs overflow-x-auto">
                      <code>{currentQuery.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Existing Reply if resolved */}
                {currentQuery.status === 'resolved' && currentQuery.instructorReply && (
                  <div className="p-3 rounded-xl bg-[#85f8c4]/20 border border-[#006948]/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#004f35]">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Prof. Arvind&apos;s Response:</span>
                    </div>
                    <p className="text-xs text-[#0b1c30] leading-relaxed">
                      {currentQuery.instructorReply}
                    </p>
                  </div>
                )}

                {/* Reply Editor for Pending Queries */}
                {currentQuery.status === 'pending' && (
                  <div className="space-y-2 pt-2">
                    <label className="block font-title-md text-xs text-[#0b1c30]">
                      Instructor Response &amp; Clarification:
                    </label>
                    <textarea
                      rows={4}
                      value={replyDrafts[currentQuery.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts({ ...replyDrafts, [currentQuery.id]: e.target.value })
                      }
                      placeholder="Type your explanation or suggest references from lecture notes..."
                      className="w-full p-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#0037b0] focus:outline-none"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const template =
                              'Recall that the variable `turn` arbitrates ties deterministically. Even if both set flags, only one can enter while the other yields.';
                            setReplyDrafts({ ...replyDrafts, [currentQuery.id]: template });
                          }}
                          className="px-2 py-1 rounded bg-[#eff4ff] text-[11px] text-[#0037b0] hover:bg-[#dce9ff]"
                        >
                          + Insert CS-401 Hint
                        </button>
                      </div>

                      <button
                        onClick={() => handleSendReply(currentQuery.id)}
                        className="px-4 py-2 rounded-xl bg-[#1d4ed8] hover:bg-[#0037b0] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        Send Response &amp; Resolve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#747686]">
                Select a query from the list to review and reply.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
