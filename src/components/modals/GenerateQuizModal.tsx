import React, { useState } from 'react';

interface GenerateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizPublished?: (quizTitle: string) => void;
}

interface GeneratedQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const GenerateQuizModal: React.FC<GenerateQuizModalProps> = ({
  isOpen,
  onClose,
  onQuizPublished,
}) => {
  const [subject, setSubject] = useState('Operating Systems (CS-401)');
  const [topic, setTopic] = useState('Process Synchronization & Semaphores');
  const [questionCount, setQuestionCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'Foundational' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([
    {
      id: 1,
      question: 'Which of the following conditions must be satisfied by any valid solution to the Critical Section problem?',
      options: [
        'Mutual Exclusion, Progress, and Bounded Waiting',
        'Preemption, Deadlock, and Starvation',
        'Hold and Wait, No Preemption, and Aging',
        'Round-Robin Schedulability and Concurrency'
      ],
      correctIndex: 0,
      explanation: 'According to Silberschatz & Galvin OS principles, every critical section solution must ensure Mutual Exclusion, Progress, and Bounded Waiting.'
    },
    {
      id: 2,
      question: 'What is the fundamental difference between a binary semaphore and a counting semaphore?',
      options: [
        'Binary semaphore values are restricted to 0 and 1, whereas counting semaphores take unrestricted non-negative values.',
        'Binary semaphores allow simultaneous access to multiple processes.',
        'Counting semaphores cannot be used to coordinate synchronization barriers.',
        'Binary semaphores do not require atomic wait() and signal() primitives.'
      ],
      correctIndex: 0,
      explanation: 'Binary semaphores behave similarly to mutex locks (0 or 1), while counting semaphores manage resource pools with arbitrary positive capacity.'
    },
    {
      id: 3,
      question: 'In Peterson’s Solution for 2 processes (i and j), what ensures that mutual exclusion cannot be violated?',
      options: [
        'The shared variable turn can hold only one value (i or j) at any given instant.',
        'Both processes disable hardware interrupts on entering the entry section.',
        'The OS scheduler forces cooperative yielding before the critical section.',
        'The memory bus is locked exclusively for the entire duration of the loop.'
      ],
      correctIndex: 0,
      explanation: 'Since turn can take only one value at an instant, even if both processes set their respective flag to true simultaneously, only one will find turn equal to the other and proceed.'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (topic.includes('Deadlock')) {
        setQuestions([
          {
            id: 1,
            question: 'Which of the following is NOT one of Coffman’s four necessary conditions for deadlock?',
            options: ['Preemptive scheduling', 'Mutual exclusion', 'Hold and wait', 'Circular wait'],
            correctIndex: 0,
            explanation: 'Coffman requires No Preemption. Preemptive scheduling actually avoids or breaks deadlocks.'
          },
          {
            id: 2,
            question: 'If a Resource Allocation Graph (RAG) contains a cycle and all resource types have only one single instance, what can be concluded?',
            options: [
              'A deadlock has definitely occurred in the system.',
              'The system is guaranteed to be in a safe state.',
              'A deadlock may or may not exist depending on future claims.',
              'The graph must be converted to an adjacency matrix first.'
            ],
            correctIndex: 0,
            explanation: 'For single-instance resource systems, a cycle in the RAG is both a necessary and sufficient condition for deadlock.'
          },
          {
            id: 3,
            question: 'What is the primary worst-case computational complexity of Banker’s Algorithm for m resource types and n processes?',
            options: ['O(m * n²)', 'O(n * log m)', 'O(2ⁿ)', 'O(m + n)'],
            correctIndex: 0,
            explanation: 'Finding a safe execution sequence requires checking up to n processes across n iterations for m resources, leading to O(m * n²).'
          }
        ]);
      } else if (subject.includes('CS-201')) {
        setQuestions([
          {
            id: 1,
            question: 'In a Red-Black Tree, what is the maximum possible height of a tree containing N internal nodes?',
            options: ['2 * log₂(N + 1)', 'log₂(N) / 2', 'N - 1', 'log₃(N)'],
            correctIndex: 0,
            explanation: 'By the black-height property, the longest path is at most twice the length of the shortest path, guaranteeing height ≤ 2 log₂(N + 1).'
          },
          {
            id: 2,
            question: 'During BST insertion, when a violation occurs where the inserted node’s uncle is RED, how is it repaired?',
            options: [
              'Recolor parent and uncle to BLACK, grandparent to RED, and propagate upward.',
              'Perform a single left-right double rotation immediately.',
              'Delete the node and re-insert into the root position.',
              'Convert the tree into an AVL tree.'
            ],
            correctIndex: 0,
            explanation: 'When the uncle is red, only recoloring is needed without rotation; the grandparent becomes the new node to examine.'
          }
        ]);
      }
      setIsGenerating(false);
      setToastMessage('New questions generated successfully from lecture syllabus!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 900);
  };

  const handlePublish = () => {
    const title = `${subject}: Quick Quiz - ${topic}`;
    if (onQuizPublished) {
      onQuizPublished(title);
    }
    setToastMessage('Quiz successfully published to 1,420 students in cohort!');
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#d3e4fe] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dae2fd] text-[#0037b0] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">quiz</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-[#0b1c30]">
                Curriculum Quiz Generator
              </h3>
              <p className="font-body-sm text-body-sm text-[#434655]">
                Generate automated assessment quizzes from lecture transcripts & notes
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

        {/* Form Controls */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-[#0b1c30]">
          {toastMessage && (
            <div className="p-3 rounded-xl bg-[#85f8c4]/30 border border-[#006948]/20 text-[#004f35] font-title-md text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {toastMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Course Subject
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (e.target.value.includes('CS-201')) {
                    setTopic('Binary Search Trees & Red-Black Trees');
                  } else {
                    setTopic('Process Synchronization & Semaphores');
                  }
                }}
                className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0037b0]"
              >
                <option value="Operating Systems (CS-401)">Operating Systems (CS-401)</option>
                <option value="Computer Science (CS-201)">Computer Science (CS-201)</option>
                <option value="Computer Architecture (CS-302)">Computer Architecture (CS-302)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Curriculum Topic / Lecture
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#c4c5d7] bg-[#f8f9ff] text-xs font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0037b0]"
              >
                {subject.includes('CS-401') ? (
                  <>
                    <option value="Process Synchronization & Semaphores">Process Synchronization & Semaphores</option>
                    <option value="Deadlock Detection & Banker's Algorithm">Deadlock Detection & Banker&apos;s Algorithm</option>
                    <option value="Virtual Memory & Paging Schemes">Virtual Memory & Paging Schemes</option>
                  </>
                ) : (
                  <>
                    <option value="Binary Search Trees & Red-Black Trees">Binary Search Trees & Red-Black Trees</option>
                    <option value="Graph Traversal: BFS vs DFS">Graph Traversal: BFS vs DFS</option>
                    <option value="Asymptotic Bounds & Recurrences">Asymptotic Bounds & Recurrences</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Questions Count
              </label>
              <div className="flex gap-2">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      questionCount === num
                        ? 'bg-[#0037b0] text-white border-[#0037b0]'
                        : 'bg-[#f8f9ff] text-[#434655] border-[#c4c5d7] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-xs text-[#434655] mb-1 font-semibold">
                Target Rigor
              </label>
              <div className="flex gap-1.5">
                {(['Foundational', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      difficulty === lvl
                        ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                        : 'bg-[#f8f9ff] text-[#434655] border-[#c4c5d7] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="py-2 px-4 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0037b0] font-title-md text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span className={`material-symbols-outlined text-[18px] ${isGenerating ? 'animate-spin' : ''}`}>
                auto_mode
              </span>
              {isGenerating ? 'Generating Questions...' : 'Regenerate Questions with AI'}
            </button>
          </div>

          {/* Questions Preview */}
          <div className="space-y-3 pt-2">
            <h4 className="font-title-md text-sm text-[#0b1c30] flex items-center justify-between">
              <span>Generated Questions Preview</span>
              <span className="font-label-sm text-xs text-[#747686]">{questions.length} Questions</span>
            </h4>

            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-2 hover:border-[#b7c4ff] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-title-md text-xs font-semibold text-[#0037b0]">
                    Q{idx + 1}.
                  </span>
                  <p className="font-body-md text-xs font-medium text-[#0b1c30] flex-1 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                <div className="space-y-1.5 pl-5">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                        optIdx === q.correctIndex
                          ? 'bg-[#85f8c4]/20 border-[#006948]/30 text-[#004f35] font-semibold'
                          : 'bg-white border-[#e5eeff] text-[#434655]'
                      }`}
                    >
                      <span>
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </span>
                      {optIdx === q.correctIndex && (
                        <span className="material-symbols-outlined text-[16px] text-[#006948]">
                          check_circle
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pl-5 pt-1">
                  <p className="font-label-sm text-[11px] text-[#565e74] bg-[#eff4ff] p-2 rounded-md">
                    <span className="font-semibold text-[#0037b0]">Explanation: </span>
                    {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5eeff] bg-[#eff4ff] flex items-center justify-between">
          <span className="font-label-sm text-xs text-[#434655]">
            Quiz will be posted to Semester IV dashboard.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#565e74] hover:bg-[#e5eeff]"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="py-2.5 px-5 rounded-xl bg-[#1d4ed8] hover:bg-[#0037b0] text-white font-title-md text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              Publish Quiz to Cohort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
