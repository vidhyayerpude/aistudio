import React, { useState, useEffect } from 'react';
import { TabType, Lecture, NoteDocument, StudentQuery, NotificationItem, UploadProgress } from './types';
import {
  INITIAL_LECTURES,
  INITIAL_NOTES,
  INITIAL_QUERIES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_UPLOAD_STATE,
} from './data/mockData';
import {
  getOfflineLectureIds,
  saveOfflineLectureIds,
  getOfflineNoteIds,
  saveOfflineNoteIds,
  useOnlineStatus,
} from './utils/offlineStorage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { LecturesScreen } from './components/screens/LecturesScreen';
import { NotesScreen } from './components/screens/NotesScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';

// Modals
import { LiveDoubtSessionModal } from './components/modals/LiveDoubtSessionModal';
import { GenerateQuizModal } from './components/modals/GenerateQuizModal';
import { StudentQueriesModal } from './components/modals/StudentQueriesModal';
import { UploadVideoModal } from './components/modals/UploadVideoModal';
import { UploadPdfModal } from './components/modals/UploadPdfModal';
import { LecturePlayerModal } from './components/modals/LecturePlayerModal';
import { PdfViewerModal } from './components/modals/PdfViewerModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { OfflineManagerModal } from './components/modals/OfflineManagerModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [activeTerm, setActiveTerm] = useState('Spring Term 2025');

  // Network & Offline Status
  const isNetworkOnline = useOnlineStatus();
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const isOffline = !isNetworkOnline || isOfflineSimulated;

  // Application Data States (reconciled with offline storage)
  const [lectures, setLectures] = useState<Lecture[]>(() => {
    const offlineIds = getOfflineLectureIds();
    return INITIAL_LECTURES.map((lec) => ({
      ...lec,
      isOfflineAvailable: offlineIds.includes(lec.id) || !!lec.isOfflineAvailable,
    }));
  });

  const [notes, setNotes] = useState<NoteDocument[]>(() => {
    const offlineIds = getOfflineNoteIds();
    return INITIAL_NOTES.map((note) => ({
      ...note,
      isOfflineAvailable: offlineIds.includes(note.id) || !!note.isOfflineAvailable,
    }));
  });

  const [queries, setQueries] = useState<StudentQuery[]>(INITIAL_QUERIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(DEFAULT_UPLOAD_STATE);

  // Modal Visibility States
  const [isLiveDoubtOpen, setIsLiveDoubtOpen] = useState(false);
  const [isGenerateQuizOpen, setIsGenerateQuizOpen] = useState(false);
  const [isQueriesOpen, setIsQueriesOpen] = useState(false);
  const [uploadVideoMode, setUploadVideoMode] = useState<'file' | 'link' | null>(null);
  const [isUploadPdfOpen, setIsUploadPdfOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedNote, setSelectedNote] = useState<NoteDocument | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Simulating live upload progress increment
  useEffect(() => {
    if (!uploadProgress || uploadProgress.status !== 'uploading') return;

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (!prev || prev.status !== 'uploading') return prev;
        if (prev.progress >= 99) {
          showToast(`Finished transcoding: ${prev.fileName}! Published to cohort.`);
          return {
            ...prev,
            progress: 100,
            uploadedMb: prev.totalMb,
            status: 'completed',
            eta: 'Complete',
            step: 'Ready for streaming',
          };
        }
        const nextProgress = Math.min(99, prev.progress + 1);
        const nextMb = Math.min(prev.totalMb, Math.round((nextProgress / 100) * prev.totalMb));
        const remSecs = Math.max(5, Math.round((100 - nextProgress) * 1.5));
        const etaText = remSecs > 60 ? `1m ${remSecs - 60}s remaining` : `${remSecs}s remaining`;

        return {
          ...prev,
          progress: nextProgress,
          uploadedMb: nextMb,
          eta: etaText,
        };
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [uploadProgress?.status]);

  // Offline Management Handlers
  const handleToggleLectureOffline = (id: string) => {
    setLectures((prev) => {
      const updated = prev.map((l) => {
        if (l.id === id) {
          const nextState = !l.isOfflineAvailable;
          return {
            ...l,
            isOfflineAvailable: nextState,
            offlineCachedAt: nextState ? 'Just now' : undefined,
            offlineSize: l.offlineSize || '185 MB',
          };
        }
        return l;
      });

      const offlineIds = updated.filter((l) => l.isOfflineAvailable).map((l) => l.id);
      saveOfflineLectureIds(offlineIds);

      // Keep selectedLecture in sync
      const current = updated.find((l) => l.id === id);
      if (current && selectedLecture?.id === id) {
        setSelectedLecture(current);
      }

      return updated;
    });
  };

  const handleToggleNoteOffline = (id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === id) {
          const nextState = !n.isOfflineAvailable;
          return {
            ...n,
            isOfflineAvailable: nextState,
            offlineCachedAt: nextState ? 'Just now' : undefined,
          };
        }
        return n;
      });

      const offlineIds = updated.filter((n) => n.isOfflineAvailable).map((n) => n.id);
      saveOfflineNoteIds(offlineIds);

      // Keep selectedNote in sync
      const current = updated.find((n) => n.id === id);
      if (current && selectedNote?.id === id) {
        setSelectedNote(current);
      }

      return updated;
    });
  };

  const handleClearAllOffline = () => {
    setLectures((prev) =>
      prev.map((l) => ({ ...l, isOfflineAvailable: false, offlineCachedAt: undefined }))
    );
    setNotes((prev) =>
      prev.map((n) => ({ ...n, isOfflineAvailable: false, offlineCachedAt: undefined }))
    );
    saveOfflineLectureIds([]);
    saveOfflineNoteIds([]);
    showToast('Offline cache cleared.');
  };

  const handleToggleSimulateOffline = () => {
    setIsOfflineSimulated((prev) => {
      const next = !prev;
      showToast(next ? 'Simulating offline classroom environment.' : 'Reconnected to Campus Wi-Fi.');
      return next;
    });
  };

  // Handlers for Lecture Actions
  const handlePublishDraft = (id: string) => {
    setLectures((prev) =>
      prev.map((lec) =>
        lec.id === id
          ? {
              ...lec,
              status: 'published',
              uploadedAgo: 'Just now',
              views: 12,
              questionsCount: 0,
            }
          : lec
      )
    );
    showToast('Draft lecture published to students successfully!');
  };

  const handleDeleteLecture = (id: string) => {
    setLectures((prev) => prev.filter((lec) => lec.id !== id));
    showToast('Lecture deleted.');
  };

  const handleUpdateLecture = (updated: Lecture) => {
    setLectures((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLecture(updated);
    showToast('Lecture metadata updated.');
  };

  // Upload Video trigger
  const handleStartUpload = (
    lectureInfo: Partial<Lecture>,
    fileDetails: { name: string; sizeMb: number }
  ) => {
    const newLec: Lecture = {
      id: `lec-${Date.now()}`,
      courseCode: lectureInfo.courseCode || 'Operating Systems (CS-401)',
      title: lectureInfo.title || 'New Lecture Stream',
      status: 'processing',
      duration: lectureInfo.duration || '40 mins',
      views: 0,
      questionsCount: 0,
      processingStep: 'Generating AI Transcripts',
      processingQuality: 'Encoding 1080p WebStream',
      uploadedAgo: 'Just now',
      description: lectureInfo.description || 'Uploaded course video.',
      chapters: lectureInfo.chapters || [
        { time: '00:00', title: 'Introduction' },
        { time: '15:00', title: 'Main Concepts' },
      ],
      transcript: lectureInfo.transcript || ['Transcribing audio stream...'],
      offlineSize: `${fileDetails.sizeMb || 180} MB`,
    };

    setLectures((prev) => [newLec, ...prev]);

    setUploadProgress({
      fileName: fileDetails.name,
      progress: 5,
      totalMb: fileDetails.sizeMb,
      uploadedMb: 20,
      eta: '2m 15s remaining',
      status: 'uploading',
      step: 'Encoding 1080p WebStream',
    });

    showToast(`Uploading ${fileDetails.name}...`);
  };

  const handleToggleUploadPause = () => {
    if (!uploadProgress) return;
    setUploadProgress((prev) => {
      if (!prev) return null;
      const nextStatus = prev.status === 'paused' ? 'uploading' : 'paused';
      return {
        ...prev,
        status: nextStatus,
      };
    });
  };

  const handleCancelUpload = () => {
    setUploadProgress(null);
    showToast('Upload cancelled.');
  };

  // Note actions
  const handleAddDocument = (doc: NoteDocument) => {
    setNotes((prev) => [doc, ...prev]);
    showToast(`Added ${doc.title} to revision repository.`);
  };

  const handleNoteDownload = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, downloads: n.downloads + 1 } : n))
    );
  };

  // Queries actions
  const handleResolveQuery = (id: string, replyText: string) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: 'resolved',
              instructorReply: replyText,
              resolvedAt: 'Just now',
            }
          : q
      )
    );
    showToast('Response sent to student and query resolved!');
  };

  // Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared.');
  };

  // Count aggregates
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const pendingQueriesCount = queries.filter((q) => q.status === 'pending').length;
  const totalOfflineItemsCount =
    lectures.filter((l) => l.isOfflineAvailable).length +
    notes.filter((n) => n.isOfflineAvailable).length;

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-body-md antialiased flex flex-col min-h-screen relative selection:bg-[#1d4ed8]/20 selection:text-[#0037b0]">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#213145] text-[#eaf1ff] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl z-50 flex items-center gap-2 border border-[#747686]/30 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Persistent App Header with Offline Indicator */}
      <Header
        currentTab={currentTab}
        unreadCount={unreadNotificationsCount}
        offlineCount={totalOfflineItemsCount}
        isOffline={isOffline}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#f8f9ff] pt-20 pb-24 px-margin-mobile">
        {currentTab === 'dashboard' && (
          <DashboardScreen
            lectures={lectures}
            notes={notes}
            pendingQueriesCount={pendingQueriesCount}
            activeTerm={activeTerm}
            uploadProgress={uploadProgress}
            isOfflineMode={isOffline}
            onOpenLiveDoubt={() => setIsLiveDoubtOpen(true)}
            onOpenGenerateQuiz={() => setIsGenerateQuizOpen(true)}
            onOpenQueries={() => setIsQueriesOpen(true)}
            onOpenUploadVideo={(mode) => setUploadVideoMode(mode)}
            onOpenUploadPdf={() => setIsUploadPdfOpen(true)}
            onOpenLecture={(lec) => setSelectedLecture(lec)}
            onOpenPdf={(doc) => setSelectedNote(doc)}
            onPublishDraft={handlePublishDraft}
            onDeleteLecture={handleDeleteLecture}
            onToggleUploadPause={handleToggleUploadPause}
            onCancelUpload={handleCancelUpload}
            onToggleLectureOffline={handleToggleLectureOffline}
            onToggleNoteOffline={handleToggleNoteOffline}
          />
        )}

        {currentTab === 'lectures' && (
          <LecturesScreen
            lectures={lectures}
            onOpenUpload={(mode) => setUploadVideoMode(mode)}
            onOpenLecture={(lec) => setSelectedLecture(lec)}
            onPublishDraft={handlePublishDraft}
            onDeleteLecture={handleDeleteLecture}
            onGenerateQuiz={() => setIsGenerateQuizOpen(true)}
            onToggleLectureOffline={handleToggleLectureOffline}
          />
        )}

        {currentTab === 'notes' && (
          <NotesScreen
            notes={notes}
            onOpenUploadPdf={() => setIsUploadPdfOpen(true)}
            onOpenPdf={(doc) => setSelectedNote(doc)}
            onDeleteNote={(id) => {
              setNotes((prev) => prev.filter((n) => n.id !== id));
              showToast('Document deleted.');
            }}
            onToggleNoteOffline={handleToggleNoteOffline}
          />
        )}

        {currentTab === 'analytics' && <AnalyticsScreen />}
      </main>

      {/* Persistent Bottom Tab Bar */}
      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

      {/* Global Interactive Modals */}
      <OfflineManagerModal
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
        lectures={lectures}
        notes={notes}
        isOfflineSimulated={isOfflineSimulated}
        onToggleSimulateOffline={handleToggleSimulateOffline}
        onToggleLectureOffline={handleToggleLectureOffline}
        onToggleNoteOffline={handleToggleNoteOffline}
        onClearAllOffline={handleClearAllOffline}
        onOpenLecture={(lec) => setSelectedLecture(lec)}
        onOpenNote={(note) => setSelectedNote(note)}
      />

      <LiveDoubtSessionModal
        isOpen={isLiveDoubtOpen}
        onClose={() => setIsLiveDoubtOpen(false)}
      />

      <GenerateQuizModal
        isOpen={isGenerateQuizOpen}
        onClose={() => setIsGenerateQuizOpen(false)}
        onQuizPublished={(title) => {
          showToast(`Published: ${title}`);
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              title: 'Quiz Published',
              message: `${title} is now active for all enrolled cohorts.`,
              timestamp: 'Just now',
              read: false,
              category: 'system',
            },
            ...prev,
          ]);
        }}
      />

      <StudentQueriesModal
        isOpen={isQueriesOpen}
        onClose={() => setIsQueriesOpen(false)}
        queries={queries}
        onResolveQuery={handleResolveQuery}
      />

      <UploadVideoModal
        isOpen={uploadVideoMode !== null}
        mode={uploadVideoMode || 'file'}
        onClose={() => setUploadVideoMode(null)}
        onStartUpload={handleStartUpload}
      />

      <UploadPdfModal
        isOpen={isUploadPdfOpen}
        onClose={() => setIsUploadPdfOpen(false)}
        onAddDocument={handleAddDocument}
      />

      <LecturePlayerModal
        isOpen={selectedLecture !== null}
        lecture={selectedLecture}
        onClose={() => setSelectedLecture(null)}
        onUpdateLecture={handleUpdateLecture}
        onToggleOffline={handleToggleLectureOffline}
        onGenerateQuiz={() => {
          setSelectedLecture(null);
          setIsGenerateQuizOpen(true);
        }}
      />

      <PdfViewerModal
        isOpen={selectedNote !== null}
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onDownload={handleNoteDownload}
        onToggleOffline={handleToggleNoteOffline}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearNotifications}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        activeTerm={activeTerm}
        onSwitchTerm={(term) => {
          setActiveTerm(term);
          showToast(`Switched active cohort view to ${term}`);
        }}
      />
    </div>
  );
}
