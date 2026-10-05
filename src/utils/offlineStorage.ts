import { useState, useEffect } from 'react';

const STORAGE_KEY_LECTURES = 'vidhya_offline_lectures_v1';
const STORAGE_KEY_NOTES = 'vidhya_offline_notes_v1';

export function getOfflineLectureIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LECTURES);
    return raw ? JSON.parse(raw) : ['lec-1']; // lec-1 ("Process Synchronization") saved offline by default as a great demo
  } catch {
    return ['lec-1'];
  }
}

export function saveOfflineLectureIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save offline lecture ids:', err);
  }
}

export function getOfflineNoteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    return raw ? JSON.parse(raw) : ['note-1']; // note-1 ("OS_Unit_3_Revision_Notes.pdf") saved offline by default
  } catch {
    return ['note-1'];
  }
}

export function saveOfflineNoteIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save offline note ids:', err);
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
