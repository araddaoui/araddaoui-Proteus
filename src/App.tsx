import React, { useState, useEffect } from 'react';
import { UserRole, Institution, OverlayPack, EvidenceClaim, EvidenceStagingItem, DecisionRecord, ScenarioEntry, StakeholderImpact, PredictionRecord, RedFlagCase, PulseSurveyResponse, ShadowAiReport, JobExecutionStatus } from './types';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { InstitutionalProfileView } from './components/InstitutionalProfileView';
import { EvidenceLedgerView } from './components/EvidenceLedgerView';
import { ScenarioEngineView } from './components/ScenarioEngineView';
import { StakeholderLedgerView } from './components/StakeholderLedgerView';
import { PredictionTrackerView } from './components/PredictionTrackerView';
import { RedFlagLibraryView } from './components/RedFlagLibraryView';
import { GrassrootsInputView } from './components/GrassrootsInputView';
import { KernelVersionManager } from './components/KernelVersionManager';
import { JobsAndGovernanceView } from './components/JobsAndGovernanceView';
import { CompassMasterView } from './components/CompassMasterView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('leadership');
  const [currentTenantId, setCurrentTenantId] = useState<string>('inst-1');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Application Data States
  const [profile, setProfile] = useState<Institution | null>(null);
  const [activeOverlayPack, setActiveOverlayPack] = useState<OverlayPack | null>(null);
  const [allInstitutions, setAllInstitutions] = useState<Institution[]>([]);
  const [allOverlayPacks, setAllOverlayPacks] = useState<OverlayPack[]>([]);

  const [claims, setClaims] = useState<EvidenceClaim[]>([]);
  const [staging, setStaging] = useState<EvidenceStagingItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioEntry[]>([]);
  const [stakeholderImpacts, setStakeholderImpacts] = useState<StakeholderImpact[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlagCase[]>([]);
  const [pulseSurveys, setPulseSurveys] = useState<PulseSurveyResponse[]>([]);
  const [shadowReports, setShadowReports] = useState<ShadowAiReport[]>([]);
  const [jobs, setJobs] = useState<JobExecutionStatus[]>([]);

  const [kernelVersion, setKernelVersion] = useState('1.0.0');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial state for selected tenant
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [
        profileRes,
        overlayRes,
        evidenceRes,
        decisionsRes,
        predRes,
        redRes,
        inputRes,
        jobsRes,
        kernelRes,
      ] = await Promise.all([
        fetch(`/api/profile/${currentTenantId}`).then((r) => r.json()),
        fetch('/api/overlay-packs').then((r) => r.json()),
        fetch(`/api/evidence/${currentTenantId}`).then((r) => r.json()),
        fetch(`/api/decisions/${currentTenantId}`).then((r) => r.json()),
        fetch(`/api/predictions/${currentTenantId}`).then((r) => r.json()),
        fetch('/api/red-flags').then((r) => r.json()),
        fetch(`/api/input-instruments/${currentTenantId}`).then((r) => r.json()),
        fetch('/api/jobs').then((r) => r.json()),
        fetch('/api/kernel').then((r) => r.json()),
      ]);

      setProfile(profileRes.profile);
      setActiveOverlayPack(profileRes.activeOverlayPack);
      setAllInstitutions(profileRes.allInstitutions || []);
      setAllOverlayPacks(overlayRes || []);

      setClaims(evidenceRes.claims || []);
      setStaging(evidenceRes.staging || []);
      setDecisions(decisionsRes || []);
      setPredictions(predRes || []);
      setRedFlags(redRes || []);
      setPulseSurveys(inputRes.pulseSurveys || []);
      setShadowReports(inputRes.shadowAiReports || []);
      setJobs(jobsRes || []);
      if (kernelRes?.kernel?.version) setKernelVersion(kernelRes.kernel.version);

      // Load scenarios and stakeholders for first decision if exists
      if (decisionsRes && decisionsRes.length > 0) {
        const firstDecId = decisionsRes[0].id;
        const [scenRes, stkRes] = await Promise.all([
          fetch(`/api/scenarios/${firstDecId}`).then((r) => r.json()),
          fetch(`/api/stakeholders/${firstDecId}`).then((r) => r.json()),
        ]);
        setScenarios(scenRes || []);
        setStakeholderImpacts(stkRes || []);
      }
    } catch (err) {
      console.error('Failed to load initial data from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  // Handler functions
  const handleUpdateProfile = async (updated: Institution) => {
    const res = await fetch(`/api/profile/${currentTenantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).then((r) => r.json());

    setProfile(res);
  };

  const handleAddClaim = async (claim: Omit<EvidenceClaim, 'id' | 'dateAdded'>) => {
    const newClaim = await fetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claim),
    }).then((r) => r.json());

    setClaims((prev) => [newClaim, ...prev]);
  };

  const handleApproveStaging = async (stagingId: string) => {
    const res = await fetch(`/api/evidence/staging/${stagingId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer: `${currentRole} User` }),
    }).then((r) => r.json());

    if (res.claim) {
      setClaims((prev) => [res.claim, ...prev]);
      setStaging((prev) => prev.map((s) => (s.id === stagingId ? { ...s, status: 'approved' } : s)));
    }
  };

  const handleRejectStaging = async (stagingId: string, reason: string) => {
    await fetch(`/api/evidence/staging/${stagingId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, reviewer: `${currentRole} User` }),
    });

    setStaging((prev) => prev.map((s) => (s.id === stagingId ? { ...s, status: 'rejected' } : s)));
  };

  const handleUpdateDisposition = async (id: string, disposition: any, notes: string, setBy: string) => {
    const res = await fetch(`/api/decisions/${id}/disposition`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disposition, notes, setBy }),
    }).then((r) => r.json());

    setDecisions((prev) => prev.map((d) => (d.id === id ? res : d)));
  };

  const handleUpdateStatus = async (id: string, status: DecisionRecord['implementationStatus']) => {
    const res = await fetch(`/api/decisions/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update status');
    }

    setDecisions((prev) => prev.map((d) => (d.id === id ? data : d)));
  };

  const handleToggleGate = async (id: string, passed: boolean) => {
    const res = await fetch(`/api/decisions/${id}/gate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passed }),
    }).then((r) => r.json());

    setDecisions((prev) => prev.map((d) => (d.id === id ? res : d)));
  };

  const handleAddDecision = (decision: Omit<DecisionRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    fetch('/api/decisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decision),
    })
      .then((r) => r.json())
      .then((newDec) => {
        setDecisions((prev) => [newDec, ...prev]);
      });
  };

  const handleGenerateAiScenarios = async (decision: DecisionRecord) => {
    const res = await fetch('/api/ai/draft-scenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decisionTitle: decision.title,
        decisionSummary: decision.summary,
        domain: decision.domain,
        institutionName: profile?.name || 'Atlas Global University',
      }),
    }).then((r) => r.json());

    if (res.scenarios) {
      const formatted = res.scenarios.map((s: any) => ({
        ...s,
        decisionId: decision.id,
      }));

      // Post to DB
      const added = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted),
      }).then((r) => r.json());

      setScenarios((prev) => [...prev, ...added]);
    }
  };

  const handleAddPrediction = async (pred: Omit<PredictionRecord, 'id' | 'dateMade'>) => {
    const res = await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pred),
    }).then((r) => r.json());

    setPredictions((prev) => [res, ...prev]);
  };

  const handleResolvePrediction = async (
    id: string,
    resolutionStatus: PredictionRecord['resolutionStatus'],
    actualOutcome: string,
    lessonsLearned: string
  ) => {
    const res = await fetch(`/api/predictions/${id}/resolve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolutionStatus, actualOutcome, lessonsLearned }),
    }).then((r) => r.json());

    setPredictions((prev) => prev.map((p) => (p.id === id ? res : p)));
  };

  const handleAddPulse = async (pulse: Omit<PulseSurveyResponse, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/input-instruments/pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pulse),
    }).then((r) => r.json());

    setPulseSurveys((prev) => [res, ...prev]);
  };

  const handleAddShadowReport = async (report: Omit<ShadowAiReport, 'id' | 'createdAt' | 'status'>) => {
    const res = await fetch('/api/input-instruments/shadow-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).then((r) => r.json());

    setShadowReports((prev) => [res, ...prev]);
  };

  const handleRunJob = async (jobId: JobExecutionStatus['jobId']) => {
    const res = await fetch(`/api/jobs/${jobId}/run`, {
      method: 'POST',
    }).then((r) => r.json());

    setJobs((prev) => prev.map((j) => (j.jobId === jobId ? res : j)));
    // Reload evidence staging if refresh ran
    if (jobId === 'evidence_refresh') {
      const ev = await fetch(`/api/evidence/${currentTenantId}`).then((r) => r.json());
      setStaging(ev.staging || []);
    }
  };

  if (isLoading || !profile || !activeOverlayPack) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-xl font-serif shadow-lg shadow-indigo-500/30">
            P
          </div>
          <h2 className="text-lg font-bold text-white font-serif">Booting Proteus Compass OS...</h2>
          <p className="text-xs text-slate-400">Loading multi-tenant data, kernel rules, and overlay packs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      {/* Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentTenantId={currentTenantId}
        setCurrentTenantId={setCurrentTenantId}
        institutions={allInstitutions}
        activeOverlayPack={activeOverlayPack}
        kernelVersion={kernelVersion}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Tab Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            institution={profile}
            activeOverlayPack={activeOverlayPack}
            decisions={decisions}
            claims={claims}
            shadowReports={shadowReports}
            predictions={predictions}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'compass_master' && (
          <CompassMasterView
            userRole={currentRole}
            currentTenantId={currentTenantId}
            institution={profile}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <InstitutionalProfileView
            institution={profile}
            activeOverlayPack={activeOverlayPack}
            allOverlayPacks={allOverlayPacks}
            userRole={currentRole}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceLedgerView
            claims={claims}
            staging={staging}
            userRole={currentRole}
            onAddClaim={handleAddClaim}
            onApproveStaging={handleApproveStaging}
            onRejectStaging={handleRejectStaging}
          />
        )}

        {activeTab === 'scenarios' && (
          <ScenarioEngineView
            decisions={decisions}
            scenarios={scenarios}
            userRole={currentRole}
            onUpdateDisposition={handleUpdateDisposition}
            onUpdateStatus={handleUpdateStatus}
            onToggleGate={handleToggleGate}
            onGenerateAiScenarios={handleGenerateAiScenarios}
            onAddDecision={handleAddDecision}
          />
        )}

        {activeTab === 'stakeholders' && (
          <StakeholderLedgerView
            decisions={decisions}
            stakeholderImpacts={stakeholderImpacts}
            userRole={currentRole}
          />
        )}

        {activeTab === 'predictions' && (
          <PredictionTrackerView
            predictions={predictions}
            userRole={currentRole}
            onAddPrediction={handleAddPrediction}
            onResolvePrediction={handleResolvePrediction}
          />
        )}

        {activeTab === 'redflags' && <RedFlagLibraryView redFlags={redFlags} />}

        {activeTab === 'input' && (
          <GrassrootsInputView
            pulseSurveys={pulseSurveys}
            shadowReports={shadowReports}
            userRole={currentRole}
            onAddPulse={handleAddPulse}
            onAddShadowReport={handleAddShadowReport}
          />
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <JobsAndGovernanceView jobs={jobs} userRole={currentRole} onRunJob={handleRunJob} />
            <KernelVersionManager />
          </div>
        )}
      </main>
    </div>
  );
}
