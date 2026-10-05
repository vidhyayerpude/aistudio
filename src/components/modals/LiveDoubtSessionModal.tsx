import React, { useState, useEffect } from 'react';

interface LiveDoubtSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: string;
}

export const LiveDoubtSessionModal: React.FC<LiveDoubtSessionModalProps> = ({
  isOpen,
  onClose,
  initialCourse = 'Operating Systems (CS-401)',
}) => {
  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [isLive, setIsLive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [whiteboardText, setWhiteboardText] = useState(
    '// Instructor Scratchpad & Whiteboard\n// Mutex Semaphore S = 1;\nwait(S);\n  // Critical Section\nsignal(S);'
  );

  const [handRaises, setHandRaises] = useState([
    { id: '1', name: 'Aarav Sharma', query: 'Can you show the timing diagram for Peterson’s Algorithm?', time: '2m ago' },
    { id: '2', name: 'Rohan Gupta', query: 'What happens if a process crashes inside wait() before decrementing?', time: '4m ago' },
    { id: '3', name: 'Ananya Mehra', query: 'Difference between spinlock and blocking semaphore latency?', time: '5m ago' },
  ]);

  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setIsLive(true);
  };

  const handleEndSession = () => {
    setIsLive(false);
    setActiveSpeaker(null);
  };

  const handleInviteToSpeak = (name: string, id: string) => {
    setActiveSpeaker(name);
    setHandRaises((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLive ? 'bg-[#ba1a1a] text-white animate-pulse' : 'bg-[#dce1ff] text-[#0037b0]'}`}>
              <span className="material-symbols-outlined text-[24px]">podcasts</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
                  Live Doubt Session
                </h3>
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-label-sm text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
                    LIVE • {formatTimer(elapsedSeconds)}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#565e74] font-label-sm text-xs">
                    Ready to Stream
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-[#434655]">
                Real-time cohort audio, screen broadcast & doubt resolution
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-[#0b1c30]">
          {/* Target Course selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff]">
            <div>
              <span className="font-label-sm text-label-sm text-[#434655]">Target Cohort:</span>
              <p className="font-title-md text-title-md font-semibold text-[#0037b0]">{selectedCourse}</p>
            </div>
            {!isLive ? (
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="h-9 px-3 rounded-lg border border-[#c4c5d7] bg-white text-xs font-medium text-[#0b1c30] focus:outline-none"
              >
                <option value="Operating Systems (CS-401)">Operating Systems (CS-401)</option>
                <option value="Computer Science (CS-201)">Computer Science (CS-201)</option>
                <option value="Computer Architecture (CS-302)">Computer Architecture (CS-302)</option>
              </select>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85f8c4]/40 text-[#004f35] font-label-sm text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">groups</span>
                48 Students In Room
              </span>
            )}
          </div>

          {/* Interactive Screen / Whiteboard Area */}
          <div className="rounded-xl overflow-hidden border border-[#d3e4fe] bg-[#0b1c30] text-white">
            <div className="p-3 bg-[#213145] flex items-center justify-between border-b border-[#3f465c]">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
                  {isWhiteboardActive ? 'draw' : isScreenSharing ? 'screen_share' : 'cast_connected'}
                </span>
                <span>
                  {isWhiteboardActive
                    ? 'Interactive Whiteboard (Visible to all students)'
                    : isScreenSharing
                    ? 'Displaying: Slide Deck - Process Synchronization'
                    : 'Instructor Broadcast Console'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    isWhiteboardActive
                      ? 'bg-[#1d4ed8] text-white'
                      : 'bg-[#3f465c] text-white/80 hover:text-white'
                  }`}
                >
                  {isWhiteboardActive ? 'Close Board' : 'Open Whiteboard'}
                </button>
              </div>
            </div>

            <div className="min-h-[160px] p-4 flex flex-col justify-center items-center relative">
              {isWhiteboardActive ? (
                <div className="w-full">
                  <textarea
                    rows={6}
                    value={whiteboardText}
                    onChange={(e) => setWhiteboardText(e.target.value)}
                    className="w-full font-mono text-xs p-3 bg-[#131b2e] rounded-lg border border-[#3f465c] text-emerald-300 focus:outline-none"
                    placeholder="Type or diagram code here..."
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Synchronized in real-time to student client devices.
                  </span>
                </div>
              ) : isLive ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#1d4ed8]/30 border border-[#1d4ed8] flex items-center justify-center text-white mb-3">
                    <span className="material-symbols-outlined text-[32px] animate-pulse">sensors</span>
                  </div>
                  <h4 className="font-semibold text-sm">Session Broadcasting to 48 Students</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeSpeaker
                      ? `Currently speaking: ${activeSpeaker}`
                      : 'Waiting for questions from the hand-raise queue below...'}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-[36px] text-slate-400 mb-2">videocam_off</span>
                  <p className="text-sm font-medium text-slate-300">Session not started yet</p>
                  <p className="text-xs text-slate-400">
                    Click &apos;Start Live Broadcast&apos; to notify enrolled cohorts.
                  </p>
                </div>
              )}
            </div>

            {/* In-Session Tool Bar */}
            {isLive && (
              <div className="p-3 bg-[#131b2e] border-t border-[#3f465c] flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    isMuted ? 'bg-[#ba1a1a] text-white' : 'bg-[#3f465c] text-white hover:bg-[#565e74]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isMuted ? 'mic_off' : 'mic'}
                  </span>
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    isScreenSharing ? 'bg-[#1d4ed8] text-white' : 'bg-[#3f465c] text-white hover:bg-[#565e74]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">screen_share</span>
                  {isScreenSharing ? 'Stop Screen' : 'Share Screen'}
                </button>

                <button
                  onClick={handleEndSession}
                  className="px-3.5 py-1.5 rounded-lg bg-[#ba1a1a] text-white text-xs font-semibold hover:bg-red-700 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">call_end</span>
                  End Session
                </button>
              </div>
            )}
          </div>

          {/* Student Doubt Queue (Hand-raise) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-title-md text-title-md text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#0037b0]">front_hand</span>
                Student Doubt Queue ({handRaises.length})
              </h4>
              <span className="font-label-sm text-xs text-[#434655]">
                {handRaises.length} hands raised
              </span>
            </div>

            {handRaises.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-[#eff4ff] text-[#434655] text-xs">
                No students currently waiting with hands raised.
              </div>
            ) : (
              <div className="space-y-2">
                {handRaises.map((hand) => (
                  <div
                    key={hand.id}
                    className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex items-start justify-between gap-3 hover:bg-[#eff4ff] transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-sm font-semibold text-[#0b1c30]">
                          {hand.name}
                        </span>
                        <span className="text-[11px] text-[#747686]">{hand.time}</span>
                      </div>
                      <p className="font-body-sm text-xs text-[#434655] mt-0.5">{hand.query}</p>
                    </div>
                    <button
                      onClick={() => handleInviteToSpeak(hand.name, hand.id)}
                      disabled={!isLive}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-all ${
                        isLive
                          ? 'bg-[#0037b0] text-white hover:bg-[#1d4ed8] active:scale-95'
                          : 'bg-[#e5eeff] text-[#747686] cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                      Invite to Speak
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#e5eeff] bg-[#eff4ff] flex items-center justify-between">
          <span className="font-label-sm text-xs text-[#434655]">
            Recorded automatically for students absent today.
          </span>
          {!isLive ? (
            <button
              onClick={handleStartSession}
              className="px-5 py-2.5 rounded-xl bg-[#1d4ed8] hover:bg-[#0037b0] text-white font-title-md text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">podcasts</span>
              Start Live Broadcast
            </button>
          ) : (
            <button
              onClick={handleEndSession}
              className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white font-title-md text-xs font-semibold hover:bg-red-700"
            >
              Leave & Close Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
