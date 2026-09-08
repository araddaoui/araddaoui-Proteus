import React, { useState } from 'react';
import { DecisionRecord, StakeholderImpact, UserRole } from '../types';
import { Users, Scale, ArrowUpRight, ArrowDownRight, Minus, Shield, Filter } from 'lucide-react';

interface StakeholderLedgerViewProps {
  decisions: DecisionRecord[];
  stakeholderImpacts: StakeholderImpact[];
  userRole: UserRole;
}

export const StakeholderLedgerView: React.FC<StakeholderLedgerViewProps> = ({
  decisions,
  stakeholderImpacts,
  userRole,
}) => {
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(decisions[0]?.id || '');

  const selectedDecision = decisions.find((d) => d.id === selectedDecisionId) || decisions[0];
  const allImpacts = stakeholderImpacts.filter((s) => s.decisionId === selectedDecision?.id);

  // Role-based filtering of stakeholder groups
  const filteredImpacts = allImpacts.filter((impact) => {
    if (userRole === 'student') {
      return impact.stakeholderGroup.includes('Student');
    }
    if (userRole === 'faculty') {
      return impact.stakeholderGroup.includes('Faculty') || impact.stakeholderGroup.includes('Student');
    }
    return true; // Leadership & Consultant see full distributional matrix
  });

  const getPowerShiftBadge = (shift: StakeholderImpact['powerShift']) => {
    switch (shift) {
      case 'gains':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> Gains Power
          </span>
        );
      case 'loses':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" /> Loses Power
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <Minus className="w-3.5 h-3.5 text-slate-500" /> Power Neutral
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <Users className="w-5 h-5 text-indigo-600" /> Stakeholder Ledger (Distributional Consequences)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compass Section XIX: "Better for whom?" Required evaluation of benefits, costs, and power shifts across vulnerable groups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-bold">Select Decision:</span>
          <select
            value={selectedDecisionId}
            onChange={(e) => setSelectedDecisionId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-bold"
          >
            {decisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role View Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs shadow-sm">
        <span className="text-slate-700 font-bold flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-700" /> Current View Filter: <span className="text-cyan-800 font-extrabold capitalize">{userRole} Scope</span>
        </span>
        <span className="text-slate-500 font-medium">
          {userRole === 'student' ? 'Showing cohort impact' : userRole === 'faculty' ? 'Showing faculty & student impact' : 'Full multi-stakeholder matrix'}
        </span>
      </div>

      {/* Stakeholder Impact Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredImpacts.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
              <h4 className="text-sm font-bold text-slate-900 font-serif">{item.stakeholderGroup}</h4>
              {getPowerShiftBadge(item.powerShift)}
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl space-y-0.5">
                <span className="font-bold text-emerald-900">Anticipated Benefits:</span>
                <p className="text-slate-800 text-[11px] leading-relaxed font-medium">{item.benefitDescription}</p>
              </div>

              <div className="bg-rose-50/80 border border-rose-200 p-3 rounded-xl space-y-0.5">
                <span className="font-bold text-rose-900">Borne Costs & Disadvantages:</span>
                <p className="text-slate-800 text-[11px] leading-relaxed font-medium">{item.costDescription}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
