import React from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  BookOpen, 
  HelpCircle,
  Bookmark,
  Check
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { WhyAmISeeingThis } from './WhyAmISeeingThis';

export const ClaimModal: React.FC = () => {
  const { 
    selectedClaim, 
    closeClaimModal, 
    investigation, 
    openSourceDrawer, 
    saveItem, 
    isItemSaved 
  } = useResearch();

  if (!selectedClaim) return null;

  const isSaved = isItemSaved(selectedClaim.text);

  const supportingSources = investigation.sources.filter(s => 
    selectedClaim.supportingSourceIds.includes(s.id)
  );

  const opposingSources = investigation.sources.filter(s => 
    selectedClaim.opposingSourceIds.includes(s.id)
  );

  const handleSaveClaim = () => {
    if (!isSaved) {
      saveItem({
        type: 'insight',
        title: selectedClaim.text,
        preview: selectedClaim.evidenceSummary,
        topic: investigation.topic,
        metadata: {
          category: selectedClaim.category,
          status: selectedClaim.status,
          supporting: supportingSources.length,
          opposing: opposingSources.length
        },
        rawItem: selectedClaim
      });
    }
  };

  const getStatusBadge = () => {
    switch (selectedClaim.status) {
      case 'Supported':
        return (
          <span className="nexa-badge nexa-badge-emerald">
            <CheckCircle2 size={13} />
            <span>🟢 Supported Consensus</span>
          </span>
        );
      case 'Mixed':
        return (
          <span className="nexa-badge nexa-badge-amber">
            <AlertTriangle size={13} />
            <span>🟠 Mixed Evidence</span>
          </span>
        );
      case 'Disputed':
        return (
          <span className="nexa-badge nexa-badge-rose">
            <XCircle size={13} />
            <span>🔴 Disputed / Conflicting</span>
          </span>
        );
    }
  };

  return (
    <div className="nexa-backdrop animate-fade-in" onClick={closeClaimModal}>
      <div className="claim-modal-container animate-pop-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="claim-modal-header">
          <div className="header-meta-row">
            <div className="header-meta-left">
              <span className="category-pill">{selectedClaim.category}</span>
              {getStatusBadge()}
            </div>
            <div className="header-meta-right">
              <button
                type="button"
                className={`save-action-btn ${isSaved ? 'active' : ''}`}
                onClick={handleSaveClaim}
                title="Bookmark this Claim Insight"
              >
                {isSaved ? <Check size={14} className="text-emerald" /> : <Bookmark size={14} />}
                <span>{isSaved ? 'Saved' : 'Save Insight'}</span>
              </button>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={closeClaimModal}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <h2 className="claim-title-text">{selectedClaim.text}</h2>

          <div className="stats-comparison-bar">
            <div className="stat-segment supporting">
              <span className="stat-label">Supporting Sources</span>
              <span className="stat-number text-emerald">{supportingSources.length}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-segment opposing">
              <span className="stat-label">Opposing / Critical Sources</span>
              <span className="stat-number text-rose">{opposingSources.length}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-segment ratio">
              <span className="stat-label">Evidence Balance</span>
              <span className="stat-number text-cyan">
                {opposingSources.length === 0 ? 'Consistent' : 'Contested'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="claim-modal-body">
          {/* Analytical Explanation */}
          <section className="modal-section">
            <h4 className="section-title">Analytical Synthesis</h4>
            <p className="body-paragraph">{selectedClaim.explanation}</p>
            <div className="evidence-summary-box">
              <span className="summary-label">Empirical Grounding:</span>
              <p className="summary-text">{selectedClaim.evidenceSummary}</p>
            </div>
          </section>

          {/* Supporting Sources Section */}
          <section className="modal-section">
            <div className="section-title-row">
              <h4 className="section-title text-emerald-heading">
                Supporting Evidence ({supportingSources.length})
              </h4>
              <span className="section-caption">Sources validating this finding</span>
            </div>

            {supportingSources.length > 0 ? (
              <div className="sources-card-grid">
                {supportingSources.map((source) => (
                  <div 
                    key={source.id} 
                    className="source-mini-card supporting-card"
                    onClick={() => {
                      closeClaimModal();
                      openSourceDrawer(source);
                    }}
                  >
                    <div className="mini-card-top">
                      <span className="mini-type-badge">{source.type}</span>
                      <span className="mini-year font-mono">{source.year}</span>
                    </div>
                    <h5 className="mini-title">{source.title}</h5>
                    <p className="mini-quote">"{source.keyQuote}"</p>
                    <div className="mini-footer">
                      <span className="inspect-link">View Full Evidence</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-sources-note">No analyzed sources directly support this claim in isolation.</p>
            )}
          </section>

          {/* Opposing / Conflicting Sources Section */}
          {opposingSources.length > 0 && (
            <section className="modal-section">
              <div className="section-title-row">
                <h4 className="section-title text-rose-heading">
                  Opposing or Countervailing Evidence ({opposingSources.length})
                </h4>
                <span className="section-caption">Sources identifying limitations or divergence</span>
              </div>

              <div className="sources-card-grid">
                {opposingSources.map((source) => (
                  <div 
                    key={source.id} 
                    className="source-mini-card opposing-card"
                    onClick={() => {
                      closeClaimModal();
                      openSourceDrawer(source);
                    }}
                  >
                    <div className="mini-card-top">
                      <span className="mini-type-badge">{source.type}</span>
                      <span className="mini-year font-mono">{source.year}</span>
                    </div>
                    <h5 className="mini-title">{source.title}</h5>
                    <p className="mini-quote">"{source.keyQuote}"</p>
                    <div className="mini-footer">
                      <span className="inspect-link">View Full Evidence</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Why am I seeing this Explainability */}
          <WhyAmISeeingThis 
            rationale={selectedClaim.whyAmISeeingThis} 
            contextTitle={`Synthesis Rationale for "${selectedClaim.category}"`}
            defaultExpanded={true}
          />
        </div>

        {/* Modal Footer */}
        <div className="claim-modal-footer">
          <div className="footer-warning-note">
            Verify before using as absolute truth: NEXA reflects the sample of {investigation.sources.length} analyzed sources.
          </div>
          <button type="button" className="nexa-btn-secondary" onClick={closeClaimModal}>
            Close Inspector
          </button>
        </div>
      </div>

      <style>{`
        .claim-modal-container {
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 760px;
          max-height: 88vh;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .claim-modal-header {
          padding: 1.5rem 1.75rem 1.25rem;
          background: var(--bg-surface-elevated);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .header-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-meta-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .category-pill {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .header-meta-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .save-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.775rem;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .save-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .save-action-btn.active {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
          color: var(--accent-emerald);
        }

        .modal-close-btn {
          color: var(--text-dim);
          padding: 6px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .modal-close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .claim-title-text {
          font-size: 1.35rem;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text-primary);
        }

        .stats-comparison-bar {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem;
        }

        .stat-segment {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .stat-label {
          font-size: 0.675rem;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-number {
          font-size: 1.15rem;
          font-weight: 700;
          font-family: var(--font-mono);
        }

        .stat-divider {
          width: 1px;
          height: 28px;
          background: var(--border-subtle);
          margin: 0 1rem;
        }

        .claim-modal-body {
          flex: 1;
          padding: 1.5rem 1.75rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .section-title {
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .text-emerald-heading {
          color: #34D399;
        }

        .text-rose-heading {
          color: #FB7185;
        }

        .section-caption {
          font-size: 0.725rem;
          color: var(--text-dim);
        }

        .body-paragraph {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .evidence-summary-box {
          background: rgba(255, 255, 255, 0.02);
          border-left: 2px solid var(--accent-cyan);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          padding: 0.65rem 0.85rem;
        }

        .summary-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 0.2rem;
          text-transform: uppercase;
        }

        .summary-text {
          font-size: 0.8125rem;
          color: var(--text-primary);
          line-height: 1.45;
          margin: 0;
        }

        .sources-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 0.85rem;
        }

        .source-mini-card {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .source-mini-card:hover {
          border-color: rgba(56, 189, 248, 0.35);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .supporting-card {
          border-left: 3px solid var(--accent-emerald);
        }

        .opposing-card {
          border-left: 3px solid var(--accent-rose);
        }

        .mini-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mini-type-badge {
          font-size: 0.675rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .mini-year {
          font-size: 0.725rem;
          color: var(--text-dim);
        }

        .mini-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
        }

        .mini-quote {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mini-footer {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.725rem;
          color: var(--accent-cyan);
          font-weight: 600;
          margin-top: auto;
          padding-top: 0.25rem;
        }

        .no-sources-note {
          font-size: 0.8125rem;
          color: var(--text-dim);
          font-style: italic;
        }

        .claim-modal-footer {
          padding: 1rem 1.75rem;
          background: var(--bg-surface-elevated);
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-warning-note {
          font-size: 0.725rem;
          color: var(--text-dim);
          max-width: 480px;
        }
      `}</style>
    </div>
  );
};
