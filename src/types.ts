export type TabType = 'dashboard' | 'lectures' | 'notes' | 'analytics';

export interface Lecture {
  id: string;
  courseCode: string; // e.g. 'Operating Systems (CS-401)'
  title: string;
  status: 'published' | 'processing' | 'draft';
  duration: string; // e.g. '42 mins'
  views: number;
  questionsCount: number;
  helpfulPercentage?: number;
  unit?: string;
  processingStep?: string;
  processingQuality?: string;
  uploadedAgo: string;
  description: string;
  videoUrl?: string;
  chapters: Array<{ time: string; title: string }>;
  transcript: string[];
  isOfflineAvailable?: boolean;
  offlineCachedAt?: string;
  offlineSize?: string;
}

export interface NoteDocument {
  id: string;
  title: string;
  size: string;
  downloads: number;
  subject: string;
  unit: string;
  uploadedAgo: string;
  pagesCount: number;
  summary: string;
  previewPoints: string[];
  isOfflineAvailable?: boolean;
  offlineCachedAt?: string;
}

export interface StudentQuery {
  id: string;
  studentName: string;
  avatarSeed: string;
  rollNo: string;
  course: string;
  timestamp: string;
  lectureContext: string;
  question: string;
  codeSnippet?: string;
  status: 'pending' | 'resolved';
  instructorReply?: string;
  resolvedAt?: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  totalMb: number;
  uploadedMb: number;
  eta: string;
  status: 'uploading' | 'paused' | 'completed' | 'cancelled';
  step: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'query' | 'system' | 'upload' | 'doubt';
}
