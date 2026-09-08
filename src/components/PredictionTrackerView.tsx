import React, { useState } from 'react';
import { PredictionRecord, UserRole } from '../types';
import { Activity, Clock, CheckCircle, AlertTriangle, Plus, RotateCcw, Check, X } from 'lucide-react';

interface PredictionTrackerViewProps {
  predictions: PredictionRecord[];
  userRole: UserRole;
  onAddPrediction: (pred: Omit<PredictionRecord, 'id' | 'dateMade'>) => void;
  onResolvePrediction: (
    id: string,
    resolutionStatus: PredictionRecord['resolutionStatus'],
    actualOutcome: string,
    lessonsLearned: string
  ) => void;
}

export const PredictionTrackerView: React.FC<PredictionTrackerViewProps> = ({
  predictions,
  userRole,
  onAddPrediction,
  onResolvePrediction,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState<PredictionRecord | null>(null);

  // Add Form
  const [predText, setPredText] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [scopeLevel, setScopeLevel] = useState<PredictionRecord['scopeLevel']>('institution');

  // Resolve Form
  const [resolutionStatus, setResolutionStatus] = useState<PredictionRecord['resolutionStatus']>('correct');
  const [actualOutcome, setActualOutcome] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const canEdit = userRole === 'leadership' || userRole === 'faculty' || userRole === 'consultant';

  const handleCreatePrediction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!predText.trim()) return;

    onAddPrediction({
      tenantId: 'inst-1',
      predictionText: predText,
      madeByUserId: 'user-curr',
      madeByUserName: 'Current User',
      madeByRole: userRole,
      targetDate,
      resolutionStatus: 'pending',
      scopeLevel,
    });

    setShowAddModal(false);
    setPredText('');
  };

  const handleSaveResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResolveModal || !actualOutcome.trim()) return;

    onResolvePrediction(showResolveModal.id, resolutionStatus, actualOutcome, lessonsLearned);
    setShowResolveModal(null);
  };

  const getStatusBadge = (status: PredictionRecord['resolutionStatus'], targetDate: string) => {
    const isPastDue = new Date(targetDate) <= new Date() && status === 'pending';

    if (isPastDue) {
      return (
        <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-rose-600" /> Past Due for Reconciliation
        </span>
      );
    }

    switch (status) {
      case 'correct':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Validated (Correct)</span>;
      case 'incorrect':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Falsified (Incorrect)</span>;
      case 'partially_correct':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Partially Correct</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Pending Outcome</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <Activity className="w-5 h-5 text-indigo-600" /> Prediction Tracker & Institutional Memory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Section X: Log strategic predictions with dates, then reconcile against actual outcomes to build institutional memory.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Log Strategic Prediction
          </button>
        )}
      </div>

      {/* Predictions Table / Cards */}
      <div className="space-y-4">
        {predictions.map((pred) => (
          <div key={pred.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                {getStatusBadge(pred.resolutionStatus, pred.targetDate)}
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono capitalize font-bold">
                  Scope: {pred.scopeLevel}
                </span>
              </div>

              <div className="text-xs text-slate-500 font-mono font-semibold">
                Made: {pred.dateMade} • Target: <span className="text-cyan-800 font-bold">{pred.targetDate}</span>
              </div>
            </div>

            <p className="text-sm text-slate-900 leading-relaxed font-sans font-medium">{pred.predictionText}</p>

            <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 flex flex-wrap justify-between items-center gap-2">
              <span>
                By: <strong className="text-slate-800 font-bold">{pred.madeByUserName}</strong> ({pred.madeByRole})
              </span>

              {pred.resolutionStatus === 'pending' && canEdit && (
                <button
                  onClick={() => {
                    setShowResolveModal(pred);
                    setActualOutcome(pred.actualOutcome || '');
                    setLessonsLearned(pred.lessonsLearned || '');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded font-bold transition-colors shadow-sm"
                >
                  Resolve & Record Outcome →
                </button>
              )}
            </div>

            {/* Actual Outcome & Lessons Learned block */}
            {pred.actualOutcome && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 mt-2">
                <div>
                  <span className="font-bold text-cyan-900">Actual Outcome:</span>
                  <p className="text-slate-800 mt-0.5 font-medium">{pred.actualOutcome}</p>
                </div>
                {pred.lessonsLearned && (
                  <div>
                    <span className="font-bold text-amber-900">Lessons Learned (Institutional Memory):</span>
                    <p className="text-slate-800 mt-0.5 font-medium">{pred.lessonsLearned}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log Prediction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Log Strategic Prediction</h3>
            <form onSubmit={handleCreatePrediction} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Prediction Text</label>
                <textarea
                  rows={3}
                  value={predText}
                  onChange={(e) => setPredText(e.target.value)}
                  placeholder="State a testable strategic prediction..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none font-sans font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Scope Level</label>
                  <select
                    value={scopeLevel}
                    onChange={(e) => setScopeLevel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white capitalize font-medium"
                  >
                    <option value="institution">Institution-wide</option>
                    <option value="program">Program / Department</option>
                    <option value="course">Course-level</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold shadow-sm">
                  Save Prediction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Outcome Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Reconcile Prediction & Outcome</h3>
            <form onSubmit={handleSaveResolution} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Resolution Status</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                >
                  <option value="correct">Validated (Correct)</option>
                  <option value="partially_correct">Partially Correct</option>
                  <option value="incorrect">Falsified (Incorrect)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Actual Outcome Description</label>
                <textarea
                  rows={2}
                  value={actualOutcome}
                  onChange={(e) => setActualOutcome(e.target.value)}
                  placeholder="Describe what actually happened..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-sans font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Lessons Learned (Institutional Memory)</label>
                <textarea
                  rows={2}
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  placeholder="What assumptions failed? What signals were missed?"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-sans font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowResolveModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold shadow-sm">
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
