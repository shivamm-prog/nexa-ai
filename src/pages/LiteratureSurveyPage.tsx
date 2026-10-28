import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Table, 
  AlertTriangle, 
  Compass, 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  ArrowRight, 
  RotateCw, 
  Printer, 
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';

export const LiteratureSurveyPage: React.FC = () => {
  const { 
    investigation, 
    literatureSurvey, 
    isGeneratingSurvey, 
    generateSurveyForTopic, 
    addToast 
  } = useResearch();

  const [topicInput, setTopicInput] = useState(investigation.topic);
  const [activeTab, setActiveTab] = useState<'survey' | 'matrix' | 'conflicts' | 'references'>('survey');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const query = topicInput.trim() || investigation.topic;
    generateSurveyForTopic(query);
  };

  const handleCopyMarkdown = () => {
    if (!literatureSurvey) return;
    const text = formatSurveyAsMarkdown(literatureSurvey);
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Survey Copied',
      message: 'Literature survey copied to clipboard as formatted Markdown.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!literatureSurvey) return;
    const text = formatSurveyAsMarkdown(literatureSurvey);
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `literature-survey-${literatureSurvey.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'File Downloaded',
      message: 'Exported survey as Markdown dossier.'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="lit-survey-page animate-fade-in">
      {/* Header & Topic Generator Lockup */}
      <header className="survey-hero-header">
        <div className="header-meta-row">
          <div className="amber-badge">
            <Sparkles size={14} className="amber-badge-icon" />
            <span>SYNTHETIC ACADEMIC INTELLIGENCE</span>
          </div>
          <span className="survey-pill font-mono">Literature Review Engine</span>
        </div>
        <h1 className="page-heading">
          Structured <span className="gradient-gold-text">Literature Survey</span>
        </h1>
        <p className="survey-lead-text">
          Automated multi-paper synthesis organizing peer-reviewed literature into thematic clusters, paper-by-paper comparative matrices, epistemic contradictions, and future research agendas.
        </p>

        {/* Topic Input Bar */}
        <form onSubmit={handleGenerate} className="survey-input-form nexa-card">
          <div className="form-input-container">
            <FileText size={20} className="input-icon text-amber" />
            <input 
              type="text" 
              className="survey-topic-input"
              placeholder="Enter research topic for comprehensive literature survey..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
            />
            <button 
              type="submit" 
              className="nexa-btn nexa-btn-amber"
              disabled={isGeneratingSurvey}
            >
              {isGeneratingSurvey ? (
                <>
                  <RotateCw size={15} className="spinner" />
                  <span>Synthesizing Corpus...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate Survey</span>
                </>
              )}
            </button>
          </div>
        </form>
      </header>

      {/* Main Content Area */}
      {isGeneratingSurvey ? (
        <div className="generating-state-card nexa-card-elevated">
          <div className="generating-spinner" />
          <h3 className="generating-title">Synthesizing Literature Survey</h3>
          <p className="generating-sub">
            Retrieving open academic works via OpenAlex, extracting comparative variables, and generating thematic matrix for "{topicInput}"...
          </p>
        </div>
      ) : !literatureSurvey ? (
        <div className="empty-survey-card nexa-card">
          <FileText size={48} className="empty-icon text-amber" />
          <h3>No Literature Survey Generated Yet</h3>
          <p>
            Click "Generate Survey" above to build a peer-reviewed synthesis for <strong>"{investigation.topic}"</strong> with comparative matrices, thematic analysis, and formal citations.
          </p>
          <button 
            type="button" 
            className="nexa-btn nexa-btn-amber"
            onClick={() => generateSurveyForTopic(investigation.topic)}
          >
            <Sparkles size={15} />
            <span>Generate Survey for Current Investigation</span>
          </button>
        </div>
      ) : (
        <div className="survey-workspace">
          {/* Action Toolbar */}
          <div className="survey-toolbar nexa-card">
            <div className="tab-pill-group">
              <button 
                type="button" 
                className={`tab-pill ${activeTab === 'survey' ? 'active' : ''}`}
                onClick={() => setActiveTab('survey')}
              >
                <FileText size={14} />
                <span>Executive Survey</span>
              </button>
              <button 
                type="button" 
                className={`tab-pill ${activeTab === 'matrix' ? 'active' : ''}`}
                onClick={() => setActiveTab('matrix')}
              >
                <Table size={14} />
                <span>Comparative Matrix ({literatureSurvey.comparativeMatrix.length})</span>
              </button>
              <button 
                type="button" 
                className={`tab-pill ${activeTab === 'conflicts' ? 'active' : ''}`}
                onClick={() => setActiveTab('conflicts')}
              >
                <AlertTriangle size={14} />
                <span>Debates &amp; Gaps ({literatureSurvey.conflictingFindings.length})</span>
              </button>
              <button 
                type="button" 
                className={`tab-pill ${activeTab === 'references' ? 'active' : ''}`}
                onClick={() => setActiveTab('references')}
              >
                <BookOpen size={14} />
                <span>References ({literatureSurvey.apaReferences.length})</span>
              </button>
            </div>

            <div className="toolbar-actions">
              <button 
                type="button" 
                className="nexa-btn nexa-btn-secondary"
                onClick={handleCopyMarkdown}
                title="Copy Markdown"
              >
                {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button 
                type="button" 
                className="nexa-btn nexa-btn-secondary"
                onClick={handleDownloadMarkdown}
                title="Download .md dossier"
              >
                <Download size={14} />
                <span>Download .MD</span>
              </button>
              <button 
                type="button" 
                className="nexa-btn nexa-btn-amber-outline"
                onClick={handlePrint}
                title="Print or Save as PDF"
              >
                <Printer size={14} />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Epistemic Transparency Tag */}
          <div className="epistemic-disclaimer-banner">
            <ShieldCheck size={16} className="shield-icon" />
            <div className="disclaimer-text">
              <strong>Epistemic Separation Standard:</strong> Literature citations, authors, DOIs, and empirical findings are retrieved directly from verified open academic repositories. Thematic clustering and comparative synthesis are performed by {literatureSurvey.modelUsed}.
            </div>
          </div>

          {/* TAB 1: EXECUTIVE SURVEY */}
          {activeTab === 'survey' && (
            <div className="survey-content-stack animate-fade-in">
              {/* Executive Summary Card */}
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">SECTION 1.0</div>
                <h2 className="section-title">Executive Summary</h2>
                <div className="prose-body">
                  <p>{literatureSurvey.executiveSummary}</p>
                </div>
              </section>

              {/* Background and Scope */}
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">SECTION 2.0</div>
                <h2 className="section-title">Background &amp; Theoretical Scope</h2>
                <div className="prose-body">
                  <p>{literatureSurvey.backgroundAndScope}</p>
                </div>
              </section>

              {/* Major Thematic Analysis */}
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">SECTION 3.0</div>
                <h2 className="section-title">Major Thematic Categorization</h2>
                <div className="themes-grid">
                  {literatureSurvey.thematicAnalysis.map((theme, i) => (
                    <div key={i} className="theme-card">
                      <div className="theme-header">
                        <span className="theme-idx font-mono">Theme #{i + 1}</span>
                        <h4 className="theme-heading">{theme.themeTitle}</h4>
                      </div>
                      <p className="theme-desc">{theme.description}</p>
                      
                      <div className="theme-consensus-box">
                        <span className="consensus-tag font-mono">CONSENSUS FINDING</span>
                        <p className="consensus-text">{theme.consensusFinding}</p>
                      </div>

                      {theme.associatedPapers.length > 0 && (
                        <div className="theme-papers-list">
                          <span className="papers-label font-mono">REPRESENTATIVE WORKS:</span>
                          <ul>
                            {theme.associatedPapers.map((paper, pi) => (
                              <li key={pi} className="paper-bullet">
                                <BookOpen size={11} className="bullet-icon" />
                                <span>{paper}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Critical Synthesis */}
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">SECTION 4.0</div>
                <h2 className="section-title">Critical Synthesis &amp; Methodological Critique</h2>
                <div className="prose-body">
                  <p>{literatureSurvey.criticalSynthesis}</p>
                </div>
              </section>

              {/* Future Research Agenda */}
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">SECTION 5.0</div>
                <h2 className="section-title">Future Research Directions</h2>
                <div className="directions-list">
                  {literatureSurvey.futureDirections.map((dir, i) => (
                    <div key={i} className="direction-item">
                      <div className="direction-num font-mono">{i + 1}</div>
                      <div className="direction-text">{dir}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: COMPARATIVE MATRIX TABLE */}
          {activeTab === 'matrix' && (
            <div className="matrix-content-wrapper animate-fade-in">
              <div className="matrix-card nexa-card-elevated">
                <div className="matrix-card-header">
                  <div>
                    <h3 className="matrix-title">Paper-by-Paper Comparative Matrix</h3>
                    <p className="matrix-subtitle">
                      Systematic cross-examination of methodologies, sample populations, primary contributions, and known limitations.
                    </p>
                  </div>
                  <span className="matrix-badge font-mono">{literatureSurvey.comparativeMatrix.length} Synthesized Papers</span>
                </div>

                <div className="table-responsive">
                  <table className="nexa-matrix-table">
                    <thead>
                      <tr>
                        <th style={{ width: '22%' }}>Paper &amp; Authors</th>
                        <th style={{ width: '8%' }}>Year</th>
                        <th style={{ width: '18%' }}>Methodology</th>
                        <th style={{ width: '18%' }}>Sample / Context</th>
                        <th style={{ width: '22%' }}>Key Contribution</th>
                        <th style={{ width: '12%' }}>Identified Limitation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {literatureSurvey.comparativeMatrix.map((row, i) => (
                        <tr key={i}>
                          <td className="paper-cell">
                            <span className="table-paper-title">{row.paperTitle}</span>
                            <span className="table-authors">{row.authors}</span>
                          </td>
                          <td className="font-mono text-center">{row.year}</td>
                          <td>
                            <span className="methodology-pill">{row.methodology}</span>
                          </td>
                          <td className="context-cell">{row.sampleOrContext}</td>
                          <td className="contribution-cell">{row.keyContribution}</td>
                          <td className="limitation-cell">
                            <span className="limitation-text">{row.limitation}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEBATES & GAPS */}
          {activeTab === 'conflicts' && (
            <div className="conflicts-content-stack animate-fade-in">
              {/* Conflicting Findings */}
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">EPISTEMIC TENSIONS</div>
                <h2 className="section-title">Contradictory Findings &amp; Scholarly Debates</h2>
                <div className="conflicts-grid">
                  {literatureSurvey.conflictingFindings.map((cf, i) => (
                    <div key={i} className="conflict-card">
                      <div className="conflict-header">
                        <AlertTriangle size={16} className="conflict-icon text-coral" />
                        <h4 className="conflict-title">{cf.tensionPoint}</h4>
                      </div>

                      <div className="perspectives-row">
                        <div className="perspective-box box-a">
                          <span className="persp-tag font-mono">PERSPECTIVE A</span>
                          <p>{cf.perspectiveA}</p>
                        </div>
                        <div className="vs-divider font-mono">VS</div>
                        <div className="perspective-box box-b">
                          <span className="persp-tag font-mono">PERSPECTIVE B</span>
                          <p>{cf.perspectiveB}</p>
                        </div>
                      </div>

                      <div className="root-cause-box">
                        <span className="root-cause-label font-mono">METHODOLOGICAL ROOT CAUSE:</span>
                        <p>{cf.methodologicalRootCause}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Research Gaps */}
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">SCHOLARLY FRONTIERS</div>
                <h2 className="section-title">Identified Research Gaps</h2>
                <div className="gaps-grid">
                  {literatureSurvey.researchGaps.map((gap, i) => (
                    <div key={i} className="gap-card">
                      <div className="gap-header">
                        <Compass size={18} className="gap-icon text-amber" />
                        <h4 className="gap-title">{gap.gapTitle}</h4>
                      </div>
                      <div className="gap-body">
                        <div className="gap-field">
                          <span className="gap-field-label font-mono">CURRENT LIMITATION:</span>
                          <p>{gap.currentLimitation}</p>
                        </div>
                        <div className="gap-field">
                          <span className="gap-field-label font-mono">IMPACT ON FIELD:</span>
                          <p>{gap.impactOnField}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: FORMAL REFERENCES */}
          {activeTab === 'references' && (
            <div className="references-content-stack animate-fade-in">
              <section className="survey-section-card nexa-card-elevated">
                <div className="section-kicker font-mono">BIBLIOGRAPHIC RECORD</div>
                <h2 className="section-title">Verified Reference List</h2>
                <p className="ref-intro">
                  Every citation below corresponds to indexed scholarly publications retrieved for this survey. DOIs and author affiliations are validated against OpenAlex and Crossref.
                </p>

                <div className="citations-format-block">
                  <h4 className="format-title font-mono">APA 7th Edition Format</h4>
                  <ol className="reference-list font-mono">
                    {literatureSurvey.apaReferences.map((ref, i) => (
                      <li key={i} className="ref-item">
                        {ref}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="citations-format-block" style={{ marginTop: '2rem' }}>
                  <h4 className="format-title font-mono">IEEE Format</h4>
                  <div className="reference-list font-mono">
                    {literatureSurvey.ieeeReferences.map((ref, i) => (
                      <div key={i} className="ref-item ieee-item">
                        {ref}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      <style>{`
        .lit-survey-page {
          padding: 2rem 2.5rem 4rem 2.5rem;
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .survey-hero-header {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .header-meta-row {
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

        .survey-pill {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .gradient-gold-text {
          background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .survey-lead-text {
          color: var(--text-secondary);
          font-size: 0.98rem;
          max-width: 780px;
          line-height: 1.55;
        }

        .survey-input-form {
          margin-top: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(13, 15, 20, 0.9);
          border: 1px solid rgba(245, 158, 11, 0.25);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .form-input-container {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .survey-topic-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.05rem;
          font-weight: 500;
          outline: none;
        }

        .survey-topic-input::placeholder {
          color: var(--text-muted);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .empty-survey-card, .generating-state-card {
          padding: 3.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          border: 1px dashed rgba(245, 158, 11, 0.25);
        }

        .generating-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(245, 158, 11, 0.2);
          border-top-color: var(--accent-amber);
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
        }

        .survey-workspace {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .survey-toolbar {
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          background: rgba(13, 16, 23, 0.9);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .tab-pill-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .tab-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 500;
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tab-pill.active {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.35);
          color: #FDE68A;
          font-weight: 600;
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .epistemic-disclaimer-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-md);
        }

        .disclaimer-text {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .disclaimer-text strong {
          color: #FDE68A;
        }

        .survey-content-stack, .matrix-content-wrapper, .conflicts-content-stack, .references-content-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .survey-section-card {
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

        .prose-body p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 1.25rem;
        }

        .theme-card {
          background: rgba(6, 8, 13, 0.75);
          border: 1px solid rgba(245, 158, 11, 0.15);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .theme-idx {
          font-size: 0.7rem;
          color: var(--accent-amber);
          font-weight: 700;
        }

        .theme-heading {
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-top: 0.2rem;
        }

        .theme-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .theme-consensus-box {
          background: rgba(245, 158, 11, 0.08);
          border-left: 3px solid var(--accent-amber);
          padding: 0.65rem 0.85rem;
          border-radius: 0 4px 4px 0;
        }

        .consensus-tag {
          font-size: 0.65rem;
          color: var(--accent-amber);
          font-weight: 700;
        }

        .consensus-text {
          font-size: 0.82rem;
          color: var(--text-primary);
          margin-top: 0.2rem;
          line-height: 1.4;
        }

        .theme-papers-list ul {
          list-style: none;
          margin-top: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .paper-bullet {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .directions-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .direction-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(6, 8, 13, 0.6);
          border: 1px solid var(--border-subtle);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
        }

        .direction-num {
          background: rgba(245, 158, 11, 0.15);
          color: #FDE68A;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .direction-text {
          font-size: 0.9rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        /* Matrix Table */
        .matrix-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .matrix-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .matrix-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .matrix-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .matrix-badge {
          background: rgba(245, 158, 11, 0.15);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.3);
          font-size: 0.75rem;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .nexa-matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
        }

        .nexa-matrix-table th {
          background: rgba(6, 8, 13, 0.85);
          color: var(--text-secondary);
          font-weight: 600;
          text-align: left;
          padding: 0.85rem 1rem;
          border-bottom: 2px solid rgba(245, 158, 11, 0.25);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.04em;
        }

        .nexa-matrix-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          vertical-align: top;
          line-height: 1.45;
        }

        .paper-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .table-paper-title {
          font-weight: 600;
          color: var(--text-primary);
        }

        .table-authors {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .methodology-pill {
          display: inline-block;
          font-size: 0.72rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .limitation-text {
          font-size: 0.78rem;
          color: #F87171;
        }

        /* Conflicts and Gaps */
        .conflicts-grid, .gaps-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .conflict-card {
          background: rgba(6, 8, 13, 0.75);
          border: 1px solid rgba(255, 107, 122, 0.2);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .conflict-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .conflict-title {
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .perspectives-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .perspectives-row {
            grid-template-columns: 1fr;
          }
        }

        .perspective-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          padding: 1rem;
          border-radius: var(--radius-sm);
        }

        .box-a { border-left: 3px solid #34D399; }
        .box-b { border-left: 3px solid #F87171; }

        .persp-tag {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.35rem;
        }

        .vs-divider {
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.8rem;
          text-align: center;
        }

        .root-cause-box {
          background: rgba(245, 158, 11, 0.07);
          border: 1px solid rgba(245, 158, 11, 0.15);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
        }

        .root-cause-label {
          font-size: 0.68rem;
          color: var(--accent-amber);
          font-weight: 700;
          display: block;
          margin-bottom: 0.2rem;
        }

        .gap-card {
          background: rgba(6, 8, 13, 0.75);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .gap-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .gap-title {
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .gap-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 768px) {
          .gap-body {
            grid-template-columns: 1fr;
          }
        }

        .gap-field-label {
          font-size: 0.68rem;
          color: var(--accent-amber);
          font-weight: 700;
          display: block;
          margin-bottom: 0.25rem;
        }

        /* References */
        .citations-format-block {
          background: rgba(6, 8, 13, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
        }

        .format-title {
          font-size: 0.8rem;
          color: var(--accent-amber);
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
        }

        .reference-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding-left: 1.25rem;
        }

        .ref-item {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.55;
          word-break: break-word;
        }

        .ieee-item {
          list-style: none;
        }

        @media print {
          .nexa-sidebar, .nexa-topbar, .survey-toolbar, .survey-input-form {
            display: none !important;
          }
          .lit-survey-page {
            padding: 0;
            color: #000;
          }
          .survey-section-card, .matrix-card {
            background: #fff !important;
            color: #000 !important;
            border: 1px solid #ccc !important;
          }
        }
      `}</style>
    </div>
  );
};

// Markdown exporter helper
function formatSurveyAsMarkdown(survey: any): string {
  return `# Literature Survey: ${survey.topic}
*Generated by NEXA AI on ${survey.generatedAt} using ${survey.modelUsed}*

## 1. Executive Summary
${survey.executiveSummary}

## 2. Background and Scope
${survey.backgroundAndScope}

## 3. Major Thematic Analysis
${survey.thematicAnalysis.map((t: any, i: number) => `
### Theme ${i + 1}: ${t.themeTitle}
${t.description}
* **Consensus Finding:** ${t.consensusFinding}
* **Associated Literature:** ${t.associatedPapers.join('; ')}
`).join('\n')}

## 4. Paper-by-Paper Comparative Matrix
| Paper & Authors | Year | Methodology | Sample / Context | Key Contribution | Limitation |
|---|---|---|---|---|---|
${survey.comparativeMatrix.map((m: any) => `| **${m.paperTitle}** (${m.authors}) | ${m.year} | ${m.methodology} | ${m.sampleOrContext} | ${m.keyContribution} | ${m.limitation} |`).join('\n')}

## 5. Critical Synthesis
${survey.criticalSynthesis}

## 6. Conflicting Findings and Debates
${survey.conflictingFindings.map((c: any, i: number) => `
### Debate ${i + 1}: ${c.tensionPoint}
* **Perspective A:** ${c.perspectiveA}
* **Perspective B:** ${c.perspectiveB}
* **Methodological Root Cause:** ${c.methodologicalRootCause}
`).join('\n')}

## 7. Identified Research Gaps
${survey.researchGaps.map((g: any, i: number) => `
* **${g.gapTitle}:** ${g.currentLimitation} (Impact: ${g.impactOnField})
`).join('\n')}

## 8. Future Research Directions
${survey.futureDirections.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}

## 9. References (APA 7th Edition)
${survey.apaReferences.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}
`;
}
