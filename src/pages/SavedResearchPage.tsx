import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Download, 
  Layers, 
  BookOpen, 
  Compass, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  FileText
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';

export const SavedResearchPage: React.FC = () => {
  const { savedItems, removeSavedItem, startAnalysis, setActivePage, addToast } = useResearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filtered saved items
  const filteredItems = savedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleExportMarkdown = () => {
    if (savedItems.length === 0) return;
    const content = `# NEXA Research Notebook Export
Generated: ${new Date().toLocaleString()}
Items count: ${savedItems.length}

${savedItems.map((item, idx) => `
## ${idx + 1}. [${item.type.toUpperCase()}] ${item.title}
**Topic:** ${item.topic}  
**Timestamp:** ${item.timestamp}  
**Synthesis:**  
> ${item.preview}
`).join('\n---\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-research-dossier-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Export Downloaded',
      message: 'Downloaded research dossier as Markdown file.'
    });
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'investigation':
        return <Layers size={16} className="text-blue" />;
      case 'insight':
        return <FileText size={16} className="text-green" />;
      case 'disagreement':
        return <AlertTriangle size={16} className="text-coral" />;
      case 'explore_next':
        return <Compass size={16} className="text-amber" />;
      default:
        return <BookOpen size={16} className="text-cyan" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'investigation':
        return <span className="nexa-badge nexa-badge-blue">Investigation</span>;
      case 'insight':
        return <span className="nexa-badge nexa-badge-green">Insight</span>;
      case 'disagreement':
        return <span className="nexa-badge nexa-badge-coral">Conflict</span>;
      case 'explore_next':
        return <span className="nexa-badge nexa-badge-amber">Explore Next</span>;
      default:
        return <span className="nexa-badge nexa-badge-neutral">Source</span>;
    }
  };

  return (
    <div className="saved-page-container animate-fade-in">
      {/* Page Header */}
      <header className="saved-header">
        <div className="header-left">
          <div className="header-icon-box">
            <Bookmark size={20} />
          </div>
          <div>
            <h1 className="page-heading">Saved Research Notebook</h1>
            <p className="saved-subtitle">
              Your personal library of bookmarked investigations, extracted claims, and candidate explore-next insights.
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="nexa-btn-secondary"
            onClick={handleExportMarkdown}
            disabled={savedItems.length === 0}
          >
            <Download size={14} />
            <span>Export Dossier (MD)</span>
          </button>
        </div>
      </header>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="saved-controls-strip nexa-card">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search saved items by title, topic, or preview..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-btn" 
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>

        <div className="filters-tab-group">
          {[
            { id: 'all', label: 'All Items', count: savedItems.length },
            { id: 'investigation', label: 'Investigations', count: savedItems.filter(i => i.type === 'investigation').length },
            { id: 'insight', label: 'Insights', count: savedItems.filter(i => i.type === 'insight').length },
            { id: 'explore_next', label: 'Explore Next', count: savedItems.filter(i => i.type === 'explore_next').length },
            { id: 'source', label: 'Sources', count: savedItems.filter(i => i.type === 'source').length },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`filter-tab-btn ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="tab-count font-mono">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Items Display Grid */}
      {filteredItems.length > 0 ? (
        <div className="saved-cards-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="saved-item-card nexa-card">
              <div className="card-header-line">
                <div className="header-type-lock">
                  {getItemIcon(item.type)}
                  {getTypeBadge(item.type)}
                </div>

                <div className="header-timestamp">
                  <Clock size={12} />
                  <span className="font-mono">{item.timestamp}</span>
                </div>
              </div>

              <h3 className="card-heading saved-item-title">{item.title}</h3>

              <div className="saved-item-topic">
                <span className="topic-sub">Investigation Topic:</span>
                <span className="topic-val">{item.topic}</span>
              </div>

              <p className="saved-item-preview">{item.preview}</p>

              {/* Action Bar */}
              <div className="saved-card-footer">
                <div className="footer-left">
                  {item.type === 'investigation' && (
                    <button 
                      type="button" 
                      className="open-action-btn"
                      onClick={() => {
                        startAnalysis(item.topic);
                      }}
                    >
                      <span>Analyze Topic</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                  {item.type === 'explore_next' && (
                    <button 
                      type="button" 
                      className="open-action-btn text-amber"
                      onClick={() => setActivePage('explore-next')}
                    >
                      <span>Open Frontier</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>

                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeSavedItem(item.id)}
                  title="Remove from saved"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-saved-state nexa-card">
          <div className="empty-icon-box">
            <Bookmark size={30} />
          </div>
          <h3 className="card-heading">No saved research found</h3>
          <p className="empty-description">
            {searchQuery 
              ? `No saved items matched "${searchQuery}". Try a broader search term or switch filters.`
              : 'You haven\'t bookmarked any investigations, claims, or explore-next frontiers yet. Use the "Save" actions across the dashboard and Evidence Map.'}
          </p>
          <button 
            type="button" 
            className="nexa-btn-primary"
            onClick={() => setActivePage('dashboard')}
          >
            <span>Return to Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      <style>{`
        .saved-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem 2.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
          position: relative;
          z-index: 5;
        }

        .saved-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(91, 140, 255, 0.12);
          border: 1px solid rgba(91, 140, 255, 0.3);
          color: var(--accent-blue);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .saved-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0.2rem 0 0 0;
        }

        /* Controls */
        .saved-controls-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 0.85rem 1.35rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.85rem;
          width: 340px;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 13px;
        }

        .clear-btn {
          font-size: 11px;
          color: var(--text-dim);
        }

        .clear-btn:hover {
          color: var(--text-primary);
        }

        .filters-tab-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .filter-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 12.5px;
          color: var(--text-secondary);
          background: transparent;
          transition: all 0.15s ease;
        }

        .filter-tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .filter-tab-btn.active {
          color: var(--accent-blue);
          background: rgba(91, 140, 255, 0.1);
          font-weight: 600;
        }

        .tab-count {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        /* Saved Cards Grid */
        .saved-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.35rem;
        }

        .saved-item-card {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .card-header-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-type-lock {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-timestamp {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 12px;
          color: var(--text-dim);
        }

        .saved-item-title {
          font-size: 16px;
          line-height: 1.35;
          margin: 0;
        }

        .saved-item-topic {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 13px;
        }

        .topic-sub {
          color: var(--text-dim);
        }

        .topic-val {
          color: var(--accent-cyan);
          font-weight: 500;
        }

        .saved-item-preview {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .saved-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-subtle);
          margin-top: auto;
        }

        .open-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-blue);
        }

        .open-action-btn.text-amber {
          color: var(--accent-amber);
        }

        .remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 12.5px;
          color: var(--text-dim);
          transition: color 0.15s ease;
        }

        .remove-btn:hover {
          color: var(--accent-coral);
        }

        .text-blue { color: var(--accent-blue); }
        .text-green { color: var(--accent-green); }
        .text-coral { color: var(--accent-coral); }
        .text-amber { color: var(--accent-amber); }
        .text-cyan { color: var(--accent-cyan); }

        /* Empty State */
        .empty-saved-state {
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.15rem;
        }

        .empty-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
        }

        .empty-description {
          font-size: 15px;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
