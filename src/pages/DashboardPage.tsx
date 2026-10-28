import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Search, 
  BookOpen, 
  ArrowRight, 
  ChevronRight,
  HelpCircle,
  Network,
  FileText,
  Sparkles
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { ClaimStatus } from '../types';

// Fast professional animated counter component (0 -> target)
const AnimatedCount: React.FC<{ target: number }> = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600; // 600ms snappy professional animation
    const steps = 18;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

export const DashboardPage: React.FC = () => {
  const { 
    investigation, 
    openSourceDrawer, 
    openClaimModal, 
    openWhySeeingThis,
    setActivePage 
  } = useResearch();

  const [sourceSearch, setSourceSearch] = useState('');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('All');
  const [claimSearch, setClaimSearch] = useState('');
  const [selectedClaimStatus, setSelectedClaimStatus] = useState<string>('All');

  const { overviewStats, sources, claims, agreements, disagreements } = investigation;

  // Filter Sources
  const filteredSources = sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(sourceSearch.toLowerCase()) ||
                          source.authors.toLowerCase().includes(sourceSearch.toLowerCase()) ||
                          source.summary.toLowerCase().includes(sourceSearch.toLowerCase());
    const matchesType = selectedSourceType === 'All' || source.type === selectedSourceType;
    return matchesSearch && matchesType;
  });

  // Filter Claims
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.text.toLowerCase().includes(claimSearch.toLowerCase()) ||
                          claim.category.toLowerCase().includes(claimSearch.toLowerCase()) ||
                          claim.explanation.toLowerCase().includes(claimSearch.toLowerCase());
    const matchesStatus = selectedClaimStatus === 'All' || claim.status === selectedClaimStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'Supported':
        return <span className="nexa-badge nexa-badge-green">🟢 Supported</span>;
      case 'Mixed':
        return <span className="nexa-badge nexa-badge-amber">🟠 Mixed</span>;
      case 'Disputed':
        return <span className="nexa-badge nexa-badge-coral">🔴 Disputed</span>;
    }
  };

  const getStanceClass = (stance: string) => {
    switch (stance) {
      case 'Supports': return 'stance-supports';
      case 'Critical': return 'stance-critical';
      case 'Mixed': return 'stance-mixed';
      default: return 'stance-neutral';
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Overview Top Strip */}
      <section className="dashboard-header-strip nexa-card">
        <div className="header-meta-left">
          <div className="topic-context-tag">
            <span className="live-dot" />
            <span className="font-mono">SYNTHESIS OVERVIEW</span>
          </div>
          <h1 className="investigation-title">{investigation.topic}</h1>
          <p className="investigation-summary-text">{investigation.summary}</p>
        </div>

        <div className="header-meta-right">
          <button 
            type="button" 
            className="nexa-btn-amber-outline"
            onClick={() => setActivePage('literature-survey')}
            title="Generate comprehensive Literature Survey"
          >
            <Sparkles size={15} />
            <span>Literature Survey</span>
          </button>

          <button 
            type="button" 
            className="nexa-btn-amber hero-map-cta-btn"
            onClick={() => setActivePage('evidence-map')}
          >
            <Network size={16} />
            <span>Launch Evidence Map</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 5 Animated Statistics Metric Cards with Strict Semantic Accents */}
      <section className="stats-metric-grid">
        {/* Card 1: Sources (Electric Blue #5B8CFF) */}
        <div className="stat-card nexa-card card-accent-blue">
          <div className="stat-card-top">
            <div className="stat-icon-wrap bg-blue-subtle text-blue">
              <BookOpen size={18} />
            </div>
            <span className="stat-num font-mono text-blue">
              <AnimatedCount target={overviewStats.sourcesCount} />
            </span>
          </div>
          <div className="stat-card-body">
            <h3 className="stat-label">Sources Indexed</h3>
            <p className="stat-subtext">Across academic, government, industry and news sources.</p>
          </div>
        </div>

        {/* Card 2: Claims (Cyan #4CC9F0) */}
        <div className="stat-card nexa-card card-accent-cyan">
          <div className="stat-card-top">
            <div className="stat-icon-wrap bg-cyan-subtle text-cyan">
              <FileText size={18} />
            </div>
            <span className="stat-num font-mono text-cyan">
              <AnimatedCount target={overviewStats.claimsCount} />
            </span>
          </div>
          <div className="stat-card-body">
            <h3 className="stat-label">Extracted Claims</h3>
            <p className="stat-subtext">Empirical findings parsed from study methodologies.</p>
          </div>
        </div>

        {/* Card 3: Agreements (Green #37D996) */}
        <div className="stat-card nexa-card card-accent-green">
          <div className="stat-card-top">
            <div className="stat-icon-wrap bg-green-subtle text-green">
              <CheckCircle2 size={18} />
            </div>
            <span className="stat-num font-mono text-green">
              <AnimatedCount target={overviewStats.agreementsCount} />
            </span>
          </div>
          <div className="stat-card-body">
            <h3 className="stat-label">Agreements (Consensus)</h3>
            <p className="stat-subtext">Findings corroborated across independent trials.</p>
          </div>
        </div>

        {/* Card 4: Disagreements (Coral #FF6B7A) */}
        <div className="stat-card nexa-card card-accent-coral">
          <div className="stat-card-top">
            <div className="stat-icon-wrap bg-coral-subtle text-coral">
              <AlertTriangle size={18} />
            </div>
            <span className="stat-num font-mono text-coral">
              <AnimatedCount target={overviewStats.disagreementsCount} />
            </span>
          </div>
          <div className="stat-card-body">
            <h3 className="stat-label">Disagreements (Friction)</h3>
            <p className="stat-subtext">Where sources differ due to population or constraints.</p>
          </div>
        </div>

        {/* Card 5: Explore Next (Amber #F6B94A) */}
        <div 
          className="stat-card nexa-card card-accent-amber hero-stat-card" 
          onClick={() => setActivePage('explore-next')}
        >
          <div className="stat-card-top">
            <div className="stat-icon-wrap bg-amber-subtle text-amber">
              <Compass size={18} />
            </div>
            <span className="stat-num font-mono text-amber">
              <AnimatedCount target={overviewStats.exploreNextCount} />
            </span>
          </div>
          <div className="stat-card-body">
            <h3 className="stat-label text-amber">Explore Next</h3>
            <p className="stat-subtext">Potential unexplored area worthy of student research.</p>
          </div>
          <div className="stat-card-action text-amber">
            <span>Inspect Frontier</span>
            <ChevronRight size={13} />
          </div>
        </div>
      </section>

      {/* Synthesis Highlights Row: Agreement Highlight & Disagreement Highlight */}
      <section className="synthesis-highlights-grid">
        {/* Agreement Feature Box (Green #37D996) */}
        <div className="highlight-panel nexa-card highlight-agreement">
          <div className="panel-header">
            <div className="panel-title-lock">
              <CheckCircle2 size={16} className="text-green" />
              <span className="panel-title-tag text-green font-mono">PRIMARY COMMON GROUND</span>
            </div>
            <button 
              type="button" 
              className="methodology-link"
              onClick={() => openWhySeeingThis(agreements[0]?.title || 'Common Ground', agreements[0]?.whyAmISeeingThis || '')}
            >
              <HelpCircle size={13} />
              <span>Why am I seeing this?</span>
            </button>
          </div>

          <h3 className="card-heading highlight-headline">{agreements[0]?.title}</h3>
          <p className="highlight-quote">"{agreements[0]?.statement}"</p>

          <div className="supporting-evidence-preview">
            <span className="preview-label font-mono">Corroborating Excerpts ({agreements[0]?.extractedEvidence.length}):</span>
            <ul className="evidence-preview-list">
              {agreements[0]?.extractedEvidence.slice(0, 2).map((snippet, i) => (
                <li key={i} className="evidence-preview-item">
                  <span className="item-bullet bullet-green" />
                  <span>{snippet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-footer">
            <span className="footer-meta font-mono">4 Supporting Sources • High Evidence</span>
            <button 
              type="button" 
              className="view-map-link text-green"
              onClick={() => setActivePage('evidence-map')}
            >
              <span>View in Map</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Disagreement Feature Box (Coral #FF6B7A) */}
        <div className="highlight-panel nexa-card highlight-disagreement">
          <div className="panel-header">
            <div className="panel-title-lock">
              <AlertTriangle size={16} className="text-coral" />
              <span className="panel-title-tag text-coral font-mono">PRIMARY EVIDENCE CONFLICT</span>
            </div>
            <button 
              type="button" 
              className="methodology-link"
              onClick={() => openWhySeeingThis(disagreements[0]?.question || 'Evidence Conflict', disagreements[0]?.whyAmISeeingThis || '')}
            >
              <HelpCircle size={13} />
              <span>Why am I seeing this?</span>
            </button>
          </div>

          <h3 className="card-heading highlight-headline">{disagreements[0]?.question}</h3>

          <div className="disagreement-contrast-cards">
            <div className="contrast-card side-a">
              <div className="contrast-top">
                <span className="contrast-stance text-green">Chen et al. (2024)</span>
                <span className="contrast-badge-green font-mono">Supports Efficiency</span>
              </div>
              <p className="contrast-quote">"{disagreements[0]?.sourceA.claimSnippet}"</p>
            </div>

            <div className="contrast-card side-b">
              <div className="contrast-top">
                <span className="contrast-stance text-coral">Vance et al. (2023)</span>
                <span className="contrast-badge-coral font-mono">Raises Concern</span>
              </div>
              <p className="contrast-quote">"{disagreements[0]?.sourceB.claimSnippet}"</p>
            </div>
          </div>

          <div className="why-different-summary">
            <span className="why-diff-label font-mono">Why are these sources different?</span>
            <p className="why-diff-text">
              Differences in study populations (novice STEM students needing pacing vs senior thesis researchers requiring epistemic friction) and software design (Socratic scaffolding vs unconstrained raw output).
            </p>
          </div>

          <div className="panel-footer">
            <span className="footer-meta font-mono">Contextual Divergence • 0% False Averaging</span>
            <button 
              type="button" 
              className="view-map-link text-coral"
              onClick={() => setActivePage('evidence-map')}
            >
              <span>Inspect Tension</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: SOURCE OVERVIEW (8+ Sources) */}
      <section className="dashboard-section sources-section">
        <div className="section-header-bar">
          <div>
            <span className="section-kicker">BIBLIOGRAPHIC SAMPLE</span>
            <h2 className="section-heading">Source Overview ({filteredSources.length})</h2>
            <p className="section-main-desc">
              Peer-reviewed papers, government frameworks, and industry audits indexed for this investigation.
            </p>
          </div>

          {/* Source Search & Filters */}
          <div className="filters-control-bar">
            <div className="search-pill">
              <Search size={14} className="search-pill-icon" />
              <input 
                type="text" 
                placeholder="Filter by title, author, or keyword..."
                value={sourceSearch}
                onChange={(e) => setSourceSearch(e.target.value)}
                className="search-pill-input"
              />
            </div>

            <div className="type-filters-row">
              {['All', 'Research Paper', 'Government Report', 'Academic Article', 'Industry Report', 'News Article'].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`type-filter-btn ${selectedSourceType === type ? 'active' : ''}`}
                  onClick={() => setSelectedSourceType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Source Cards Grid */}
        <div className="sources-grid">
          {filteredSources.map((source) => (
            <div 
              key={source.id} 
              className="source-card nexa-card"
              onClick={() => openSourceDrawer(source)}
            >
              <div className="source-card-header">
                <div className="source-type-box">
                  <BookOpen size={13} />
                  <span>{source.type}</span>
                  <span className="year-dot">•</span>
                  <span className="font-mono">{source.year}</span>
                </div>
                <span className="relevance-score font-mono">{source.relevance}% Match</span>
              </div>

              <h3 className="card-heading source-title" title={source.title}>{source.title}</h3>
              
              <div className="source-author-line">
                <span className="source-author">{source.authors}</span>
                <span className="source-publisher">{source.publisher}</span>
              </div>

              <p className="source-summary-snippet">{source.summary}</p>

              <div className="source-card-footer">
                <span className={`stance-pill ${getStanceClass(source.stance)}`}>
                  {source.stance}
                </span>

                <button 
                  type="button" 
                  className="view-evidence-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openSourceDrawer(source);
                  }}
                >
                  <span>View Evidence</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: CLAIM ANALYSIS (12 Claims) */}
      <section className="dashboard-section claims-section">
        <div className="section-header-bar">
          <div>
            <span className="section-kicker">EXTRACTED PROPOSITIONS</span>
            <h2 className="section-heading">Claim Analysis ({filteredClaims.length})</h2>
            <p className="section-main-desc">
              Extracted claims categorized by empirical consensus, mixed evidence, and disputed status. Click any claim to inspect opposing viewpoints.
            </p>
          </div>

          {/* Claim Search & Status Filters */}
          <div className="filters-control-bar">
            <div className="search-pill">
              <Search size={14} className="search-pill-icon" />
              <input 
                type="text" 
                placeholder="Search claims or categories..."
                value={claimSearch}
                onChange={(e) => setClaimSearch(e.target.value)}
                className="search-pill-input"
              />
            </div>

            <div className="type-filters-row">
              {['All', 'Supported', 'Mixed', 'Disputed'].map(status => (
                <button
                  key={status}
                  type="button"
                  className={`type-filter-btn ${selectedClaimStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedClaimStatus(status)}
                >
                  {status === 'All' ? 'All Claims' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Claims Table / List with Refined Alignment */}
        <div className="claims-list-container nexa-card">
          <div className="claims-table-header font-mono">
            <span className="th-claim">CLAIM PROPOSITION</span>
            <span className="th-category">CATEGORY</span>
            <span className="th-status">EVIDENCE STATUS</span>
            <span className="th-sources">SUPPORT BALANCE</span>
            <span className="th-action">ACTION</span>
          </div>

          <div className="claims-rows">
            {filteredClaims.map((claim) => (
              <div 
                key={claim.id} 
                className="claim-row-card"
                onClick={() => openClaimModal(claim)}
              >
                <div className="td-claim">
                  <h4 className="claim-text-title">{claim.text}</h4>
                  <p className="claim-sub-explanation">{claim.explanation}</p>
                </div>

                <div className="td-category">
                  <span className="category-tag">{claim.category}</span>
                </div>

                <div className="td-status">
                  {getStatusBadge(claim.status)}
                </div>

                <div className="td-sources">
                  <div className="support-tally font-mono">
                    <span className="tally-support">
                      +{claim.supportingSourceIds.length}
                    </span>
                    <span className="tally-slash">/</span>
                    <span className="tally-oppose">
                      -{claim.opposingSourceIds.length}
                    </span>
                  </div>
                  <span className="tally-label">
                    {claim.opposingSourceIds.length === 0 ? 'Uncontested' : 'Mixed Evidence'}
                  </span>
                </div>

                <div className="td-action">
                  <button type="button" className="inspect-claim-btn">
                    <span>Inspect</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .dashboard-container {
          padding: 2.5rem 2.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 2.75rem;
          max-width: 1380px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 5;
        }

        .dashboard-header-strip {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 2rem 2.25rem;
          gap: 2rem;
        }

        .header-meta-left {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-width: 860px;
        }

        .topic-context-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
        }

        .investigation-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #FFF;
        }

        .investigation-summary-text {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .hero-map-cta-btn {
          white-space: nowrap;
          padding: 0.75rem 1.4rem;
        }

        /* 5 Metric Cards */
        .stats-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.15rem;
        }

        .stat-card {
          padding: 1.35rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .card-accent-blue:hover { border-color: rgba(91, 140, 255, 0.4); }
        .card-accent-cyan:hover { border-color: rgba(76, 201, 240, 0.4); }
        .card-accent-green:hover { border-color: rgba(55, 217, 150, 0.4); }
        .card-accent-coral:hover { border-color: rgba(255, 107, 122, 0.4); }
        .card-accent-amber:hover { border-color: rgba(246, 185, 74, 0.5); }

        .hero-stat-card {
          border-color: rgba(246, 185, 74, 0.3);
          background: linear-gradient(180deg, rgba(246, 185, 74, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
          cursor: pointer;
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-blue-subtle { background: var(--accent-blue-subtle); }
        .bg-cyan-subtle { background: var(--accent-cyan-subtle); }
        .bg-green-subtle { background: var(--accent-green-subtle); }
        .bg-coral-subtle { background: var(--accent-coral-subtle); }
        .bg-amber-subtle { background: var(--accent-amber-subtle); }

        .text-blue { color: var(--accent-blue); }
        .text-cyan { color: var(--accent-cyan); }
        .text-green { color: var(--accent-green); }
        .text-coral { color: var(--accent-coral); }
        .text-amber { color: var(--accent-amber); }

        .stat-num {
          font-size: 1.85rem;
          font-weight: 700;
        }

        .stat-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .stat-subtext {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.45;
          margin: 0;
        }

        .stat-card-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(246, 185, 74, 0.2);
        }

        /* Synthesis Highlights */
        .synthesis-highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .highlight-panel {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .highlight-agreement {
          border-top: 3px solid var(--accent-green);
        }

        .highlight-disagreement {
          border-top: 3px solid var(--accent-coral);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title-lock {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .panel-title-tag {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .methodology-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 12px;
          color: var(--text-muted);
          transition: color 0.15s ease;
        }

        .methodology-link:hover {
          color: var(--accent-cyan);
        }

        .highlight-headline {
          font-size: 1.15rem;
          margin: 0;
          color: var(--text-primary);
        }

        .highlight-quote {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.55;
          font-style: italic;
          margin: 0;
        }

        .supporting-evidence-preview {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
        }

        .preview-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .evidence-preview-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin: 0;
          padding: 0;
        }

        .evidence-preview-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .item-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .bullet-green { background: var(--accent-green); }

        /* Disagreement Split Box */
        .disagreement-contrast-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .contrast-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .contrast-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .contrast-stance {
          font-size: 12px;
          font-weight: 700;
        }

        .contrast-badge-green {
          font-size: 11px;
          color: var(--accent-green);
          background: var(--accent-green-subtle);
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
        }

        .contrast-badge-coral {
          font-size: 11px;
          color: var(--accent-coral);
          background: var(--accent-coral-subtle);
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
        }

        .contrast-quote {
          font-size: 13px;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.45;
          margin: 0;
        }

        .why-different-summary {
          background: var(--accent-coral-subtle);
          border-left: 2px solid var(--accent-coral);
          padding: 0.75rem 0.95rem;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .why-diff-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-coral);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .why-diff-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .panel-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-subtle);
        }

        .footer-meta {
          font-size: 12px;
          color: var(--text-muted);
        }

        .view-map-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 13px;
          font-weight: 600;
        }

        /* Sources Section */
        .dashboard-section {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .section-header-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .section-kicker {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .section-main-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0.2rem 0 0 0;
          max-width: 680px;
        }

        .filters-control-bar {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .search-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.85rem;
        }

        .search-pill-icon {
          color: var(--text-muted);
        }

        .search-pill-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 13px;
          width: 240px;
        }

        .type-filters-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .type-filter-btn {
          font-size: 12px;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .type-filter-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
        }

        .type-filter-btn.active {
          background: rgba(91, 140, 255, 0.15);
          border-color: rgba(91, 140, 255, 0.4);
          color: #7AA2FF;
          font-weight: 600;
        }

        /* Source Grid */
        .sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1.25rem;
        }

        .source-card {
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
        }

        .source-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .source-type-box {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 12px;
          color: #7AA2FF;
          background: rgba(91, 140, 255, 0.1);
          padding: 0.15rem 0.55rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .year-dot {
          color: var(--text-dim);
        }

        .relevance-score {
          font-size: 12px;
          color: var(--text-muted);
        }

        .source-title {
          font-size: 15px;
          line-height: 1.35;
          margin: 0;
        }

        .source-author-line {
          display: flex;
          flex-direction: column;
          font-size: 13px;
        }

        .source-author {
          color: var(--text-secondary);
        }

        .source-publisher {
          color: var(--text-dim);
          font-style: italic;
        }

        .source-summary-snippet {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .source-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          margin-top: auto;
        }

        .stance-pill {
          font-size: 12px;
          font-weight: 600;
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-full);
        }

        .stance-supports { background: var(--accent-green-subtle); color: var(--accent-green); }
        .stance-critical { background: var(--accent-coral-subtle); color: var(--accent-coral); }
        .stance-mixed { background: var(--accent-amber-subtle); color: var(--accent-amber); }

        .view-evidence-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-blue);
          transition: color 0.15s ease;
        }

        .view-evidence-btn:hover {
          color: #8EB2FF;
        }

        /* Claims Table / List */
        .claims-list-container {
          padding: 0;
          overflow: hidden;
        }

        .claims-table-header {
          display: grid;
          grid-template-columns: 3fr 1.2fr 1.2fr 1.2fr 90px;
          padding: 0.95rem 1.75rem;
          background: rgba(255, 255, 255, 0.025);
          border-bottom: 1px solid var(--border-subtle);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 0.06em;
        }

        .claims-rows {
          display: flex;
          flex-direction: column;
        }

        .claim-row-card {
          display: grid;
          grid-template-columns: 3fr 1.2fr 1.2fr 1.2fr 90px;
          align-items: center;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .claim-row-card:last-child {
          border-bottom: none;
        }

        .claim-row-card:hover {
          background: rgba(255, 255, 255, 0.035);
        }

        .td-claim {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding-right: 1.5rem;
        }

        .claim-text-title {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
          margin: 0;
        }

        .claim-sub-explanation {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.45;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-tag {
          font-size: 12px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }

        .support-tally {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 13px;
        }

        .tally-support { color: var(--accent-green); font-weight: 700; }
        .tally-slash { color: var(--text-dim); }
        .tally-oppose { color: var(--accent-coral); font-weight: 700; }

        .tally-label {
          font-size: 12px;
          color: var(--text-dim);
        }

        .inspect-claim-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-blue);
        }

        @media (max-width: 1100px) {
          .stats-metric-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .synthesis-highlights-grid {
            grid-template-columns: 1fr;
          }
          .claims-table-header {
            display: none;
          }
          .claim-row-card {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};
