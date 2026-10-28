import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

interface WhyAmISeeingThisProps {
  rationale: string;
  contextTitle?: string;
  defaultExpanded?: boolean;
  inline?: boolean;
}

export const WhyAmISeeingThis: React.FC<WhyAmISeeingThisProps> = ({
  rationale,
  contextTitle = 'NEXA Synthesis Rationale',
  defaultExpanded = false,
  inline = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!inline) {
    return null;
  }

  return (
    <div className={`why-seeing-box ${isExpanded ? 'expanded' : ''}`}>
      <button 
        type="button" 
        className="why-seeing-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="toggle-left">
          <HelpCircle size={14} className="info-icon" />
          <span className="toggle-label">Why am I seeing this?</span>
        </div>
        <div className="toggle-right">
          <span className="toggle-sub">Explainability</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {isExpanded && (
        <div className="why-seeing-body animate-fade-in">
          <div className="rationale-accent-bar" />
          <div className="rationale-content">
            <div className="rationale-header">
              <ShieldCheck size={14} className="shield-icon" />
              <span className="rationale-heading">{contextTitle}</span>
            </div>
            <p className="rationale-text">{rationale}</p>
            <div className="rationale-footer">
              <span className="guardrail-tag">Epistemic Transparency Guardrail</span>
              <span className="guardrail-note">Zero synthetic certainty applied</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .why-seeing-box {
          margin-top: 0.85rem;
          background: rgba(14, 21, 36, 0.45);
          border: 1px solid rgba(56, 189, 248, 0.16);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .why-seeing-box.expanded {
          background: rgba(14, 21, 36, 0.8);
          border-color: rgba(56, 189, 248, 0.35);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .why-seeing-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55rem 0.85rem;
          color: var(--text-secondary);
          font-size: 0.775rem;
          transition: all 0.15s ease;
        }

        .why-seeing-toggle:hover {
          background: rgba(56, 189, 248, 0.06);
          color: var(--text-primary);
        }

        .toggle-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-icon {
          color: var(--accent-cyan);
        }

        .toggle-label {
          font-weight: 600;
          color: #BAE6FD;
        }

        .toggle-right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: var(--text-dim);
        }

        .why-seeing-body {
          display: flex;
          border-top: 1px solid rgba(56, 189, 248, 0.12);
          padding: 0.75rem 0.85rem;
          background: rgba(8, 14, 26, 0.5);
        }

        .rationale-accent-bar {
          width: 3px;
          background: linear-gradient(180deg, var(--accent-cyan) 0%, var(--accent-violet) 100%);
          border-radius: 2px;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .rationale-content {
          flex: 1;
        }

        .rationale-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.35rem;
        }

        .shield-icon {
          color: var(--accent-emerald);
        }

        .rationale-heading {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .rationale-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 0.5rem 0;
        }

        .rationale-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.675rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 0.4rem;
        }

        .guardrail-tag {
          color: var(--accent-cyan);
          font-weight: 600;
          font-family: var(--font-mono);
        }

        .guardrail-note {
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
};

export const WhySeeingModal: React.FC = () => {
  const { whySeeingThisData, closeWhySeeingThis } = useResearch();

  if (!whySeeingThisData) return null;

  return (
    <div className="nexa-backdrop" onClick={closeWhySeeingThis}>
      <div className="modal-container animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-wrap">
            <div className="header-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="modal-title">Why Am I Seeing This?</h3>
              <p className="modal-subtitle">{whySeeingThisData.title}</p>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={closeWhySeeingThis}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-content">
          <div className="explainability-card">
            <div className="card-badge">
              <ShieldCheck size={14} />
              <span>Algorithmic Epistemic Audit</span>
            </div>
            <p className="explain-body">{whySeeingThisData.rationale}</p>
          </div>

          <div className="principles-section">
            <h4 className="principles-title">NEXA Core Principles:</h4>
            <div className="principles-grid">
              <div className="principle-item">
                <span className="principle-number">01</span>
                <div>
                  <div className="principle-name">No Fake Certainty</div>
                  <p className="principle-desc">We never invent pseudo-precise percentage probabilities for unmeasured claims.</p>
                </div>
              </div>
              <div className="principle-item">
                <span className="principle-number">02</span>
                <div>
                  <div className="principle-name">Context Preservation</div>
                  <p className="principle-desc">Differences in study populations or software constraints are preserved, not averaged out.</p>
                </div>
              </div>
              <div className="principle-item">
                <span className="principle-number">03</span>
                <div>
                  <div className="principle-name">Student Sovereignty</div>
                  <p className="principle-desc">NEXA visualizes evidence so the researcher can make the final epistemic determination.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="nexa-btn-primary" onClick={closeWhySeeingThis}>
            Understood
          </button>
        </div>
      </div>

      <style>{`
        .modal-container {
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 540px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .header-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 1.05rem;
          margin-bottom: 0.15rem;
        }

        .modal-subtitle {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin: 0;
        }

        .close-btn {
          color: var(--text-dim);
          padding: 6px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .close-btn:hover {
          color: var(--text-primary);
          background: var(--bg-surface-elevated);
        }

        .modal-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .explainability-card {
          background: rgba(8, 14, 26, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: var(--radius-md);
          padding: 1.15rem;
        }

        .card-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--accent-cyan);
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .explain-body {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-primary);
          margin: 0;
        }

        .principles-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .principles-title {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .principles-grid {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .principle-item {
          display: flex;
          gap: 0.85rem;
          padding: 0.65rem 0.85rem;
          background: var(--bg-surface-elevated);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .principle-number {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          color: var(--accent-violet);
          font-weight: 700;
        }

        .principle-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
        }

        .principle-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
          background: rgba(8, 14, 26, 0.4);
        }
      `}</style>
    </div>
  );
};
