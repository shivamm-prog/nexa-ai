import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  Check, 
  RotateCcw, 
  HelpCircle,
  Play
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

export const TopBar: React.FC = () => {
  const { 
    activePage, 
    investigation, 
    startAnalysis, 
    toggleAssistant, 
    isAssistantOpen, 
    saveItem, 
    isItemSaved,
    openWhySeeingThis,
    replayIntro
  } = useResearch();

  const [searchFocused, setSearchFocused] = useState(false);
  const isSaved = isItemSaved(investigation.topic);

  const getPageTitle = () => {
    switch (activePage) {
      case 'home':
        return 'Research Hub';
      case 'dashboard':
        return 'Research Analysis';
      case 'sources':
        return 'Sources & Citation Intelligence';
      case 'literature-survey':
        return 'Literature Survey Synthesis';
      case 'evidence-map':
        return 'Visual Evidence Map';
      case 'explore-next':
        return 'Explore Next Frontier';
      case 'saved':
        return 'Research Notebook';
      case 'settings':
        return 'Platform Preferences';
      case 'paper-comparison':
        return 'Paper Comparison Engine';
      default:
        return 'Research Intelligence';
    }
  };

  const handleSaveInvestigation = () => {
    if (!isSaved) {
      saveItem({
        type: 'investigation',
        title: investigation.topic,
        preview: investigation.summary,
        topic: investigation.topic,
        metadata: {
          sources: investigation.sources.length,
          claims: investigation.claims.length,
          agreements: investigation.agreements.length
        },
        rawItem: investigation
      });
    }
  };

  return (
    <header className="nexa-topbar">
      {/* Left: Page Title & Context */}
      <div className="topbar-left">
        <div className="page-meta">
          <div className="page-breadcrumb">
            <span className="crumb-root">NEXA</span>
            <span className="crumb-divider">/</span>
            <span className="crumb-current">{getPageTitle()}</span>
          </div>
          {activePage !== 'home' && (
            <div className="topic-pill">
              <span className="topic-indicator-dot" />
              <span className="topic-pill-text" title={investigation.topic}>
                {investigation.topic}
              </span>
              <button 
                type="button" 
                className="reanalyze-btn" 
                title="Re-run Evidence Synthesis"
                onClick={() => startAnalysis(investigation.topic)}
              >
                <RotateCcw size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search / Filter input */}
      <div className="topbar-center">
        <div className={`global-search-container ${searchFocused ? 'focused' : ''}`}>
          <Search size={15} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search claims, sources, or empirical keywords..." 
            className="global-search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = (e.target as HTMLInputElement).value;
                if (target.trim()) {
                  startAnalysis(target);
                }
              }
            }}
          />
          <kbd className="search-kbd font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="topbar-right">
        {/* Replay Intro Gateway */}
        <button
          type="button"
          className="topbar-action-btn intro-replay-btn"
          onClick={replayIntro}
          title="Replay Cinematic Introduction"
        >
          <Play size={13} className="text-blue" />
          <span className="btn-label">Replay Intro</span>
        </button>

        {/* Why am I seeing this explainability trigger */}
        <button
          type="button"
          className="topbar-action-btn"
          title="Explain NEXA Synthesis Methodology"
          onClick={() => openWhySeeingThis(
            'NEXA Evidence Synthesis Methodology',
            'NEXA applies epistemological clustering across multi-source literature: instead of averaging conflicting findings into a false consensus, it maps divergent experimental conditions, study populations, and outcome metrics into discrete Agreements, Conflicts, and Explore Next frontiers.'
          )}
        >
          <HelpCircle size={15} />
          <span className="btn-label">Methodology</span>
        </button>

        {/* Save Investigation button */}
        {activePage !== 'home' && (
          <button
            type="button"
            className={`topbar-action-btn ${isSaved ? 'btn-saved' : ''}`}
            onClick={handleSaveInvestigation}
            title={isSaved ? 'Investigation Saved' : 'Save Investigation to Notebook'}
          >
            {isSaved ? <Check size={15} className="text-green" /> : <Bookmark size={15} />}
            <span className="btn-label">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        )}

        {/* Mini AI Assistant trigger */}
        <button
          type="button"
          className={`assistant-trigger-btn ${isAssistantOpen ? 'active' : ''}`}
          onClick={() => toggleAssistant()}
          title="Ask contextual questions about this evidence"
        >
          <Sparkles size={14} className="assistant-sparkle-icon" />
          <span>Ask About Evidence</span>
        </button>
      </div>

      <style>{`
        .nexa-topbar {
          height: var(--topbar-height);
          background: rgba(11, 16, 32, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 35;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .page-meta {
          display: flex;
          align-items: center;
          gap: 1.15rem;
        }

        .page-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 13.5px;
        }

        .crumb-root {
          color: var(--text-dim);
          font-weight: 600;
        }

        .crumb-divider {
          color: var(--text-dim);
        }

        .crumb-current {
          color: var(--text-primary);
          font-weight: 600;
        }

        .topic-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid var(--border-subtle);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 12.5px;
        }

        .topic-indicator-dot {
          width: 6px;
          height: 6px;
          background: var(--accent-cyan);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--accent-cyan);
        }

        .topic-pill-text {
          color: var(--text-secondary);
          font-weight: 500;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .reanalyze-btn {
          color: var(--text-dim);
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 3px;
          transition: all 0.15s ease;
        }

        .reanalyze-btn:hover {
          color: var(--accent-blue);
          transform: rotate(-45deg);
        }

        .topbar-center {
          flex: 1;
          max-width: 440px;
          margin: 0 1.5rem;
        }

        .global-search-container {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.45rem 0.85rem;
          transition: all 0.2s ease;
        }

        .global-search-container.focused {
          border-color: var(--accent-blue);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 2px rgba(91, 140, 255, 0.15);
        }

        .search-icon {
          color: var(--text-muted);
        }

        .global-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 13px;
          font-family: inherit;
        }

        .global-search-input::placeholder {
          color: var(--text-dim);
        }

        .search-kbd {
          font-size: 10px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .topbar-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.8rem;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.18s ease;
        }

        .topbar-action-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-medium);
          color: var(--text-primary);
        }

        .topbar-action-btn.btn-saved {
          border-color: rgba(55, 217, 150, 0.3);
          background: rgba(55, 217, 150, 0.08);
          color: var(--accent-green);
        }

        .text-green {
          color: var(--accent-green);
        }

        .assistant-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.9rem;
          background: linear-gradient(135deg, rgba(91, 140, 255, 0.2) 0%, rgba(139, 124, 255, 0.2) 100%);
          border: 1px solid rgba(91, 140, 255, 0.35);
          border-radius: var(--radius-md);
          color: #DDD6FE;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(91, 140, 255, 0.15);
        }

        .assistant-trigger-btn:hover {
          background: linear-gradient(135deg, rgba(91, 140, 255, 0.3) 0%, rgba(139, 124, 255, 0.3) 100%);
          border-color: rgba(91, 140, 255, 0.55);
          color: #FFF;
          box-shadow: 0 0 20px rgba(91, 140, 255, 0.3);
        }

        .assistant-trigger-btn.active {
          background: linear-gradient(135deg, #5B8CFF 0%, #8B7CFF 100%);
          color: #FFF;
          border-color: transparent;
        }

        .assistant-sparkle-icon {
          color: #A78BFA;
        }

        @media (max-width: 900px) {
          .topbar-center {
            display: none;
          }
          .btn-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
