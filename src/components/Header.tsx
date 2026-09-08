import React from 'react';
import { UserRole, Institution, OverlayPack } from '../types';
import { ShieldCheck, Compass, Users, Building2, AlertTriangle, Layers, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentTenantId: string;
  setCurrentTenantId: (id: string) => void;
  institutions: Institution[];
  activeOverlayPack: OverlayPack;
  kernelVersion: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  currentTenantId,
  setCurrentTenantId,
  institutions,
  activeOverlayPack,
  kernelVersion,
  activeTab,
  setActiveTab,
}) => {
  const currentInst = institutions.find((i) => i.id === currentTenantId) || institutions[0];

  const roleNavItems = [
    { id: 'overview', label: 'Compass Executive Hub', roles: ['leadership', 'faculty', 'student', 'consultant'] },
    { id: 'compass_master', label: 'Compass Master (30 Sections & Final Test)', roles: ['leadership', 'faculty', 'student', 'consultant'] },
    { id: 'profile', label: 'Institutional Profile', roles: ['leadership', 'faculty', 'student', 'consultant'] },
    { id: 'evidence', label: 'Evidence Ledger', roles: ['leadership', 'faculty', 'student', 'consultant'] },
    { id: 'scenarios', label: 'Scenario Engine & Decisions', roles: ['leadership', 'faculty', 'consultant'] },
    { id: 'stakeholders', label: 'Stakeholder Ledger', roles: ['leadership', 'faculty', 'student', 'consultant'] },
    { id: 'predictions', label: 'Prediction Tracker', roles: ['leadership', 'faculty', 'consultant'] },
    { id: 'redflags', label: 'Red-Flag Library', roles: ['leadership', 'faculty', 'student', 'consultant'] },
    { id: 'input', label: 'Grassroots Input & Shadow AI', roles: ['leadership', 'faculty', 'student', 'consultant'] },
    { id: 'jobs', label: 'Governance Jobs & Kernel', roles: ['leadership', 'consultant'] },
  ];

  const availableTabs = roleNavItems.filter((item) => item.roles.includes(currentRole));

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner & Governance Guardrails Notice */}
      <div className="bg-slate-950 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800 flex flex-wrap justify-between items-center text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Guardrails Active
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-slate-300">Human-in-the-loop floor ENFORCED on grading/enrollment</span>
          <span className="hidden md:inline text-slate-700">•</span>
          <span className="hidden md:inline text-amber-300 font-medium">Mandatory source_url verification</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded font-bold border border-slate-700">
            KERNEL v{kernelVersion}
          </span>
          <span className="bg-indigo-950 text-indigo-300 px-2.5 py-0.5 rounded font-bold border border-indigo-800">
            OVERLAY: {activeOverlayPack.name}
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-600/30">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-serif">Proteus</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                Strategic Compass
              </span>
            </div>
            <p className="text-xs text-slate-400">Higher Education Strategic Intelligence & Governance OS</p>
          </div>
        </div>

        {/* Multi-Tenant & Role Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Tenant Switcher */}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-medium">Tenant:</span>
            <select
              value={currentTenantId}
              onChange={(e) => setCurrentTenantId(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id} className="bg-slate-900 text-slate-200">
                  {inst.shortName} ({inst.governanceType})
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400 font-medium">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-indigo-300 font-bold focus:outline-none cursor-pointer capitalize"
            >
              <option value="leadership" className="bg-slate-900 text-slate-200">
                Leadership (Full Edit)
              </option>
              <option value="faculty" className="bg-slate-900 text-slate-200">
                Faculty (Scoped + Input)
              </option>
              <option value="student" className="bg-slate-900 text-slate-200">
                Student (Program + Pulse)
              </option>
              <option value="consultant" className="bg-slate-900 text-slate-200">
                Consultant (Multi-Tenant)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-950/60 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-1 py-1.5">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
