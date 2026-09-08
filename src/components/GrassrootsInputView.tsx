import React, { useState } from 'react';
import { PulseSurveyResponse, ShadowAiReport, UserRole } from '../types';
import { AlertTriangle, Send, ShieldAlert, CheckCircle, MessageSquare, Users, Eye } from 'lucide-react';

interface GrassrootsInputViewProps {
  pulseSurveys: PulseSurveyResponse[];
  shadowReports: ShadowAiReport[];
  userRole: UserRole;
  onAddPulse: (pulse: Omit<PulseSurveyResponse, 'id' | 'createdAt'>) => void;
  onAddShadowReport: (report: Omit<ShadowAiReport, 'id' | 'createdAt' | 'status'>) => void;
}

export const GrassrootsInputView: React.FC<GrassrootsInputViewProps> = ({
  pulseSurveys,
  shadowReports,
  userRole,
  onAddPulse,
  onAddShadowReport,
}) => {
  const [activeForm, setActiveForm] = useState<'pulse' | 'shadow'>('pulse');

  // Pulse Survey Form State
  const [pulseRole, setPulseRole] = useState<'faculty' | 'student'>(userRole === 'student' ? 'student' : 'faculty');
  const [discipline, setDiscipline] = useState('');
  const [frequency, setFrequency] = useState<PulseSurveyResponse['aiUsageFrequency']>('weekly');
  const [toolsInput, setToolsInput] = useState('ChatGPT, Claude');
  const [valueRating, setValueRating] = useState(3);
  const [riskRating, setRiskRating] = useState(3);
  const [pulseComments, setPulseComments] = useState('');
  const [pulseSuccess, setPulseSuccess] = useState(false);

  // Shadow AI / Breakdown Report State
  const [deptName, setDeptName] = useState('');
  const [toolName, setToolName] = useState('');
  const [breakdownDesc, setBreakdownDesc] = useState('');
  const [riskType, setRiskType] = useState<ShadowAiReport['perceivedRiskType']>('unapproved_grading');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleSubmitPulse = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPulse({
      tenantId: 'inst-1',
      role: pulseRole,
      disciplineOrProgram: discipline || 'General Academic',
      aiUsageFrequency: frequency,
      primaryToolsUsed: toolsInput.split(',').map((t) => t.trim()),
      perceivedAcademicValue: valueRating,
      perceivedIntegrityRisk: riskRating,
      comments: pulseComments,
    });

    setPulseSuccess(true);
    setPulseComments('');
    setTimeout(() => setPulseSuccess(false), 2500);
  };

  const handleSubmitShadowReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breakdownDesc.trim()) return;

    onAddShadowReport({
      tenantId: 'inst-1',
      reportedByRole: userRole,
      departmentOrCourse: deptName || 'Academic Course',
      toolOrUseName: toolName || 'Unsanctioned AI Tool',
      description: breakdownDesc,
      perceivedRiskType: riskType,
    });

    setReportSuccess(true);
    setBreakdownDesc('');
    setToolName('');
    setTimeout(() => setReportSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Grassroots Input & Shadow AI Watch
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Section XIV & III: Upward data flow from faculty and students to eliminate the governance gap of shadow AI use.
          </p>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex text-xs font-bold">
          <button
            onClick={() => setActiveForm('pulse')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeForm === 'pulse' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Pulse Survey
          </button>
          <button
            onClick={() => setActiveForm('shadow')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeForm === 'shadow' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flag Shadow AI / Breakdown
          </button>
        </div>
      </div>

      {/* Forms Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Form Instrument */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
          {activeForm === 'pulse' ? (
            <form onSubmit={handleSubmitPulse} className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Faculty & Student Pulse Survey</h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-mono font-bold">
                  Upward Feedback Instrument
                </span>
              </div>

              {pulseSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Pulse response submitted to leadership dashboard!
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Your Role</label>
                  <select
                    value={pulseRole}
                    onChange={(e) => setPulseRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  >
                    <option value="faculty">Faculty / Instructor</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Academic Department / Program</label>
                  <input
                    type="text"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    placeholder="e.g. Department of Philosophy"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">AI Usage Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="occasional">Occasional</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Primary Tools Used</label>
                  <input
                    type="text"
                    value={toolsInput}
                    onChange={(e) => setToolsInput(e.target.value)}
                    placeholder="ChatGPT, Claude, Grammarly"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Perceived Learning Value (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={valueRating}
                    onChange={(e) => setValueRating(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-[10px] text-cyan-800 font-mono font-bold">{valueRating} / 5</span>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Perceived Integrity Risk (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={riskRating}
                    onChange={(e) => setRiskRating(parseInt(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <span className="text-[10px] text-rose-800 font-mono font-bold">{riskRating} / 5</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Qualitative Observations / Friction</label>
                <textarea
                  rows={3}
                  value={pulseComments}
                  onChange={(e) => setPulseComments(e.target.value)}
                  placeholder="Share how GAI is actually affecting classroom dynamics or course workload..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none font-sans font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" /> Submit Pulse Survey Response
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitShadowReport} className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Flag Shadow AI or System Breakdown
                </h3>
                <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-mono font-bold">
                  Critical Safety Report
                </span>
              </div>

              {reportSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Shadow AI flag logged for leadership review!
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Department / Course Code</label>
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="e.g. Bio 101"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Tool / Use Case Name</label>
                  <input
                    type="text"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g. Unapproved AI Grading Browser Extension"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Risk Category</label>
                <select
                  value={riskType}
                  onChange={(e) => setRiskType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                >
                  <option value="unapproved_grading">Unapproved Automated Grading</option>
                  <option value="student_data_leak">Student Data Leak / Third-Party Vendor</option>
                  <option value="misinformation">Hallucinated Information in Coursework</option>
                  <option value="accreditation_bypass">Accreditation Interaction Bypass</option>
                  <option value="shadow_vendor">Shadow EdTech Procurement</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Detailed Incident Description</label>
                <textarea
                  rows={4}
                  value={breakdownDesc}
                  onChange={(e) => setBreakdownDesc(e.target.value)}
                  placeholder="Describe where the AI tool broke down or operated outside institutional visibility..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none font-sans font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" /> Submit Shadow AI Alert
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Upward Leadership Dashboard Feed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-700" /> Leadership Upward Data Flow
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
              Live Feed
            </span>
          </div>

          {/* Shadow AI Reports Feed */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono">
              Flagged Shadow AI Uses & Breakdown Reports ({shadowReports.length})
            </h4>

            {shadowReports.map((report) => (
              <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900">{report.toolOrUseName}</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      report.status === 'flagged' ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <p className="text-slate-700 text-[11px] leading-relaxed font-medium">{report.description}</p>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 font-mono font-semibold">
                  <span>Dept: {report.departmentOrCourse}</span>
                  <span>Reported by: {report.reportedByRole}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pulse Survey Feed */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider font-mono">
              Faculty & Student Pulse Submissions ({pulseSurveys.length})
            </h4>

            {pulseSurveys.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-900 capitalize">{p.role} Pulse - {p.disciplineOrProgram}</span>
                  <span className="text-[10px] font-mono font-bold text-cyan-800">Freq: {p.aiUsageFrequency}</span>
                </div>

                <p className="text-slate-700 text-[11px] italic font-medium">"{p.comments}"</p>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono font-semibold">
                  <span>Learning Value: {p.perceivedAcademicValue}/5</span>
                  <span>Integrity Risk: {p.perceivedIntegrityRisk}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
