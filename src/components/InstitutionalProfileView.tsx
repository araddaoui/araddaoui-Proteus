import React, { useState } from 'react';
import { Institution, OverlayPack, UserRole } from '../types';
import { Building2, Layers, Globe, Shield, Save, CheckCircle, Lock, Users } from 'lucide-react';

interface InstitutionalProfileViewProps {
  institution: Institution;
  activeOverlayPack: OverlayPack;
  allOverlayPacks: OverlayPack[];
  userRole: UserRole;
  onUpdateProfile: (updated: Institution) => void;
}

export const InstitutionalProfileView: React.FC<InstitutionalProfileViewProps> = ({
  institution,
  activeOverlayPack,
  allOverlayPacks,
  userRole,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<Institution>({ ...institution });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canEditAll = userRole === 'leadership' || userRole === 'consultant';
  const isStudent = userRole === 'student';

  const handleChange = (field: keyof Institution, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDemographicsChange = (field: keyof Institution['studentDemographics'], value: number) => {
    setFormData((prev) => ({
      ...prev,
      studentDemographics: {
        ...prev.studentDemographics,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditAll) return;
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Title & Role Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <Building2 className="w-5 h-5 text-indigo-600" /> Institutional Profile Module
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Section VI & VII of Higher Education AI Compass. All AI recommendations are filtered through these institutional realities.
          </p>
        </div>
        {!canEditAll && (
          <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-600" /> Read-Only ({userRole} view)
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Institution Identity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">
            1. Mission & Governance Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Institution Name</label>
              <input
                type="text"
                disabled={!canEditAll}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-medium"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Mission Statement (Section VI Anchor)</label>
              <textarea
                disabled={!canEditAll}
                rows={3}
                value={formData.missionStatement}
                onChange={(e) => handleChange('missionStatement', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 resize-none font-sans font-medium"
              />
            </div>

            {!isStudent && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Governance Structure</label>
                  <select
                    disabled={!canEditAll}
                    value={formData.governanceType}
                    onChange={(e) => handleChange('governanceType', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 capitalize font-medium"
                  >
                    <option value="public">Public University System</option>
                    <option value="private">Private Non-Profit</option>
                    <option value="hybrid">Hybrid / International Branch</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Legal Jurisdiction</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={formData.legalJurisdiction}
                    onChange={(e) => handleChange('legalJurisdiction', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Budget Tier</label>
                  <select
                    disabled={!canEditAll}
                    value={formData.budgetTier}
                    onChange={(e) => handleChange('budgetTier', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-medium"
                  >
                    <option value="Small (<$50M)">Small (&lt;$50M)</option>
                    <option value="Medium ($50M-$250M)">Medium ($50M-$250M)</option>
                    <option value="Large ($250M-$1B)">Large ($250M-$1B)</option>
                    <option value="Tier 1 R1 ($1B+)">Tier 1 R1 ($1B+)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Institutional AI Policy Status</label>
                  <select
                    disabled={!canEditAll}
                    value={formData.currentAiPolicyStatus}
                    onChange={(e) => handleChange('currentAiPolicyStatus', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 capitalize font-medium"
                  >
                    <option value="none">No Formal Policy</option>
                    <option value="drafting">Drafting Framework in Progress</option>
                    <option value="formal">Formal Policy Ratified</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Student Demographics (Restricted for student view) */}
        {!isStudent && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">
              2. Student Population & Equity Demographics (Section XIX Driver)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Total Student Enrollment</label>
                <input
                  type="number"
                  disabled={!canEditAll}
                  value={formData.enrollmentSize}
                  onChange={(e) => handleChange('enrollmentSize', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Undergraduate %</label>
                <input
                  type="number"
                  disabled={!canEditAll}
                  value={formData.studentDemographics.undergraduatePercent}
                  onChange={(e) => handleDemographicsChange('undergraduatePercent', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">First-Generation %</label>
                <input
                  type="number"
                  disabled={!canEditAll}
                  value={formData.studentDemographics.firstGenPercent}
                  onChange={(e) => handleDemographicsChange('firstGenPercent', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Pell-Eligible / Low Income %</label>
                <input
                  type="number"
                  disabled={!canEditAll}
                  value={formData.studentDemographics.pellEligiblePercent}
                  onChange={(e) => handleDemographicsChange('pellEligiblePercent', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">International Students %</label>
                <input
                  type="number"
                  disabled={!canEditAll}
                  value={formData.studentDemographics.internationalPercent}
                  onChange={(e) => handleDemographicsChange('internationalPercent', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Overlay Pack Selector */}
        {!isStudent && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600" /> 3. Regional Overlay Pack System (Section VII)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Swappable compliance layer containing accreditor rules, data protection regimes, and language localization.
                </p>
              </div>
              <span className="text-xs bg-cyan-100 text-cyan-800 border border-cyan-200 px-2.5 py-1 rounded font-bold">
                Active: {activeOverlayPack.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allOverlayPacks.map((pack) => {
                const isSelected = formData.activeOverlayPackId === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => canEditAll && handleChange('activeOverlayPackId', pack.id)}
                    className={`border rounded-xl p-4 space-y-3 cursor-pointer transition-all shadow-sm ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-900">{pack.name}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{pack.description}</p>
                    <div className="space-y-1 text-[10px] text-slate-700 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 font-bold">Regime:</span>{' '}
                        <span className="font-bold text-cyan-700">{pack.dataProtectionRegime}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Languages:</span>{' '}
                        <span className="font-medium">{pack.languagesSupported.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special Compliance Gates of Selected Overlay */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" /> Enforced Regional Compliance Gates ({activeOverlayPack.name}):
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-medium">
                {activeOverlayPack.specialComplianceGates.map((gate, i) => (
                  <li key={i}>{gate}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Save Button */}
        {canEditAll && (
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Institutional Profile
            </button>
            {saveSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Profile updated successfully
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
