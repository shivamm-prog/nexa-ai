import React from 'react';
import { ResearchProvider, useResearch } from './context/ResearchContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer } from './components/common/Toast';
import { SourceDrawer } from './components/common/SourceDrawer';
import { ClaimModal } from './components/common/ClaimModal';
import { WhySeeingModal } from './components/common/WhyAmISeeingThis';
import { MiniAssistant } from './components/common/MiniAssistant';
import { LoadingSequence } from './components/analysis/LoadingSequence';
import { SpatialAtmosphere } from './components/common/SpatialAtmosphere';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { SourcesPage } from './pages/SourcesPage';
import { LiteratureSurveyPage } from './pages/LiteratureSurveyPage';
import { EvidenceMapPage } from './pages/EvidenceMapPage';
import { ExploreNextPage } from './pages/ExploreNextPage';
import { SavedResearchPage } from './pages/SavedResearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { CinematicIntro } from './components/intro/CinematicIntro';

const AppContent: React.FC = () => {
  const { activePage, isIntroActive, setIsIntroActive } = useResearch();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'sources':
        return <SourcesPage />;
      case 'literature-survey':
        return <LiteratureSurveyPage />;
      case 'evidence-map':
        return <EvidenceMapPage />;
      case 'explore-next':
        return <ExploreNextPage />;
      case 'saved':
        return <SavedResearchPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="nexa-app-layout">
      {/* 3D Spatial Atmospheric Canvas Layer */}
      <SpatialAtmosphere />

      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="nexa-main-viewport">
        <TopBar />
        <main className="nexa-page-stage">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <LoadingSequence />
      <SourceDrawer />
      <ClaimModal />
      <WhySeeingModal />
      <MiniAssistant />
      <ToastContainer />

      {/* Cinematic Intro Gateway Layer */}
      {isIntroActive && (
        <CinematicIntro onEnter={() => setIsIntroActive(false)} />
      )}

      <style>{`
        .nexa-app-layout {
          display: flex;
          width: 100vw;
          min-height: 100vh;
          background-color: var(--bg-canvas);
          color: var(--text-primary);
          overflow-x: hidden;
          position: relative;
        }

        .nexa-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100vh;
          overflow-y: auto;
          position: relative;
          z-index: 10;
        }

        .nexa-page-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ResearchProvider>
      <AppContent />
    </ResearchProvider>
  );
};

export default App;
