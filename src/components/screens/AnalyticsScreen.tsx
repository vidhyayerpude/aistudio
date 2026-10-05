import React, { useState } from 'react';

export const AnalyticsScreen: React.FC = () => {
  const [reportDownloaded, setReportDownloaded] = useState(false);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Module,Views,Completion Rate,Questions,Avg Watch Time\n' +
      'Process Synchronization,328,94.2%,14,38m\n' +
      'Deadlock Detection,280,89.5%,11,42m\n' +
      'Binary Search Trees,512,96.8%,19,35m\n' +
      'Graph Traversal,190,87.0%,6,31m\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Vidhya_Cohort_Analytics_Spring2025.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 3000);
  };

  return (
    <div className="flex flex-col w-full space-y-space-md max-w-2xl mx-auto">
      {/* Top Banner */}
      <section className="bg-[#eff4ff] rounded-xl p-space-md shadow-sm border border-[#dce9ff]/60 flex items-center justify-between">
        <div>
          <span className="font-label-sm text-xs font-semibold text-[#0037b0] block">
            Pedagogical Intelligence
          </span>
          <h2 className="font-headline-md text-xl font-bold text-[#0b1c30]">
            Cohort Analytics &amp; Telemetry
          </h2>
          <p className="font-body-sm text-xs text-[#434655]">
            Spring Term 2025 • Semester IV (1,420 Enrolled Students)
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-title-md text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">file_download</span>
          Export Report
        </button>
      </section>

      {reportDownloaded && (
        <div className="p-3 rounded-xl bg-[#85f8c4]/30 border border-[#006948]/20 text-[#004f35] font-title-md text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Cohort report exported as CSV successfully!
        </div>
      )}

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 bg-white rounded-xl border border-[#e5eeff] shadow-sm">
          <span className="text-xs text-[#565e74]">Pass Rate</span>
          <p className="font-headline-sm text-xl font-bold text-[#0037b0] mt-1">94.8%</p>
          <span className="text-[10px] text-[#004f35] font-semibold flex items-center gap-0.5 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            +2.4% vs last term
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#e5eeff] shadow-sm">
          <span className="text-xs text-[#565e74]">Avg. Completion</span>
          <p className="font-headline-sm text-xl font-bold text-[#0b1c30] mt-1">88.6%</p>
          <span className="text-[10px] text-[#004f35] font-semibold flex items-center gap-0.5 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            High retention
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#e5eeff] shadow-sm">
          <span className="text-xs text-[#565e74]">Doubts Resolved</span>
          <p className="font-headline-sm text-xl font-bold text-[#004f35] mt-1">98.2%</p>
          <span className="text-[10px] text-[#747686] mt-0.5 block">Avg. response 4.2h</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#e5eeff] shadow-sm">
          <span className="text-xs text-[#565e74]">Total Views</span>
          <p className="font-headline-sm text-xl font-bold text-[#0b1c30] mt-1">14.8k</p>
          <span className="text-[10px] text-[#0037b0] font-semibold flex items-center gap-0.5 mt-0.5">
            Across 34 lectures
          </span>
        </div>
      </section>

      {/* Video Lecture Retention & Attention Heatmap */}
      <section className="bg-white rounded-xl p-space-md shadow-sm border border-[#e5eeff] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
              Lecture Watch Retention &amp; Drop-off Analysis
            </h3>
            <p className="font-body-sm text-xs text-[#565e74]">
              Aggregate playback engagement across first 45 minutes of lecture video
            </p>
          </div>
          <span className="material-symbols-outlined text-[#0037b0] text-[20px]">analytics</span>
        </div>

        {/* Visual Simulated Bar Chart */}
        <div className="space-y-2 pt-2">
          {[
            { segment: '00:00 - 10:00 (Intro & Definitions)', retention: 98, color: 'bg-[#1d4ed8]' },
            { segment: '10:00 - 20:00 (Problem Formulation & Invariants)', retention: 92, color: 'bg-[#1d4ed8]' },
            { segment: '20:00 - 30:00 (Complex Proofs & Code Spinlocks)', retention: 79, color: 'bg-[#0037b0]' },
            { segment: '30:00 - 40:00 (Deadlock & Semaphore Solutions)', retention: 84, color: 'bg-[#1d4ed8]' },
            { segment: '40:00 - 50:00 (Summary & Exam Questions)', retention: 88, color: 'bg-[#004f35]' },
          ].map((bar, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-[#434655]">
                <span>{bar.segment}</span>
                <span className="font-mono text-[#0b1c30]">{bar.retention}% retention</span>
              </div>
              <div className="w-full h-2.5 bg-[#eff4ff] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                  style={{ width: `${bar.retention}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concepts Requiring Clarification / Student Doubt Topics */}
      <section className="bg-white rounded-xl p-space-md shadow-sm border border-[#e5eeff] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
            Top Challenging Concepts (Exam Alert)
          </h3>
          <span className="text-xs text-[#ba1a1a] font-semibold bg-[#ffdad6] px-2 py-0.5 rounded-full">
            Flagged for Revision
          </span>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe] flex items-center justify-between">
            <div>
              <h4 className="font-title-md text-xs font-semibold text-[#0b1c30]">
                Peterson&apos;s Solution &amp; Modern Out-of-Order Execution
              </h4>
              <p className="text-xs text-[#565e74]">
                Operating Systems (CS-401) • 14 student doubt tickets
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#ba1a1a] bg-white px-2 py-1 rounded border border-[#ffdad6]">
              64% error rate
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe] flex items-center justify-between">
            <div>
              <h4 className="font-title-md text-xs font-semibold text-[#0b1c30]">
                Red-Black Tree Insertion Case 2 (Uncle Black &amp; Outer)
              </h4>
              <p className="text-xs text-[#565e74]">
                Computer Science (CS-201) • 19 student doubt tickets
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#ba1a1a] bg-white px-2 py-1 rounded border border-[#ffdad6]">
              58% error rate
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe] flex items-center justify-between">
            <div>
              <h4 className="font-title-md text-xs font-semibold text-[#0b1c30]">
                Banker’s Algorithm Multi-Resource Allocation Safety Check
              </h4>
              <p className="text-xs text-[#565e74]">
                Operating Systems (CS-401) • 11 student doubt tickets
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#004f35] bg-white px-2 py-1 rounded border border-[#85f8c4]">
              41% error rate
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
