import {
  Institution,
  OverlayPack,
  EvidenceClaim,
  EvidenceStagingItem,
  DecisionRecord,
  ScenarioEntry,
  StakeholderImpact,
  PredictionRecord,
  RedFlagCase,
  RedFlagStagingItem,
  PulseSurveyResponse,
  ShadowAiReport,
  JobExecutionStatus
} from '../types';

export class RelationalDatabase {
  institutions: Institution[] = [
    {
      id: 'inst-1',
      name: 'Atlas Global University',
      shortName: 'AGU',
      missionStatement: 'Advancing research, critical inquiry, democratic civic leadership, and global social mobility through human-centered scholarship.',
      governanceType: 'public',
      academicGovernanceType: 'faculty_senate',
      academicGovernanceBodyName: 'University Faculty Senate',
      provostOfficeName: 'Office of the Provost & Executive Vice Chancellor',
      accreditors: ['SACSCOC - Southern Association of Colleges and Schools', 'ABET'],
      legalJurisdiction: 'United States (Federal FERPA & State Higher Ed Code)',
      budgetTier: 'Large ($250M-$1B)',
      enrollmentSize: 28500,
      studentDemographics: {
        undergraduatePercent: 72,
        graduatePercent: 28,
        internationalPercent: 14,
        firstGenPercent: 31,
        pellEligiblePercent: 38
      },
      currentAiPolicyStatus: 'drafting',
      primaryLanguages: ['English', 'Spanish'],
      activeOverlayPackId: 'pack-us-ferpa',
      createdAt: '2026-01-15T08:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z'
    },
    {
      id: 'inst-2',
      name: 'Tecnológico de Monterrey (Partner Campus)',
      shortName: 'TecMonterrey',
      missionStatement: 'Educating leaders with entrepreneurial spirit, humanistic outlook, and international competitiveness.',
      governanceType: 'private',
      academicGovernanceType: 'scientific_council',
      academicGovernanceBodyName: 'Faculty Scientific & Academic Council',
      provostOfficeName: 'Vice-Rectorate for Academic Affairs & Faculty',
      accreditors: ['FIMPES', 'SACSCOC International'],
      legalJurisdiction: 'Mexico (Ley General de Educación Superior)',
      budgetTier: 'Tier 1 R1 ($1B+)',
      enrollmentSize: 92000,
      studentDemographics: {
        undergraduatePercent: 80,
        graduatePercent: 20,
        internationalPercent: 8,
        firstGenPercent: 22,
        pellEligiblePercent: 25
      },
      currentAiPolicyStatus: 'formal',
      primaryLanguages: ['Spanish', 'English'],
      activeOverlayPackId: 'pack-us-ferpa',
      createdAt: '2026-02-01T08:00:00Z',
      updatedAt: '2026-08-02T10:00:00Z'
    },
    {
      id: 'inst-3',
      name: 'Université Internationale de la Méditerranée (UIM)',
      shortName: 'UIM MENA',
      missionStatement: 'Promoting interdisciplinary research, Francophone/Arabophone scholarship, and equitable regional innovation.',
      governanceType: 'hybrid',
      academicGovernanceType: 'scientific_council',
      academicGovernanceBodyName: 'Conseil Scientifique et Pédagogique (Scientific Council)',
      provostOfficeName: 'Direction des Affaires Académiques et de la Recherche',
      accreditors: ['HCRES France', 'Arab League Quality Assurance Network'],
      legalJurisdiction: 'MENA / Francophone Dual Jurisdiction (GDPR-Aligned)',
      budgetTier: 'Medium ($50M-$250M)',
      enrollmentSize: 16400,
      studentDemographics: {
        undergraduatePercent: 68,
        graduatePercent: 32,
        internationalPercent: 29,
        firstGenPercent: 41,
        pellEligiblePercent: 45
      },
      currentAiPolicyStatus: 'drafting',
      primaryLanguages: ['French', 'Arabic', 'English'],
      activeOverlayPackId: 'pack-mena-francophone',
      createdAt: '2026-03-10T08:00:00Z',
      updatedAt: '2026-08-05T10:00:00Z'
    }
  ];

  overlayPacks: OverlayPack[] = [
    {
      id: 'pack-us-ferpa',
      name: 'US Higher Ed (FERPA & SACSCOC / WASC)',
      region: 'North America (United States)',
      accreditationFrameworks: ['SACSCOC Substantive Change Guidance', 'NWCCU Standard 1.C', 'DEAC Distance Ed Rules'],
      dataProtectionRegime: 'FERPA',
      languagesSupported: ['English', 'Spanish'],
      regionalCaseStudyFocus: 'US Public Universities & Community College Financial Sustainability',
      specialComplianceGates: [
        'Mandatory Human Review for Financial Aid Eligibility & Course Withdrawal',
        'FERPA Student Directory Data Prohibition in External Model Training',
        'Faculty Governance Consultation on Syllabus AI Restrictions'
      ],
      description: 'Standard US higher education overlay ensuring compliance with FERPA student privacy rules, US regional accreditor substantive change rules, and ADA Title II accessibility.'
    },
    {
      id: 'pack-mena-francophone',
      name: 'MENA & Francophone Cross-Border Pack',
      region: 'Middle East, North Africa & Francophone Sphere',
      accreditationFrameworks: ['HCRES (High Council for Evaluation of Research)', 'Arab Network for Quality Assurance in HE (ANQAHE)'],
      dataProtectionRegime: 'MENA_PDPL',
      languagesSupported: ['French', 'Arabic', 'English'],
      regionalCaseStudyFocus: 'Trilingual AI Literacy, Cross-Border Student Mobility & Sovereignty',
      specialComplianceGates: [
        'Local Data Sovereignty Gate for Research Repositories',
        'Trilingual AI Curriculum Audit (French / Arabic / English)',
        'Council of Europe AI & Human Rights Framework Checklist'
      ],
      description: 'Designed specifically for MENA and Francophone universities requiring multilingual support, Arab League/French accreditation alignment, and national data sovereignty safeguards.'
    },
    {
      id: 'pack-eu-gdpr',
      name: 'EU AI Act & European Higher Education Area (EHEA)',
      region: 'European Union & EHEA',
      accreditationFrameworks: ['ESG (Standards and Guidelines for QA in EHEA)', 'EU AI Act High-Risk Educational Systems Standard'],
      dataProtectionRegime: 'GDPR',
      languagesSupported: ['English', 'French', 'German', 'Spanish'],
      regionalCaseStudyFocus: 'EU AI Act Compliance for Automated Assessment & Access Systems',
      specialComplianceGates: [
        'Article 6 EU AI Act High-Risk Impact Assessment for Exam Monitoring',
        'GDPR Right to Explanation for Algorithmic Student Profiling',
        'Works Council & Academic Senate Co-Determination Requirement'
      ],
      description: 'Strict European overlay enforcing the EU AI Act’s high-risk educational classification (August 2024), GDPR data minimization, and EHEA student participation.'
    }
  ];

  evidenceClaims: EvidenceClaim[] = [
    {
      id: 'claim-101',
      tenantId: 'inst-1',
      claimText: 'A synthesis of higher education studies revealed that AI detection tools exhibit false positive rates exceeding 18% on non-native English writing, posing severe academic integrity risks.',
      sourceUrl: 'https://arxiv.org/abs/2304.02819',
      sourceName: 'Stanford University Computer Science Research Report',
      confidenceTier: 'peer_reviewed',
      datePublished: '2023-04-15',
      dateAdded: '2026-01-20',
      retractionStatus: 'active',
      tags: ['ai_detectors', 'academic_integrity', 'bias'],
      discipline: 'Computer Science & Applied Linguistics'
    },
    {
      id: 'claim-102',
      tenantId: 'inst-1',
      claimText: 'UNESCO 2024 global survey found only 19% of higher education institutions have formal AI governance frameworks, while 42% are drafting policies and 39% have no guidelines.',
      sourceUrl: 'https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research',
      sourceName: 'UNESCO Global AI Survey in Higher Education',
      confidenceTier: 'peer_reviewed',
      datePublished: '2024-03-10',
      dateAdded: '2026-02-01',
      retractionStatus: 'active',
      tags: ['global_adoption', 'governance', 'policy_gap'],
      discipline: 'Institutional Strategy'
    },
    {
      id: 'claim-103',
      tenantId: 'inst-1',
      claimText: 'A high-profile study claiming a 40% improvement in student writing scores via GAI assistance was retracted by the journal due to flawed sample selection and vendor co-authorship disclosure gaps.',
      sourceUrl: 'https://retractionwatch.com/category/by-subject/education-retractions/',
      sourceName: 'Retraction Watch Education Archives',
      confidenceTier: 'peer_reviewed',
      datePublished: '2025-11-12',
      dateAdded: '2026-02-15',
      retractionStatus: 'retracted',
      tags: ['retraction', 'writing_instruction', 'vendor_bias'],
      discipline: 'Higher Education Pedagogy'
    },
    {
      id: 'claim-104',
      tenantId: 'inst-1',
      claimText: 'University of Florida scaled an infrastructure-first GAI model with 230+ AI-designated courses, 300 participating faculty, and a 9-credit university-wide certificate.',
      sourceUrl: 'https://universitybusiness.com/university-of-florida-ai-across-the-curriculum/',
      sourceName: 'University Business Institutional Spotlight',
      confidenceTier: 'journalistic',
      datePublished: '2025-09-01',
      dateAdded: '2026-03-01',
      retractionStatus: 'active',
      tags: ['case_study', 'curriculum', 'infrastructure'],
      discipline: 'Academic Affairs'
    },
    {
      id: 'claim-105',
      tenantId: 'inst-1',
      claimText: 'Vendor-published survey claims 88% student satisfaction with automated AI chatbots for late-night tutoring and registration assistance.',
      sourceUrl: 'https://example-vendor-report.org/ai-tutoring-2025',
      sourceName: 'EdTech Global Marketing Whitepaper',
      confidenceTier: 'vendor_reported',
      datePublished: '2025-10-05',
      dateAdded: '2026-03-10',
      retractionStatus: 'disputed',
      tags: ['tutoring', 'vendor_claim', 'student_support'],
      discipline: 'Student Affairs'
    }
  ];

  evidenceStaging: EvidenceStagingItem[] = [
    {
      id: 'stage-201',
      tenantId: 'inst-1',
      claimText: 'EU AI Act Enforcement Report (Aug 2025): Higher education institutions using GAI for admissions filtering must complete mandatory bias audits before autumn registration.',
      sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      sourceName: 'EU AI Office Public Bulletin',
      confidenceTier: 'journalistic',
      datePublished: '2025-08-20',
      discoveredAt: '2026-08-07T04:00:00Z',
      status: 'pending_review'
    },
    {
      id: 'stage-202',
      tenantId: 'inst-1',
      claimText: 'Survey of 1,200 adjunct faculty indicated 64% feel unequipped to grade assignments in GAI-saturated courses without explicit institutional policy support.',
      sourceUrl: 'https://www.insidehighered.com/news/tech-o-logy/faculty-workload-gai',
      sourceName: 'Inside Higher Ed Faculty Pulse',
      confidenceTier: 'journalistic',
      datePublished: '2026-01-14',
      discoveredAt: '2026-08-07T04:00:00Z',
      status: 'pending_review'
    }
  ];

  decisions: DecisionRecord[] = [
    {
      id: 'dec-1',
      tenantId: 'inst-1',
      title: 'Automated AI Essay Grading & Feedback Tool Deployment',
      summary: 'Proposal to license a vendor GAI assistant to auto-grade 100-level undergraduate essay assignments and provide immediate feedback.',
      domain: 'grading_assessment',
      touchesEnrollmentOrGrading: true, // Non-negotiable human gate!
      humanApprovalGatePassed: false,
      humanDisposition: null, // REQUIRED to set before implementation
      dispositionNotes: 'Pending Academic Senate & Faculty Affairs safety review. Hardcoded human-in-the-loop required.',
      implementationStatus: 'under_review',
      isAiDrafted: true,
      kernelSectionIds: ['II', 'IV', 'VIII', 'XX', 'XXI', 'XXX'],
      academicSignoff: {
        signoffType: 'academic',
        bodyName: 'University Faculty Senate',
        signedBy: null,
        signedAt: null,
        status: 'pending',
        resolutionNotes: 'Referred to Senate Committee on Academic Freedom & Grading Ethics. Plenary review pending.'
      },
      administrativeSignoff: {
        signoffType: 'administrative',
        bodyName: 'Office of the Provost & Executive Vice Chancellor',
        signedBy: 'Dr. Evelyn Vance, Provost',
        signedAt: '2026-07-15T10:00:00Z',
        status: 'conditional',
        resolutionNotes: 'Conditional administrative approval for sandboxed pilot only; strictly subject to Senate plenary concurrence.'
      },
      createdAt: '2026-07-01T10:00:00Z',
      updatedAt: '2026-08-05T12:00:00Z'
    },
    {
      id: 'dec-2',
      tenantId: 'inst-1',
      title: 'Autonomous Student Withdrawal & Retention Chatbot',
      summary: 'Deploy an automated conversational bot to process student requests for course drop/withdrawal and academic standing holds without staff intervention.',
      domain: 'enrollment_admissions',
      touchesEnrollmentOrGrading: true,
      humanApprovalGatePassed: false,
      humanDisposition: 'rejected',
      dispositionNotes: 'REJECTED by Leadership following Red-Flag analysis showing high risk of student harm, loss of advising human connection, and accreditor non-compliance.',
      dispositionSetBy: 'Dr. Evelyn Vance (Provost)',
      dispositionSetAt: '2026-07-28T14:30:00Z',
      implementationStatus: 'shelved',
      isAiDrafted: false,
      kernelSectionIds: ['II', 'IV', 'XIX', 'XXI', 'XXVII'],
      academicSignoff: {
        signoffType: 'academic',
        bodyName: 'University Faculty Senate',
        signedBy: 'Prof. Marcus Thorne, Senate Chair',
        signedAt: '2026-07-25T16:00:00Z',
        status: 'rejected',
        resolutionNotes: 'Voted down by Senate Plenary 42-3. Autonomous withdrawal algorithmically severs the human educator-student pact.'
      },
      administrativeSignoff: {
        signoffType: 'administrative',
        bodyName: 'Office of the Provost & Executive Vice Chancellor',
        signedBy: 'Dr. Evelyn Vance, Provost',
        signedAt: '2026-07-28T14:30:00Z',
        status: 'rejected',
        resolutionNotes: 'Concur with Faculty Senate resolution. Project completely shelved and terminated.'
      },
      createdAt: '2026-06-15T09:00:00Z',
      updatedAt: '2026-07-28T14:30:00Z'
    },
    {
      id: 'dec-3',
      tenantId: 'inst-1',
      title: 'University-Wide Interdisciplinary AI Literacy Certificate',
      summary: 'Launch a 9-credit certificate for all undergraduate majors covering AI ethics, source evaluation, quantitative reasoning, and practical GAI augmentation.',
      domain: 'pedagogy',
      touchesEnrollmentOrGrading: false,
      humanApprovalGatePassed: true,
      humanDisposition: 'accepted',
      dispositionNotes: 'Unanimously accepted by Faculty Senate Curriculum Committee. Augmented human critical thinking model.',
      dispositionSetBy: 'Curriculum Governance Board',
      dispositionSetAt: '2026-05-10T11:00:00Z',
      implementationStatus: 'implemented',
      isAiDrafted: false,
      kernelSectionIds: ['I', 'XIII', 'XXIII', 'XIV'],
      academicSignoff: {
        signoffType: 'academic',
        bodyName: 'University Faculty Senate',
        signedBy: 'Prof. Marcus Thorne, Senate Chair',
        signedAt: '2026-05-02T14:00:00Z',
        status: 'approved',
        resolutionNotes: 'Unanimous curricular approval (Senate Resolution 2026-14).'
      },
      administrativeSignoff: {
        signoffType: 'administrative',
        bodyName: 'Office of the Provost & Executive Vice Chancellor',
        signedBy: 'Dr. Evelyn Vance, Provost',
        signedAt: '2026-05-10T11:00:00Z',
        status: 'approved',
        resolutionNotes: 'Administrative authorization confirmed. $120,000 allocated from Academic Innovation Fund.'
      },
      createdAt: '2026-04-01T08:00:00Z',
      updatedAt: '2026-05-10T11:00:00Z'
    }
  ];

  scenarios: ScenarioEntry[] = [
    // Scenarios for dec-1
    {
      id: 'scen-101',
      decisionId: 'dec-1',
      scenarioType: 'conservative',
      title: 'Formative Assist Only (Human Educator as Primary Grader)',
      description: 'The tool operates purely as an optional pre-submission grammar/structure checker for students. Faculty assign all grades manually.',
      keyAssumptions: ['Faculty retain 100% evaluation authority', 'No student grade is determined by algorithm'],
      nonTechDrivers: {
        demographics: 'Stable student expectations for personalized instructor relationship',
        economics: 'Modest software licensing cost ($15k/yr)',
        policy: 'Strict faculty governance rules regarding evaluation transparency',
        geopolitics: 'Low sensitivity'
      },
      reversibilityRating: 5,
      isAiDrafted: true
    },
    {
      id: 'scen-102',
      decisionId: 'dec-1',
      scenarioType: 'moderate',
      title: 'Co-Pilot Grading with Mandatory Instructor Audit',
      description: 'AI drafts scores and rubric annotations; faculty must review and approve every student score before posting.',
      keyAssumptions: ['Faculty time per paper reduced by 30%', '10% sample re-graded for consistency'],
      nonTechDrivers: {
        demographics: 'Rising class sizes in lower-division courses',
        economics: 'Teaching assistant budget savings reinvested in writing workshops',
        policy: 'Accreditor mandates human oversight logs for all automated assessment components',
        geopolitics: 'Standard vendor SLA'
      },
      reversibilityRating: 4,
      isAiDrafted: true
    },
    {
      id: 'scen-103',
      decisionId: 'dec-1',
      scenarioType: 'ambitious',
      title: 'Real-Time Adaptive Essay Diagnostic Engine',
      description: 'AI grades draft iterations continuously, offering students targeted micro-lessons before final submission.',
      keyAssumptions: ['High student engagement with iterative feedback', 'Faculty shift to coaching role'],
      nonTechDrivers: {
        demographics: 'Digital-native incoming cohort demanding instant feedback',
        economics: 'High upfront integration costs with LMS',
        policy: 'Requires updated student privacy consent agreements',
        geopolitics: 'Model hosted on domestic cloud instance'
      },
      reversibilityRating: 3,
      isAiDrafted: true
    },
    {
      id: 'scen-104',
      decisionId: 'dec-1',
      scenarioType: 'adverse',
      title: 'Algorithmic Hallucination & Grade Appeal Backlog',
      description: 'The vendor model misinterprets non-standard dialect and complex arguments, causing systemic grading bias and mass student appeals.',
      keyAssumptions: ['Vendor model lacks contextual awareness of academic discipline', 'Students lose trust in evaluation fairness'],
      nonTechDrivers: {
        demographics: 'Disproportionately harms first-generation and international ESL students',
        economics: 'Legal and administrative costs of handling 300+ formal grade appeals',
        policy: 'Public relations crisis and potential accreditor investigation',
        geopolitics: 'Third-party API outage during finals week'
      },
      reversibilityRating: 2,
      isAiDrafted: true
    },
    {
      id: 'scen-105',
      decisionId: 'dec-1',
      scenarioType: 'disruptive',
      title: 'Complete Devaluation of Written Assessment & Syllabi Collapse',
      description: 'Widespread availability of GAI essay generators leads to an arms race between student generation and AI automated grading, rendering the paper format obsolete.',
      keyAssumptions: ['Students use GAI to write papers that GAI grades', 'Zero authentic learning occurs'],
      nonTechDrivers: {
        demographics: 'Widespread cynicism regarding degree credential validity',
        economics: 'Decline in institutional reputation and alumni donor support',
        policy: 'Emergency university-wide shift back to oral examinations and blue-book proctored exams',
        geopolitics: 'Global erosion of degree recognition'
      },
      reversibilityRating: 1,
      isAiDrafted: true
    }
  ];

  stakeholderImpacts: StakeholderImpact[] = [
    {
      id: 'stk-101',
      decisionId: 'dec-1',
      stakeholderGroup: 'Students (Low Income / Pell)',
      benefitDescription: 'May receive faster basic feedback on writing drafts.',
      costDescription: 'Risk of algorithmic penalty if dialect or non-standard syntax is misinterpreted by vendor model.',
      powerShift: 'loses'
    },
    {
      id: 'stk-102',
      decisionId: 'dec-1',
      stakeholderGroup: 'International Students',
      benefitDescription: 'Immediate grammar corrections.',
      costDescription: 'Disproportionately high rate of false positive plagiarism or AI-writing flags.',
      powerShift: 'loses'
    },
    {
      id: 'stk-103',
      decisionId: 'dec-1',
      stakeholderGroup: 'Adjunct / Contingent Faculty',
      benefitDescription: 'Potential reduction in late-night routine grading load.',
      costDescription: 'Risk of workload escalation (forced to manage student grade disputes without additional pay) or reduction in adjunct headcount.',
      powerShift: 'loses'
    },
    {
      id: 'stk-104',
      decisionId: 'dec-1',
      stakeholderGroup: 'Tenure-Track Faculty',
      benefitDescription: 'Saves time on introductory assignments, allowing focus on upper-level research.',
      costDescription: 'Erosion of faculty evaluation sovereignty over curriculum.',
      powerShift: 'neutral'
    },
    {
      id: 'stk-105',
      decisionId: 'dec-1',
      stakeholderGroup: 'Professional / Support Staff',
      benefitDescription: 'None.',
      costDescription: 'Increased burden on Writing Center Tutors who must resolve conflicting AI feedback.',
      powerShift: 'loses'
    }
  ];

  predictions: PredictionRecord[] = [
    {
      id: 'pred-101',
      tenantId: 'inst-1',
      predictionText: 'By June 2026, over 40% of 100-level Humanities courses will adopt oral or in-class proctored assessments to counter GAI essay generation.',
      madeByUserId: 'user-leadership-1',
      madeByUserName: 'Dr. Evelyn Vance',
      madeByRole: 'leadership',
      dateMade: '2025-06-10',
      targetDate: '2026-06-01', // Past target date -> Reconciliation candidate!
      actualOutcome: 'Reconciliation Pending: Preliminary survey indicates 38% shifted to oral exams or in-class writing portfolios.',
      resolutionStatus: 'partially_correct',
      lessonsLearned: 'Assessment redesign happened faster in English and History, but slower in Philosophy due to class sizes.',
      scopeLevel: 'institution'
    },
    {
      id: 'pred-102',
      tenantId: 'inst-1',
      predictionText: 'By December 2026, at least one major AI detection tool vendor will face a class-action lawsuit or accreditor sanction due to false positive rates.',
      madeByUserId: 'user-faculty-1',
      madeByUserName: 'Prof. Marcus Chen',
      madeByRole: 'faculty',
      dateMade: '2026-01-15',
      targetDate: '2026-12-15',
      resolutionStatus: 'pending',
      scopeLevel: 'program'
    }
  ];

  redFlags: RedFlagCase[] = [
    {
      id: 'rf-01',
      title: 'Texas A&M Senior Diploma Hold False Alarm',
      category: 'integrity_collapse',
      institutionOrContext: 'US Public University (Texas A&M)',
      caseSummary: 'A professor ran senior capstone essays through a popular GAI chatbot, asking if it wrote them. The chatbot falsely claimed authorship, leading to temporary diploma holds for graduating seniors until university leadership intervened to manually review and exonerate the students.',
      sourceUrl: 'https://www.rollingstone.com/culture/culture-news/texas-am-chatgpt-ai-professor-flunk-graduates-1234737233/',
      patternDescription: 'Using generative AI tools as authoritative plagiarism detectors despite known hallucination tendencies.',
      warningSigns: [
        'Faculty reliance on GAI prompt "did you write this?" as evidence',
        'Absence of clear institutional appeal protocol before punitive action',
        'Direct threat to student graduation and degree issuance'
      ],
      mitigations: [
        'Explicit prohibition of using LLMs as plagiarism detectors',
        'Mandatory multi-tier human review before withholding grades or diplomas',
        'Faculty education on LLM output limitations'
      ],
      dateReported: '2023-05-18'
    },
    {
      id: 'rf-02',
      title: 'For-Profit College Instructor Substitution with Unmonitored Bot',
      category: 'accreditation_gap',
      institutionOrContext: 'For-Profit Online College Network',
      caseSummary: 'An online institution replaced core course instructors with an automated chatbot. Students had no contact with human faculty, and the bot autonomously processed course withdrawals, grading, and enrollment status changes. Accreditors subsequently sanctioned the institution for failing to provide regular and substantive faculty-student interaction.',
      sourceUrl: 'https://www.chronicle.com/article/when-ai-replaces-the-professor',
      patternDescription: 'Complete automation of instruction and enrollment decisions, eliminating human-in-the-loop oversight.',
      warningSigns: [
        'Zero human faculty touchpoints in course delivery',
        'Automated processing of student course drops and financial aid triggers',
        'Marketing cost reduction as educational innovation'
      ],
      mitigations: [
        'Enforce a hardcoded, non-negotiable human-approval gate for all grading, withdrawal, and degree status actions',
        'Regular accreditor substantive interaction audits'
      ],
      dateReported: '2024-02-10'
    },
    {
      id: 'rf-03',
      title: 'Rapid Rollback of Commercial Assignment-Completer EdTech Tool',
      category: 'rollback_after_launch',
      institutionOrContext: 'Commercial EdTech Startup Launch',
      caseSummary: 'A commercial startup launched an AI assistant marketed to "watch lectures and complete coursework." Within 72 hours of viral adoption, the tool was pulled offline following massive backlash from universities, data protection regulators, and cheating concerns.',
      sourceUrl: 'https://www.wired.com/story/ai-homework-tool-pulled-backlash/',
      patternDescription: 'Fast-launched AI products with short half-lives that promise complete homework automation without pedagogical grounding.',
      warningSigns: [
        'Tool promises to complete assignments on behalf of students',
        'Lack of transparent data privacy architecture',
        'Vendor marketing targeted directly at bypassing faculty assessment'
      ],
      mitigations: [
        'Vetting tools against the Red-Flag library prior to institutional procurement',
        'Assessment redesign focusing on authentic, multi-modal human performance'
      ],
      dateReported: '2025-03-22'
    },
    {
      id: 'rf-04',
      title: 'Systemic Overreliance & Writing Skill Erosion Study',
      category: 'overreliance',
      institutionOrContext: 'Multi-Institutional Pedagogical Research',
      caseSummary: 'Research tracking students who used unguided GAI tools for all writing assignments showed measurable decline in original synthesis skills, critical reasoning, and heightened anxiety when required to perform in unassisted environments.',
      sourceUrl: 'https://link.springer.com/article/10.1007/s10639-024-12800-x',
      patternDescription: 'Substituting fundamental cognitive practice with GAI output, producing performance without underlying competence.',
      warningSigns: [
        'Student inability to explain rationale behind GAI-generated text',
        'Absence of scaffolded AI literacy in introductory courses',
        'Over-reliance on automated summaries over primary source reading'
      ],
      mitigations: [
        'Mandated "human-only responsibility" zones in foundational courses',
        'Explicit instruction in epistemic judgment and source verification'
      ],
      dateReported: '2024-11-05'
    },
    {
      id: 'rf-05',
      title: 'Vendor Lock-In & Unsanctioned Student Data Mining',
      category: 'vendor_lock_in',
      institutionOrContext: 'Mid-Sized Private University Procurement',
      caseSummary: 'A university signed an exclusive contract with an GAI vendor, only to discover later that the contract granted the vendor perpetual rights to train proprietary models on student research papers and thesis submissions without explicit opt-in consent.',
      sourceUrl: 'https://www.eff.org/deeplinks/student-privacy-ai-contracts',
      patternDescription: 'Opaque vendor terms that turn institutional and student intellectual property into training data.',
      warningSigns: [
        'Contract lacks explicit data prohibition clauses for AI model training',
        'No exit strategy or data portability protocol',
        'Vendor refuses third-party security and privacy audits'
      ],
      mitigations: [
        'Enforce Overlay Pack data sovereignty requirements during procurement',
        'Require institutional legal review against Compass Principle XXVI'
      ],
      dateReported: '2025-06-18'
    }
  ];

  pulseSurveys: PulseSurveyResponse[] = [
    {
      id: 'pulse-1',
      tenantId: 'inst-1',
      role: 'faculty',
      disciplineOrProgram: 'Department of English',
      aiUsageFrequency: 'weekly',
      primaryToolsUsed: ['ChatGPT', 'Claude', 'Grammarly AI'],
      perceivedAcademicValue: 3,
      perceivedIntegrityRisk: 5,
      comments: 'Students are turning in flawless, generic essays that lack any personal voice. Traditional take-home paper prompt is broken.',
      createdAt: '2026-08-01T14:00:00Z'
    },
    {
      id: 'pulse-2',
      tenantId: 'inst-1',
      role: 'student',
      disciplineOrProgram: 'School of Business',
      aiUsageFrequency: 'daily',
      primaryToolsUsed: ['ChatGPT', 'Perplexity'],
      perceivedAcademicValue: 4,
      perceivedIntegrityRisk: 2,
      comments: 'I use GAI to explain complex finance formulas. However, professors have conflicting policies — some ban it completely while others require it.',
      createdAt: '2026-08-03T16:20:00Z'
    }
  ];

  shadowAiReports: ShadowAiReport[] = [
    {
      id: 'sh-1',
      tenantId: 'inst-1',
      reportedByRole: 'faculty',
      departmentOrCourse: 'Biology 101 - Introductory Life Sciences',
      toolOrUseName: 'Unapproved AI Grading Browser Extension',
      description: 'A teaching assistant was found using a browser extension to auto-generate lab report grades and comments without reviewing student data.',
      perceivedRiskType: 'unapproved_grading',
      status: 'flagged',
      actionTaken: 'Escalated to Department Chair; human-in-the-loop review initiated.',
      createdAt: '2026-08-04T11:15:00Z'
    },
    {
      id: 'sh-2',
      tenantId: 'inst-1',
      reportedByRole: 'student',
      departmentOrCourse: 'Computer Science Department',
      toolOrUseName: 'Third-Party AI Flashcard & Exam Prep Bot',
      description: 'Course exam questions and student quiz submissions were uploaded to a public AI flashcard generator that indexed proprietary course materials.',
      perceivedRiskType: 'student_data_leak',
      status: 'under_review',
      actionTaken: 'ITS Security evaluating domain block and student warning bulletin.',
      createdAt: '2026-08-06T09:30:00Z'
    }
  ];

  jobStatuses: JobExecutionStatus[] = [
    {
      jobId: 'evidence_refresh',
      jobName: 'Evidence Ledger Watchlist Refresh',
      autonomyLevel: 'semi_automated',
      lastRunAt: '2026-08-07T04:00:00Z',
      nextRunDueAt: '2026-08-14T04:00:00Z',
      itemsProcessed: 12,
      status: 'idle',
      lastResultSummary: 'Processed 12 source feeds (EDUCAUSE, UNESCO, THE, Retraction Watch). Created 2 candidates in Evidence Staging for human review.'
    },
    {
      jobId: 'prediction_reconciliation',
      jobName: 'Prediction Tracker Daily Reconciliation',
      autonomyLevel: 'fully_automated',
      lastRunAt: '2026-08-08T02:00:00Z',
      nextRunDueAt: '2026-08-09T02:00:00Z',
      itemsProcessed: 5,
      status: 'idle',
      lastResultSummary: 'Checked 5 active predictions. 1 prediction (pred-101) past target date; notification dispatched to author for resolution entry.'
    },
    {
      jobId: 'red_flag_scan',
      jobName: 'Red-Flag Library Candidate Scan',
      autonomyLevel: 'semi_automated',
      lastRunAt: '2026-08-01T00:00:00Z',
      nextRunDueAt: '2026-09-01T00:00:00Z',
      itemsProcessed: 8,
      status: 'idle',
      lastResultSummary: 'Scanned legal/educational failure report feeds. 0 new red-flag candidates drafted.'
    }
  ];

  // Helper getters and mutation methods with strict business rules
  getInstitution(id: string): Institution | undefined {
    return this.institutions.find(i => i.id === id);
  }

  updateInstitution(updated: Institution): Institution {
    const idx = this.institutions.findIndex(i => i.id === updated.id);
    if (idx >= 0) {
      this.institutions[idx] = { ...updated, updatedAt: new Date().toISOString() };
      return this.institutions[idx];
    }
    this.institutions.push(updated);
    return updated;
  }

  getClaims(tenantId: string): EvidenceClaim[] {
    return this.evidenceClaims.filter(c => c.tenantId === tenantId);
  }

  addClaim(claim: Omit<EvidenceClaim, 'id' | 'dateAdded'>): EvidenceClaim {
    if (!claim.sourceUrl || claim.sourceUrl.trim() === '') {
      throw new Error('EVIDENCE_LEDGER_CONSTRAINT_VIOLATION: Factual claims require a valid source_url.');
    }
    const newClaim: EvidenceClaim = {
      ...claim,
      id: `claim-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    this.evidenceClaims.unshift(newClaim);
    return newClaim;
  }

  getDecisions(tenantId: string): DecisionRecord[] {
    return this.decisions.filter(d => d.tenantId === tenantId);
  }

  addDecision(decision: Omit<DecisionRecord, 'id' | 'createdAt' | 'updatedAt'>): DecisionRecord {
    const newDec: DecisionRecord = {
      ...decision,
      id: `dec-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.decisions.unshift(newDec);
    return newDec;
  }

  updateDecisionDisposition(
    id: string,
    disposition: 'pending' | 'accepted' | 'rejected' | 'modified',
    notes: string,
    setBy: string
  ): DecisionRecord {
    const dec = this.decisions.find(d => d.id === id);
    if (!dec) throw new Error('Decision not found');

    dec.humanDisposition = disposition;
    dec.dispositionNotes = notes;
    dec.dispositionSetBy = setBy;
    dec.dispositionSetAt = new Date().toISOString();
    dec.updatedAt = new Date().toISOString();

    return dec;
  }

  updateDecisionStatus(id: string, newStatus: DecisionRecord['implementationStatus']): DecisionRecord {
    const dec = this.decisions.find(d => d.id === id);
    if (!dec) throw new Error('Decision not found');

    // Rule 1: Cannot mark implemented if human_disposition is null or pending
    if (newStatus === 'implemented' && (!dec.humanDisposition || dec.humanDisposition === 'pending')) {
      throw new Error('GOVERNANCE_GUARDRAIL_VIOLATION: Every recommendation requires an explicit human disposition (accepted/rejected/modified) set by a human user before implementation.');
    }

    // Rule 2: Dual Academic + Administrative Governance Signoff requirement
    if (newStatus === 'implemented' && dec.touchesEnrollmentOrGrading) {
      const academicApproved = dec.academicSignoff?.status === 'approved';
      const adminApproved = dec.administrativeSignoff?.status === 'approved';

      if (!academicApproved || !adminApproved) {
        const academicBody = dec.academicSignoff?.bodyName || 'Faculty Senate / Scientific Council';
        const adminBody = dec.administrativeSignoff?.bodyName || 'Office of the Provost';
        throw new Error(`DUAL_GOVERNANCE_VIOLATION: Section II & XIV mandate dual-signature approval. Implementation blocked until affirmative authorization is signed by BOTH the Academic Body (${academicBody}) and Administrative Leadership (${adminBody}). Current status: Academic: ${dec.academicSignoff?.status || 'unsubmitted'}, Admin: ${dec.administrativeSignoff?.status || 'unsubmitted'}.`);
      }
    }

    // Rule 3: Hardcoded human approval gate for grading/enrollment decisions
    if (newStatus === 'implemented' && dec.touchesEnrollmentOrGrading && !dec.humanApprovalGatePassed) {
      throw new Error('CRITICAL_SAFETY_GATE_VIOLATION: Any workflow touching enrollment status, grading, or degree progress has a hard-coded human-approval gate that cannot be bypassed.');
    }

    dec.implementationStatus = newStatus;
    dec.updatedAt = new Date().toISOString();
    return dec;
  }

  recordGovernanceSignoff(
    decisionId: string,
    signoffType: 'academic' | 'administrative',
    status: 'approved' | 'rejected' | 'pending' | 'conditional',
    resolutionNotes: string,
    signedBy: string
  ): DecisionRecord {
    const dec = this.decisions.find(d => d.id === decisionId);
    if (!dec) throw new Error('Decision not found');
    const inst = this.getInstitution(dec.tenantId) || this.institutions[0];

    const bodyName = signoffType === 'academic'
      ? inst.academicGovernanceBodyName
      : inst.provostOfficeName;

    const signoffRecord = {
      signoffType,
      bodyName,
      signedBy: signedBy || (signoffType === 'academic' ? 'Faculty Governance Presiding Officer' : 'Chief Academic Officer'),
      signedAt: new Date().toISOString(),
      status,
      resolutionNotes
    };

    if (signoffType === 'academic') {
      dec.academicSignoff = signoffRecord;
    } else {
      dec.administrativeSignoff = signoffRecord;
    }

    // Auto-update humanApprovalGatePassed if both approved
    if (dec.academicSignoff?.status === 'approved' && dec.administrativeSignoff?.status === 'approved') {
      dec.humanApprovalGatePassed = true;
    } else {
      dec.humanApprovalGatePassed = false;
    }

    dec.updatedAt = new Date().toISOString();
    return dec;
  }

  setHumanApprovalGate(id: string, passed: boolean): DecisionRecord {
    const dec = this.decisions.find(d => d.id === id);
    if (!dec) throw new Error('Decision not found');
    dec.humanApprovalGatePassed = passed;
    dec.updatedAt = new Date().toISOString();
    return dec;
  }

  getScenariosForDecision(decisionId: string): ScenarioEntry[] {
    return this.scenarios.filter(s => s.decisionId === decisionId);
  }

  addScenarios(newScenarios: Omit<ScenarioEntry, 'id'>[]): ScenarioEntry[] {
    const added: ScenarioEntry[] = newScenarios.map((s, idx) => ({
      ...s,
      id: `scen-${Date.now()}-${idx}`
    }));
    this.scenarios.push(...added);
    return added;
  }

  getStakeholdersForDecision(decisionId: string): StakeholderImpact[] {
    return this.stakeholderImpacts.filter(s => s.decisionId === decisionId);
  }

  getPredictions(tenantId: string): PredictionRecord[] {
    return this.predictions.filter(p => p.tenantId === tenantId);
  }

  addPrediction(pred: Omit<PredictionRecord, 'id' | 'dateMade'>): PredictionRecord {
    const newPred: PredictionRecord = {
      ...pred,
      id: `pred-${Date.now()}`,
      dateMade: new Date().toISOString().split('T')[0]
    };
    this.predictions.unshift(newPred);
    return newPred;
  }

  resolvePrediction(id: string, resolutionStatus: PredictionRecord['resolutionStatus'], actualOutcome: string, lessonsLearned: string): PredictionRecord {
    const pred = this.predictions.find(p => p.id === id);
    if (!pred) throw new Error('Prediction not found');
    pred.resolutionStatus = resolutionStatus;
    pred.actualOutcome = actualOutcome;
    pred.lessonsLearned = lessonsLearned;
    return pred;
  }

  getRedFlags(): RedFlagCase[] {
    return this.redFlags;
  }

  addPulseSurvey(pulse: Omit<PulseSurveyResponse, 'id' | 'createdAt'>): PulseSurveyResponse {
    const newPulse: PulseSurveyResponse = {
      ...pulse,
      id: `pulse-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.pulseSurveys.unshift(newPulse);
    return newPulse;
  }

  addShadowAiReport(report: Omit<ShadowAiReport, 'id' | 'createdAt' | 'status'>): ShadowAiReport {
    const newRep: ShadowAiReport = {
      ...report,
      id: `sh-${Date.now()}`,
      status: 'flagged',
      createdAt: new Date().toISOString()
    };
    this.shadowAiReports.unshift(newRep);
    return newRep;
  }

  approveStagingEvidence(stagingId: string, reviewer: string): EvidenceClaim {
    const item = this.evidenceStaging.find(s => s.id === stagingId);
    if (!item) throw new Error('Staging item not found');
    item.status = 'approved';
    item.reviewedBy = reviewer;
    item.reviewedAt = new Date().toISOString();

    return this.addClaim({
      tenantId: item.tenantId,
      claimText: item.claimText,
      sourceUrl: item.sourceUrl,
      sourceName: item.sourceName,
      confidenceTier: item.confidenceTier,
      datePublished: item.datePublished,
      retractionStatus: 'active',
      tags: ['staging_approved', 'automated_refresh']
    });
  }

  rejectStagingEvidence(stagingId: string, reason: string, reviewer: string) {
    const item = this.evidenceStaging.find(s => s.id === stagingId);
    if (!item) throw new Error('Staging item not found');
    item.status = 'rejected';
    item.rejectionReason = reason;
    item.reviewedBy = reviewer;
    item.reviewedAt = new Date().toISOString();
  }

  // 32-Item Institutional Diagnostic Checklist (Section VI)
  diagnosticItems: Record<string, { id: string; name: string; category: string; isAvailable: boolean; notes?: string; dataReference?: string }[]> = {
    'inst-1': [
      { id: 'diag-1', name: 'Mission Statements', category: 'governance_finance', isAvailable: true, notes: 'Board approved 2024 mission statement on record.' },
      { id: 'diag-2', name: 'Strategic Plans', category: 'governance_finance', isAvailable: true, notes: 'Vision 2030 Strategic Roadmap on file.' },
      { id: 'diag-3', name: 'Academic Catalogs', category: 'academic', isAvailable: true, notes: '2025-2026 Undergraduate & Graduate Catalogs.' },
      { id: 'diag-4', name: 'Curricula & Learning Outcomes', category: 'academic', isAvailable: true, notes: 'Departmental syllabus repository indexed.' },
      { id: 'diag-5', name: 'Program Inventories', category: 'academic', isAvailable: true, notes: 'Complete list of 84 degree programs.' },
      { id: 'diag-6', name: 'Enrollment Data & Trends', category: 'students', isAvailable: true, notes: 'Fall 2025 census data integrated (28,500 students).' },
      { id: 'diag-7', name: 'Retention & Completion Data', category: 'students', isAvailable: true, notes: '6-year graduation rate: 68%; 1st-year retention: 84%.' },
      { id: 'diag-8', name: 'Faculty Profiles & Tenured Ratios', category: 'faculty', isAvailable: true, notes: '1,240 total instructional faculty (58% tenure/tenure-track, 42% contingent).' },
      { id: 'diag-9', name: 'Staffing Structures & Workloads', category: 'faculty', isAvailable: true, notes: 'HR workload audit 2025.' },
      { id: 'diag-10', name: 'Research Portfolios & Outputs', category: 'research', isAvailable: true, notes: 'Annual sponsored research expenditures: $340M.' },
      { id: 'diag-11', name: 'Research Strategies & Priorities', category: 'research', isAvailable: true, notes: 'Interdisciplinary clean energy & bio-health priorities.' },
      { id: 'diag-12', name: 'Budgets & Financial Constraints', category: 'governance_finance', isAvailable: true, notes: 'FY2026 Operating budget $680M.' },
      { id: 'diag-13', name: 'Facilities & Campus Footprint', category: 'governance_finance', isAvailable: true, notes: 'Main campus + 2 regional research facilities.' },
      { id: 'diag-14', name: 'Infrastructure & Tech Systems', category: 'governance_finance', isAvailable: true, notes: 'Core data center, AWS GovCloud, Canvas LMS.' },
      { id: 'diag-15', name: 'Technology Architectures & LMS', category: 'governance_finance', isAvailable: false, notes: 'LMS AI plug-in security audit pending completion.' },
      { id: 'diag-16', name: 'Governance Structures & Charters', category: 'governance_finance', isAvailable: true, notes: 'University Senate constitution on record.' },
      { id: 'diag-17', name: 'Faculty Governance Documents & Senate', category: 'faculty', isAvailable: true, notes: 'Faculty senate resolutions on AI in curriculum.' },
      { id: 'diag-18', name: 'Student-Support Structures', category: 'students', isAvailable: true, notes: 'Student success center, academic coaching, wellness center.' },
      { id: 'diag-19', name: 'Advising Systems & Workflows', category: 'students', isAvailable: true, notes: 'Centralized CRM advising portal.' },
      { id: 'diag-20', name: 'Accreditation Requirements & Standards', category: 'legal_accreditation', isAvailable: true, notes: 'SACSCOC Substantive change guidelines.' },
      { id: 'diag-21', name: 'Institutional Policies & Handbooks', category: 'legal_accreditation', isAvailable: true, notes: 'Faculty handbook rev. 2025.' },
      { id: 'diag-22', name: 'AI Policies & Guidelines', category: 'legal_accreditation', isAvailable: true, notes: 'Interim policy on generative AI use in coursework.' },
      { id: 'diag-23', name: 'Collective Bargaining Agreements', category: 'faculty', isAvailable: false, notes: 'Adjunct union contract renegotiation in progress.' },
      { id: 'diag-24', name: 'Assessment & Grading Practices', category: 'academic', isAvailable: true, notes: 'Institutional assessment rubric library.' },
      { id: 'diag-25', name: 'Admissions Practices & Criteria', category: 'students', isAvailable: true, notes: 'Holistic review protocol with banned automated cuts.' },
      { id: 'diag-26', name: 'Student Demographic Breakdown', category: 'students', isAvailable: true, notes: 'Pell 38%, First-Gen 31%, Underrep. 42%.' },
      { id: 'diag-27', name: 'Institutional Research Reports', category: 'research', isAvailable: true, notes: 'Annual Factbook 2025.' },
      { id: 'diag-28', name: 'Board of Trustees / Regents Decisions', category: 'governance_finance', isAvailable: true, notes: 'Minutes from June 2026 meeting.' },
      { id: 'diag-29', name: 'Prior Strategic Initiatives & Audits', category: 'governance_finance', isAvailable: true, notes: 'Digital transformation audit 2024.' },
      { id: 'diag-30', name: 'Relevant White Papers & Taskforce Reports', category: 'academic', isAvailable: false, notes: 'Provost taskforce report on AI in the humanities delayed.' },
      { id: 'diag-31', name: 'Institutional Histories & Traditions', category: 'academic', isAvailable: true, notes: 'Centennial foundation records (1926-2026).' },
      { id: 'diag-32', name: 'Community Relationships & Civic Compacts', category: 'governance_finance', isAvailable: false, notes: 'Urban community anchor partnership agreement pending renewal.' }
    ]
  };

  getDiagnosticsForTenant(tenantId: string) {
    if (!this.diagnosticItems[tenantId]) {
      // Default to cloned inst-1 checklist
      this.diagnosticItems[tenantId] = this.diagnosticItems['inst-1'].map(item => ({ ...item }));
    }
    return this.diagnosticItems[tenantId];
  }

  toggleDiagnosticAvailability(tenantId: string, diagId: string, isAvailable: boolean, notes?: string) {
    const list = this.getDiagnosticsForTenant(tenantId);
    const item = list.find(d => d.id === diagId);
    if (!item) throw new Error('Diagnostic item not found');
    item.isAvailable = isAvailable;
    if (notes !== undefined) item.notes = notes;
    return item;
  }

  runJob(jobId: 'evidence_refresh' | 'prediction_reconciliation' | 'red_flag_scan'): JobExecutionStatus {
    const job = this.jobStatuses.find(j => j.jobId === jobId);
    if (!job) throw new Error('Job not found');

    job.status = 'running';
    const now = new Date();

    if (jobId === 'evidence_refresh') {
      const newStaging: EvidenceStagingItem = {
        id: `stage-${Date.now()}`,
        tenantId: 'inst-1',
        claimText: `Automated Scan (${now.toLocaleDateString()}): New EDUCAUSE briefing notes 76% of CIOs prioritizing AI ethics reviews over automated Proctoring tools.`,
        sourceUrl: 'https://library.educause.edu/resources/2026/1/ai-horizon-report',
        sourceName: 'EDUCAUSE Horizon Watch 2026',
        confidenceTier: 'journalistic',
        datePublished: now.toISOString().split('T')[0],
        discoveredAt: now.toISOString(),
        status: 'pending_review'
      };
      this.evidenceStaging.unshift(newStaging);
      job.itemsProcessed += 1;
      job.lastResultSummary = `Scanned watchlist domains. Inserted 1 candidate entry into Evidence Staging. Human approval required before live ledger entry.`;
    } else if (jobId === 'prediction_reconciliation') {
      const pastDue = this.predictions.filter(p => p.resolutionStatus === 'pending' && new Date(p.targetDate) <= now);
      job.itemsProcessed = pastDue.length;
      job.lastResultSummary = `Reconciliation completed. Found ${pastDue.length} past-due predictions requiring user resolution. Dispatched notification logs.`;
    } else if (jobId === 'red_flag_scan') {
      job.itemsProcessed = 1;
      job.lastResultSummary = `Scanned international academic governance feeds. Zero critical red-flag breaches found in past 30 days.`;
    }

    job.lastRunAt = now.toISOString();
    job.nextRunDueAt = new Date(now.getTime() + 86400000 * 7).toISOString();
    job.status = 'idle';

    return job;
  }
}

export const db = new RelationalDatabase();
