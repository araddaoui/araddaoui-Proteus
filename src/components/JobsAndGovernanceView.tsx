import React, { useState } from 'react';
import { JobExecutionStatus, UserRole } from '../types';
import { Play, Activity, Clock, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

interface JobsAndGovernanceViewProps {
  jobs: JobExecutionStatus[];
  userRole: UserRole;
  onRunJob: (jobId: JobExecutionStatus['jobId']) => Promise<void>;
}

export const JobsAndGovernanceView: React.FC<JobsAndGovernanceViewProps> = ({
  jobs,
  userRole,
  onRunJob,
}) => {
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const handleTrigger = async (jobId: JobExecutionStatus['jobId']) => {
    setRunningJobId(jobId);
    try {
      await onRunJob(jobId);
    } catch (err) {
      console.error(err);
    } finally {
      setRunningJobId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <Activity className="w-5 h-5 text-indigo-600" /> Scheduled Governance Jobs & Staging Control
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Section IX: Three scheduled background jobs separated strictly by autonomy level to prevent automated hallucination.
          </p>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const isRunning = runningJobId === job.jobId;
          const isSemi = job.autonomyLevel === 'semi_automated';

          return (
            <div key={job.jobId} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                      isSemi
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isSemi ? 'Semi-Automated (Human Staging Queue)' : 'Fully Automated (Date Audit)'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">Items: {job.itemsProcessed}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-serif">{job.jobName}</h3>

                <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-900">Last Execution Summary:</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">{job.lastResultSummary}</p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 space-y-0.5 font-semibold">
                  <div>Last Run: {new Date(job.lastRunAt).toLocaleString()}</div>
                  <div>Next Scheduled: {new Date(job.nextRunDueAt).toLocaleDateString()}</div>
                </div>
              </div>

              <button
                onClick={() => handleTrigger(job.jobId)}
                disabled={isRunning}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Executing Background Task...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Execute Job Now
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
