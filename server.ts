import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/services/db';
import { getActiveKernel, getKernelVersionHistory, evaluateProposalAgainstKernel } from './src/kernel/kernelModule';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI lazily
let genAI: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

// REST API Endpoints

// 1. Kernel & Compass Master API
app.get('/api/kernel', (req, res) => {
  const kernel = getActiveKernel();
  const history = getKernelVersionHistory();
  res.json({ kernel, versionHistory: history });
});

app.get('/api/compass/principles', (req, res) => {
  const kernel = getActiveKernel();
  res.json(kernel);
});

app.post('/api/compass/final-test-audit', (req, res) => {
  const { proposalText, role } = req.body;
  if (!proposalText) {
    return res.status(400).json({ error: 'proposalText is required' });
  }
  const result = evaluateProposalAgainstKernel(proposalText);
  res.json(result);
});

app.get('/api/compass/diagnostic/:tenantId', (req, res) => {
  const items = db.getDiagnosticsForTenant(req.params.tenantId);
  const total = items.length;
  const availableCount = items.filter(i => i.isAvailable).length;
  const missingItems = items.filter(i => !i.isAvailable);
  const completionPercentage = Math.round((availableCount / total) * 100);

  res.json({
    tenantId: req.params.tenantId,
    total,
    availableCount,
    completionPercentage,
    missingItems,
    items,
    mandatoryGapStatement: missingItems.length > 0 
      ? `A reliable recommendation cannot yet be made because the following ${missingItems.length} essential institutional datasets are missing: ${missingItems.slice(0, 5).map(m => m.name).join(', ')}${missingItems.length > 5 ? ` and ${missingItems.length - 5} more.` : '.'}`
      : 'All foundational institutional baseline datasets verified. Institutional diagnostic criteria satisfied.'
  });
});

app.put('/api/compass/diagnostic/:tenantId/:diagId', (req, res) => {
  try {
    const { isAvailable, notes } = req.body;
    const item = db.toggleDiagnosticAvailability(req.params.tenantId, req.params.diagId, isAvailable, notes);
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Profile & Overlay Packs
app.get('/api/profile/:tenantId', (req, res) => {
  const inst = db.getInstitution(req.params.tenantId) || db.institutions[0];
  const activePack = db.overlayPacks.find(p => p.id === inst.activeOverlayPackId) || db.overlayPacks[0];
  res.json({ profile: inst, activeOverlayPack: activePack, allInstitutions: db.institutions });
});

app.put('/api/profile/:tenantId', (req, res) => {
  try {
    const updated = db.updateInstitution(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/overlay-packs', (req, res) => {
  res.json(db.overlayPacks);
});

// 3. Evidence Ledger API
app.get('/api/evidence/:tenantId', (req, res) => {
  const claims = db.getClaims(req.params.tenantId);
  const staging = db.evidenceStaging.filter(s => s.tenantId === req.params.tenantId);
  res.json({ claims, staging });
});

app.post('/api/evidence', (req, res) => {
  try {
    const newClaim = db.addClaim(req.body);
    res.json(newClaim);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/evidence/staging/:id/approve', (req, res) => {
  try {
    const claim = db.approveStagingEvidence(req.params.id, req.body.reviewer || 'Leadership Reviewer');
    res.json({ success: true, claim });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/evidence/staging/:id/reject', (req, res) => {
  try {
    db.rejectStagingEvidence(req.params.id, req.body.reason || 'Unverified source', req.body.reviewer || 'Leadership Reviewer');
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Decision & Scenario Engine API
app.get('/api/decisions/:tenantId', (req, res) => {
  const decisions = db.getDecisions(req.params.tenantId);
  res.json(decisions);
});

app.post('/api/decisions', (req, res) => {
  try {
    const dec = db.addDecision(req.body);
    res.json(dec);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/decisions/:id/disposition', (req, res) => {
  try {
    const { disposition, notes, setBy } = req.body;
    const dec = db.updateDecisionDisposition(req.params.id, disposition, notes, setBy);
    res.json(dec);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/decisions/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const dec = db.updateDecisionStatus(req.params.id, status);
    res.json(dec);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/decisions/:id/gate', (req, res) => {
  try {
    const { passed } = req.body;
    const dec = db.setHumanApprovalGate(req.params.id, passed);
    res.json(dec);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/decisions/:id/governance-signoff', (req, res) => {
  try {
    const { signoffType, status, resolutionNotes, signedBy } = req.body;
    const dec = db.recordGovernanceSignoff(req.params.id, signoffType, status, resolutionNotes, signedBy);
    res.json(dec);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/decisions/:id/dossier', (req, res) => {
  try {
    const dec = db.decisions.find(d => d.id === req.params.id);
    if (!dec) return res.status(404).json({ error: 'Decision not found' });
    const inst = db.getInstitution(dec.tenantId) || db.institutions[0];

    const auditEval = evaluateProposalAgainstKernel(`${dec.title}. ${dec.summary}`);
    const scenarios = db.getScenariosForDecision(dec.id);
    const relatedClaims = db.getClaims(dec.tenantId).slice(0, 3);
    const relatedRedFlags = db.redFlags.slice(0, 2);

    const dossier = {
      dossierId: `DOSSIER-${new Date().getFullYear()}-${inst.shortName}-${dec.id.toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      institution: inst,
      decision: dec,
      finalTestResults: auditEval.finalTestResults,
      evidenceArchitecture: {
        claimedAssumptions: scenarios.flatMap(s => s.keyAssumptions).slice(0, 5),
        verifiedEvidence: relatedClaims.map(c => `[${c.confidenceTier.toUpperCase()}] ${c.claimText} (${c.sourceName})`),
        counterEvidence: relatedRedFlags.map(rf => `[${rf.category.toUpperCase()}] ${rf.title}: ${rf.caseSummary}`),
        epistemicStatus: dec.touchesEnrollmentOrGrading ? 'High Epistemic Sensitivity (Mandatory Empirical Validation)' : 'Standard Strategic Projection'
      },
      governanceCertification: {
        academicBody: dec.academicSignoff || {
          signoffType: 'academic',
          bodyName: inst.academicGovernanceBodyName,
          signedBy: null,
          signedAt: null,
          status: 'pending',
          resolutionNotes: 'Awaiting formal faculty committee submission.'
        },
        administrativeBody: dec.administrativeSignoff || {
          signoffType: 'administrative',
          bodyName: inst.provostOfficeName,
          signedBy: null,
          signedAt: null,
          status: 'pending',
          resolutionNotes: 'Awaiting executive academic affairs review.'
        },
        quorumSatisfied: (dec.academicSignoff?.status === 'approved' && dec.administrativeSignoff?.status === 'approved'),
        finalDisposition: dec.humanDisposition
      }
    };

    res.json(dossier);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scenarios/:decisionId', (req, res) => {
  const list = db.getScenariosForDecision(req.params.decisionId);
  res.json(list);
});

app.post('/api/scenarios', (req, res) => {
  try {
    const added = db.addScenarios(req.body);
    res.json(added);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Stakeholder Ledger API
app.get('/api/stakeholders/:decisionId', (req, res) => {
  const list = db.getStakeholdersForDecision(req.params.decisionId);
  res.json(list);
});

// 6. Prediction Tracker API
app.get('/api/predictions/:tenantId', (req, res) => {
  const list = db.getPredictions(req.params.tenantId);
  res.json(list);
});

app.post('/api/predictions', (req, res) => {
  try {
    const pred = db.addPrediction(req.body);
    res.json(pred);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/predictions/:id/resolve', (req, res) => {
  try {
    const { resolutionStatus, actualOutcome, lessonsLearned } = req.body;
    const updated = db.resolvePrediction(req.params.id, resolutionStatus, actualOutcome, lessonsLearned);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Red-Flag Library API
app.get('/api/red-flags', (req, res) => {
  res.json(db.getRedFlags());
});

app.post('/api/red-flags/check-proposal', (req, res) => {
  const { proposalText } = req.body;
  const lowercase = (proposalText || '').toLowerCase();
  
  const matchedFlags = db.getRedFlags().filter(flag => {
    return (
      lowercase.includes('grad') && flag.category === 'integrity_collapse' ||
      lowercase.includes('bot') && flag.category === 'accreditation_gap' ||
      lowercase.includes('vendor') && flag.category === 'vendor_lock_in' ||
      lowercase.includes('auto') && flag.category === 'overreliance' ||
      lowercase.includes('homework') && flag.category === 'rollback_after_launch'
    );
  });

  res.json({
    proposalText,
    matchedFlags: matchedFlags.length > 0 ? matchedFlags : db.getRedFlags().slice(0, 2)
  });
});

// 8. Grassroots Input Instruments API (Pulse Surveys & Shadow AI Reports)
app.get('/api/input-instruments/:tenantId', (req, res) => {
  const pulses = db.pulseSurveys.filter(p => p.tenantId === req.params.tenantId);
  const reports = db.shadowAiReports.filter(r => r.tenantId === req.params.tenantId);
  res.json({ pulseSurveys: pulses, shadowAiReports: reports });
});

app.post('/api/input-instruments/pulse', (req, res) => {
  try {
    const pulse = db.addPulseSurvey(req.body);
    res.json(pulse);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/input-instruments/shadow-ai', (req, res) => {
  try {
    const report = db.addShadowAiReport(req.body);
    res.json(report);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Scheduled Jobs API
app.get('/api/jobs', (req, res) => {
  res.json(db.jobStatuses);
});

app.post('/api/jobs/:jobId/run', (req, res) => {
  try {
    const status = db.runJob(req.params.jobId as any);
    res.json(status);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 10. AI Generation Endpoints (Gemini API with fallback)
app.post('/api/ai/draft-scenarios', async (req, res) => {
  const { decisionTitle, decisionSummary, domain, institutionName } = req.body;
  const ai = getAI();

  if (!ai) {
    // Fallback scenario generator when GEMINI_API_KEY is not configured
    const mockScenarios = [
      {
        scenarioType: 'conservative',
        title: `[AI-Drafted] Minimal Pilot: ${decisionTitle}`,
        description: `Implement ${decisionTitle} as an optional faculty/student trial in 2 non-core sections with human oversight.`,
        keyAssumptions: ['Faculty retain total grading control', 'No automation of student status'],
        nonTechDrivers: {
          demographics: 'Traditional undergraduate preferences',
          economics: 'Low cost pilot ($5k budget)',
          policy: 'Complies fully with FERPA',
          geopolitics: 'Domestic server hosting'
        },
        reversibilityRating: 5,
        isAiDrafted: true
      },
      {
        scenarioType: 'moderate',
        title: `[AI-Drafted] Hybrid Co-Pilot Deployment`,
        description: `Integrate ${decisionTitle} to assist human instructors with initial draft analysis, requiring instructor approval for all scores.`,
        keyAssumptions: ['Reduces instructor prep time by 25%', 'Human approval gate mandatory'],
        nonTechDrivers: {
          demographics: 'Rising class enrollments',
          economics: 'Moderate subscription cost',
          policy: 'Requires faculty senate co-design',
          geopolitics: 'Standard SLA'
        },
        reversibilityRating: 4,
        isAiDrafted: true
      },
      {
        scenarioType: 'ambitious',
        title: `[AI-Drafted] Institution-Wide Strategic Modernization`,
        description: `Full scale integration of ${decisionTitle} across all undergraduate programs with custom fine-tuned institutional domain models.`,
        keyAssumptions: ['High faculty adoption', 'Seamless LMS integration'],
        nonTechDrivers: {
          demographics: 'Competitive student recruitment',
          economics: 'Significant capital investment',
          policy: 'New institutional AI policy framework',
          geopolitics: 'Cloud infrastructure contract'
        },
        reversibilityRating: 3,
        isAiDrafted: true
      },
      {
        scenarioType: 'adverse',
        title: `[AI-Drafted] Algorithmic Misalignment & Student Dispute Backlog`,
        description: `Systemic false positive flags and biased feedback trigger widespread student appeals, faculty pushback, and accreditor inquiry.`,
        keyAssumptions: ['Model lacks discipline-specific nuance', 'Students lose trust in evaluation'],
        nonTechDrivers: {
          demographics: 'Disproportionately affects ESL/first-gen students',
          economics: 'High administrative appeal handling cost',
          policy: 'Accreditor warning on substantive interaction',
          geopolitics: 'API downtime during finals'
        },
        reversibilityRating: 2,
        isAiDrafted: true
      },
      {
        scenarioType: 'disruptive',
        title: `[AI-Drafted] Curriculum Disintermediation & Value Erosion`,
        description: `Complete breakdown of authentic student assessment leading to credential devaluation and loss of institutional trust.`,
        keyAssumptions: ['Students use GAI to bypass core learning', 'Faculty morale collapses'],
        nonTechDrivers: {
          demographics: 'Enrollment drop due to loss of prestige',
          economics: 'Long-term revenue risk',
          policy: 'Emergency return to paper blue-books',
          geopolitics: 'Global credential scrutiny'
        },
        reversibilityRating: 1,
        isAiDrafted: true
      }
    ];

    return res.json({ scenarios: mockScenarios, note: 'Generated via Proteus AI Engine (Fallback mode - configure GEMINI_API_KEY for live model response)' });
  }

  try {
    const prompt = `You are the Proteus Higher Education AI Compass Intelligence Engine.
You must generate 5 distinct scenarios (conservative, moderate, ambitious, adverse, disruptive) for the proposed higher education decision:
Decision Title: "${decisionTitle}"
Summary: "${decisionSummary}"
Domain: "${domain}"
Institution: "${institutionName}"

Enforce Section V of the Higher Education AI Compass:
Each scenario MUST include:
- scenarioType ("conservative" | "moderate" | "ambitious" | "adverse" | "disruptive")
- title (prefixed with [AI-Drafted])
- description
- keyAssumptions (array of 2 strings)
- nonTechDrivers (object with string properties: demographics, economics, policy, geopolitics)
- reversibilityRating (integer 1 to 5)

Return strictly valid JSON array of 5 scenario objects inside a top level "scenarios" property. Do not use markdown code block wrappers if possible, or return JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text || '';
    let parsed: any;
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = { scenarios: [] };
    }

    if (parsed.scenarios && Array.isArray(parsed.scenarios) && parsed.scenarios.length >= 5) {
      const formatted = parsed.scenarios.map((s: any) => ({
        ...s,
        isAiDrafted: true
      }));
      return res.json({ scenarios: formatted });
    } else {
      throw new Error('Invalid JSON format from model');
    }
  } catch (err: any) {
    res.status(500).json({ error: 'AI generation failed: ' + err.message });
  }
});

app.post('/api/ai/analyze-proposal', async (req, res) => {
  const { proposalText } = req.body;
  const analysis = evaluateProposalAgainstKernel(proposalText || '');
  res.json(analysis);
});

// Vite / Production Static File Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Proteus Compass OS] Server running on http://localhost:${PORT}`);
  });
}

startServer();
