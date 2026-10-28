import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  GitCompare, 
  Compass, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { RECENT_INVESTIGATIONS, EXAMPLE_TOPICS } from '../data/mockData';
import { SpatialCore } from '../components/common/SpatialCore';

export const HomePage: React.FC = () => {
  const { startAnalysis, isAnalyzing } = useResearch();
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAnalysis(topicInput || 'Impact of AI on Education');
  };

  const handleChipClick = (topic: string) => {
    setTopicInput(topic);
    startAnalysis(topic);
  };

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Header Lockup */}
      <header className="hero-header">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-badge-sparkle" />
          <span>AUTONOMOUS EVIDENCE INTELLIGENCE</span>
        </div>
        <h1 className="hero-title">
          Turn scattered information into <span className="gradient-text">evidence you can understand.</span>
        </h1>
        <p className="hero-subtitle">
          NEXA is a structured research platform for students. It transforms dense academic literature into verifiable claims, common ground, and empirical conflicts — without fake certainty.
        </p>
      </header>

      {/* Spatially Alive 3D NEXA Intelligence Core */}
      <SpatialCore isConverging={isAnalyzing} />

      {/* Main Topic Input Workspace */}
      <section className="search-workspace-card nexa-card">
        <div className="input-banner-label">
          <span className="banner-dot" />
          <span>RESEARCH DISCOVERY WORKSPACE</span>
        </div>

        <h2 className="search-lead-heading">What do you want to investigate?</h2>

        <form onSubmit={handleSubmit} className="topic-search-form">
          <div className="input-wrapper">
            <Search size={20} className="input-search-icon" />
            <input 
              type="text" 
              className="topic-main-input"
              placeholder='e.g., "Impact of AI on Education"'
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              autoFocus
            />
            {topicInput && (
              <button 
                type="button" 
                className="clear-input-btn"
                onClick={() => setTopicInput('')}
              >
                Clear
              </button>
            )}
          </div>

          <button type="submit" className="nexa-btn-amber analyze-submit-btn">
            <span>Analyze Evidence</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Example Topic Chips */}
        <div className="example-chips-row">
          <span className="chips-label">Suggested Inquiries:</span>
          <div className="chips-group">
            {EXAMPLE_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                className="topic-chip"
                onClick={() => handleChipClick(topic)}
              >
                <span>{topic}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Workflow Explanation: Sources -> Analyze -> Compare -> Discover */}
      <section className="workflow-section">
        <div className="workflow-header-row">
          <span className="section-kicker">EPISTEMIC WORKFLOW</span>
          <h2 className="section-heading">How NEXA Structures Research</h2>
        </div>

        <div className="workflow-grid">
          <div className="workflow-step-card nexa-card">
            <div className="step-num-pill font-mono">01</div>
            <div className="step-icon-box box-cyan">
              <BookOpen size={20} />
            </div>
            <h3 className="card-heading">Sources</h3>
            <p className="step-card-desc">
              Indexes peer-reviewed papers, policy directives, and field audits with complete citation transparency.
            </p>
          </div>

          <div className="workflow-step-arrow">
            <ChevronRight size={20} />
          </div>

          <div className="workflow-step-card nexa-card">
            <div className="step-num-pill font-mono">02</div>
            <div className="step-icon-box box-blue">
              <Layers size={20} />
            </div>
            <h3 className="card-heading">Analyze</h3>
            <p className="step-card-desc">
              Extracts discrete claims, study demographics, experimental constraints, and methodology parameters.
            </p>
          </div>

          <div className="workflow-step-arrow">
            <ChevronRight size={20} />
          </div>

          <div className="workflow-step-card nexa-card">
            <div className="step-num-pill font-mono">03</div>
            <div className="step-icon-box box-violet">
              <GitCompare size={20} />
            </div>
            <h3 className="card-heading">Compare</h3>
            <p className="step-card-desc">
              Maps points of consensus (Agreements) and isolates why sources differ (Disagreements) without forcing averaging.
            </p>
          </div>

          <div className="workflow-step-arrow">
            <ChevronRight size={20} />
          </div>

          <div className="workflow-step-card nexa-card hero-workflow-step">
            <div className="step-num-pill highlight font-mono">04</div>
            <div className="step-icon-box box-amber">
              <Compass size={20} />
            </div>
            <h3 className="card-heading text-amber">Discover</h3>
            <p className="step-card-desc">
              Identifies underexplored academic frontiers (Explore Next) to formulate original student thesis questions.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Investigations */}
      <section className="recents-section">
        <div className="recents-header-row">
          <div>
            <span className="section-kicker">NOTEBOOK</span>
            <h2 className="section-heading">Recent Investigations</h2>
          </div>
          <span className="recents-count font-mono">{RECENT_INVESTIGATIONS.length} Synthesized Models</span>
        </div>

        <div className="recents-cards-grid">
          {RECENT_INVESTIGATIONS.map((inv) => (
            <div 
              key={inv.id} 
              className="recent-card nexa-card"
              onClick={() => handleChipClick(inv.topic)}
            >
              <div className="recent-card-top">
                <span className={`status-pill pill-${inv.badgeColor}`}>
                  <CheckCircle2 size={12} />
                  <span>{inv.status}</span>
                </span>
                <div className="recent-date">
                  <Clock size={12} />
                  <span className="font-mono">{inv.date}</span>
                </div>
              </div>

              <h3 className="card-heading recent-topic-title">{inv.topic}</h3>

              <div className="recent-metrics-strip">
                <div className="metric-cell">
                  <span className="cell-num font-mono">{inv.sourcesCount}</span>
                  <span className="cell-label">Sources</span>
                </div>
                <div className="metric-cell">
                  <span className="cell-num font-mono">{inv.claimsCount}</span>
                  <span className="cell-label">Claims</span>
                </div>
                <div className="metric-cell">
                  <span className="cell-num font-mono">{inv.insightsCount}</span>
                  <span className="cell-label">Insights</span>
                </div>
              </div>

              <div className="recent-card-footer">
                <span className="open-link">Open Investigation</span>
                <ArrowRight size={13} className="open-arrow" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Epistemic Trust Banner */}
      <footer className="epistemic-trust-footer nexa-card">
        <div className="trust-content">
          <ShieldCheck size={20} className="trust-icon" />
          <p className="trust-text">
            <strong>NEXA Epistemic Protocol:</strong> We strictly avoid synthetic certainty. Claims are tagged as <em>Supported</em>, <em>Mixed</em>, or <em>Disputed</em> strictly based on verifiable source citations. Students remain sovereign in their research decisions.
          </p>
        </div>
      </footer>

      <style>{`
        .home-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem 2.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
          position: relative;
          z-index: 5;
        }

        .hero-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
          position: relative;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(91, 140, 255, 0.08);
          border: 1px solid rgba(91, 140, 255, 0.25);
          color: #7AA2FF;
          padding: 0.35rem 0.95rem;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .hero-badge-sparkle {
          color: var(--accent-cyan);
        }

        .gradient-text {
          background: linear-gradient(135deg, #FFFFFF 20%, #7AA2FF 60%, #4CC9F0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 17px;
          color: var(--text-secondary);
          max-width: 740px;
          line-height: 1.65;
        }

        /* Search Workspace */
        .search-workspace-card {
          padding: 2.25rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
          border-color: rgba(91, 140, 255, 0.2);
          box-shadow: var(--shadow-lg), 0 0 50px rgba(91, 140, 255, 0.06);
        }

        .input-banner-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
        }

        .banner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
        }

        .search-lead-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .topic-search-form {
          display: flex;
          gap: 1rem;
        }

        .input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(11, 16, 32, 0.7);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.25rem;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: var(--accent-blue);
          background: rgba(14, 20, 36, 0.9);
          box-shadow: 0 0 0 3px rgba(91, 140, 255, 0.15);
        }

        .input-search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .topic-main-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 1.05rem;
          font-family: inherit;
        }

        .topic-main-input::placeholder {
          color: var(--text-dim);
        }

        .clear-input-btn {
          font-size: 12px;
          color: var(--text-dim);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .clear-input-btn:hover {
          color: var(--text-primary);
        }

        .analyze-submit-btn {
          height: 52px;
          white-space: nowrap;
        }

        .example-chips-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.85rem;
          padding-top: 0.25rem;
        }

        .chips-label {
          font-size: 13px;
          color: var(--text-dim);
          font-weight: 500;
        }

        .chips-group {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .topic-chip {
          padding: 0.35rem 0.85rem;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .topic-chip:hover {
          background: rgba(91, 140, 255, 0.1);
          color: #7AA2FF;
          border-color: rgba(91, 140, 255, 0.35);
          transform: translateY(-1px);
        }

        /* Workflow */
        .workflow-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .workflow-header-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .section-kicker {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .workflow-grid {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 1rem;
        }

        .workflow-step-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
        }

        .hero-workflow-step {
          border-color: rgba(246, 185, 74, 0.3);
          background: linear-gradient(180deg, rgba(246, 185, 74, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
        }

        .text-amber {
          color: var(--accent-amber);
        }

        .step-num-pill {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }

        .step-num-pill.highlight {
          color: var(--accent-amber);
          background: rgba(246, 185, 74, 0.15);
        }

        .step-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .box-cyan {
          background: rgba(76, 201, 240, 0.12);
          color: var(--accent-cyan);
          border: 1px solid rgba(76, 201, 240, 0.25);
        }

        .box-blue {
          background: rgba(91, 140, 255, 0.12);
          color: var(--accent-blue);
          border: 1px solid rgba(91, 140, 255, 0.25);
        }

        .box-violet {
          background: rgba(139, 124, 255, 0.12);
          color: var(--accent-violet);
          border: 1px solid rgba(139, 124, 255, 0.25);
        }

        .box-amber {
          background: rgba(246, 185, 74, 0.12);
          color: var(--accent-amber);
          border: 1px solid rgba(246, 185, 74, 0.3);
        }

        .step-card-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        .workflow-step-arrow {
          color: var(--text-dim);
          display: flex;
          align-items: center;
        }

        /* Recents */
        .recents-section {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .recents-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .recents-count {
          font-size: 13px;
          color: var(--text-muted);
        }

        .recents-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .recent-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .recent-card:hover .open-arrow {
          transform: translateX(4px);
          color: var(--accent-blue);
        }

        .recent-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 12px;
          font-weight: 600;
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-full);
        }

        .pill-emerald { background: var(--accent-green-subtle); color: var(--accent-green); }
        .pill-blue { background: var(--accent-blue-subtle); color: var(--accent-blue); }
        .pill-cyan { background: var(--accent-cyan-subtle); color: var(--accent-cyan); }
        .pill-violet { background: var(--accent-violet-subtle); color: var(--accent-violet); }

        .recent-date {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 12px;
          color: var(--text-dim);
        }

        .recent-topic-title {
          font-size: 1.05rem;
          margin: 0;
        }

        .recent-metrics-strip {
          display: flex;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.6rem;
        }

        .metric-cell {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cell-num {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cell-label {
          font-size: 11px;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .recent-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: var(--accent-blue);
          font-weight: 600;
          padding-top: 0.35rem;
          border-top: 1px solid var(--border-subtle);
        }

        .open-arrow {
          transition: transform 0.2s ease;
        }

        .epistemic-trust-footer {
          padding: 1.35rem 1.75rem;
        }

        .trust-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .trust-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .trust-text {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
        }

        .trust-text strong {
          color: var(--text-primary);
        }

        @media (max-width: 900px) {
          .workflow-grid {
            flex-direction: column;
          }
          .workflow-step-arrow {
            transform: rotate(90deg);
            justify-content: center;
          }
          .topic-search-form {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
