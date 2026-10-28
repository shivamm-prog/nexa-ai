import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers, 
  Filter, 
  FileText, 
  Download,
  Sparkles,
  Quote
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Source } from '../types';
import { formatApaCitation, formatIeeeCitation } from '../services/academicSearch';

export const SourcesPage: React.FC = () => {
  const { investigation, openSourceDrawer, addToast } = useResearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStance, setSelectedStance] = useState<string>('All');
  const [citationFormat, setCitationFormat] = useState<'APA' | 'IEEE'>('APA');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sources = investigation.sources || [];

  const filteredSources = sources.filter(source => {
    const matchesSearch = 
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All' || source.type === selectedType;
    const matchesStance = selectedStance === 'All' || source.stance === selectedStance;

    return matchesSearch && matchesType && matchesStance;
  });

  const getCitation = (source: Source, index: number) => {
    if (citationFormat === 'APA') {
      return formatApaCitation({
        authors: source.authors,
        year: source.year,
        title: source.title,
        publisher: source.publisher,
        doi: source.doi
      });
    }
    return formatIeeeCitation({
      authors: source.authors,
      year: source.year,
      title: source.title,
      publisher: source.publisher,
      doi: source.doi
    }, index + 1);
  };

  const handleCopyCitation = (source: Source, index: number) => {
    const text = getCitation(source, index);
    navigator.clipboard.writeText(text);
    setCopiedId(source.id);
    addToast({
      type: 'success',
      title: `${citationFormat} Citation Copied`,
      message: `Copied citation for "${source.title.substring(0, 35)}..."`
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAllCitations = () => {
    if (sources.length === 0) return;
    const header = `# NEXA Citation Intelligence Export (${citationFormat} 7th/Std)\n# Topic: ${investigation.topic}\n# Exported: ${new Date().toLocaleString()}\n\n`;
    const body = sources.map((s, idx) => getCitation(s, idx)).join('\n\n');
    const blob = new Blob([header + body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-citations-${investigation.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Citations Exported',
      message: `Exported ${sources.length} citations in ${citationFormat} format.`
    });
  };

  const uniqueTypes = ['All', ...Array.from(new Set(sources.map(s => s.type)))];

  return (
    <div className="sources-page-container animate-fade-in">
      {/* Header */}
      <header className="sources-hero-header">
        <div className="header-badge-row">
          <div className="amber-badge">
            <BookOpen size={14} className="amber-badge-icon" />
            <span>VERIFIED ACADEMIC CORPUS</span>
          </div>
          <span className="source-count-pill font-mono">{sources.length} Scholarly Records</span>
        </div>
        <h1 className="page-heading">
          Sources &amp; <span className="gradient-gold-text">Citation Intelligence</span>
        </h1>
        <p className="sources-subtitle">
          Primary academic literature, DOIs, peer citations, and verified reference metadata extracted for "{investigation.topic}".
        </p>
      </header>

      {/* Control Bar */}
      <div className="sources-controls-card nexa-card">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon text-amber" />
          <input 
            type="text"
            className="source-search-input"
            placeholder="Search by title, author, journal, or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-btn" onClick={() => setSearchQuery('')}>Clear</button>
          )}
        </div>

        <div className="filters-and-actions">
          {/* Type Filter */}
          <div className="filter-group">
            <span className="filter-label">TYPE:</span>
            <div className="pill-selector">
              {uniqueTypes.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`selector-pill ${selectedType === t ? 'active' : ''}`}
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Citation Format Switcher */}
          <div className="citation-format-group">
            <span className="filter-label">CITATION:</span>
            <div className="pill-selector">
              <button
                type="button"
                className={`selector-pill ${citationFormat === 'APA' ? 'active' : ''}`}
                onClick={() => setCitationFormat('APA')}
              >
                APA 7th
              </button>
              <button
                type="button"
                className={`selector-pill ${citationFormat === 'IEEE' ? 'active' : ''}`}
                onClick={() => setCitationFormat('IEEE')}
              >
                IEEE
              </button>
            </div>
          </div>

          {/* Export Button */}
          <button 
            type="button" 
            className="nexa-btn nexa-btn-amber-outline"
            onClick={handleExportAllCitations}
            title="Download formatted reference list"
          >
            <Download size={14} />
            <span>Export List</span>
          </button>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="sources-list-grid">
        {filteredSources.length === 0 ? (
          <div className="empty-state-card nexa-card">
            <BookOpen size={40} className="empty-icon text-amber" />
            <h3>No matching academic sources found</h3>
            <p>Try adjusting your keyword filter or source category.</p>
          </div>
        ) : (
          filteredSources.map((source, index) => {
            const citationText = getCitation(source, index);
            const isCopied = copiedId === source.id;

            return (
              <article key={source.id} className="source-card nexa-card-elevated">
                <div className="source-card-header">
                  <div className="source-type-meta">
                    <span className="source-index font-mono">#{index + 1}</span>
                    <span className="source-type-badge font-mono">{source.type}</span>
                    <span className="source-year font-mono">{source.year}</span>
                    {source.doi && (
                      <span className="verified-badge font-mono">
                        <ShieldCheck size={12} />
                        DOI Verified
                      </span>
                    )}
                  </div>
                  <div className="relevance-meter">
                    <span className="meter-label font-mono">Relevance</span>
                    <span className="meter-val font-mono">{source.relevance}%</span>
                  </div>
                </div>

                <h3 className="source-title" onClick={() => openSourceDrawer(source)}>
                  {source.title}
                </h3>

                <p className="source-authors">
                  <strong>Authors:</strong> {source.authors}
                </p>
                <p className="source-venue">
                  <strong>Venue:</strong> {source.publisher}
                </p>

                <p className="source-abstract-preview">
                  {source.summary}
                </p>

                {/* Formatted Citation Block */}
                <div className="citation-box">
                  <div className="citation-box-header">
                    <div className="citation-type-tag font-mono">
                      <Quote size={12} />
                      {citationFormat} 7th Edition Citation
                    </div>
                    <button
                      type="button"
                      className="copy-citation-btn"
                      onClick={() => handleCopyCitation(source, index)}
                      title="Copy citation to clipboard"
                    >
                      {isCopied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="citation-content font-mono">
                    {citationText}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="source-card-footer">
                  <button
                    type="button"
                    className="view-details-btn font-mono"
                    onClick={() => openSourceDrawer(source)}
                  >
                    <span>View Epistemic Breakdown</span>
                    <span className="arrow">→</span>
                  </button>

                  <div className="footer-links">
                    {source.url && (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="doi-link-btn font-mono"
                      >
                        <span>Open Repository</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <style>{`
        .sources-page-container {
          padding: 2rem 2.5rem 4rem 2.5rem;
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .sources-hero-header {
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

        .source-count-pill {
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

        .sources-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          max-width: 720px;
          line-height: 1.5;
        }

        .sources-controls-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: rgba(15, 18, 25, 0.85);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .search-bar-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(6, 8, 13, 0.75);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.6rem 1rem;
          transition: border-color 0.2s;
        }

        .search-bar-wrapper:focus-within {
          border-color: var(--accent-amber);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.15);
        }

        .source-search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
        }

        .source-search-input::placeholder {
          color: var(--text-muted);
        }

        .clear-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.75rem;
          cursor: pointer;
        }

        .clear-btn:hover {
          color: var(--text-primary);
        }

        .filters-and-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-group, .citation-format-group {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .filter-label {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .pill-selector {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(6, 8, 13, 0.6);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .selector-pill {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.78rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .selector-pill.active {
          background: rgba(245, 158, 11, 0.18);
          color: #FDE68A;
          font-weight: 600;
        }

        .sources-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .sources-list-grid {
            grid-template-columns: 1fr;
          }
        }

        .source-card {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.07);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .source-card:hover {
          transform: translateY(-2px);
          border-color: rgba(245, 158, 11, 0.35);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px -5px rgba(245, 158, 11, 0.15);
        }

        .source-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .source-type-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .source-index {
          color: var(--accent-amber);
          font-weight: 700;
          font-size: 0.8rem;
        }

        .source-type-badge {
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }

        .source-year {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          color: #34D399;
          background: rgba(52, 211, 153, 0.12);
          border: 1px solid rgba(52, 211, 153, 0.25);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .relevance-meter {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .meter-label {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .meter-val {
          font-size: 0.75rem;
          color: var(--accent-amber);
          font-weight: 700;
        }

        .source-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .source-title:hover {
          color: #FDE68A;
        }

        .source-authors, .source-venue {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .source-authors strong, .source-venue strong {
          color: var(--text-muted);
        }

        .source-abstract-preview {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .citation-box {
          background: rgba(6, 8, 13, 0.8);
          border: 1px solid rgba(245, 158, 11, 0.15);
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .citation-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .citation-type-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          color: var(--accent-amber);
          letter-spacing: 0.04em;
        }

        .copy-citation-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.7rem;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .copy-citation-btn:hover {
          background: rgba(245, 158, 11, 0.15);
          color: #FDE68A;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .citation-content {
          font-size: 0.74rem;
          color: var(--text-secondary);
          line-height: 1.45;
          word-break: break-word;
        }

        .source-card-footer {
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .view-details-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          color: var(--accent-amber);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .view-details-btn:hover {
          color: #FDE68A;
        }

        .doi-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
          font-size: 0.74rem;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .doi-link-btn:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
