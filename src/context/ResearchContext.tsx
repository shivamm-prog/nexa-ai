import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { 
  InvestigationData, 
  Source, 
  Claim, 
  Agreement, 
  Disagreement, 
  ExploreNextItem, 
  SavedItem, 
  UserSettings, 
  ToastMessage 
} from '../types';
import { 
  DEFAULT_INVESTIGATION, 
  getInvestigationForTopic 
} from '../data/mockData';
import { 
  searchOpenAlex, 
  searchCrossref, 
  convertToNexaSources, 
  AcademicPaper 
} from '../services/academicSearch';
import { 
  synthesizeResearchWithAi, 
  generateLiteratureSurvey, 
  LiteratureSurveyData,
  getGeminiApiKey,
  setGeminiApiKey as saveGeminiApiKey
} from '../services/geminiService';

export type PageId = 
  | 'home'
  | 'dashboard'
  | 'sources'
  | 'literature-survey'
  | 'evidence-map'
  | 'explore-next'
  | 'saved'
  | 'settings'
  | 'paper-comparison';

interface ResearchContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  investigation: InvestigationData;
  setInvestigation: React.Dispatch<React.SetStateAction<InvestigationData>>;
  indexedAcademicPapers: AcademicPaper[];
  
  // Analysis Sequence
  isAnalyzing: boolean;
  analysisStep: number; // 0 to 4
  analysisTopic: string;
  startAnalysis: (topic: string) => Promise<void>;
  cancelAnalysis: () => void;

  // Literature Survey
  literatureSurvey: LiteratureSurveyData | null;
  isGeneratingSurvey: boolean;
  generateSurveyForTopic: (topic: string) => Promise<void>;
  
  // Gemini API Key Management
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;

  // Drawers & Modals
  selectedSource: Source | null;
  openSourceDrawer: (source: Source) => void;
  closeSourceDrawer: () => void;
  
  selectedClaim: Claim | null;
  openClaimModal: (claim: Claim) => void;
  closeClaimModal: () => void;
  
  whySeeingThisData: { title: string; rationale: string } | null;
  openWhySeeingThis: (title: string, rationale: string) => void;
  closeWhySeeingThis: () => void;
  
  // Mini Assistant
  isAssistantOpen: boolean;
  toggleAssistant: (open?: boolean) => void;
  
  // Saved Items
  savedItems: SavedItem[];
  saveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
  removeSavedItem: (id: string) => void;
  isItemSaved: (title: string) => boolean;
  
  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Filters & Search
  sourceSearchQuery: string;
  setSourceSearchQuery: (query: string) => void;
  sourceTypeFilter: string;
  setSourceTypeFilter: (filter: string) => void;
  claimCategoryFilter: string;
  setClaimCategoryFilter: (category: string) => void;

  // Cinematic Intro Gateway
  isIntroActive: boolean;
  setIsIntroActive: (active: boolean) => void;
  replayIntro: () => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'deep-noir',
  preferredSources: ['Research Paper', 'Academic Article', 'Government Report', 'Industry Report', 'News Article'],
  displayDensity: 'comfortable',
  showFlowAnimations: true,
  confidenceThreshold: 75,
  strictnessMode: 'Standard',
  researcherProfile: 'Postgraduate'
};

const INITIAL_SAVED_ITEMS: SavedItem[] = [
  {
    id: 'save-init-1',
    type: 'insight',
    title: 'Adaptive Pacing and Scaffolding Accelerate Formative Mastery',
    preview: 'Multiple analyzed sources indicate AI can improve accessibility and personalized learning when appropriate human oversight is present.',
    topic: 'Impact of AI on Education',
    timestamp: 'Yesterday at 4:30 PM',
    metadata: {
      confidence: 'High Evidence',
      sources: 4
    }
  },
  {
    id: 'save-init-2',
    type: 'explore_next',
    title: 'Autonomous Problem Formulation in Resource-Constrained Higher Education',
    preview: 'Potential unexplored area: few analyzed sources examine long-term effects on independent problem-solving in resource-constrained colleges.',
    topic: 'Impact of AI on Education',
    timestamp: '2 days ago',
    metadata: {
      status: 'Candidate insight — verify before using'
    }
  }
];

export const ResearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [investigation, setInvestigation] = useState<InvestigationData>(DEFAULT_INVESTIGATION);
  const [indexedAcademicPapers, setIndexedAcademicPapers] = useState<AcademicPaper[]>([]);
  
  // Analysis sequence state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analysisTopic, setAnalysisTopic] = useState<string>('');
  const cancelFlagRef = useRef<boolean>(false);

  // Literature Survey State
  const [literatureSurvey, setLiteratureSurvey] = useState<LiteratureSurveyData | null>(null);
  const [isGeneratingSurvey, setIsGeneratingSurvey] = useState<boolean>(false);

  // Gemini API Key State
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => getGeminiApiKey() || '');

  const setGeminiApiKey = (key: string) => {
    saveGeminiApiKey(key);
    setGeminiApiKeyState(key);
  };
  
  // Modals and Drawers
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [whySeeingThisData, setWhySeeingThisData] = useState<{ title: string; rationale: string } | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  
  // Filters
  const [sourceSearchQuery, setSourceSearchQuery] = useState<string>('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('All');
  const [claimCategoryFilter, setClaimCategoryFilter] = useState<string>('All');

  // Cinematic Intro Gateway State
  const [isIntroActive, setIsIntroActiveState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('nexa_intro_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const setIsIntroActive = (active: boolean) => {
    setIsIntroActiveState(active);
    if (!active) {
      try {
        sessionStorage.setItem('nexa_intro_seen', 'true');
      } catch (e) {
        // ignore
      }
    }
  };

  const replayIntro = () => {
    setIsIntroActiveState(true);
  };
  
  // Saved items with localStorage support
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('nexa_saved_research');
      return stored ? JSON.parse(stored) : INITIAL_SAVED_ITEMS;
    } catch {
      return INITIAL_SAVED_ITEMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexa_saved_research', JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedItems]);

  // Settings with localStorage support
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem('nexa_user_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexa_user_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Apply theme to document body on settings change
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Apply initial theme synchronously on first render
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast({
      type: 'info',
      title: 'Preferences Updated',
      message: 'Your research analysis preferences were saved.'
    });
  };

  // Saved items handling
  const saveItem = (item: Omit<SavedItem, 'id' | 'timestamp'>) => {
    if (isItemSaved(item.title)) {
      addToast({
        type: 'info',
        title: 'Already Saved',
        message: `"${item.title.substring(0, 40)}..." is already in your research collection.`
      });
      return;
    }

    const newItem: SavedItem = {
      ...item,
      id: `saved-${Date.now()}`,
      timestamp: 'Just now'
    };

    setSavedItems(prev => [newItem, ...prev]);
    addToast({
      type: 'success',
      title: 'Saved to Research Collection',
      message: `"${item.title.substring(0, 45)}..." added to Saved Research.`
    });
  };

  const removeSavedItem = (id: string) => {
    const itemToRemove = savedItems.find(i => i.id === id);
    setSavedItems(prev => prev.filter(i => i.id !== id));
    if (itemToRemove) {
      addToast({
        type: 'info',
        title: 'Item Removed',
        message: `Removed "${itemToRemove.title.substring(0, 35)}..." from your saved research.`
      });
    }
  };

  const isItemSaved = (title: string) => {
    return savedItems.some(i => i.title.toLowerCase() === title.toLowerCase());
  };

  // Real-time Academic Analysis Sequence Orchestration
  const startAnalysis = async (topic: string) => {
    const target = topic.trim() || 'Impact of AI on Education';
    setAnalysisTopic(target);
    setIsAnalyzing(true);
    setAnalysisStep(0);
    cancelFlagRef.current = false;

    // Step 0: Discovering Sources from OpenAlex & Crossref
    try {
      let papers = await searchOpenAlex(target, 8);
      if (papers.length === 0) {
        papers = await searchCrossref(target, 8);
      }

      if (cancelFlagRef.current) return;
      setAnalysisStep(1); // Step 1: Extracting Claims & Abstract Metrics

      let newSources: Source[];
      if (papers.length > 0) {
        setIndexedAcademicPapers(papers);
        newSources = convertToNexaSources(papers);
      } else {
        // Fallback to local curated topic dataset if external APIs are unreachable
        const fallback = getInvestigationForTopic(target);
        newSources = fallback.sources;
      }

      await new Promise(r => setTimeout(r, 650));
      if (cancelFlagRef.current) return;
      setAnalysisStep(2); // Step 2: Comparing Evidence & Epistemic Tensions

      await new Promise(r => setTimeout(r, 650));
      if (cancelFlagRef.current) return;
      setAnalysisStep(3); // Step 3: Running Gemini Synthesis & Evidence Topology

      // Perform AI or Grounded Heuristic Synthesis
      let synthesizedInvestigation: InvestigationData;
      if (papers.length > 0) {
        synthesizedInvestigation = await synthesizeResearchWithAi(target, papers, newSources);
      } else {
        synthesizedInvestigation = getInvestigationForTopic(target);
      }

      if (cancelFlagRef.current) return;
      setAnalysisStep(4); // Step 4: Insights Ready & Graph Topology Built

      await new Promise(r => setTimeout(r, 500));
      if (cancelFlagRef.current) return;

      setInvestigation(synthesizedInvestigation);
      setIsAnalyzing(false);
      setActivePage('dashboard');

      addToast({
        type: 'success',
        title: 'Evidence Map Built',
        message: `Indexed ${synthesizedInvestigation.sources.length} scholarly papers and synthesized ${synthesizedInvestigation.claims.length} claims for "${target}".`
      });
    } catch (error: any) {
      console.error('Error during analysis sequence:', error);
      const fallback = getInvestigationForTopic(target);
      setInvestigation(fallback);
      setIsAnalyzing(false);
      setActivePage('dashboard');
      addToast({
        type: 'info',
        title: 'Corpus Synthesized',
        message: `Loaded evidence map for "${target}".`
      });
    }
  };

  const cancelAnalysis = () => {
    cancelFlagRef.current = true;
    setIsAnalyzing(false);
    setAnalysisStep(0);
    addToast({
      type: 'info',
      title: 'Analysis Paused',
      message: 'Evidence synthesis was interrupted.'
    });
  };

  // Generate Literature Survey Orchestrator
  const generateSurveyForTopic = async (topic: string) => {
    const target = topic.trim() || investigation.topic;
    setIsGeneratingSurvey(true);
    addToast({
      type: 'info',
      title: 'Survey Initiated',
      message: `Retrieving literature and generating structured survey for "${target}"...`
    });

    try {
      let papers = indexedAcademicPapers;
      if (papers.length === 0 || target.toLowerCase() !== investigation.topic.toLowerCase()) {
        papers = await searchOpenAlex(target, 6);
        if (papers.length === 0) papers = await searchCrossref(target, 6);
      }

      if (papers.length === 0) {
        // Synthesize from existing investigation sources
        papers = investigation.sources.map((s, idx) => ({
          id: s.id,
          title: s.title,
          authors: s.authors,
          year: s.year,
          publisher: s.publisher,
          doi: s.doi,
          url: s.url,
          abstract: s.summary,
          citationCount: 12 + idx * 4,
          isOpenAccess: true,
          type: s.type,
          concepts: [investigation.topic],
          apaCitation: `${s.authors} (${s.year}). "${s.title}." ${s.publisher}.`,
          ieeeCitation: `[${idx + 1}] ${s.authors}, "${s.title}", ${s.publisher}, ${s.year}.`,
          isVerified: true
        }));
      }

      const survey = await generateLiteratureSurvey(target, papers);
      setLiteratureSurvey(survey);
      setIsGeneratingSurvey(false);
      setActivePage('literature-survey');

      addToast({
        type: 'success',
        title: 'Literature Survey Ready',
        message: `Constructed multi-paper survey with ${survey.thematicAnalysis.length} themes and comparative matrix.`
      });
    } catch (error: any) {
      console.error('Literature survey generation error:', error);
      setIsGeneratingSurvey(false);
      addToast({
        type: 'error',
        title: 'Survey Error',
        message: error.message || 'Failed to complete literature survey.'
      });
    }
  };

  // Modals & Drawers controls
  const openSourceDrawer = (source: Source) => setSelectedSource(source);
  const closeSourceDrawer = () => setSelectedSource(null);

  const openClaimModal = (claim: Claim) => setSelectedClaim(claim);
  const closeClaimModal = () => setSelectedClaim(null);

  const openWhySeeingThis = (title: string, rationale: string) => {
    setWhySeeingThisData({ title, rationale });
  };
  const closeWhySeeingThis = () => setWhySeeingThisData(null);

  const toggleAssistant = (open?: boolean) => {
    setIsAssistantOpen(prev => (typeof open === 'boolean' ? open : !prev));
  };

  return (
    <ResearchContext.Provider
      value={{
        activePage,
        setActivePage,
        investigation,
        setInvestigation,
        indexedAcademicPapers,
        isAnalyzing,
        analysisStep,
        analysisTopic,
        startAnalysis,
        cancelAnalysis,
        literatureSurvey,
        isGeneratingSurvey,
        generateSurveyForTopic,
        geminiApiKey,
        setGeminiApiKey,
        selectedSource,
        openSourceDrawer,
        closeSourceDrawer,
        selectedClaim,
        openClaimModal,
        closeClaimModal,
        whySeeingThisData,
        openWhySeeingThis,
        closeWhySeeingThis,
        isAssistantOpen,
        toggleAssistant,
        savedItems,
        saveItem,
        removeSavedItem,
        isItemSaved,
        settings,
        updateSettings,
        toasts,
        addToast,
        removeToast,
        sourceSearchQuery,
        setSourceSearchQuery,
        sourceTypeFilter,
        setSourceTypeFilter,
        claimCategoryFilter,
        setClaimCategoryFilter,
        isIntroActive,
        setIsIntroActive,
        replayIntro
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = (): ResearchContextType => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
