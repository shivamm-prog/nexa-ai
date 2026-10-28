import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Search, 
  FileText, 
  GitCompare, 
  Network, 
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

interface StepInfo {
  title: string;
  subtext: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const LoadingSequence: React.FC = () => {
  const { isAnalyzing, analysisStep, analysisTopic, cancelAnalysis } = useResearch();

  if (!isAnalyzing) return null;

  const STEPS: StepInfo[] = [
    {
      title: 'DISCOVERING ACADEMIC SOURCES',
      subtext: 'Querying OpenAlex & Crossref repositories for peer-reviewed literature',
      icon: Search
    },
    {
      title: 'PARSING EMPIRICAL FINDINGS',
      subtext: 'Extracting abstracts, DOIs, sample sizes, and study methodologies',
      icon: FileText
    },
    {
      title: 'CROSS-EXAMINING EVIDENCE',
      subtext: 'Comparing findings, identifying common ground, and surfacing contradictions',
      icon: GitCompare
    },
    {
      title: 'SYNTHESIZING WITH GEMINI AI',
      subtext: 'Grounding claims, mapping epistemic boundaries, and detecting research gaps',
      icon: Network
    },
    {
      title: 'RESEARCH DOSSIER READY',
      subtext: 'Finalizing visual Evidence Map and Literature Survey topology',
      icon: Sparkles
    }
  ];

  const progressPercentage = Math.min(100, Math.round(((analysisStep + 1) / STEPS.length) * 100));

  return (
    <div className="nexa-backdrop analysis-backdrop animate-fade-in">
      <div className="analysis-card animate-fade-in">
        {/* Header */}
        <div className="analysis-header">
          <div className="header-brand-lock">
            <div className="pulse-icon-box">
              <Layers size={20} className="pulse-brand-svg" />
            </div>
            <div>
              <span className="pipeline-label">NEXA SPATIAL SYNTHESIS PIPELINE</span>
              <h3 className="target-topic" title={analysisTopic}>"{analysisTopic}"</h3>
            </div>
          </div>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={cancelAnalysis}
            title="Cancel synthesis"
          >
            <X size={16} />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="steps-container">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isDone = index < analysisStep;
            const isCurrent = index === analysisStep;
            const isPending = index > analysisStep;

            return (
              <div 
                key={step.title} 
                className={`step-row ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''} ${isPending ? 'pending' : ''}`}
              >
                <div className="step-status-indicator">
                  {isDone && <CheckCircle2 size={18} className="step-icon done-icon" />}
                  {isCurrent && <Loader2 size={18} className="step-icon spin-icon" />}
                  {isPending && <div className="step-pending-dot" />}
                </div>

                <div className="step-icon-wrapper">
                  <Icon size={15} className="step-meta-icon" />
                </div>

                <div className="step-text-wrap">
                  <div className="step-title-line">
                    <span className="step-title font-mono">{step.title}</span>
                    {isCurrent && (
                      <span className="step-active-tag">Active Vectoring</span>
                    )}
                    {isDone && (
                      <span className="step-completed-tag">Verified</span>
                    )}
                  </div>
                  <span className="step-subtext">{step.subtext}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Metric Ticker */}
        <div className="analysis-footer">
          <div className="telemetry-box">
            <span className="telemetry-label font-mono">PIPELINE TELEMETRY:</span>
            <span className="telemetry-stat font-mono">
              {analysisStep === 0 && 'Indexing 8 high-relevance source documents...'}
              {analysisStep === 1 && 'Extracted 12 verifiable claims with citation links...'}
              {analysisStep === 2 && 'Evaluating 4 agreements and 2 evidence conflicts...'}
              {analysisStep === 3 && 'Routing interactive 3D relational topology...'}
              {analysisStep >= 4 && 'Isolating 1 Explore Next candidate insight...'}
            </span>
          </div>
          <span className="percent-display font-mono">{progressPercentage}%</span>
        </div>
      </div>

      <style>{`
        .analysis-backdrop {
          z-index: 300;
          background: rgba(4, 7, 14, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .analysis-card {
          width: 100%;
          max-width: 580px;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg), 0 0 60px rgba(91, 140, 255, 0.15);
          overflow: hidden;
        }

        .analysis-header {
          padding: 1.5rem 1.75rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-surface-elevated);
          border-bottom: 1px solid var(--border-subtle);
        }

        .header-brand-lock {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .pulse-icon-box {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(91, 140, 255, 0.25), rgba(76, 201, 240, 0.3));
          border: 1px solid rgba(91, 140, 255, 0.45);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          box-shadow: 0 0 20px rgba(91, 140, 255, 0.3);
          animation: spatialFloat 5s ease-in-out infinite;
        }

        .pipeline-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .target-topic {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          max-width: 380px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cancel-btn {
          color: var(--text-dim);
          padding: 6px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .cancel-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .progress-track {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.06);
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #5B8CFF 0%, #4CC9F0 50%, #37D996 100%);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 12px rgba(91, 140, 255, 0.6);
        }

        .steps-container {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .step-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: all 0.25s ease;
        }

        .step-row.current {
          background: rgba(91, 140, 255, 0.08);
          border-color: rgba(91, 140, 255, 0.3);
          box-shadow: 0 2px 12px rgba(91, 140, 255, 0.1);
        }

        .step-row.done {
          opacity: 0.85;
        }

        .step-row.pending {
          opacity: 0.3;
        }

        .step-status-indicator {
          width: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .done-icon {
          color: var(--accent-green);
        }

        .spin-icon {
          color: var(--accent-blue);
          animation: spin 1s linear infinite;
        }

        .step-pending-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-dim);
        }

        .step-icon-wrapper {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .step-row.current .step-icon-wrapper {
          background: rgba(91, 140, 255, 0.15);
          border-color: rgba(91, 140, 255, 0.35);
          color: var(--accent-blue);
        }

        .step-row.done .step-icon-wrapper {
          color: var(--accent-green);
        }

        .step-text-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .step-title-line {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .step-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-primary);
        }

        .step-subtext {
          font-size: 13px;
          color: var(--text-muted);
        }

        .step-active-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-blue);
          background: rgba(91, 140, 255, 0.15);
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }

        .step-completed-tag {
          font-size: 11px;
          font-weight: 600;
          color: var(--accent-green);
        }

        .analysis-footer {
          padding: 1rem 1.75rem;
          background: var(--bg-surface-elevated);
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .telemetry-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 12px;
        }

        .telemetry-label {
          font-weight: 700;
          color: var(--text-dim);
        }

        .telemetry-stat {
          color: var(--text-secondary);
        }

        .percent-display {
          font-size: 14px;
          font-weight: 700;
          color: var(--accent-blue);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
