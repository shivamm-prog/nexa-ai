import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Network, 
  Compass, 
  Bookmark, 
  Settings, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  BookOpen,
  FileText,
  GitCompare
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import type { PageId } from '../../context/ResearchContext';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, investigation, savedItems } = useResearch();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Research Analysis', icon: LayoutDashboard },
    { id: 'sources', label: 'Sources', icon: BookOpen, badge: investigation.sources?.length || undefined },
    { id: 'literature-survey', label: 'Literature Survey', icon: FileText, badge: 'New', highlight: true },
    { id: 'paper-comparison', label: 'Paper Comparison', icon: GitCompare },
    { id: 'evidence-map', label: 'Evidence Map', icon: Network },
    { id: 'explore-next', label: 'Explore Next', icon: Compass, badge: 'Frontier' },
    { id: 'saved', label: 'Saved Research', icon: Bookmark, badge: savedItems.length || undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="nexa-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-lockup" onClick={() => setActivePage('home')}>
          <div className="brand-logo-icon">
            <Layers size={19} className="brand-icon-svg" />
            <span className="brand-pulse-dot" />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-name">NEXA</span>
              <span className="brand-version-pill">v2.5</span>
            </div>
            <span className="brand-subtitle">Evidence &amp; Insight Navigator</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">NAVIGATION</div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-button ${isActive ? 'active' : ''} ${item.highlight ? 'hero-nav' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <div className="nav-button-left">
                    <Icon size={17} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`nav-badge ${item.badge === 'Frontier' ? 'badge-frontier' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Active Investigation Context Widget */}
      <div className="sidebar-footer">
        <div className="investigation-widget">
          <div className="widget-header">
            <span className="widget-status-dot" />
            <span className="widget-label">ACTIVE TOPIC</span>
          </div>
          <p className="widget-topic-title" title={investigation.topic}>
            {investigation.topic}
          </p>
          <div className="widget-metrics-row">
            <span className="metric-tag">{investigation.sources.length} Sources</span>
            <span className="metric-tag">{investigation.claims.length} Claims</span>
          </div>
          <button 
            type="button" 
            className="widget-cta"
            onClick={() => setActivePage('evidence-map')}
          >
            <span>Open Evidence Map</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Student Status Profile Bar */}
        <div className="user-profile-bar">
          <div className="avatar-chip">
            <span>SR</span>
          </div>
          <div className="user-meta">
            <span className="user-role">Student Researcher</span>
            <span className="user-institution">Independent Academic</span>
          </div>
          <Sparkles size={13} className="sparkle-accent" />
        </div>
      </div>

      <style>{`
        .nexa-sidebar {
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          height: 100vh;
          background: rgba(11, 16, 32, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 40;
          user-select: none;
        }

        .sidebar-header {
          padding: 1.35rem 1.25rem 1.15rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          cursor: pointer;
        }

        .brand-logo-icon {
          position: relative;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, rgba(91, 140, 255, 0.2) 0%, rgba(139, 124, 255, 0.25) 100%);
          border: 1px solid rgba(91, 140, 255, 0.4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          box-shadow: 0 0 16px rgba(91, 140, 255, 0.2);
        }

        .brand-pulse-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 7px;
          height: 7px;
          background: var(--accent-cyan);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent-cyan);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-name {
          font-family: var(--font-family);
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #FFF;
        }

        .brand-version-pill {
          font-size: 0.65rem;
          font-family: var(--font-mono);
          background: rgba(255, 255, 255, 0.06);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          color: var(--text-muted);
        }

        .brand-subtitle {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.25rem 0.75rem;
          overflow-y: auto;
        }

        .nav-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 0.08em;
          padding: 0 0.65rem 0.5rem;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.75rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .nav-button-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-icon {
          color: var(--text-muted);
          transition: color 0.18s ease;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
        }

        .nav-button:hover .nav-icon {
          color: var(--accent-blue);
        }

        /* Active item: restrained, not overly bright */
        .nav-button.active {
          background: rgba(91, 140, 255, 0.08);
          color: #FFF;
          font-weight: 600;
          border-left: 3px solid var(--accent-blue);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .nav-button.active .nav-icon {
          color: var(--accent-blue);
        }

        .nav-badge {
          font-size: 0.675rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
        }

        .nav-badge.badge-frontier {
          background: rgba(246, 185, 74, 0.12);
          color: var(--accent-amber);
          border: 1px solid rgba(246, 185, 74, 0.25);
          font-size: 0.65rem;
          letter-spacing: 0.02em;
        }

        .sidebar-footer {
          padding: 0.85rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .investigation-widget {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem;
        }

        .widget-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.35rem;
        }

        .widget-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
          box-shadow: 0 0 6px var(--accent-green);
        }

        .widget-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 0.06em;
        }

        .widget-topic-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.45rem;
        }

        .widget-metrics-row {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.55rem;
        }

        .metric-tag {
          font-size: 0.675rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .widget-cta {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-blue);
          padding: 0.35rem 0.5rem;
          background: rgba(91, 140, 255, 0.08);
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .widget-cta:hover {
          background: rgba(91, 140, 255, 0.16);
          color: #8EB2FF;
        }

        .user-profile-bar {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.45rem 0.55rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
        }

        .avatar-chip {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5B8CFF, #8B7CFF);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.725rem;
          font-weight: 700;
          color: #FFF;
        }

        .user-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-role {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-institution {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .sparkle-accent {
          color: var(--accent-violet-light);
        }
      `}</style>
    </aside>
  );
};
