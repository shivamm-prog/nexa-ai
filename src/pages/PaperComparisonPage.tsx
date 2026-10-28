import React, { useState } from 'react';
import { 
  GitCompare, 
  CheckSquare, 
  Square, 
  Sparkles, 
  Download, 
  RotateCw, 
  FileText, 
  BookOpen, 
  AlertTriangle, 
  Compass, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { exportPaperComparisonPdf } from '../services/pdfExportService';
import { compareSelectedPapersWithAi, PaperComparisonData } from '../services/paperComparisonService';

export const PaperComparisonPage: React.FC = () => {
  const { investigation, indexedAcademicPapers, addToast } = useResearch();

  // Combine indexed academic papers with investigation sources if needed
  const availablePapers = indexedAcademicPapers.length > 0
    ? indexedAcademicPapers
    : investigation.sources.map((s, idx) => ({
        id: s.id,
        title: s.title,
        authors: s.authors,
        year: s.year,
        publisher: s.publisher,
        doi: s.doi,
        url: s.url,
        abstract: s.summary,
        citationCount: 14 + idx * 3,
        isOpenAccess: true,
        type: s.type,
        concepts: [investigation.topic],
        apaCitation: `${s.authors} (${s.year}). "${s.title}." ${s.publisher}.`,
        ieeeCitation: `[${idx + 1}] ${s.authors}, "${s.title}", ${s.publisher}, ${s.year}.`,
        isVerified: true
      }));

  // Selected paper IDs (default to first 2)
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>(() => {
    return availablePapers.slice(0, 2).map(p => p.id);
  });

  const [comparisonResult, setComparisonResult] = useState<PaperComparisonData | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const togglePaperSelection = (id: string) => {
    setSelectedPaperIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 2) {
          addToast({
            type: 'warning',
            title: 'Minimum 2 Papers Required',
            message: 'You need at least 2 papers selected for comparative analysis.'
          });
          return prev;
        }
        return prev.filter(pId => pId !== id);
      } else {
        if (prev.length >= 4) {
          addToast({
            type: 'info',
            title: 'Maximum 4 Papers',
            message: 'To maintain optimal comparative readability, compare up to 4 papers simultaneously.'
          });
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleRunComparison = async () => {
    const selectedPapers = availablePapers.filter(p => selectedPaperIds.includes(p.id));
    if (selectedPapers.length < 2) {
      addToast({
        type: 'warning',
        title: 'Select at least 2 papers',
        message: 'Please choose at least 2 research papers to generate side-by-side comparison.'
      });
      return;
    }

    setIsComparing(true);
    addToast({
      type: 'info',
      title: 'Comparing Literature',
      message: `Analyzing methodologies and findings across ${selectedPapers.length} selected papers...`
    });

    try {
      const result = await compareSelectedPapersWithAi(selectedPapers, investigation.topic);
      setComparisonResult(result);
      setIsComparing(false);
      addToast({
        type: 'success',
        title: 'Comparative Matrix Ready',
        message: `Successfully synthesized comparative matrix across ${selectedPapers.length} papers.`
      });
    } catch (err: any) {
      console.error('Comparison error:', err);
      setIsComparing(false);
      addToast({
        type: 'error',
        title: 'Comparison Error',
        message: err.message || 'Failed to compare papers.'
      });
    }
  };

  const handleDownloadPdf = () => {
    if (!comparisonResult) return;
    setIsExportingPdf(true);
    try {
      exportPaperComparisonPdf(comparisonResult, investigation.topic);
      addToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Saved NEXA_AI_Paper_Comparison.pdf successfully.'
      });
    } catch (e: any) {
      console.error('PDF generation error:', e);
      addToast({
        type: 'error',
        title: 'PDF Generation Failed',
        message: e.message || 'Could not export comparative PDF.'
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopySummary = () => {
    if (!comparisonResult) return;
    const text = `# Comparative Literature Analysis: ${investigation.topic}
${comparisonResult.comparativeSummary}

## Similarities
${comparisonResult.similarities.map(s => `- ${s}`).join('\n')}

## Differences
${comparisonResult.differences.map(d => `- ${d}`).join('\n')}

## Contradictory Findings
${comparisonResult.contradictoryFindings.map(c => `- ${c.issue}: ${c.paperAStance} vs ${c.paperBStance} (Root cause: ${c.rootCause})`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Copied',
      message: 'Comparative summary copied to clipboard.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="paper-comp-page animate-fade-in">
      {/* Header */}
      <header className="comp-hero-header">
        <div className="header-badge-row">
          <div className="amber-badge">
            <GitCompare size={14} className="amber-badge-icon" />
            <span>SIDE-BY-SIDE SYNTHESIS</span>
          </div>
          <span className="comp-topic-tag font-mono">Topic: {investigation.topic}</span>
        </div>
        <h1 className="page-heading">
          Paper <span className="gradient-gold-text">Comparison Engine</span>
        </h1>
        <p className="comp-subtitle">
          Select two or more peer-reviewed papers from the current investigation to dissect methodologies, sample cohorts, conflicting claims, and potential literature gaps.
        </p>
      </header>

      {/* Paper Selection Strip */}
      <section className="paper-selection-section nexa-card">
        <div className="selection-header">
          <div className="selection-title-group">
            <h3 className="section-label-heading font-mono">SELECT PAPERS TO CROSS-EXAMINE:</h3>
            <span className="selected-counter font-mono">
              {selectedPaperIds.length} of {availablePapers.length} selected (min 2, max 4)
            </span>
          </div>

          <button
            type="button"
            className="nexa-btn nexa-btn-amber"
            onClick={handleRunComparison}
            disabled={isComparing || selectedPaperIds.length < 2}
          >
            {isComparing ? (
              <>
                <RotateCw size={15} className="spinner" />
                <span>Comparing Corpus...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate Comparative Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Paper Cards Selector Grid */}
        <div className="paper-chips-grid">
          {availablePapers.map((paper, idx) => {
            const isSelected = selectedPaperIds.includes(paper.id);
            return (
              <div 
                key={paper.id}
                className={`paper-select-card ${isSelected ? 'selected' : ''}`}
                onClick={() => togglePaperSelection(paper.id)}
              >
                <div className="select-checkbox-row">
                  {isSelected ? (
                    <CheckSquare size={16} className="text-amber" />
                  ) : (
                    <Square size={16} className="text-muted" />
                  )}
                  <span className="paper-chip-index font-mono">#{idx + 1}</span>
                  <span className="paper-chip-year font-mono">{paper.year}</span>
                </div>
                <h4 className="paper-chip-title">{paper.title}</h4>
                <p className="paper-chip-authors">{paper.authors}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Output Workspace */}
      {isComparing ? (
        <div className="loading-card nexa-card-elevated">
          <div className="generating-spinner" />
          <h3>Cross-Referencing Selected Methodologies</h3>
          <p>Extracting sample cohorts, operational assumptions, and contradictory conclusions...</p>
        </div>
      ) : !comparisonResult ? (
        <div className="empty-comp-card nexa-card">
          <GitCompare size={48} className="empty-icon text-amber" />
          <h3>No Comparison Matrix Generated Yet</h3>
          <p>
            Choose at least 2 papers from the list above and click <strong>"Generate Comparative Analysis"</strong> to produce a side-by-side breakdown.
          </p>
        </div>
      ) : (
        <div className="comp-results-stack animate-fade-in">
          {/* Action Bar */}
          <div className="comp-action-bar nexa-card">
            <div className="action-bar-left">
              <span className="badge-verified font-mono">
                <ShieldCheck size={14} />
                {comparisonResult.isAiGenerated ? 'Grounded AI Synthesis' : 'Verified Index Synthesis'}
              </span>
              <span className="meta-text font-mono">Compared: {comparisonResult.comparedAt}</span>
            </div>

            <div className="action-bar-right">
              <button
                type="button"
                className="nexa-btn nexa-btn-secondary"
                onClick={handleCopySummary}
              >
                {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                className="nexa-btn nexa-btn-amber-outline"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
              >
                <Download size={14} />
                <span>{isExportingPdf ? 'Exporting...' : 'Download PDF Report'}</span>
              </button>
            </div>
          </div>

          {/* Comparative Summary Card */}
          <section className="comp-section-card nexa-card-elevated">
            <div className="section-kicker font-mono">SYNTHESIS OVERVIEW</div>
            <h2 className="section-title">Comparative Literature Summary</h2>
            <p className="summary-body-text">{comparisonResult.comparativeSummary}</p>
          </section>

          {/* Side-by-Side Comparison Matrix Table */}
          <section className="comp-section-card nexa-card-elevated">
            <div className="section-kicker font-mono">SYSTEMATIC BREAKDOWN</div>
            <h2 className="section-title">Side-by-Side Comparative Matrix</h2>

            <div className="table-responsive">
              <table className="nexa-matrix-table">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>Dimension</th>
                    {comparisonResult.papers.map((p, idx) => (
                      <th key={p.paperId} style={{ width: `${82 / comparisonResult.papers.length}%` }}>
                        <div className="th-paper-lock">
                          <span className="th-paper-tag font-mono">PAPER {idx + 1}</span>
                          <span className="th-paper-name">{p.title}</span>
                          <span className="th-paper-authors font-mono">{p.authors} ({p.year})</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-header font-mono">Research Objectives</td>
                    {comparisonResult.papers.map(p => (
                      <td key={p.paperId}>{p.objectives}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-header font-mono">Methodology</td>
                    {comparisonResult.papers.map(p => (
                      <td key={p.paperId}>
                        <span className="method-pill">{p.methodology}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-header font-mono">Dataset / Sample Size</td>
                    {comparisonResult.papers.map(p => (
                      <td key={p.paperId} className="font-mono text-dim">{p.sampleOrDataset}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-header font-mono">Key Findings</td>
                    {comparisonResult.papers.map(p => (
                      <td key={p.paperId} className="findings-cell">{p.keyFindings}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-header font-mono">Core Contributions</td>
                    {comparisonResult.papers.map(p => (
                      <td key={p.paperId}>{p.contributions}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-header font-mono">Limitations</td>
                    {comparisonResult.papers.map(p => (
                      <td key={p.paperId} className="limitation-cell">{p.limitations}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Similarities & Differences */}
          <div className="sim-diff-grid">
            <div className="sim-card nexa-card">
              <div className="card-top-row">
                <Layers size={16} className="text-emerald" />
                <h3 className="card-subheading">Shared Assumptions &amp; Similarities</h3>
              </div>
              <ul className="bullet-list">
                {comparisonResult.similarities.map((sim, i) => (
                  <li key={i}>
                    <span className="bullet-dot emerald" />
                    <span>{sim}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="diff-card nexa-card">
              <div className="card-top-row">
                <GitCompare size={16} className="text-amber" />
                <h3 className="card-subheading">Methodological Divergences</h3>
              </div>
              <ul className="bullet-list">
                {comparisonResult.differences.map((diff, i) => (
                  <li key={i}>
                    <span className="bullet-dot amber" />
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contradictory Findings */}
          {comparisonResult.contradictoryFindings.length > 0 && (
            <section className="comp-section-card nexa-card-elevated">
              <div className="section-kicker font-mono">EMPIRICAL TENSIONS</div>
              <h2 className="section-title">Contradictory Findings &amp; Root Causes</h2>
              <div className="conflicts-stack">
                {comparisonResult.contradictoryFindings.map((cf, i) => (
                  <div key={i} className="conflict-item nexa-card">
                    <div className="conflict-issue-row">
                      <AlertTriangle size={16} className="text-coral" />
                      <h4 className="conflict-issue-title">{cf.issue}</h4>
                    </div>

                    <div className="stances-columns">
                      <div className="stance-box box-left">
                        <span className="stance-label font-mono">STANCE A</span>
                        <p>{cf.paperAStance}</p>
                      </div>
                      <div className="vs-divider font-mono">VS</div>
                      <div className="stance-box box-right">
                        <span className="stance-label font-mono">STANCE B</span>
                        <p>{cf.paperBStance}</p>
                      </div>
                    </div>

                    <div className="root-cause-explanation">
                      <span className="root-label font-mono">METHODOLOGICAL ROOT CAUSE:</span>
                      <p>{cf.rootCause}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Potential Research Gaps */}
          <section className="comp-section-card nexa-card-elevated">
            <div className="section-kicker font-mono">UNADDRESSED QUESTIONS</div>
            <h2 className="section-title">Potential Research Gaps in Selected Literature</h2>
            <div className="gaps-list">
              {comparisonResult.potentialGaps.map((gap, i) => (
                <div key={i} className="gap-item-card">
                  <Compass size={18} className="text-amber gap-icon" />
                  <p className="gap-text">{gap}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <style>{`
        .paper-comp-page {
          padding: 2rem 2.5rem 4rem 2.5rem;
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .comp-hero-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .header-badge-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .amber-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: var(--accent-amber);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .comp-topic-tag {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .comp-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          max-width: 760px;
          line-height: 1.5;
        }

        .paper-selection-section {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: rgba(13, 16, 23, 0.85);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .selection-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-label-heading {
          font-size: 0.75rem;
          color: var(--accent-amber);
          letter-spacing: 0.06em;
        }

        .selected-counter {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 0.75rem;
        }

        .paper-chips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.85rem;
        }

        .paper-select-card {
          background: rgba(6, 8, 13, 0.75);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.9rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .paper-select-card:hover {
          border-color: rgba(245, 158, 11, 0.4);
          transform: translateY(-1px);
        }

        .paper-select-card.selected {
          border-color: var(--accent-amber);
          background: rgba(245, 158, 11, 0.08);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.15);
        }

        .select-checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .paper-chip-index {
          font-size: 0.7rem;
          color: var(--accent-amber);
          font-weight: 700;
        }

        .paper-chip-year {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .paper-chip-title {
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .paper-chip-authors {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .empty-comp-card, .loading-card {
          padding: 3.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          border: 1px dashed rgba(245, 158, 11, 0.25);
        }

        .generating-spinner {
          width: 44px;
          height: 44px;
          border: 3px solid rgba(245, 158, 11, 0.2);
          border-top-color: var(--accent-amber);
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
        }

        .comp-results-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .comp-action-bar {
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          background: rgba(13, 16, 23, 0.9);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .action-bar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .badge-verified {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(52, 211, 153, 0.12);
          color: #34D399;
          border: 1px solid rgba(52, 211, 153, 0.3);
          font-size: 0.72rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .meta-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .action-bar-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .comp-section-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(13, 16, 23, 0.7);
        }

        .section-kicker {
          font-size: 0.7rem;
          color: var(--accent-amber);
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .summary-body-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .table-responsive {
          overflow-x: auto;
          margin-top: 0.5rem;
        }

        .nexa-matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .nexa-matrix-table th {
          background: rgba(6, 8, 13, 0.85);
          color: var(--text-secondary);
          font-weight: 600;
          text-align: left;
          padding: 0.9rem 1rem;
          border-bottom: 2px solid rgba(245, 158, 11, 0.25);
          font-size: 0.75rem;
        }

        .nexa-matrix-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          vertical-align: top;
          line-height: 1.5;
        }

        .th-paper-lock {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .th-paper-tag {
          color: var(--accent-amber);
          font-weight: 700;
          font-size: 0.68rem;
        }

        .th-paper-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .th-paper-authors {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .row-header {
          font-weight: 700;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.02);
          white-space: nowrap;
          font-size: 0.75rem;
        }

        .method-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.74rem;
          color: var(--text-secondary);
        }

        .findings-cell {
          color: var(--text-primary);
        }

        .limitation-cell {
          color: #F87171;
        }

        .sim-diff-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 800px) {
          .sim-diff-grid {
            grid-template-columns: 1fr;
          }
        }

        .sim-card, .diff-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: rgba(13, 16, 23, 0.75);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-subheading {
          font-size: 0.98rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .bullet-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .bullet-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .bullet-dot.emerald { background: #34D399; }
        .bullet-dot.amber { background: var(--accent-amber); }

        .conflicts-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .conflict-item {
          background: rgba(6, 8, 13, 0.75);
          border: 1px solid rgba(255, 107, 122, 0.2);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .conflict-issue-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .conflict-issue-title {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .stances-columns {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .stances-columns {
            grid-template-columns: 1fr;
          }
        }

        .stance-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
        }

        .box-left { border-left: 3px solid #34D399; }
        .box-right { border-left: 3px solid #F87171; }

        .stance-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.25rem;
        }

        .vs-divider {
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.8rem;
          text-align: center;
        }

        .root-cause-explanation {
          background: rgba(245, 158, 11, 0.07);
          border: 1px solid rgba(245, 158, 11, 0.15);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
        }

        .root-label {
          font-size: 0.68rem;
          color: var(--accent-amber);
          font-weight: 700;
          display: block;
          margin-bottom: 0.15rem;
        }

        .gaps-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .gap-item-card {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: rgba(6, 8, 13, 0.6);
          border: 1px solid var(--border-subtle);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
        }

        .gap-text {
          font-size: 0.88rem;
          color: var(--text-primary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};
