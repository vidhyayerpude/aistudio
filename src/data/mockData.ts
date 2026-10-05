import { Lecture, NoteDocument, StudentQuery, NotificationItem, UploadProgress } from '../types';

export const INITIAL_LECTURES: Lecture[] = [
  {
    id: 'lec-1',
    courseCode: 'Operating Systems (CS-401)',
    title: 'Process Synchronization & Semaphores',
    status: 'published',
    duration: '42 mins',
    views: 328,
    questionsCount: 14,
    helpfulPercentage: 96,
    unit: 'Unit 3: Concurrency Control',
    uploadedAgo: 'Uploaded 2 days ago',
    isOfflineAvailable: true,
    offlineCachedAt: 'Oct 4, 2026',
    offlineSize: '185 MB',
    description: 'Detailed analysis of critical section problems, race conditions, atomic operations, hardware spinlocks (TestAndSet, Swap), counting semaphores, and classical synchronization problems like Producer-Consumer and Dining Philosophers.',
    chapters: [
      { time: '00:00', title: 'Introduction to Critical Section' },
      { time: '08:15', title: 'Race Conditions in Multi-Threaded Execution' },
      { time: '17:30', title: 'Hardware Spinlocks & Mutex Primitive' },
      { time: '29:45', title: 'Counting Semaphores (Wait & Signal)' },
      { time: '37:10', title: 'Producer-Consumer Buffer Solution' },
    ],
    transcript: [
      'Welcome back everyone. Today we are diving into one of the most critical topics in operating system kernel architecture: process synchronization.',
      'When two or more concurrent threads access shared mutable data without coordination, interleaving of machine instructions leads to race conditions.',
      'A semaphore S is an integer variable that, apart from initialization, is accessed only through two standard atomic operations: wait() and signal().',
      'Notice that within the critical section, mutual exclusion must strictly be preserved without causing starvation or deadlocks.'
    ]
  },
  {
    id: 'lec-2',
    courseCode: 'Operating Systems (CS-401)',
    title: 'Deadlock Detection & Prevention',
    status: 'processing',
    duration: '55 mins',
    views: 0,
    questionsCount: 0,
    offlineSize: '210 MB',
    processingStep: 'Generating AI Transcripts',
    processingQuality: 'Encoding 720p/1080p',
    uploadedAgo: 'Uploaded 3 hours ago',
    description: 'Covers Coffman conditions for system deadlock, Resource Allocation Graphs (RAG) with cycle detection algorithms, Banker’s Algorithm for safe state evaluation, and recovery mechanisms.',
    chapters: [
      { time: '00:00', title: 'The 4 Coffman Conditions' },
      { time: '14:20', title: 'Resource Allocation Graph (RAG) Traversal' },
      { time: '28:10', title: 'Banker’s Safety & Request Algorithms' },
      { time: '44:00', title: 'Deadlock Recovery & Preemption' }
    ],
    transcript: [
      'Today we examine the four Coffman conditions necessary for a deadlock to manifest: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
      'Banker’s Algorithm simulates resource allocation to verify whether granting a request will leave the system in a globally safe execution state.'
    ]
  },
  {
    id: 'lec-3',
    courseCode: 'Computer Science (CS-201)',
    title: 'Binary Search Trees & Red-Black Trees',
    status: 'published',
    duration: '38 mins',
    views: 512,
    questionsCount: 19,
    helpfulPercentage: 98,
    unit: 'Unit 4: Balanced Hierarchies',
    uploadedAgo: 'Uploaded 5 days ago',
    offlineSize: '155 MB',
    description: 'Comprehensive study of balanced search trees, Worst-case O(N) degradation in unconstrained BSTs, self-balancing mechanics, left/right tree rotations, and Red-Black tree color invariant maintenance.',
    chapters: [
      { time: '00:00', title: 'Recap of BST Invariants' },
      { time: '09:20', title: 'Skewed Trees and Worst-Case Lookups' },
      { time: '18:40', title: 'Left & Right Pointer Rotations' },
      { time: '26:50', title: 'Red-Black Tree Properties & Recoloring' }
    ],
    transcript: [
      'In a balanced binary search tree, search, insertion, and deletion operate in guaranteed O(log N) worst-case time.',
      'Red-Black trees maintain 5 fundamental structural invariants. Crucially, no two consecutive red nodes may exist on any root-to-leaf path.',
      'When an insertion causes a violation, we resolve it via recoloring if the uncle is red, or through rotation if the uncle is black.'
    ]
  },
  {
    id: 'lec-4',
    courseCode: 'Computer Science (CS-201)',
    title: 'Graph Traversal: BFS vs DFS',
    status: 'draft',
    duration: '46 mins',
    views: 0,
    questionsCount: 0,
    uploadedAgo: 'Saved 1 hour ago',
    unit: 'Unit 5: Graph Theory & Algorithms',
    offlineSize: '190 MB',
    description: 'Queue-based Breadth-First Search (BFS) for shortest unweighted paths versus recursive / stack-based Depth-First Search (DFS) for topological sorting and cycle detection.',
    chapters: [
      { time: '00:00', title: 'Graph Representations (Matrix vs List)' },
      { time: '11:15', title: 'BFS Algorithm with FIFO Queue' },
      { time: '24:00', title: 'DFS Traversal with Call Stack' },
      { time: '36:30', title: 'Cycle Detection in Directed Graphs' }
    ],
    transcript: [
      'Graph traversal forms the backbone of routing, social networks, and dependency resolution algorithms.',
      'We demonstrate step-by-step why BFS discovers the shortest path in unweighted graphs by expanding outward in concentric frontiers.'
    ]
  }
];

export const INITIAL_NOTES: NoteDocument[] = [
  {
    id: 'note-1',
    title: 'OS_Unit_3_Revision_Notes.pdf',
    size: '2.4 MB',
    downloads: 412,
    subject: 'Operating Systems (CS-401)',
    unit: 'Unit 3: Concurrency & Semaphores',
    uploadedAgo: 'Oct 2, 2026',
    pagesCount: 16,
    isOfflineAvailable: true,
    offlineCachedAt: 'Oct 4, 2026',
    summary: 'Concise summary of process synchronization primitives, Peterson’s algorithm proof, Bakery algorithm, semaphore implementation nuances, and mutex lock comparison sheet.',
    previewPoints: [
      'Mutual exclusion, progress, and bounded waiting criteria',
      'TestAndSet vs CompareAndSwap hardware primitives',
      'Counting vs Binary Semaphores with POSIX C code samples',
      'Solutions to Readers-Writers and Bounded-Buffer synchronization problems'
    ]
  },
  {
    id: 'note-2',
    title: 'CS_Algorithm_CheatSheet_Final.pdf',
    size: '1.1 MB',
    downloads: 620,
    subject: 'Computer Science (CS-201)',
    unit: 'Units 1-4: Asymptotic Bounds & Data Structures',
    uploadedAgo: 'Sep 28, 2026',
    pagesCount: 8,
    summary: 'One-page reference sheet with Big-O time and space complexity table for all fundamental sorting algorithms, heap operations, hash table collision strategies, and graph traversals.',
    previewPoints: [
      'Master Theorem cheat formula for divide-and-conquer recurrences',
      'Time complexity comparison: QuickSort vs MergeSort vs TimSort',
      'Red-Black Tree rotation formulas and recoloring rules',
      'Dijkstra vs Bellman-Ford vs Floyd-Warshall comparison'
    ]
  },
  {
    id: 'note-3',
    title: 'Virtual_Memory_Paging_Formulas.pdf',
    size: '1.8 MB',
    downloads: 285,
    subject: 'Operating Systems (CS-401)',
    unit: 'Unit 4: Memory Management',
    uploadedAgo: 'Yesterday',
    pagesCount: 12,
    summary: 'Hand-drawn diagrams and step-by-step calculations for Multi-level page tables, TLB hit ratio effective access times, and Page Replacement algorithms (FIFO, LRU, Optimal).',
    previewPoints: [
      'Logical to Physical Address Translation equations',
      'Two-level and Inverted Page Table memory overhead analysis',
      'TLB miss penalty calculations and Effective Memory Access Time (EMAT)',
      'Belady’s anomaly demonstration in FIFO page replacement'
    ]
  }
];

export const INITIAL_QUERIES: StudentQuery[] = [
  {
    id: 'query-1',
    studentName: 'Aarav Sharma',
    avatarSeed: 'Aarav',
    rollNo: '23CS0104',
    course: 'Operating Systems (CS-401)',
    timestamp: '25 mins ago',
    lectureContext: 'Lecture 07: Process Synchronization & Semaphores',
    question: 'Professor, in Peterson’s algorithm, what prevents both processes from staying in the while-loop indefinitely if both set their flag to true simultaneously?',
    codeSnippet: `// Peterson's Algorithm check
flag[i] = true;
turn = j;
while (flag[j] && turn == j); // Can both spin here?`,
    status: 'pending'
  },
  {
    id: 'query-2',
    studentName: 'Sneha Patel',
    avatarSeed: 'Sneha',
    rollNo: '23CS0082',
    course: 'Operating Systems (CS-401)',
    timestamp: '1 hour ago',
    lectureContext: 'Lecture 08: Deadlock Detection & Prevention',
    question: 'When using Banker’s algorithm, how do we distinguish between an unsafe state and an actual deadlock? Does entering an unsafe state guarantee that deadlock will occur?',
    status: 'pending'
  },
  {
    id: 'query-3',
    studentName: 'Vikramaditya Roy',
    avatarSeed: 'Vikram',
    rollNo: '23CS0156',
    course: 'Computer Science (CS-201)',
    timestamp: '3 hours ago',
    lectureContext: 'Lecture 12: Binary Search Trees & Red-Black Trees',
    question: 'In Red-Black tree insertion Case 2 (uncle is black and node is outer child), does performing a single rotation automatically preserve the black-height of all subtrees?',
    status: 'pending'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '3 New Student Queries',
    message: 'Students submitted questions on Peterson’s Solution and Red-Black Trees.',
    timestamp: '15m ago',
    read: false,
    category: 'query'
  },
  {
    id: 'notif-2',
    title: 'Lecture 08 Transcoding',
    message: 'CS302_Lecture_08 encoding at 68% (1080p WebStream stream ready soon).',
    timestamp: '40m ago',
    read: false,
    category: 'upload'
  },
  {
    id: 'notif-3',
    title: 'Spring 2025 Mid-Term Roster Synced',
    message: '1,420 enrolled students successfully mapped to Semester IV cohort.',
    timestamp: '2h ago',
    read: true,
    category: 'system'
  }
];

export const DEFAULT_UPLOAD_STATE: UploadProgress = {
  fileName: 'CS302_Lecture_08_Paging_VirtualMemory.mp4',
  progress: 68,
  totalMb: 400,
  uploadedMb: 272,
  eta: '1m 20s remaining',
  status: 'uploading',
  step: 'Encoding 1080p WebStream'
};
