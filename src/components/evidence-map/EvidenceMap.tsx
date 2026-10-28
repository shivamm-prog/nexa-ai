import React, { useState, useRef, useEffect } from 'react';
import { 
  Network, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronRight,
  ShieldCheck,
  Eye,
  FileText
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

type MapFilter = 'all' | 'agreements' | 'disagreements' | 'explore';

export const EvidenceMap: React.FC = () => {
  const { 
    investigation, 
    openSourceDrawer, 
    openClaimModal, 
    openWhySeeingThis,
    settings,
    setActivePage
  } = useResearch();

  const [activeFilter, setActiveFilter] = useState<MapFilter>('all');
  const [hoveredSourceId, setHoveredSourceId] = useState<string | null>(null);
  const [hoveredClaimId, setHoveredClaimId] = useState<string | null>(null);
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 1420, height: 860 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSvgDimensions({
          width: Math.max(1420, containerRef.current.scrollWidth || 1420),
          height: Math.max(860, containerRef.current.scrollHeight || 860)
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [investigation, activeFilter]);

  const sources = investigation.sources;
  const keyClaims = investigation.claims.slice(0, 6); // Core 6 representative claim nodes
  const agreements = investigation.agreements;
  const disagreements = investigation.disagreements;
  const exploreNext = investigation.exploreNext;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(1.25, Math.max(0.75, +(prev + delta).toFixed(2))));
  };

  const hasHoverActive = Boolean(hoveredSourceId || hoveredClaimId || hoveredBranchId);

  return (
    <div className="evidence-map-container" ref={containerRef}>
      {/* Visual Canvas Control Toolbar */}
      <div className="map-toolbar">
        <div className="toolbar-left">
          <div className="map-title-lock">
            <div className="map-icon-box">
              <Network size={18} />
            </div>
            <div>
              <h2 className="map-heading">Spatial Evidence Relational Topology</h2>
              <span className="map-subheading">Source Nodes → Extracted Claims → NEXA Analyzer → Agreements, Conflicts &amp; Frontiers</span>
            </div>
          </div>

          {/* Filter Pills with Strict Semantic Colors */}
          <div className="filter-pill-group">
            <button 
              type="button" 
              className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <Layers size={13} />
              <span>All ({sources.length} Sources)</span>
            </button>
            <button 
              type="button" 
              className={`filter-pill filter-pill-green ${activeFilter === 'agreements' ? 'active' : ''}`}
              onClick={() => setActiveFilter('agreements')}
            >
              <CheckCircle2 size={13} />
              <span>Agreements ({agreements.length})</span>
            </button>
            <button 
              type="button" 
              className={`filter-pill filter-pill-coral ${activeFilter === 'disagreements' ? 'active' : ''}`}
              onClick={() => setActiveFilter('disagreements')}
            >
              <AlertTriangle size={13} />
              <span>Conflicts ({disagreements.length})</span>
            </button>
            <button 
              type="button" 
              className={`filter-pill filter-pill-amber ${activeFilter === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveFilter('explore')}
            >
              <Compass size={13} />
              <span>Explore Next (1)</span>
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <button 
            type="button" 
            className={`spatial-view-toggle ${is3DMode ? 'active' : ''}`}
            onClick={() => setIs3DMode(!is3DMode)}
            title="Toggle Spatial 3D Perspective Depth"
          >
            <Eye size={13} />
            <span>{is3DMode ? '3D Perspective' : 'Flat 2D View'}</span>
          </button>

          <div className="zoom-controls">
            <button 
              type="button" 
              className="zoom-btn" 
              onClick={() => handleZoom(-0.1)}
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="zoom-level font-mono">{Math.round(zoomLevel * 100)}%</span>
            <button 
              type="button" 
              className="zoom-btn" 
              onClick={() => handleZoom(0.1)}
              title="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
            <button 
              type="button" 
              className="zoom-btn" 
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Spatial Graph Canvas Area */}
      <div 
        className={`graph-canvas-wrapper ${is3DMode ? 'canvas-3d-perspective' : ''}`} 
        style={{ transform: `scale(${zoomLevel}) ${is3DMode ? 'rotateX(4deg)' : ''}`, transformOrigin: 'top center' }}
      >
        {/* SVG Bezier Flow Connections Layer */}
        <svg 
          className="connectors-svg" 
          width={svgDimensions.width} 
          height={svgDimensions.height}
        >
          <defs>
            <linearGradient id="flow-blue-to-claim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4CC9F0" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="flow-claim-to-hub" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4CC9F0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B7CFF" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="flow-hub-to-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#37D996" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="flow-hub-to-coral" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B7CFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF6B7A" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="flow-hub-to-amber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F6B94A" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Paths: Sources (Col 1) -> Claims (Col 2) */}
          {sources.slice(0, 6).map((source, idx) => {
            const startX = 260;
            const startY = 100 + idx * 115;
            const endX = 350;
            const endY = 100 + idx * 115;
            const isHovered = hoveredSourceId === source.id;

            return (
              <path
                key={`line-src-${source.id}`}
                d={`M ${startX} ${startY} C ${startX + 40} ${startY}, ${endX - 40} ${endY}, ${endX} ${endY}`}
                className={`flow-path ${isHovered ? 'active-path' : ''} ${settings.showFlowAnimations ? 'animated-flow' : ''}`}
                stroke={isHovered ? '#5B8CFF' : 'rgba(91, 140, 255, 0.22)'}
                strokeWidth={isHovered ? 2.5 : 1.2}
                fill="none"
              />
            );
          })}

          {/* Paths: Claims (Col 2) -> NEXA Analyzer (Col 3) */}
          {keyClaims.map((claim, idx) => {
            const startX = 610;
            const startY = 100 + idx * 115;
            const hubX = 720;
            const hubY = 380;
            const isHovered = hoveredClaimId === claim.id;

            return (
              <path
                key={`line-clm-${claim.id}`}
                d={`M ${startX} ${startY} C ${startX + 60} ${startY}, ${hubX - 60} ${hubY}, ${hubX} ${hubY}`}
                className={`flow-path ${isHovered ? 'active-cyan-path' : ''} ${settings.showFlowAnimations ? 'animated-flow' : ''}`}
                stroke={isHovered ? '#4CC9F0' : 'rgba(76, 201, 240, 0.2)'}
                strokeWidth={isHovered ? 2.5 : 1.2}
                fill="none"
              />
            );
          })}

          {/* Paths: NEXA Analyzer (Col 3) -> Agreements (Green #37D996) */}
          {(activeFilter === 'all' || activeFilter === 'agreements') &&
            agreements.map((agr, idx) => {
              const hubX = 960;
              const hubY = 380;
              const endX = 1050;
              const endY = 85 + idx * 110;
              const isHovered = hoveredBranchId === agr.id;

              return (
                <path
                  key={`line-agr-${agr.id}`}
                  d={`M ${hubX} ${hubY} C ${hubX + 50} ${hubY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
                  className={`flow-path ${isHovered ? 'active-green-path' : ''} ${settings.showFlowAnimations ? 'animated-flow' : ''}`}
                  stroke={isHovered ? '#37D996' : 'rgba(55, 217, 150, 0.25)'}
                  strokeWidth={isHovered ? 2.5 : 1.2}
                  fill="none"
                />
              );
            })}

          {/* Paths: NEXA Analyzer (Col 3) -> Disagreements (Coral #FF6B7A) */}
          {(activeFilter === 'all' || activeFilter === 'disagreements') &&
            disagreements.map((dis, idx) => {
              const hubX = 960;
              const hubY = 380;
              const endX = 1050;
              const endY = 530 + idx * 140;
              const isHovered = hoveredBranchId === dis.id;

              return (
                <path
                  key={`line-dis-${dis.id}`}
                  d={`M ${hubX} ${hubY} C ${hubX + 50} ${hubY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
                  className={`flow-path ${isHovered ? 'active-coral-path' : ''} ${settings.showFlowAnimations ? 'animated-flow' : ''}`}
                  stroke={isHovered ? '#FF6B7A' : 'rgba(255, 107, 122, 0.28)'}
                  strokeWidth={isHovered ? 2.5 : 1.2}
                  fill="none"
                />
              );
            })}

          {/* Paths: NEXA Analyzer (Col 3) -> Explore Next (Amber #F6B94A) */}
          {(activeFilter === 'all' || activeFilter === 'explore') && (
            <path
              d={`M 960 380 C 1000 380, 1010 770, 1050 770`}
              className={`flow-path ${hoveredBranchId === exploreNext.id ? 'active-amber-path' : ''} ${settings.showFlowAnimations ? 'animated-flow' : ''}`}
              stroke={hoveredBranchId === exploreNext.id ? '#F6B94A' : 'rgba(246, 185, 74, 0.4)'}
              strokeWidth={hoveredBranchId === exploreNext.id ? 3 : 1.5}
              fill="none"
            />
          )}
        </svg>

        {/* 4-Tier Interactive Spatial Flow Columns */}
        <div className="map-columns-grid">
          {/* TIER 1: SOURCE NODES */}
          <div className="map-column column-sources">
            <div className="column-header-banner">
              <span className="column-step-badge font-mono">INPUT LAYER</span>
              <h3 className="column-title">Sources ({sources.length})</h3>
              <p className="column-desc">Peer-reviewed &amp; policy evidence</p>
            </div>

            <div className="sources-nodes-stack">
              {sources.slice(0, 6).map((source) => {
                const isHovered = hoveredSourceId === source.id;
                const isFaded = hasHoverActive && !isHovered;
                return (
                  <div
                    key={source.id}
                    className={`map-node-card source-node-card nexa-card ${isHovered ? 'hovered' : ''} ${isFaded ? 'faded' : ''}`}
                    onMouseEnter={() => setHoveredSourceId(source.id)}
                    onMouseLeave={() => setHoveredSourceId(null)}
                    onClick={() => openSourceDrawer(source)}
                  >
                    <div className="source-node-top">
                      <span className="source-node-type">{source.type}</span>
                      <span className="source-node-year font-mono">{source.year}</span>
                    </div>

                    <h4 className="source-node-title" title={source.title}>
                      {source.title}
                    </h4>

                    <div className="source-node-bottom">
                      <span className={`stance-badge stance-${source.stance.toLowerCase()}`}>
                        {source.stance}
                      </span>
                      <span className="source-relevance-chip font-mono">{source.relevance}% Match</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIER 2: EXTRACTED CLAIM NODES */}
          <div className="map-column column-claims">
            <div className="column-header-banner">
              <span className="column-step-badge font-mono">EXTRACTION LAYER</span>
              <h3 className="column-title">Claims ({keyClaims.length})</h3>
              <p className="column-desc">Extracted empirical findings</p>
            </div>

            <div className="claims-nodes-stack">
              {keyClaims.map((claim) => {
                const isHovered = hoveredClaimId === claim.id;
                const isFaded = hasHoverActive && !isHovered;
                return (
                  <div
                    key={claim.id}
                    className={`map-node-card claim-node-card nexa-card ${isHovered ? 'hovered' : ''} ${isFaded ? 'faded' : ''}`}
                    onMouseEnter={() => setHoveredClaimId(claim.id)}
                    onMouseLeave={() => setHoveredClaimId(null)}
                    onClick={() => openClaimModal(claim)}
                  >
                    <div className="claim-node-top">
                      <span className="claim-category-chip">{claim.category}</span>
                      <span className={`claim-status-badge status-${claim.status.toLowerCase()}`}>
                        {claim.status === 'Supported' && '🟢 Supported'}
                        {claim.status === 'Mixed' && '🟠 Mixed'}
                        {claim.status === 'Disputed' && '🔴 Disputed'}
                      </span>
                    </div>

                    <h4 className="claim-node-text" title={claim.text}>
                      {claim.text}
                    </h4>

                    <div className="claim-node-footer">
                      <span className="claim-sources-tag font-mono">
                        +{claim.supportingSourceIds.length} / -{claim.opposingSourceIds.length} sources
                      </span>
                      <div className="inspect-arrow">
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIER 3: NEXA ANALYZER NEURAL HUB */}
          <div className="map-column column-hub">
            <div className="hub-container">
              <div className="hub-outer-gyro" />
              <div className="hub-pulse-ring" />

              <div className="hub-core-card nexa-card-elevated animate-core-pulse">
                <div className="hub-core-header">
                  <div className="hub-sparkle-dot" />
                  <span className="hub-core-tag font-mono">AI REASONING CORE</span>
                </div>

                <div className="hub-brand-title">
                  <Layers size={22} className="hub-brand-icon" />
                  <span>NEXA ANALYZER</span>
                </div>

                <p className="hub-core-summary">
                  Multi-vector epistemology matrix. Evaluates 8 sources against 12 claims without synthetic certainty.
                </p>

                <div className="hub-stats-badges">
                  <div className="hub-stat-pill">
                    <span className="stat-dot dot-green" />
                    <span>4 Agreements (Consensus)</span>
                  </div>
                  <div className="hub-stat-pill">
                    <span className="stat-dot dot-coral" />
                    <span>2 Conflicts (Divergence)</span>
                  </div>
                  <div className="hub-stat-pill">
                    <span className="stat-dot dot-amber" />
                    <span>1 Explore Next (Frontier)</span>
                  </div>
                </div>

                <div className="hub-verification-lock">
                  <ShieldCheck size={13} className="text-cyan" />
                  <span>Zero Synthetic Averaging</span>
                </div>
              </div>
            </div>
          </div>

          {/* TIER 4: SYNTHESIZED BRANCHES (Green / Coral / Amber) */}
          <div className="map-column column-branches">
            <div className="column-header-banner">
              <span className="column-step-badge font-mono">SYNTHESIS LAYER</span>
              <h3 className="column-title">Relational Findings</h3>
              <p className="column-desc">Agreements, Conflicts &amp; Frontiers</p>
            </div>

            {/* AGREEMENTS (Green #37D996) */}
            {(activeFilter === 'all' || activeFilter === 'agreements') && (
              <div className="branch-group group-agreements">
                <div className="group-heading-row">
                  <div className="group-title-wrap">
                    <span className="group-accent-dot dot-green" />
                    <h4 className="group-title text-green">AGREEMENT (Common Ground)</h4>
                  </div>
                  <span className="group-count-badge badge-green font-mono">{agreements.length} Findings</span>
                </div>

                <div className="branch-cards-stack">
                  {agreements.map((agr) => {
                    const isHovered = hoveredBranchId === agr.id;
                    const isFaded = hasHoverActive && !isHovered;
                    return (
                      <div
                        key={agr.id}
                        className={`map-node-card branch-node-card agr-node-card nexa-card ${isHovered ? 'hovered' : ''} ${isFaded ? 'faded' : ''}`}
                        onMouseEnter={() => setHoveredBranchId(agr.id)}
                        onMouseLeave={() => setHoveredBranchId(null)}
                        onClick={() => openWhySeeingThis(agr.title, agr.whyAmISeeingThis)}
                      >
                        <div className="branch-card-header">
                          <span className="confidence-tag tag-green">{agr.confidence}</span>
                          <span className="source-counter-tag font-mono">{agr.supportingSourceIds.length} Sources</span>
                        </div>

                        <h5 className="branch-title">{agr.title}</h5>
                        <p className="branch-statement">"{agr.statement}"</p>

                        <div className="branch-footer">
                          <span className="epistemic-hint text-green">Epistemic Consensus</span>
                          <ChevronRight size={12} className="text-green" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DISAGREEMENTS (Coral #FF6B7A) */}
            {(activeFilter === 'all' || activeFilter === 'disagreements') && (
              <div className="branch-group group-disagreements">
                <div className="group-heading-row">
                  <div className="group-title-wrap">
                    <span className="group-accent-dot dot-coral" />
                    <h4 className="group-title text-coral">DISAGREEMENT (Evidence Conflicts)</h4>
                  </div>
                  <span className="group-count-badge badge-coral font-mono">{disagreements.length} Divergences</span>
                </div>

                <div className="branch-cards-stack">
                  {disagreements.map((dis) => {
                    const isHovered = hoveredBranchId === dis.id;
                    const isFaded = hasHoverActive && !isHovered;
                    return (
                      <div
                        key={dis.id}
                        className={`map-node-card branch-node-card dis-node-card nexa-card ${isHovered ? 'hovered' : ''} ${isFaded ? 'faded' : ''}`}
                        onMouseEnter={() => setHoveredBranchId(dis.id)}
                        onMouseLeave={() => setHoveredBranchId(null)}
                        onClick={() => openWhySeeingThis(dis.question, dis.whyAmISeeingThis)}
                      >
                        <div className="branch-card-header">
                          <span className="confidence-tag tag-coral">Empirical Divergence</span>
                          <span className="source-counter-tag font-mono">2 Paradigms</span>
                        </div>

                        <h5 className="branch-title text-primary">{dis.question}</h5>

                        <div className="mini-conflict-split">
                          <div className="split-side side-support">
                            <span className="split-label text-green">Supports</span>
                            <p className="split-quote">"{dis.sourceA.claimSnippet}"</p>
                          </div>
                          <div className="split-side side-concern">
                            <span className="split-label text-coral">Concern</span>
                            <p className="split-quote">"{dis.sourceB.claimSnippet}"</p>
                          </div>
                        </div>

                        <div className="branch-footer">
                          <span className="factor-notice">
                            Why: {dis.whyDifferentFactors[0]?.factor}
                          </span>
                          <ChevronRight size={12} className="text-coral" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXPLORE NEXT (Amber #F6B94A) */}
            {(activeFilter === 'all' || activeFilter === 'explore') && (
              <div className="branch-group group-explore">
                <div className="group-heading-row">
                  <div className="group-title-wrap">
                    <span className="group-accent-dot dot-amber" />
                    <h4 className="group-title text-amber">EXPLORE NEXT (Candidate Frontier)</h4>
                  </div>
                  <span className="group-count-badge badge-amber font-mono">Discovery</span>
                </div>

                <div
                  className={`map-node-card branch-node-card exp-node-card nexa-card ${hoveredBranchId === exploreNext.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredBranchId(exploreNext.id)}
                  onMouseLeave={() => setHoveredBranchId(null)}
                  onClick={() => setActivePage('explore-next')}
                >
                  <div className="branch-card-header">
                    <div className="explore-beacon">
                      <span className="beacon-ping" />
                      <span className="beacon-dot" />
                      <span className="beacon-text">Underexplored Gap</span>
                    </div>
                    <span className="candidate-warning-chip font-mono">Candidate Insight</span>
                  </div>

                  <h5 className="branch-title text-amber">{exploreNext.title}</h5>
                  <p className="branch-statement text-secondary">
                    {exploreNext.underexploredArea}
                  </p>

                  <div className="branch-footer">
                    <span className="gap-stat font-mono">Gap: 87% short trials</span>
                    <span className="explore-link text-amber">
                      <span>Explore Frontier</span>
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .evidence-map-container {
          display: flex;
          flex-direction: column;
          background: #070A12;
          min-height: calc(100vh - var(--topbar-height));
          position: relative;
          overflow: auto;
        }

        .map-toolbar {
          padding: 1.15rem 2rem;
          background: rgba(11, 16, 32, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 25;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .map-title-lock {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .map-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: rgba(91, 140, 255, 0.15);
          border: 1px solid rgba(91, 140, 255, 0.35);
          color: var(--accent-blue);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .map-heading {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          color: #FFF;
        }

        .map-subheading {
          font-size: 13px;
          color: var(--text-muted);
        }

        .filter-pill-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          padding: 0.25rem;
          border-radius: var(--radius-md);
        }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          transition: all 0.18s ease;
        }

        .filter-pill:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .filter-pill.active {
          background: rgba(91, 140, 255, 0.15);
          color: #7AA2FF;
          border: 1px solid rgba(91, 140, 255, 0.35);
          font-weight: 600;
        }

        .filter-pill-green.active {
          background: rgba(55, 217, 150, 0.15);
          color: var(--accent-green);
          border-color: rgba(55, 217, 150, 0.35);
        }

        .filter-pill-coral.active {
          background: rgba(255, 107, 122, 0.15);
          color: var(--accent-coral);
          border-color: rgba(255, 107, 122, 0.35);
        }

        .filter-pill-amber.active {
          background: rgba(246, 185, 74, 0.15);
          color: var(--accent-amber);
          border-color: rgba(246, 185, 74, 0.35);
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .spatial-view-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .spatial-view-toggle.active {
          background: rgba(91, 140, 255, 0.12);
          border-color: rgba(91, 140, 255, 0.35);
          color: #7AA2FF;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.2rem;
        }

        .zoom-btn {
          color: var(--text-dim);
          padding: 0.35rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
        }

        .zoom-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
        }

        .zoom-level {
          font-size: 12px;
          color: var(--text-muted);
          padding: 0 0.4rem;
          min-width: 42px;
          text-align: center;
        }

        .graph-canvas-wrapper {
          position: relative;
          min-width: 1420px;
          padding: 2rem 2.5rem 4rem;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .canvas-3d-perspective {
          perspective: 1200px;
        }

        .connectors-svg {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 5;
        }

        .flow-path {
          transition: stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease;
        }

        .animated-flow {
          stroke-dasharray: 5, 5;
          animation: dashFlow 20s linear infinite;
        }

        .active-path {
          filter: drop-shadow(0 0 8px rgba(91, 140, 255, 0.8));
        }

        .active-cyan-path {
          filter: drop-shadow(0 0 8px rgba(76, 201, 240, 0.8));
        }

        .active-green-path {
          filter: drop-shadow(0 0 8px rgba(55, 217, 150, 0.8));
        }

        .active-coral-path {
          filter: drop-shadow(0 0 8px rgba(255, 107, 122, 0.8));
        }

        .active-amber-path {
          filter: drop-shadow(0 0 10px rgba(246, 185, 74, 0.9));
        }

        /* 4-Tier Columns Grid */
        .map-columns-grid {
          display: grid;
          grid-template-columns: 260px 260px 240px 420px;
          justify-content: space-between;
          position: relative;
          z-index: 10;
        }

        .map-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .column-header-banner {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding-bottom: 0.4rem;
        }

        .column-step-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 0.08em;
        }

        .column-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
          color: #FFF;
        }

        .column-desc {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }

        /* Cards */
        .sources-nodes-stack,
        .claims-nodes-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .map-node-card {
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .map-node-card.faded {
          opacity: 0.35;
        }

        .map-node-card.hovered {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
        }

        .source-node-card.hovered {
          border-color: rgba(91, 140, 255, 0.5);
          box-shadow: 0 0 20px rgba(91, 140, 255, 0.2);
        }

        .claim-node-card.hovered {
          border-color: rgba(76, 201, 240, 0.5);
          box-shadow: 0 0 20px rgba(76, 201, 240, 0.2);
        }

        .source-node-top,
        .claim-node-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .source-node-type {
          font-size: 11px;
          color: #7AA2FF;
          background: rgba(91, 140, 255, 0.1);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .source-node-year {
          font-size: 12px;
          color: var(--text-dim);
        }

        .source-node-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
          margin: 0 0 0.45rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .source-node-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stance-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
        }

        .stance-supports { background: var(--accent-green-subtle); color: var(--accent-green); }
        .stance-critical { background: var(--accent-coral-subtle); color: var(--accent-coral); }
        .stance-mixed { background: var(--accent-amber-subtle); color: var(--accent-amber); }

        .source-relevance-chip {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Claim Nodes */
        .claim-category-chip {
          font-size: 11px;
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .claim-status-badge {
          font-size: 11px;
          font-weight: 600;
        }

        .claim-node-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
          margin: 0 0 0.4rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .claim-node-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-dim);
        }

        /* Hub Core */
        .column-hub {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 140px;
        }

        .hub-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 230px;
        }

        .hub-outer-gyro {
          position: absolute;
          inset: -15px;
          border-radius: 30px;
          border: 1px dashed rgba(91, 140, 255, 0.25);
          animation: spinGyro 30s linear infinite;
        }

        @keyframes spinGyro {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hub-pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 24px;
          border: 1px solid rgba(76, 201, 240, 0.2);
        }

        .hub-core-card {
          width: 100%;
          background: linear-gradient(180deg, #10162B 0%, #0A0F1E 100%);
          border: 1px solid rgba(91, 140, 255, 0.4);
          border-radius: var(--radius-xl);
          padding: 1.35rem 1.15rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(91, 140, 255, 0.15);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          position: relative;
          z-index: 10;
        }

        .hub-core-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .hub-sparkle-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
        }

        .hub-core-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
        }

        .hub-brand-title {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-family);
          font-size: 1.1rem;
          font-weight: 800;
          color: #FFF;
        }

        .hub-brand-icon {
          color: var(--accent-blue);
        }

        .hub-core-summary {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0;
        }

        .hub-stats-badges {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .hub-stat-pill {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.3rem 0.55rem;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dot-green { background: var(--accent-green); box-shadow: 0 0 6px var(--accent-green); }
        .dot-coral { background: var(--accent-coral); box-shadow: 0 0 6px var(--accent-coral); }
        .dot-amber { background: var(--accent-amber); box-shadow: 0 0 6px var(--accent-amber); }

        .hub-verification-lock {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 11px;
          color: var(--accent-cyan);
          background: rgba(76, 201, 240, 0.08);
          border: 1px solid rgba(76, 201, 240, 0.2);
          border-radius: 4px;
          padding: 0.25rem 0.45rem;
        }

        /* Column 4: Branches */
        .column-branches {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .branch-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .group-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .group-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .group-accent-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .group-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .text-green { color: var(--accent-green); }
        .text-coral { color: var(--accent-coral); }
        .text-amber { color: var(--accent-amber); }

        .group-count-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .badge-green { background: var(--accent-green-subtle); color: var(--accent-green); }
        .badge-coral { background: var(--accent-coral-subtle); color: var(--accent-coral); }
        .badge-amber { background: var(--accent-amber-subtle); color: var(--accent-amber); }

        .branch-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .branch-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .confidence-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }

        .tag-green { background: var(--accent-green-subtle); color: var(--accent-green); }
        .tag-coral { background: var(--accent-coral-subtle); color: var(--accent-coral); }

        .source-counter-tag {
          font-size: 12px;
          color: var(--text-dim);
        }

        .branch-title {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.35;
          margin: 0 0 0.3rem 0;
        }

        .branch-statement {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
          font-style: italic;
          margin: 0 0 0.55rem 0;
        }

        .branch-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .epistemic-hint {
          font-size: 12px;
          font-weight: 600;
        }

        /* Disagreement Split Preview */
        .mini-conflict-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem;
          margin-bottom: 0.55rem;
        }

        .split-side {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .split-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .split-quote {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .factor-notice {
          font-size: 12px;
          color: var(--text-dim);
        }

        /* Explore Next Node with Distinct Amber Highlight */
        .exp-node-card {
          border-color: rgba(246, 185, 74, 0.35);
          background: linear-gradient(180deg, rgba(246, 185, 74, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
          box-shadow: 0 0 25px rgba(246, 185, 74, 0.1);
        }

        .exp-node-card.hovered {
          border-color: rgba(246, 185, 74, 0.6);
          box-shadow: 0 0 35px rgba(246, 185, 74, 0.2);
        }

        .explore-beacon {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          position: relative;
        }

        .beacon-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-amber);
          box-shadow: 0 0 8px var(--accent-amber);
        }

        .beacon-ping {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-amber);
          animation: beaconPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .beacon-text {
          font-size: 12px;
          font-weight: 700;
          color: #FDE68A;
          text-transform: uppercase;
        }

        .candidate-warning-chip {
          font-size: 11px;
          font-weight: 600;
          background: var(--accent-amber-subtle);
          color: var(--accent-amber);
          border: 1px solid rgba(246, 185, 74, 0.3);
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }

        .gap-stat {
          font-size: 12px;
          color: var(--text-dim);
        }

        .explore-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
