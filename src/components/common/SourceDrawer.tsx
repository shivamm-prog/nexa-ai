import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Copy, 
  Check, 
  Layers, 
  Quote, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { Source } from '../../types';

export const SourceDrawer: React.FC = () => {
  const { 
    selectedSource, 
    closeSourceDrawer, 
    investigation, 
    openClaimModal, 
    saveItem, 
    isItemSaved, 
    addToast 
  } = useResearch();

  const [copied, setCopied] = useState(false);

  if (!selectedSource) return null;

  const isSaved = isItemSaved(selectedSource.title);

  // Retrieve claims referenced by this source
  const referencedClaims = investigation.claims.filter(claim => 
    claim.supportingSourceIds.includes(selectedSource.id) || 
    claim.opposingSourceIds.includes(selectedSource.id)
  );

  const formatCitation = () => {
    return `${selectedSource.authors} (${selectedSource.year}). "${selectedSource.title}." ${selectedSource.publisher}. DOI: ${selectedSource.doi || 'N/A'}`;
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(formatCitation());
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Citation Copied',
      message: 'APA citation copied to clipboard.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSource = () => {
    if (!isSaved) {
      saveItem({
        type: 'source',
        title: selectedSource.title,
        preview: selectedSource.summary,
        topic: investigation.topic,
        metadata: {
          year: selectedSource.year,
          type: selectedSource.type,
          relevance: `${selectedSource.relevance}%`
        },
        rawItem: selectedSource
      });
    }
  };

  const getStanceClass = (stance: string) => {
    switch (stance) {
      case 'Supports':
        return 'nexa-badge-emerald';
      case 'Critical':
        return 'nexa-badge-rose';
      case 'Mixed':
        return 'nexa-badge-amber';
      default:
        return 'nexa-badge-cyan';
    }
  };

  return (
    <div className="drawer-overlay animate-fade-in" onClick={closeSourceDrawer}>
      <div className="drawer-panel animate-slide-in" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-top">
            <div className="source-type-pill">
              <BookOpen size={13} />
              <span>{selectedSource.type}</span>
              <span className="year-dot">•</span>
              <span>{selectedSource.year}</span>
            </div>
            <div className="header-actions">
              <button 
                type="button" 
                className={`drawer-action-btn ${isSaved ? 'active' : ''}`}
                onClick={handleSaveSource}
                title={isSaved ? 'Source Saved' : 'Save Source to Notebook'}
              >
                {isSaved ? <Check size={14} className="text-emerald" /> : <Bookmark size={14} />}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button 
                type="button" 
                className="drawer-close-btn"
                onClick={closeSourceDrawer}
                title="Close Drawer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <h2 className="drawer-source-title">{selectedSource.title}</h2>

          <div className="source-metadata-strip">
            <div className="author-pub">
              <span className="authors-text">{selectedSource.authors}</span>
              <span className="publisher-text">{selectedSource.publisher}</span>
            </div>
          </div>

          <div className="source-badges-row">
            <span className={`nexa-badge ${getStanceClass(selectedSource.stance)}`}>
              Stance: {selectedSource.stance}
            </span>
            <span className="nexa-badge nexa-badge-cyan">
              Relevance: {selectedSource.relevance}% Match
            </span>
            <span className="nexa-badge nexa-badge-neutral">
              Used in {selectedSource.insightsUsedCount} Synthesis Insights
            </span>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Executive Summary */}
          <section className="drawer-section">
            <h4 className="section-label">Source Synthesis &amp; Scope</h4>
            <p className="summary-paragraph">{selectedSource.summary}</p>
          </section>

          {/* Key Direct Evidence Quote */}
          <section className="drawer-section">
            <div className="section-label-row">
              <h4 className="section-label">Extracted Empirical Evidence</h4>
              <Quote size={14} className="text-cyan" />
            </div>
            <div className="evidence-callout">
              <div className="quote-mark">“</div>
              <p className="evidence-quote">{selectedSource.evidenceSnippet}</p>
            </div>
            <div className="key-quote-box">
              <span className="key-quote-label">Key Author Statement:</span>
              <p className="key-quote-text">"{selectedSource.keyQuote}"</p>
            </div>
          </section>

          {/* Methodology & Sampling */}
          {(selectedSource.methodology || selectedSource.sampleSize) && (
            <section className="drawer-section">
              <h4 className="section-label">Methodology &amp; Parameters</h4>
              <div className="methodology-grid">
                {selectedSource.methodology && (
                  <div className="meta-box">
                    <span className="meta-sub">Design</span>
                    <span className="meta-val">{selectedSource.methodology}</span>
                  </div>
                )}
                {selectedSource.sampleSize && (
                  <div className="meta-box">
                    <span className="meta-sub">Sample Size</span>
                    <span className="meta-val font-mono">{selectedSource.sampleSize}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Referenced Claims */}
          <section className="drawer-section">
            <div className="section-label-row">
              <h4 className="section-label">Extracted Claims ({referencedClaims.length})</h4>
              <Layers size={14} className="text-violet" />
            </div>
            <div className="claims-list">
              {referencedClaims.map((claim) => {
                const isSupporting = claim.supportingSourceIds.includes(selectedSource.id);
                return (
                  <div 
                    key={claim.id} 
                    className="drawer-claim-card"
                    onClick={() => openClaimModal(claim)}
                  >
                    <div className="claim-card-top">
                      <span className={`claim-status-indicator ${isSupporting ? 'supported' : 'opposing'}`}>
                        {isSupporting ? 'Supports Claim' : 'Challenges Claim'}
                      </span>
                      <span className="claim-cat">{claim.category}</span>
                    </div>
                    <p className="claim-card-text">{claim.text}</p>
                    <div className="claim-card-footer">
                      <span className="view-link">Inspect Evidence Balance</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Citation & Attribution Box */}
          <section className="drawer-section">
            <h4 className="section-label">Academic Citation (APA)</h4>
            <div className="citation-box">
              <p className="citation-text font-mono">{formatCitation()}</p>
              <div className="citation-actions">
                <button 
                  type="button" 
                  className="copy-citation-btn"
                  onClick={handleCopyCitation}
                >
                  {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                  <span>{copied ? 'Citation Copied' : 'Copy Citation'}</span>
                </button>
                {selectedSource.url && (
                  <a 
                    href={selectedSource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="doi-link"
                  >
                    <span>Inspect DOI/Index</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="verification-notice">
            <ShieldCheck size={14} className="text-emerald" />
            <span>NEXA Verifiable Metadata • Source verified from open academic indexes</span>
          </div>
        </div>
      </div>

      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 6, 12, 0.7);
          backdrop-filter: blur(6px);
          z-index: 150;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-panel {
          width: 100%;
          max-width: 580px;
          height: 100%;
          background: var(--bg-surface);
          border-left: 1px solid var(--border-medium);
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .animate-slide-in {
          animation: slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .drawer-header {
          padding: 1.5rem 1.75rem 1.25rem;
          background: var(--bg-surface-elevated);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .drawer-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .source-type-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(56, 189, 248, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(56, 189, 248, 0.25);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .year-dot {
          color: var(--text-dim);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .drawer-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .drawer-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .drawer-action-btn.active {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
          color: var(--accent-emerald);
        }

        .drawer-close-btn {
          color: var(--text-dim);
          padding: 5px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .drawer-close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .drawer-source-title {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.35;
          color: var(--text-primary);
        }

        .source-metadata-strip {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .authors-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .publisher-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .source-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .drawer-body {
          flex: 1;
          padding: 1.5rem 1.75rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .drawer-section {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .section-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-paragraph {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .evidence-callout {
          position: relative;
          background: rgba(8, 14, 26, 0.75);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-left: 3px solid var(--accent-cyan);
          border-radius: var(--radius-md);
          padding: 1rem 1.15rem 1rem 1.5rem;
        }

        .quote-mark {
          position: absolute;
          top: -6px;
          left: 6px;
          font-size: 2rem;
          color: rgba(56, 189, 248, 0.25);
          font-family: Georgia, serif;
          line-height: 1;
        }

        .evidence-quote {
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--text-primary);
          font-style: italic;
        }

        .key-quote-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
          font-size: 0.775rem;
        }

        .key-quote-label {
          display: block;
          color: var(--text-dim);
          font-weight: 600;
          font-size: 0.7rem;
          margin-bottom: 0.2rem;
        }

        .key-quote-text {
          color: var(--text-secondary);
          margin: 0;
        }

        .methodology-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .meta-box {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-sub {
          font-size: 0.675rem;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 600;
        }

        .meta-val {
          font-size: 0.775rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .font-mono {
          font-family: var(--font-mono);
        }

        .claims-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .drawer-claim-card {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .drawer-claim-card:hover {
          border-color: rgba(56, 189, 248, 0.35);
          transform: translateX(3px);
          background: var(--bg-surface-hover);
        }

        .claim-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .claim-status-indicator {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .claim-status-indicator.supported {
          background: rgba(16, 185, 129, 0.12);
          color: var(--accent-emerald);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .claim-status-indicator.opposing {
          background: rgba(244, 63, 94, 0.12);
          color: var(--accent-rose);
          border: 1px solid rgba(244, 63, 94, 0.25);
        }

        .claim-cat {
          font-size: 0.7rem;
          color: var(--text-dim);
        }

        .claim-card-text {
          font-size: 0.8125rem;
          color: var(--text-primary);
          line-height: 1.45;
          margin-bottom: 0.5rem;
        }

        .claim-card-footer {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.725rem;
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .citation-box {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem;
        }

        .citation-text {
          font-size: 0.725rem;
          line-height: 1.5;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          word-break: break-all;
        }

        .citation-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .copy-citation-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.75rem;
          transition: all 0.15s ease;
        }

        .copy-citation-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .doi-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--accent-cyan);
        }

        .drawer-footer {
          padding: 0.85rem 1.75rem;
          background: var(--bg-surface-elevated);
          border-top: 1px solid var(--border-subtle);
        }

        .verification-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.725rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
