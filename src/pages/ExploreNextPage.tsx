import React from 'react';
import { 
  Compass, 
  Bookmark, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  GraduationCap, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { WhyAmISeeingThis } from '../components/common/WhyAmISeeingThis';

export const ExploreNextPage: React.FC = () => {
  const { 
    investigation, 
    startAnalysis, 
    saveItem, 
    isItemSaved 
  } = useResearch();

  const exploreItem = investigation.exploreNext;
  const isSaved = isItemSaved(exploreItem.title);

  const handleSave = () => {
    if (!isSaved) {
      saveItem({
        type: 'explore_next',
        title: exploreItem.title,
        preview: exploreItem.underexploredArea,
        topic: investigation.topic,
        metadata: {
          status: exploreItem.candidateLabel,
          surfacedReason: exploreItem.whyThisSurfaced
        },
        rawItem: exploreItem
      });
    }
  };

  const handleExploreNewTopic = () => {
    startAnalysis(exploreItem.title);
  };

  return (
    <div className="explore-next-container animate-fade-in">
      {/* Hero Header */}
      <header className="explore-hero-header">
        <div className="frontier-pill">
          <span className="beacon-dot" />
          <span className="font-mono">RESEARCH FRONTIER IDENTIFIED</span>
        </div>
        <h1 className="page-heading">Explore Next</h1>
        <p className="explore-subtitle">
          NEXA isolates missing methodologies, underrepresented populations, and unexamined long-term outcomes to surface candidate research questions for original student inquiry.
        </p>
      </header>

      {/* Main Hero Card: Potential Unexplored Area with Special Amber Highlight */}
      <div className="unexplored-hero-card nexa-card-elevated">
        <div className="card-top-banner">
          <div className="banner-left">
            <span className="hero-kicker font-mono">HERO DISCOVERY</span>
            <span className="hero-badge-tag font-mono">Potential Unexplored Area</span>
          </div>
          <div className="candidate-warning-banner">
            <ShieldAlert size={15} className="text-amber" />
            <span className="warning-text font-mono">
              Candidate insight — verify before using as a research claim.
            </span>
          </div>
        </div>

        <h2 className="frontier-heading">"{exploreItem.underexploredArea}"</h2>

        {/* Why this surfaced */}
        <div className="why-surfaced-section">
          <div className="section-label-row">
            <span className="section-title font-mono">WHY THIS SURFACED</span>
            <span className="sample-basis font-mono">Cross-referencing {investigation.sources.length} analyzed sources</span>
          </div>
          <div className="surfaced-callout nexa-card">
            <p className="surfaced-body">{exploreItem.whyThisSurfaced}</p>
            <div className="gap-metric-box">
              <span className="gap-num font-mono">3.2%</span>
              <span className="gap-label font-mono">{exploreItem.methodologyGap}</span>
            </div>
          </div>
        </div>

        {/* Supporting Context 3-Column Grid */}
        <div className="supporting-context-grid">
          {/* Column A: Related Claims */}
          <div className="context-col nexa-card">
            <div className="col-header">
              <Layers size={15} className="text-cyan" />
              <h3 className="card-heading col-title">Related Analyzed Claims</h3>
            </div>
            <ul className="context-list">
              {exploreItem.supportingContext.relatedClaims.map((claimText, idx) => (
                <li key={idx} className="context-item">
                  <span className="bullet-cyan" />
                  <span className="context-text">{claimText}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column B: Relevant Sources */}
          <div className="context-col nexa-card">
            <div className="col-header">
              <BookOpen size={15} className="text-green" />
              <h3 className="card-heading col-title">Relevant Sources in Literature</h3>
            </div>
            <ul className="context-list">
              {exploreItem.supportingContext.relevantSources.map((sourceText, idx) => (
                <li key={idx} className="context-item">
                  <span className="bullet-green" />
                  <span className="context-text">{sourceText}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column C: Related Search Topics */}
          <div className="context-col nexa-card">
            <div className="col-header">
              <Compass size={15} className="text-amber" />
              <h3 className="card-heading col-title">Related Research Directions</h3>
            </div>
            <ul className="context-list">
              {exploreItem.supportingContext.relatedTopics.map((topicText, idx) => (
                <li 
                  key={idx} 
                  className="context-item interactive"
                  onClick={() => startAnalysis(topicText)}
                  title={`Analyze "${topicText}"`}
                >
                  <span className="bullet-amber" />
                  <span className="context-text text-amber">{topicText}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Student Research Directions */}
        <div className="suggested-directions-section nexa-card">
          <div className="directions-header">
            <GraduationCap size={17} className="text-amber" />
            <h3 className="card-heading directions-title">Candidate Student Research Directions &amp; Methodology Suggestions</h3>
          </div>
          <div className="directions-cards">
            {exploreItem.suggestedResearchDirections.map((direction, idx) => (
              <div key={idx} className="direction-card">
                <span className="direction-number font-mono">0{idx + 1}</span>
                <p className="direction-text">{direction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Accordion */}
        <WhyAmISeeingThis 
          rationale={exploreItem.whyAmISeeingThis}
          contextTitle="Explainability: Why NEXA surfaced this gap"
          defaultExpanded={true}
        />

        {/* Action Buttons */}
        <div className="hero-card-actions">
          <div className="action-disclaimer">
            The student remains sovereign. NEXA surfaces methodological blindspots to empower rigorous thesis design.
          </div>

          <div className="actions-buttons-cluster">
            <button 
              type="button" 
              className={`nexa-btn-secondary ${isSaved ? 'btn-saved' : ''}`}
              onClick={handleSave}
            >
              {isSaved ? <Check size={16} className="text-green" /> : <Bookmark size={16} />}
              <span>{isSaved ? 'Insight Saved' : 'Save Insight'}</span>
            </button>

            <button 
              type="button" 
              className="nexa-btn-primary"
              onClick={handleExploreNewTopic}
            >
              <Compass size={16} />
              <span>Explore This Topic</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .explore-next-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 2.5rem 2rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          position: relative;
          z-index: 5;
        }

        .explore-hero-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.85rem;
        }

        .frontier-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(246, 185, 74, 0.12);
          border: 1px solid rgba(246, 185, 74, 0.3);
          color: #FDE68A;
          font-size: 11px;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.06em;
        }

        .beacon-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent-amber);
          box-shadow: 0 0 8px var(--accent-amber);
        }

        .explore-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 720px;
          line-height: 1.6;
        }

        /* Hero Card */
        .unexplored-hero-card {
          border-color: rgba(246, 185, 74, 0.35);
          background: linear-gradient(180deg, rgba(246, 185, 74, 0.06) 0%, rgba(14, 20, 36, 0.85) 100%);
          box-shadow: var(--shadow-lg), 0 0 60px rgba(246, 185, 74, 0.12);
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .card-top-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .hero-kicker {
          font-size: 11px;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero-badge-tag {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-amber);
          background: var(--accent-amber-subtle);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(246, 185, 74, 0.3);
        }

        .candidate-warning-banner {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(246, 185, 74, 0.12);
          border: 1px solid rgba(246, 185, 74, 0.35);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.75rem;
        }

        .warning-text {
          font-size: 12px;
          font-weight: 600;
          color: #FDE68A;
        }

        .frontier-heading {
          font-size: 1.65rem;
          font-weight: 700;
          line-height: 1.4;
          color: #FFF;
          margin: 0;
        }

        /* Why Surfaced */
        .why-surfaced-section {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .section-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .sample-basis {
          font-size: 12px;
          color: var(--text-dim);
        }

        .surfaced-callout {
          padding: 1.35rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          background: rgba(0, 0, 0, 0.3);
        }

        .surfaced-body {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
          flex: 1;
        }

        .gap-metric-box {
          background: rgba(246, 185, 74, 0.08);
          border: 1px solid rgba(246, 185, 74, 0.25);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.15rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 150px;
        }

        .gap-num {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--accent-amber);
        }

        .gap-label {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.35;
        }

        /* Supporting Context Grid */
        .supporting-context-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .context-col {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .col-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .col-title {
          font-size: 14px;
          margin: 0;
        }

        .context-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin: 0;
          padding: 0;
        }

        .context-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .context-item.interactive {
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .context-item.interactive:hover {
          transform: translateX(4px);
        }

        .bullet-cyan {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-cyan);
          margin-top: 6px;
          flex-shrink: 0;
        }

        .bullet-green {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-green);
          margin-top: 6px;
          flex-shrink: 0;
        }

        .bullet-amber {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-amber);
          margin-top: 6px;
          flex-shrink: 0;
        }

        /* Directions */
        .suggested-directions-section {
          padding: 1.35rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          background: rgba(0, 0, 0, 0.25);
        }

        .directions-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .directions-title {
          font-size: 14px;
          margin: 0;
        }

        .directions-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }

        .direction-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .direction-number {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-amber);
        }

        .direction-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0;
        }

        /* Card Actions */
        .hero-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.35rem;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .action-disclaimer {
          font-size: 13px;
          color: var(--text-dim);
          max-width: 500px;
        }

        .actions-buttons-cluster {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .btn-saved {
          border-color: rgba(55, 217, 150, 0.4);
          color: var(--accent-green);
        }

        @media (max-width: 900px) {
          .supporting-context-grid,
          .directions-cards {
            grid-template-columns: 1fr;
          }
          .surfaced-callout {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
