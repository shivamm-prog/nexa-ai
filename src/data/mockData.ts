import { InvestigationData, Source, Claim, Agreement, Disagreement, ExploreNextItem } from '../types';

export const AI_EDUCATION_SOURCES: Source[] = [
  {
    id: 'src-1',
    title: 'AI-Assisted Learning in Higher Education: Longitudinal Cognitive Outcomes',
    type: 'Research Paper',
    year: 2024,
    authors: 'Dr. Sarah Chen, Dr. Arthur Miller, Dr. Rajiv Gupta',
    publisher: 'Journal of Educational Computing Research',
    relevance: 96,
    stance: 'Supports',
    summary: 'A 2-year longitudinal study across 4,200 undergraduates assessing how prompt-based scaffolding correlates with formative concept acquisition in introductory STEM courses.',
    keyQuote: 'Students utilizing guided AI scaffolding demonstrated a 27% acceleration in formative mastery benchmarks compared to baseline peer cohorts.',
    evidenceSnippet: 'Statistically significant performance gains (p < 0.001) were documented in continuous feedback scenarios when AI intervention was capped at step-by-step guidance rather than full solution generation.',
    methodology: 'Randomized controlled trial with pre/post testing and eye-tracking attention metrics.',
    sampleSize: 'n = 4,210 undergraduates across 6 universities',
    doi: '10.1177/0735633124108891',
    url: 'https://doi.org/10.1177/0735633124108891',
    claimIds: ['clm-1', 'clm-4', 'clm-5'],
    insightsUsedCount: 3
  },
  {
    id: 'src-2',
    title: 'The Automation of Inquiry: Epistemic Risks of Generative LLMs in Undergraduate Research',
    type: 'Academic Article',
    year: 2023,
    authors: 'Prof. Marcus Vance, Dr. Evelyn Sterling',
    publisher: 'Oxford Review of Education',
    relevance: 92,
    stance: 'Critical',
    summary: 'Philosophical and behavioral inquiry examining how generative synthesis removes the "productive struggle" required for deep hypothesis construction and epistemic verification.',
    keyQuote: 'When search and synthesis become instantaneous and friction-free, students systematically bypass the critical epistemic discomfort that develops genuine intellectual autonomy.',
    evidenceSnippet: 'Qualitative analysis of 350 student research journals revealed a 41% decrease in self-initiated source verification when an AI-generated summary was accepted as ground truth.',
    methodology: 'Mixed-method qualitative coding of research journals and structured epistemic interviews.',
    sampleSize: 'n = 350 senior thesis candidates',
    doi: '10.1080/03054985.2023.2214502',
    url: 'https://doi.org/10.1080/03054985.2023.2214502',
    claimIds: ['clm-3', 'clm-5', 'clm-8'],
    insightsUsedCount: 4
  },
  {
    id: 'src-3',
    title: 'National Blueprint for Artificial Intelligence in Educational Infrastructure',
    type: 'Government Report',
    year: 2024,
    authors: 'Office of Educational Technology',
    publisher: 'U.S. Department of Education',
    relevance: 94,
    stance: 'Mixed',
    summary: 'Comprehensive federal policy framework balancing instructional personalization with data privacy, algorithmic accountability, and educator-in-the-loop governance.',
    keyQuote: 'AI models must remain assistive instruments subordinated to teacher pedagogy rather than autonomous instructional decision-makers.',
    evidenceSnippet: 'Analysis across 48 state education boards identified severe disparities in teacher readiness, with only 14% of districts providing formal guidelines on AI attribution.',
    methodology: 'National policy audit, stakeholder hearings, and federal district survey.',
    sampleSize: '50 state agencies & 1,120 school districts',
    doi: 'gov.ed.tech/blueprint-2024-ai',
    url: 'https://tech.ed.gov/ai-policy-blueprint',
    claimIds: ['clm-1', 'clm-5', 'clm-9'],
    insightsUsedCount: 3
  },
  {
    id: 'src-4',
    title: 'Adaptive Scaffolding and Mastery Learning: Evaluating Enterprise AI Tutors in K-12 STEM',
    type: 'Industry Report',
    year: 2024,
    authors: 'Global EdTech Consortium & Cognitive Labs',
    publisher: 'EdTech Science Review',
    relevance: 88,
    stance: 'Supports',
    summary: 'Large-scale empirical assessment of automated intelligent tutoring systems operating in middle-school and high-school algebra curriculums.',
    keyQuote: 'Real-time adaptive hints tailored to diagnostic error misconceptions reduced student drop-off in self-paced homework modules by 34%.',
    evidenceSnippet: 'Log-file analysis of 1.2 million interaction sessions demonstrated sustained learning gains when hint generation enforced gradual cognitive escalation rather than answer disclosure.',
    methodology: 'Telemetry data analysis of multi-platform learner interaction trajectories.',
    sampleSize: 'n = 85,000 active student accounts',
    doi: '10.5281/zenodo.892014',
    url: 'https://edtechscience.org/reports/2024-scaffolding',
    claimIds: ['clm-1', 'clm-4', 'clm-7'],
    insightsUsedCount: 2
  },
  {
    id: 'src-5',
    title: 'Algorithmic Inequity and Bias in Proctoring Systems: An Audit Across Diverse Student Demographics',
    type: 'Research Paper',
    year: 2023,
    authors: 'Dr. Elena Rostova, Dr. Kevin Patel, Dr. Amara Diallo',
    publisher: 'ACM Conference on Fairness, Accountability, and Transparency (FAccT)',
    relevance: 91,
    stance: 'Critical',
    summary: 'Empirical benchmark evaluating facial recognition and gaze-tracking algorithms in remote examination environments across varied skin tones and non-native accents.',
    keyQuote: 'Computer vision proctoring systems demonstrated an 18.4% higher false-positive rate for gaze anomalies when testing non-native speakers and darker skin tones.',
    evidenceSnippet: 'Controlled audit across 5 commercial proctoring SDKs showed systemic misclassification of ambient domestic noise and normative cultural eye-gaze patterns as academic dishonesty.',
    methodology: 'Algorithmic bias audit with standardized synthetic and empirical student test video datasets.',
    sampleSize: 'n = 1,400 benchmark video validation hours',
    doi: '10.1145/3593013.3594021',
    url: 'https://doi.org/10.1145/3593013.3594021',
    claimIds: ['clm-6', 'clm-9', 'clm-10'],
    insightsUsedCount: 3
  },
  {
    id: 'src-6',
    title: 'Generative AI and the Transformation of Teacher Workload: Administrative Relief vs Curricular Burden',
    type: 'Academic Article',
    year: 2024,
    authors: 'Dr. Linda Zhao, Prof. Henrik Lindqvist',
    publisher: 'British Journal of Educational Technology',
    relevance: 85,
    stance: 'Supports',
    summary: 'Field evaluation of generative rubric drafting, lesson plan generation, and automated assignment parsing among secondary school faculty.',
    keyQuote: 'Teachers utilizing automated draft synthesis reclaimed an average of 4.8 hours per week from administrative grading, reallocating 62% of that time to direct 1-on-1 student advisory.',
    evidenceSnippet: 'Time-diary tracking across 280 educators demonstrated high satisfaction in rubric construction, though 78% noted that verifying AI-generated factual content requires continued vigil.',
    methodology: 'Time-motion diary study and quarterly burnout psychometric index evaluation.',
    sampleSize: 'n = 280 certified secondary school educators',
    doi: '10.1111/bjet.13420',
    url: 'https://doi.org/10.1111/bjet.13420',
    claimIds: ['clm-5', 'clm-7'],
    insightsUsedCount: 2
  },
  {
    id: 'src-7',
    title: 'From Chalkboards to Neural Nets: How Multi-Modal AI is Democratizing Access for Neurodiverse Learners',
    type: 'News Article',
    year: 2024,
    authors: 'Jonathan Harris, Tech & Society Bureau',
    publisher: 'MIT Technology Review',
    relevance: 87,
    stance: 'Supports',
    summary: 'In-depth investigative report into specialized multi-modal models providing dyslexia-friendly text dynamic reformatting, sensory pacing, and real-time conceptual analogies.',
    keyQuote: 'For students with severe executive function challenges, multimodal AI agents act as cognitive prosthetics, translating dense academic prose into modular visual storyboards.',
    evidenceSnippet: 'Case studies documented across 14 inclusive education labs showed reading comprehension scores improved by 31% when learners could query text through dynamic audio-visual summaries.',
    methodology: 'Investigative journalistic reporting, expert interviews, and classroom observational audits.',
    sampleSize: '14 inclusive learning centers, 42 clinical interviews',
    doi: 'news.mit.edu/2024/multimodal-ai-neurodiverse-0312',
    url: 'https://www.technologyreview.com/2024/03/12/multimodal-ai-neurodiverse',
    claimIds: ['clm-2', 'clm-11'],
    insightsUsedCount: 2
  },
  {
    id: 'src-8',
    title: 'Evaluating Critical Thinking Degradation in Prompt-Based Learning Environments',
    type: 'Research Paper',
    year: 2024,
    authors: 'Dr. Katherine Bell, Dr. Tariq Mansour',
    publisher: 'Cognitive Science Society Proceedings',
    relevance: 95,
    stance: 'Critical',
    summary: 'Psychological trial testing the hypothesis of "cognitive offloading" in computer science and philosophy students relying on LLM code generation and essay outlines.',
    keyQuote: 'Students exposed to instant AI solution generation demonstrated statistically weaker conceptual recall and an inability to debug non-trivial architectural edge cases without the model.',
    evidenceSnippet: 'Delayed unassisted testing at 30 days post-intervention revealed a 38% deficit in autonomous problem-solving performance among high-AI reliance cohorts versus control groups.',
    methodology: 'Pre/post-test experimental control trial with delayed 30-day unassisted recall testing.',
    sampleSize: 'n = 640 engineering & humanities students',
    doi: '10.31234/osf.io/cogsci.2024.8821',
    url: 'https://doi.org/10.31234/osf.io/cogsci.2024.8821',
    claimIds: ['clm-3', 'clm-8', 'clm-12'],
    insightsUsedCount: 4
  }
];

export const AI_EDUCATION_CLAIMS: Claim[] = [
  {
    id: 'clm-1',
    text: 'AI can improve personalized learning through adaptive pacing and immediate formative feedback.',
    category: 'Personalized Learning',
    status: 'Supported',
    supportingSourceIds: ['src-1', 'src-3', 'src-4', 'src-6', 'src-7'],
    opposingSourceIds: [],
    evidenceSummary: '5 analyzed sources across research papers, government reports, and industry pilots confirm that adaptive algorithms accelerate student mastery when configured for iterative scaffolding.',
    explanation: 'Evidence suggests learners benefit from micro-interventions that adjust difficulty according to diagnosed conceptual bottlenecks, reducing frustration and idle waiting periods.',
    keyQuotes: [
      {
        sourceId: 'src-1',
        quote: 'Students utilizing guided AI scaffolding demonstrated a 27% acceleration in formative mastery benchmarks.',
        stance: 'Supports'
      },
      {
        sourceId: 'src-4',
        quote: 'Real-time adaptive hints tailored to diagnostic error misconceptions reduced student drop-off in self-paced modules by 34%.',
        stance: 'Supports'
      }
    ],
    whyAmISeeingThis: 'All 5 sources measuring concept acquisition speed reached congruent positive outcomes. No analyzed source refuted the immediate formative acceleration effect.'
  },
  {
    id: 'clm-2',
    text: 'AI improves accessibility for neurodivergent and differently-abled learners through multimodal adaptations.',
    category: 'Accessibility & Equity',
    status: 'Supported',
    supportingSourceIds: ['src-3', 'src-7'],
    opposingSourceIds: [],
    evidenceSummary: 'Empirical cases show multimodal models provide on-demand simplification, audio description, and structured visual scaffolding that benefit ADHD, dyslexic, and ESL learners.',
    explanation: 'Dynamic reformatting of dense instructional material into audio, executive-functioning checklists, or visual mindmaps removes sensory friction.',
    keyQuotes: [
      {
        sourceId: 'src-7',
        quote: 'Multimodal AI agents act as cognitive prosthetics, translating dense academic prose into modular visual storyboards.',
        stance: 'Supports'
      }
    ],
    whyAmISeeingThis: 'Sources evaluating inclusive learning environments highlight consistent accessibility advantages for sensory and neurodivergent adaptations.'
  },
  {
    id: 'clm-3',
    text: 'Over-reliance on generative AI prompts may reduce independent problem-solving and critical enquiry.',
    category: 'Cognitive Impact',
    status: 'Mixed',
    supportingSourceIds: ['src-2', 'src-8'],
    opposingSourceIds: ['src-1', 'src-4'],
    evidenceSummary: 'Cognitive science studies show significant 30-day recall deficits when AI is used for solution delivery, whereas instructional tech studies argue scaffolding preserves enquiry if constrained.',
    explanation: 'The disagreement hinges on whether the AI delivers the answer immediately (causing cognitive offloading) or provides Socratic guiding questions (which can maintain student engagement).',
    keyQuotes: [
      {
        sourceId: 'src-2',
        quote: 'Students systematically bypass the critical epistemic discomfort that develops genuine intellectual autonomy.',
        stance: 'Critical'
      },
      {
        sourceId: 'src-1',
        quote: 'Gains were documented when AI intervention was capped at step-by-step guidance rather than full solution generation.',
        stance: 'Supports'
      }
    ],
    whyAmISeeingThis: 'Sources evaluate fundamentally different software configurations: unconstrained chatbot outputs vs bounded pedagogical tutors with Socratic constraints.'
  },
  {
    id: 'clm-4',
    text: 'AI-assisted feedback significantly improves student academic productivity and draft revision velocity.',
    category: 'Productivity & Writing',
    status: 'Supported',
    supportingSourceIds: ['src-1', 'src-4', 'src-6'],
    opposingSourceIds: [],
    evidenceSummary: 'Across 3 cohorts, students completed structured draft revisions 40% faster and addressed grammatical and syntactic concerns before instructor review.',
    explanation: 'Instant syntax, clarity, and structural feedback shortens the revision loop, allowing students to iterate through several drafts in the time previously required for one.',
    keyQuotes: [
      {
        sourceId: 'src-1',
        quote: 'Statistically significant performance gains were documented in continuous feedback scenarios.',
        stance: 'Supports'
      }
    ],
    whyAmISeeingThis: 'Literature consistently validates iterative feedback speed, while cautioning that productivity metrics must not be conflated with conceptual mastery.'
  },
  {
    id: 'clm-5',
    text: 'Human educator supervision remains indispensable for contextual validation, empathy, and ethical guidance.',
    category: 'Pedagogy & Governance',
    status: 'Supported',
    supportingSourceIds: ['src-1', 'src-2', 'src-3', 'src-6'],
    opposingSourceIds: [],
    evidenceSummary: '100% of examined pedagogical and governmental publications affirm that algorithmic tools must augment, never replace, the empathetic guidance of human educators.',
    explanation: 'AI lacks situational judgment, emotional attunement, ethical nuance, and contextual knowledge of student life conditions. Human mentors anchor academic integrity and well-being.',
    keyQuotes: [
      {
        sourceId: 'src-3',
        quote: 'AI models must remain assistive instruments subordinated to teacher pedagogy rather than autonomous instructional decision-makers.',
        stance: 'Supports'
      }
    ],
    whyAmISeeingThis: 'Strong consensus across academic, policy, and research domains. No source advocates for autonomous AI instruction devoid of educator oversight.'
  },
  {
    id: 'clm-6',
    text: 'Commercial AI proctoring and detection tools exhibit disproportionate false-positive error rates for non-native English speakers.',
    category: 'Ethics & Equity',
    status: 'Disputed',
    supportingSourceIds: ['src-5'],
    opposingSourceIds: ['src-3'],
    evidenceSummary: 'Audits reveal an 18.4% elevation in acoustic/gaze anomaly flags for diverse demographics, while federal and vendor briefs argue recent model recalibrations resolve baseline discrepancies.',
    explanation: 'Independent algorithmic auditing teams demonstrate persistent acoustic and facial landmark biases in domestic environments, whereas vendor benchmarks report controlled lab parity.',
    keyQuotes: [
      {
        sourceId: 'src-5',
        quote: 'Computer vision proctoring systems demonstrated an 18.4% higher false-positive rate for gaze anomalies when testing non-native speakers.',
        stance: 'Critical'
      },
      {
        sourceId: 'src-3',
        quote: 'Federal blueprints emphasize emerging NIST standards to minimize demographic disparity in automated evaluation.',
        stance: 'Mixed'
      }
    ],
    whyAmISeeingThis: 'Methodological split: Vendor lab evaluations claim high accuracy under optimal conditions, while independent academic audits expose failure modes in real-world messy environments.'
  },
  {
    id: 'clm-7',
    text: 'Generative AI lowers educator administrative burden, allowing more individual student mentoring time.',
    category: 'Educator Workload',
    status: 'Supported',
    supportingSourceIds: ['src-4', 'src-6'],
    opposingSourceIds: [],
    evidenceSummary: 'Teachers using automated rubric assistance reclaimed nearly 5 hours weekly, reallocating the majority toward one-on-one student discussions.',
    explanation: 'Automating repetitive administrative drafting (lesson plan variations, initial rubric alignment, multiple-choice quiz stems) unlocks vital high-touch mentoring capacity.',
    keyQuotes: [
      {
        sourceId: 'src-6',
        quote: 'Teachers utilizing automated draft synthesis reclaimed an average of 4.8 hours per week from administrative grading.',
        stance: 'Supports'
      }
    ],
    whyAmISeeingThis: 'Both industry pilot data and academic time-motion surveys register positive faculty sentiment on administrative efficiency.'
  },
  {
    id: 'clm-8',
    text: 'Early exposure to AI tutors fosters cognitive complacency in foundational mathematics without structured struggle.',
    category: 'Cognitive Impact',
    status: 'Mixed',
    supportingSourceIds: ['src-2', 'src-8'],
    opposingSourceIds: ['src-4'],
    evidenceSummary: 'Laboratory testing shows students who receive immediate step breakdowns struggle to reconstruct formulas autonomously 30 days later, though adaptive tools claim to regulate step pacing.',
    explanation: 'The pedagogical concept of "productive struggle" is easily bypassed when software provides intermediate hints too eagerly before the student engages their working memory.',
    keyQuotes: [
      {
        sourceId: 'src-8',
        quote: 'Delayed unassisted testing at 30 days revealed a 38% deficit in autonomous problem-solving performance among high-AI reliance cohorts.',
        stance: 'Critical'
      }
    ],
    whyAmISeeingThis: 'Disagreement stems from differing definitions of "success": immediate task completion rates versus delayed unassisted retention.'
  },
  {
    id: 'clm-9',
    text: 'Equitable access to frontier AI models threatens to widen the institutional achievement gap between elite and underfunded colleges.',
    category: 'Accessibility & Equity',
    status: 'Supported',
    supportingSourceIds: ['src-3', 'src-5'],
    opposingSourceIds: [],
    evidenceSummary: 'Subscription-tier frontier models with multimodal reasoning create an asymmetric advantage for students and institutions that can afford enterprise seat licenses.',
    explanation: 'Free tier limitations and hardware compute disparities risk replicating and exacerbating historical digital divides across socio-economic and geographical boundaries.',
    keyQuotes: [
      {
        sourceId: 'src-3',
        quote: 'Disparities in institutional funding dictate whether students access verified enterprise tutors or unvetted ad-supported public models.',
        stance: 'Critical'
      }
    ],
    whyAmISeeingThis: 'Sociological and policy analyses identify capital concentration as an active risk to educational parity.'
  },
  {
    id: 'clm-10',
    text: 'AI-driven automated grading provides objective rubrics that reduce implicit instructor grading bias.',
    category: 'Assessment & Grading',
    status: 'Disputed',
    supportingSourceIds: ['src-4'],
    opposingSourceIds: ['src-2', 'src-5'],
    evidenceSummary: 'Proponents argue automated graders eliminate fatigue and name-based bias, while critics prove LLM graders over-reward verbose academic diction and penalize unconventional thought.',
    explanation: 'Language models often mistake linguistic complexity for cognitive depth, generating an artificial penalty for concise or non-standard stylistic expression.',
    keyQuotes: [
      {
        sourceId: 'src-2',
        quote: 'Automated rubrics disproportionately reward superficial stylistic hallmarks of academic prose while missing authentic epistemic insight.',
        stance: 'Critical'
      }
    ],
    whyAmISeeingThis: 'Direct conflict between computational consistency (reliability) and semantic validity (does the grade measure authentic comprehension?).'
  },
  {
    id: 'clm-11',
    text: 'Multi-lingual real-time AI translation accelerates academic comprehension for international student cohorts.',
    category: 'Accessibility & Equity',
    status: 'Supported',
    supportingSourceIds: ['src-7'],
    opposingSourceIds: [],
    evidenceSummary: 'Bilingual students using real-time conceptual translation show steeper mastery of domain-specific terminology without sacrificing lecture cadence.',
    explanation: 'Lowering the translation latency barrier allows second-language students to allocate working memory toward high-order conceptual reasoning rather than vocabulary decoding.',
    keyQuotes: [
      {
        sourceId: 'src-7',
        quote: 'Reading comprehension scores improved by 31% when learners could query text through dynamic multimodal audio-visual summaries.',
        stance: 'Supports'
      }
    ],
    whyAmISeeingThis: 'Field observations and student interviews demonstrate marked confidence and retention improvements in multilingual cohorts.'
  },
  {
    id: 'clm-12',
    text: 'Prolonged reliance on conversational AI tools reduces retention of foundational domain knowledge compared to retrieval practice.',
    category: 'Cognitive Impact',
    status: 'Mixed',
    supportingSourceIds: ['src-8'],
    opposingSourceIds: ['src-1'],
    evidenceSummary: 'Cognitive psychology trials contrast conversational question-answering with active recall flashcards, observing lower long-term neural consolidation in conversational groups.',
    explanation: 'Conversational reading creates an illusion of competence ("fluency heuristic") where the student feels they understand because the explanation was smooth and coherent.',
    keyQuotes: [
      {
        sourceId: 'src-8',
        quote: 'Students exposed to instant AI solution generation demonstrated statistically weaker conceptual recall.',
        stance: 'Critical'
      }
    ],
    whyAmISeeingThis: 'Research highlights the difference between passive comprehension (fluency) and active memory retrieval pathways.'
  }
];

export const AI_EDUCATION_AGREEMENTS: Agreement[] = [
  {
    id: 'agr-1',
    title: 'Adaptive Pacing and Scaffolding Accelerate Formative Mastery',
    statement: 'Multiple analyzed sources indicate that AI can improve accessibility and personalized learning when appropriate human oversight and iterative pedagogical scaffolding are present.',
    confidence: 'High Evidence',
    supportingSourceIds: ['src-1', 'src-3', 'src-4', 'src-7'],
    extractedEvidence: [
      'Chen et al. (2024): 27% acceleration in formative mastery benchmarks in controlled trials.',
      'EdTech Science Review (2024): 34% reduction in homework dropout rates using adaptive hints.',
      'U.S. Dept of Education (2024): Endorses iterative scaffolding as primary pedagogical AI use-case.',
      'MIT Tech Review (2024): 31% comprehension improvement for neurodivergent learners.'
    ],
    relatedClaimIds: ['clm-1', 'clm-2', 'clm-4'],
    sourceTypeBreakdown: {
      'Research Paper': 1,
      'Government Report': 1,
      'Industry Report': 1,
      'News Article': 1
    },
    whyAmISeeingThis: '4 diverse source categories (academic research, federal policy, industry data, tech journalism) converge on this finding under conditions of structured step-by-step guidance.'
  },
  {
    id: 'agr-2',
    title: 'Human Educator Oversight is Indispensable to Ethical Learning',
    statement: 'All analyzed sources agree that algorithmic systems must function as assistive co-pilots subordinated to human teachers rather than autonomous replacements.',
    confidence: 'High Evidence',
    supportingSourceIds: ['src-1', 'src-2', 'src-3', 'src-6'],
    extractedEvidence: [
      'Oxford Review (2023): Intellectual autonomy requires human-guided epistemic friction.',
      'U.S. Dept of Education (2024): Mandatory human-in-the-loop requirement for federal learning systems.',
      'Chen et al. (2024): AI tutoring effectiveness decays rapidly without weekly teacher check-ins.',
      'Zhao & Lindqvist (2024): Faculty reclaim administrative time specifically to deepen human mentorship.'
    ],
    relatedClaimIds: ['clm-5', 'clm-7'],
    sourceTypeBreakdown: {
      'Research Paper': 1,
      'Academic Article': 2,
      'Government Report': 1
    },
    whyAmISeeingThis: 'No analyzed publication proposes eliminating educators. Across all ideological perspectives, pedagogical mentorship remains irreplaceable.'
  },
  {
    id: 'agr-3',
    title: 'Administrative Automation Unlocks High-Touch Mentoring Time',
    statement: 'Evidence confirms that generative AI reliably streamlines mechanical administrative workflows such as rubric drafting, syllabus variations, and quiz generation.',
    confidence: 'Moderate Evidence',
    supportingSourceIds: ['src-4', 'src-6'],
    extractedEvidence: [
      'British Journal of EdTech (2024): 4.8 hours reclaimed per week from routine administrative grading.',
      'EdTech Science Review (2024): 62% of reclaimed educator time reallocated to 1-on-1 tutoring.'
    ],
    relatedClaimIds: ['clm-7'],
    sourceTypeBreakdown: {
      'Academic Article': 1,
      'Industry Report': 1
    },
    whyAmISeeingThis: 'Both practitioner time-motion studies and enterprise deployments report consistent time-saving metrics on bureaucratic tasks.'
  },
  {
    id: 'agr-4',
    title: 'Multimodal Adaptations Expand Inclusion for Neurodivergent Learners',
    statement: 'Synthesized findings show multimodal transformation of complex text into visual storyboards, audio summaries, and structured micro-steps substantially aids cognitive accessibility.',
    confidence: 'Moderate Evidence',
    supportingSourceIds: ['src-3', 'src-7'],
    extractedEvidence: [
      'MIT Tech Review (2024): Neurodiverse lab case studies recorded double-digit reading retention gains.',
      'U.S. Dept of Education (2024): Recommended Universal Design for Learning (UDL) AI implementations.'
    ],
    relatedClaimIds: ['clm-2', 'clm-11'],
    sourceTypeBreakdown: {
      'Government Report': 1,
      'News Article': 1
    },
    whyAmISeeingThis: 'Sources evaluating inclusive learning environments highlight consistent accessibility advantages for sensory and neurodivergent adaptations.'
  }
];

export const AI_EDUCATION_DISAGREEMENTS: Disagreement[] = [
  {
    id: 'dis-1',
    question: 'Does AI improve independent student learning or foster cognitive dependency?',
    category: 'Cognitive Autonomy & Problem-Solving',
    sourceA: {
      sourceId: 'src-1',
      sourceTitle: 'AI-Assisted Learning in Higher Education (Chen et al., 2024)',
      sourceType: 'Research Paper',
      stance: 'Supports Learning Efficiency',
      claimSnippet: 'AI-assisted feedback can improve learning efficiency and formative concept mastery by 27%.',
      contextCondition: 'Controlled iterative scaffolding with Socratic hints in introductory college STEM.',
      studyPopulation: 'Undergraduate STEM students (n = 4,210) receiving bounded step-by-step guidance.'
    },
    sourceB: {
      sourceId: 'src-2',
      sourceTitle: 'The Automation of Inquiry (Vance & Sterling, 2023)',
      sourceType: 'Academic Article',
      stance: 'Raises Critical Concern',
      claimSnippet: 'Over-reliance on generative AI prompts reduces independent problem-solving and epistemic struggle.',
      contextCondition: 'Open-ended research thesis formulation using general-purpose generative LLM summaries.',
      studyPopulation: 'Senior thesis humanities & social science candidates (n = 350) given unconstrained search.'
    },
    whyDifferentFactors: [
      {
        factor: 'Study Population & Academic Level',
        sourceAContext: 'Introductory first-year undergraduates learning baseline procedural STEM problem sets.',
        sourceBContext: 'Advanced senior thesis scholars required to formulate original arguments and critique literature.',
        analysis: 'Novices benefit heavily from immediate guidance to overcome procedural bottlenecks, whereas advanced scholars require epistemic friction to synthesize original thoughts.'
      },
      {
        factor: 'Software Constraint & System Design',
        sourceAContext: 'Custom pedagogical tutor restricted to progressive hints; forbidden from outputting final code.',
        sourceBContext: 'Commercial general-purpose conversational LLM outputting complete syntheses in seconds.',
        analysis: 'The tool architecture dictates the cognitive outcome: bounded scaffolding fosters engagement, while unconstrained generation induces cognitive offloading.'
      },
      {
        factor: 'Measured Outcome Variable',
        sourceAContext: 'Immediate formative test speed and milestone completion rates across a 16-week semester.',
        sourceBContext: 'Qualitative epistemic depth, autonomous question formulation, and source verification habits.',
        analysis: 'Source A measures speed and efficiency of task completion, while Source B measures deep critical enquiry and intellectual self-reliance.'
      }
    ],
    systemConclusionNote: 'NEXA preserves this divergence rather than computing an artificial average: whether AI empowers or diminishes student independence depends critically on pedagogical boundaries and whether the learner is a novice or advanced researcher.',
    whyAmISeeingThis: 'These two rigorous sources examine fundamentally different learning phases and software environments. Forcing a single binary score would obscure vital contextual variables that researchers must consider.'
  },
  {
    id: 'dis-2',
    question: 'Do automated AI proctoring and detection tools protect exam integrity or inflict demographic injustice?',
    category: 'Assessment Ethics & Demographic Parity',
    sourceA: {
      sourceId: 'src-3',
      sourceTitle: 'National Blueprint for AI in Education (U.S. Dept of Ed, 2024)',
      sourceType: 'Government Report',
      stance: 'Supports Standardized Verification',
      claimSnippet: 'Automated anomaly detection provides scalable integrity mechanisms for remote educational credentials.',
      contextCondition: 'Federal benchmark standards evaluating next-generation NIST-aligned anomaly algorithms.',
      studyPopulation: 'Aggregate district data and national remote testing credential standards.'
    },
    sourceB: {
      sourceId: 'src-5',
      sourceTitle: 'Algorithmic Inequity and Bias in Proctoring Systems (Rostova et al., 2023)',
      sourceType: 'Research Paper',
      stance: 'Demonstrates Systemic Inequity',
      claimSnippet: 'Computer vision proctoring systems exhibit 18.4% higher false-positive anomaly rates for non-native speakers.',
      contextCondition: 'Empirical audit of commercial software operating in diverse uncurated student home environments.',
      studyPopulation: '1,400 video hours of ethnically and linguistically diverse test-takers in real-world settings.'
    },
    whyDifferentFactors: [
      {
        factor: 'Test Environment Realism',
        sourceAContext: 'Theoretical policy frameworks assuming optimal lighting, high-bandwidth networks, and standardized hardware.',
        sourceBContext: 'Messy domestic living environments with fluctuating ambient noise, poor webcams, and shared rooms.',
        analysis: 'Algorithms perform with theoretical parity in clean lab benchmarks, but fail predictably when deployed into socio-economically variable student households.'
      },
      {
        factor: 'Threshold for "Integrity"',
        sourceAContext: 'Prioritizes institutional protection against widespread credential inflation and fraudulent submission.',
        sourceBContext: 'Prioritizes individual student civil rights and the psychological harm of erroneous accusations.',
        analysis: 'Source A frames the dilemma from the institution’s reputational risk, while Source B evaluates the human trauma and academic disruption experienced by falsely flagged students.'
      }
    ],
    systemConclusionNote: 'NEXA highlights this friction as an unresolved institutional dilemma: technical standards are evolving, but real-world demographic disparities remain an active point of contestation in empirical audits.',
    whyAmISeeingThis: 'Policy documents often project ideal compliance standards, whereas independent algorithmic audits expose ground-truth failure modes in uncurated socio-economic contexts.'
  }
];

export const AI_EDUCATION_EXPLORE_NEXT: ExploreNextItem = {
  id: 'exp-1',
  title: 'Long-Term Impact on Autonomous Problem Formulation in Resource-Constrained Higher Education',
  underexploredArea: 'Few analyzed sources directly examine the long-term effect of AI tools on students\' independent problem-solving skills in resource-constrained colleges where human mentoring ratios are severely limited.',
  whyThisSurfaced: 'Most analyzed sources focus on immediate learning outcomes in well-funded university pilot programs with abundant teacher support. Limited longitudinal evidence was found regarding independent problem-solving when students rely almost exclusively on AI in high student-to-faculty environments.',
  supportingContext: {
    relatedClaims: [
      'Over-reliance on generative AI prompts may reduce independent problem-solving (Claim 3)',
      'Human educator supervision remains indispensable (Claim 5)',
      'Equitable access threatens to widen institutional achievement gap (Claim 9)'
    ],
    relevantSources: [
      'Prof. Marcus Vance (2023) — Oxford Review of Education',
      'Dr. Elena Rostova et al. (2023) — ACM FAccT',
      'Dr. Sarah Chen et al. (2024) — Journal of Educational Computing Research'
    ],
    relatedTopics: [
      'Longitudinal Cognitive Offloading in Global South Universities',
      'Faculty-to-Student Ratios as a Moderator of AI Tutor Efficacy',
      'Autonomous Thesis Hypothesis Generation Without Senior Advisor Mentorship'
    ]
  },
  candidateLabel: 'Candidate insight — verify before using as a research claim.',
  methodologyGap: '87% of published AI education papers assess 4-to-16 week semester windows. Only 3.2% evaluate retention and autonomous capability 12 to 24 months post-intervention, and less than 5% sample community colleges or underfunded institutions.',
  suggestedResearchDirections: [
    'Design a 2-year longitudinal study comparing senior thesis originality in low-resource vs high-resource institutions using identical AI toolsets.',
    'Examine whether unassisted diagnostic debugging skills atrophy faster in students who used AI assistants for >80% of coursework.',
    'Investigate peer-to-peer collaborative scaffolding as an economic substitute for faculty oversight in AI-heavy curricula.'
  ],
  whyAmISeeingThis: 'NEXA cross-referenced study metadata across all 8 sources. While 7 sources investigated well-resourced institutions or short interventions, zero studies examined multi-year autonomous outcomes in underfunded colleges. This represents a distinct gap in the literature.'
};

export const DEFAULT_INVESTIGATION: InvestigationData = {
  id: 'inv-ai-edu',
  topic: 'Impact of AI on Education',
  summary: 'Comprehensive analysis of 8 peer-reviewed, policy, and field sources assessing pedagogical efficacy, cognitive dependencies, ethical disparities, and unexplored research frontiers.',
  overviewStats: {
    sourcesCount: 8,
    claimsCount: 12,
    agreementsCount: 4,
    disagreementsCount: 2,
    exploreNextCount: 1
  },
  sources: AI_EDUCATION_SOURCES,
  claims: AI_EDUCATION_CLAIMS,
  agreements: AI_EDUCATION_AGREEMENTS,
  disagreements: AI_EDUCATION_DISAGREEMENTS,
  exploreNext: AI_EDUCATION_EXPLORE_NEXT,
  lastAnalyzed: 'Updated 10 minutes ago',
  status: 'Completed'
};

// Preset topic generators for alternate queries
export const RECENT_INVESTIGATIONS = [
  {
    id: 'inv-ai-edu',
    topic: 'Impact of AI on Education',
    sourcesCount: 8,
    claimsCount: 12,
    insightsCount: 7,
    date: 'Today, 2:15 PM',
    status: 'Ready',
    badgeColor: 'emerald'
  },
  {
    id: 'inv-cyber',
    topic: 'AI in Cybersecurity Defense',
    sourcesCount: 11,
    claimsCount: 16,
    insightsCount: 9,
    date: 'Yesterday',
    status: 'Ready',
    badgeColor: 'blue'
  },
  {
    id: 'inv-ev-india',
    topic: 'Electric Vehicles in India',
    sourcesCount: 9,
    claimsCount: 14,
    insightsCount: 8,
    date: 'Sep 12, 2026',
    status: 'Ready',
    badgeColor: 'cyan'
  },
  {
    id: 'inv-social-media',
    topic: 'Social Media & Student Mental Health',
    sourcesCount: 14,
    claimsCount: 19,
    insightsCount: 11,
    date: 'Sep 08, 2026',
    status: 'Ready',
    badgeColor: 'violet'
  }
];

export const EXAMPLE_TOPICS = [
  'AI in Cybersecurity',
  'Impact of AI on Education',
  'Electric Vehicles in India',
  'Social Media & Students',
  'Sustainable Technology'
];

export function getInvestigationForTopic(queryTopic: string): InvestigationData {
  const normalized = queryTopic.trim().toLowerCase();

  if (normalized.includes('cyber') || normalized.includes('security')) {
    return {
      id: 'inv-cyber',
      topic: 'AI in Cybersecurity Defense',
      summary: 'Synthesis of threat intelligence, automated penetration testing, and zero-day response across enterprise and national defense domains.',
      overviewStats: {
        sourcesCount: 10,
        claimsCount: 14,
        agreementsCount: 4,
        disagreementsCount: 2,
        exploreNextCount: 1
      },
      sources: AI_EDUCATION_SOURCES.map((s, idx) => ({
        ...s,
        id: `src-cyber-${idx}`,
        title: [
          'Autonomous Threat Remediation in Cloud Infrastructures',
          'Adversarial Attacks on Neural Intrusion Detection Systems',
          'CISA Strategic Directive on Machine Speed Vulnerability Triage',
          'Evaluating Generative Exploit Generation Against Commercial WAFs',
          'Socio-Technical Friction in Security Operations Center Automation',
          'Human-in-the-Loop Incident Response in Critical Energy Grids',
          'Quantum-Resilient Cryptography in Autonomous Defense Mesh',
          'Telemetry Synthesis and Alert Fatigue in Modern SOC Workflows'
        ][idx % 8],
        type: s.type,
        authors: ['Dr. Viktor Ramos', 'Elena Chen, CISSP', 'Cybersecurity Infrastructure Agency', 'MITRE ATT&CK Research'][idx % 4]
      })),
      claims: AI_EDUCATION_CLAIMS.map((c, idx) => ({
        ...c,
        id: `clm-cyber-${idx}`,
        text: [
          'Autonomous AI response dramatically reduces Mean Time to Remediation (MTTR) for known credential stuffing.',
          'LLM-assisted threat intelligence reduces analyst triage latency from hours to seconds.',
          'Adversarial prompt injection against automated SOC agents presents an unresolved attack surface.',
          'AI-assisted defense creates an asymmetric advantage over uncoordinated threat actors.',
          'Human security analysts remain vital for threat attribution and sovereign legal escalation.',
          'Automated defensive tools exhibit elevated false-positive isolation of legitimate developer workloads.',
          'Machine-speed patching prevents zero-day proliferation in enterprise Active Directory.',
          'Reliance on black-box security heuristics limits legal compliance under EU NIS2 directives.'
        ][idx % 8] || c.text
      })),
      agreements: [
        {
          id: 'agr-cyber-1',
          title: 'Automated Triaging Dramatically Reduces Mean Time to Detection',
          statement: 'Sources unanimously agree that machine-speed pattern matching outperforms human operators in initial log aggregation and alert correlation.',
          confidence: 'High Evidence',
          supportingSourceIds: ['src-cyber-0', 'src-cyber-2', 'src-cyber-7'],
          extractedEvidence: ['72% reduction in unreviewed alerts in audited SOC deployments.'],
          relatedClaimIds: ['clm-cyber-0', 'clm-cyber-1'],
          sourceTypeBreakdown: { 'Research Paper': 1, 'Government Report': 1, 'Industry Report': 1 },
          whyAmISeeingThis: 'Telemetry logs across industrial sectors confirm unambiguous time-to-containment gains.'
        },
        {
          id: 'agr-cyber-2',
          title: 'Human Incident Commanders Are Essential for High-Risk Isolation',
          statement: 'Full automated quarantine of critical production pipelines causes unacceptable catastrophic downtime without human verification.',
          confidence: 'High Evidence',
          supportingSourceIds: ['src-cyber-1', 'src-cyber-4', 'src-cyber-5'],
          extractedEvidence: ['94% of Fortune 500 CISOs enforce human sign-off for core infrastructure shutdowns.'],
          relatedClaimIds: ['clm-cyber-4'],
          sourceTypeBreakdown: { 'Academic Article': 2, 'Research Paper': 1 },
          whyAmISeeingThis: 'Operational risk analysis indicates full autonomous containment introduces severe systemic business continuity hazards.'
        }
      ],
      disagreements: [
        {
          id: 'dis-cyber-1',
          question: 'Does automated AI patching improve zero-day resilience or introduce stealth backdoors?',
          category: 'Vulnerability Management',
          sourceA: {
            sourceId: 'src-cyber-0',
            sourceTitle: 'Autonomous Threat Remediation in Cloud Infrastructures',
            sourceType: 'Research Paper',
            stance: 'Supports Automated Patching',
            claimSnippet: 'Automated synthesis of defensive hotfixes cuts critical zero-day exposure windows by 88%.',
            contextCondition: 'Controlled microservice architectures with automated canary regression tests.',
            studyPopulation: 'Standardized Kubernetes cluster deployments with synthetic vulnerability injections.'
          },
          sourceB: {
            sourceId: 'src-cyber-1',
            sourceTitle: 'Adversarial Attacks on Neural Intrusion Detection Systems',
            sourceType: 'Academic Article',
            stance: 'Raises Critical Concern',
            claimSnippet: 'Synthetic patches can introduce subtle logic bypasses that evade static analysis while creating zero-day backdoors.',
            contextCondition: 'Adversarial testing targeting deep neural code generation models.',
            studyPopulation: 'Complex legacy monoliths and distributed industrial firmware systems.'
          },
          whyDifferentFactors: [
            {
              factor: 'Infrastructure Modernity',
              sourceAContext: 'Modern ephemeral microservices with fast rollback capabilities.',
              sourceBContext: 'Monolithic legacy industrial SCADA systems where any bug can cause physical outages.',
              analysis: 'The acceptable tolerance for algorithmic code intervention depends on whether failures can be rolled back safely in seconds.'
            }
          ],
          systemConclusionNote: 'NEXA preserves this tension: automation is safe in stateless microservices, but fraught with grave peril in critical legacy systems.',
          whyAmISeeingThis: 'Divergent risk profiles across cloud-native environments vs operational technology (OT) grids produce fundamentally conflicting recommendations.'
        }
      ],
      exploreNext: {
        id: 'exp-cyber-1',
        title: 'Autonomous Multi-Agent Defensive Swarms in Air-Gapped Industrial Networks',
        underexploredArea: 'Very few public studies explore how autonomous AI defensive swarms coordinate without cloud telemetry in air-gapped nuclear and municipal water networks.',
        whyThisSurfaced: 'Most cybersecurity AI literature assumes persistent high-bandwidth access to massive cloud foundation models. Critical infrastructure, however, operates disconnected from public internet.',
        supportingContext: {
          relatedClaims: ['Adversarial prompt injection', 'Zero-day vulnerability triage'],
          relevantSources: ['CISA Strategic Directive', 'MITRE ATT&CK Research'],
          relatedTopics: ['Air-Gapped Embedded AI', 'SCADA Swarm Defense', 'Edge Foundation Models']
        },
        candidateLabel: 'Candidate insight — verify before using as a research claim.',
        methodologyGap: '96% of AI cybersecurity papers benchmark against internet-connected enterprise IT networks. Less than 2% evaluate sovereign air-gapped edge infrastructure.',
        suggestedResearchDirections: [
          'Investigate small quantized models running on localized programmable logic controllers (PLCs).',
          'Assess consensus mechanisms among edge agents under adversarial sensor spoofing.'
        ],
        whyAmISeeingThis: 'Metadata analysis reveals a stark geographic and infrastructure blindspot in cloud-dependent security research.'
      },
      lastAnalyzed: 'Just now',
      status: 'Completed'
    };
  }

  // Default to AI Education (our primary deeply curated dataset)
  return {
    ...DEFAULT_INVESTIGATION,
    topic: queryTopic.trim() || DEFAULT_INVESTIGATION.topic
  };
}
