import React, { useState } from 'react';
import { 
  Settings, 
  Moon, 
  Sliders, 
  Monitor, 
  GraduationCap, 
  Check,
  Play,
  Key,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  RotateCw
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { SourceType } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, addToast, replayIntro, geminiApiKey, setGeminiApiKey } = useResearch();

  const [inputApiKey, setInputApiKey] = useState(geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  const handleSaveApiKey = () => {
    setGeminiApiKey(inputApiKey);
    addToast({
      type: 'success',
      title: 'API Key Saved',
      message: inputApiKey ? 'Google Gemini API key securely saved in local storage.' : 'Gemini API key cleared. Reverting to local heuristic synthesis.'
    });
  };

  const handleTestApiKey = async () => {
    const keyToTest = inputApiKey.trim() || geminiApiKey.trim();
    if (!keyToTest) {
      addToast({
        type: 'warning',
        title: 'No API Key Entered',
        message: 'Please paste your Google Gemini API key first.'
      });
      return;
    }

    setIsTestingKey(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${keyToTest}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with: "NEXA AI Connection Verified."' }] }]
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Status ${res.status}: ${err}`);
      }

      setIsTestingKey(false);
      addToast({
        type: 'success',
        title: 'Gemini Connection Verified',
        message: `Successfully connected to ${selectedModel}. AI synthesis active!`
      });
    } catch (err: any) {
      setIsTestingKey(false);
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: err.message || 'Could not verify Gemini API key.'
      });
    }
  };

  const handleSourceTypeToggle = (type: SourceType) => {
    const current = settings.preferredSources;
    if (current.includes(type)) {
      if (current.length === 1) {
        addToast({
          type: 'warning',
          title: 'Minimum 1 Source Required',
          message: 'At least one source category must remain active for synthesis.'
        });
        return;
      }
      updateSettings({ preferredSources: current.filter(t => t !== type) });
    } else {
      updateSettings({ preferredSources: [...current, type] });
    }
  };

  const handleThemeChange = (theme: 'dark-navy' | 'midnight-slate' | 'deep-noir' | 'light') => {
    updateSettings({ theme });
    document.body.setAttribute('data-theme', theme);
  };

  const ALL_SOURCE_TYPES: SourceType[] = [
    'Research Paper',
    'Academic Article',
    'Government Report',
    'Industry Report',
    'News Article'
  ];

  return (
    <div className="settings-page-container animate-fade-in">
      {/* Settings Header */}
      <header className="settings-header">
        <div className="header-icon-box">
          <Settings size={22} />
        </div>
        <div>
          <h1 className="page-heading">Platform Preferences &amp; AI Integration</h1>
          <p className="settings-subtitle">
            Configure Google Gemini AI models, API keys, academic source filters, and interface themes.
          </p>
        </div>
      </header>

      <div className="settings-sections-stack">
        {/* SECTION 0: GEMINI AI INTEGRATION */}
        <section className="settings-card nexa-card-elevated" style={{ border: '1px solid rgba(245, 158, 11, 0.35)' }}>
          <div className="section-title-line">
            <Sparkles size={18} className="text-amber" />
            <div>
              <h3 className="card-heading">Google Gemini AI Engine</h3>
              <p className="section-subtext">
                Connect your Google Gemini API key to activate real-time grounded evidence synthesis, Literature Survey generation, and the interactive Evidence Co-Pilot.
              </p>
            </div>
          </div>

          <div className="api-config-container">
            <div className="api-status-row">
              <span className="status-label font-mono">STATUS:</span>
              {geminiApiKey ? (
                <span className="status-pill active font-mono">
                  <ShieldCheck size={13} />
                  Connected to Google AI Studio
                </span>
              ) : (
                <span className="status-pill fallback font-mono">
                  Using OpenAlex Heuristic Engine (No Key Configured)
                </span>
              )}
            </div>

            <div className="api-input-row">
              <div className="input-group-wrapper">
                <Key size={16} className="key-icon text-amber" />
                <input 
                  type={showKey ? 'text' : 'password'}
                  className="api-key-input font-mono"
                  placeholder="Paste Google Gemini API Key (e.g. AIzaSy...)"
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                />
                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button 
                type="button" 
                className="nexa-btn nexa-btn-amber"
                onClick={handleSaveApiKey}
              >
                <span>Save Key</span>
              </button>

              <button 
                type="button" 
                className="nexa-btn nexa-btn-amber-outline"
                onClick={handleTestApiKey}
                disabled={isTestingKey}
              >
                {isTestingKey ? (
                  <>
                    <RotateCw size={14} className="spinner" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>

            <div className="api-guidance-footer">
              <span className="guidance-text">
                Don't have an API key? You can get a free-tier Google Gemini key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="guidance-link"
                >
                  Google AI Studio <ExternalLink size={12} />
                </a>. Keys are stored locally in your browser.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: APPEARANCE */}
        <section className="settings-card nexa-card">
          <div className="section-title-line">
            <Moon size={18} className="text-blue" />
            <div>
              <h3 className="card-heading">Appearance &amp; Dark Theme</h3>
              <p className="section-subtext">Select your preferred high-contrast research canvas.</p>
            </div>
          </div>

          <div className="theme-options-grid">
            {[
              {
                id: 'dark-navy',
                title: 'Dark Navy (Default)',
                desc: 'Deep naval obsidian canvas (#070A12) with electric blue accents.',
                previewBg: '#070A12'
              },
              {
                id: 'midnight-slate',
                title: 'Midnight Slate',
                desc: 'Slate blue undertones (#090E1A) with high contrast readability.',
                previewBg: '#090E1A'
              },
              {
                id: 'deep-noir',
                title: 'Deep Noir',
                desc: 'Pure high-contrast black (#04060A) for OLED low-light environments.',
                previewBg: '#04060A'
              },
              {
                id: 'light',
                title: 'Light Academic',
                desc: 'Clean white canvas (#F4F6FA) with amber gold accents — ideal for print and daylight.',
                previewBg: '#F4F6FA'
              }
            ].map(theme => (
              <div
                key={theme.id}
                className={`theme-card nexa-card ${settings.theme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.id as any)}
              >
                <div className="theme-color-preview" style={{ background: theme.previewBg }}>
                  <div className="preview-accent-dot" />
                </div>
                <div className="theme-meta">
                  <span className="theme-title">{theme.title}</span>
                  <p className="theme-desc">{theme.desc}</p>
                </div>
                {settings.theme === theme.id && (
                  <div className="active-check">
                    <Check size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: ANALYSIS PREFERENCES */}
        <section className="settings-card nexa-card">
          <div className="section-title-line">
            <Sliders size={18} className="text-violet" />
            <div>
              <h3 className="card-heading">Analysis &amp; Bibliographic Filtering</h3>
              <p className="section-subtext">Toggle which source classes NEXA incorporates into claim extraction.</p>
            </div>
          </div>

          <div className="source-toggles-grid">
            {ALL_SOURCE_TYPES.map(type => {
              const isChecked = settings.preferredSources.includes(type);
              return (
                <div
                  key={type}
                  className={`source-toggle-card nexa-card ${isChecked ? 'checked' : ''}`}
                  onClick={() => handleSourceTypeToggle(type)}
                >
                  <div className="checkbox-box">
                    {isChecked && <Check size={13} />}
                  </div>
                  <div className="source-toggle-info">
                    <span className="source-toggle-name">{type}</span>
                    <span className="source-toggle-sub">
                      {type === 'Research Paper' && 'Peer-reviewed empirical studies and randomized trials'}
                      {type === 'Academic Article' && 'Scholarly theory, qualitative inquiries, and reviews'}
                      {type === 'Government Report' && 'Federal directives, agency whitepapers, and audits'}
                      {type === 'Industry Report' && 'Enterprise benchmarks and longitudinal telemetry'}
                      {type === 'News Article' && 'Investigative tech journalism and clinical case audits'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="strictness-row">
            <div className="strictness-left">
              <span className="setting-micro-title">Synthesis Strictness Mode</span>
              <p className="setting-micro-desc">
                Defines required citation convergence before grouping items into Common Ground agreements.
              </p>
            </div>
            <div className="strictness-buttons">
              {(['Exploratory', 'Standard', 'Rigorous Peer-Reviewed'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  className={`strictness-btn ${settings.strictnessMode === mode ? 'active' : ''}`}
                  onClick={() => updateSettings({ strictnessMode: mode })}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: DISPLAY & GRAPH DENSITY */}
        <section className="settings-card nexa-card">
          <div className="section-title-line">
            <Monitor size={18} className="text-green" />
            <div>
              <h3 className="card-heading">Display &amp; Visualization Engine</h3>
              <p className="section-subtext">Adjust information density and animated flowlines in the Evidence Map.</p>
            </div>
          </div>

          <div className="settings-options-list">
            <div className="setting-row nexa-card">
              <div>
                <span className="setting-title">Display Density</span>
                <p className="setting-desc">Comfortable layout with expanded excerpts vs compact research mode.</p>
              </div>
              <div className="toggle-pill-group">
                <button
                  type="button"
                  className={`toggle-pill ${settings.displayDensity === 'comfortable' ? 'active' : ''}`}
                  onClick={() => updateSettings({ displayDensity: 'comfortable' })}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  className={`toggle-pill ${settings.displayDensity === 'compact' ? 'active' : ''}`}
                  onClick={() => updateSettings({ displayDensity: 'compact' })}
                >
                  Compact
                </button>
              </div>
            </div>

            <div className="setting-row nexa-card">
              <div>
                <span className="setting-title">Spatial Animated Flowlines</span>
                <p className="setting-desc">Enable animated SVG dashes and pulse beacons in the Evidence Relational Map.</p>
              </div>
              <button
                type="button"
                className={`switch-toggle ${settings.showFlowAnimations ? 'on' : ''}`}
                onClick={() => updateSettings({ showFlowAnimations: !settings.showFlowAnimations })}
              >
                <div className="switch-thumb" />
              </button>
            </div>

            <div className="setting-row nexa-card">
              <div>
                <span className="setting-title">Cinematic Introduction Experience</span>
                <p className="setting-desc">Replay the interactive 3D particle constellation sphere, narrative progression, and architectural overview.</p>
              </div>
              <button
                type="button"
                className="btn-replay-intro"
                onClick={replayIntro}
              >
                <Play size={13} />
                <span>Replay Intro</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4: DEMO PROFILE */}
        <section className="settings-card nexa-card">
          <div className="section-title-line">
            <GraduationCap size={18} className="text-cyan" />
            <div>
              <h3 className="card-heading">Student Researcher Profile</h3>
              <p className="section-subtext">Tailor analytical depth to your academic stage (standalone browser state).</p>
            </div>
          </div>

          <div className="profiles-grid">
            {(['Undergraduate', 'Postgraduate', 'Independent Researcher', 'Faculty'] as const).map(role => (
              <div
                key={role}
                className={`profile-card nexa-card ${settings.researcherProfile === role ? 'active' : ''}`}
                onClick={() => updateSettings({ researcherProfile: role })}
              >
                <span className="profile-name">{role}</span>
                <span className="profile-desc">
                  {role === 'Undergraduate' && 'Formative concepts, guided scaffolding, and revision support.'}
                  {role === 'Postgraduate' && 'Methodology critiques, gap discovery, and thesis formulating.'}
                  {role === 'Independent Researcher' && 'Open-access indexes and sovereign epistemic verification.'}
                  {role === 'Faculty' && 'Curricular rubrics, student integrity monitoring, and policy.'}
                </span>
                {settings.researcherProfile === role && (
                  <div className="active-check">
                    <Check size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .settings-page-container {
          max-width: 980px;
          margin: 0 auto;
          padding: 2.5rem 2rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
          position: relative;
          z-index: 5;
        }

        .settings-header {
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

        .settings-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0.2rem 0 0 0;
        }

        .settings-sections-stack {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .settings-card {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .section-title-line {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }

        .section-subtext {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0.2rem 0 0 0;
        }

        /* Theme Cards */
        .theme-options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .theme-card {
          padding: 1.15rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
        }

        .theme-card.active {
          border-color: var(--accent-blue);
          background: rgba(91, 140, 255, 0.08);
          box-shadow: 0 0 20px rgba(91, 140, 255, 0.15);
        }

        .theme-color-preview {
          height: 38px;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          padding: 0 0.65rem;
        }

        .preview-accent-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-blue);
        }

        .theme-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
        }

        .theme-desc {
          font-size: 12.5px;
          color: var(--text-muted);
          margin: 0.2rem 0 0 0;
          line-height: 1.45;
        }

        .active-check {
          position: absolute;
          top: 0.85rem;
          right: 0.85rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-blue);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Source Toggles */
        .source-toggles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .source-toggle-card {
          padding: 1rem 1.15rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          cursor: pointer;
        }

        .source-toggle-card.checked {
          border-color: rgba(91, 140, 255, 0.35);
          background: rgba(91, 140, 255, 0.06);
        }

        .checkbox-box {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .source-toggle-card.checked .checkbox-box {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
        }

        .source-toggle-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .source-toggle-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .source-toggle-sub {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .strictness-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.15rem;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .setting-micro-title {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .setting-micro-desc {
          font-size: 12.5px;
          color: var(--text-muted);
          margin: 0.15rem 0 0 0;
        }

        .strictness-buttons {
          display: flex;
          gap: 0.4rem;
        }

        .strictness-btn {
          font-size: 12.5px;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .strictness-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
        }

        .strictness-btn.active {
          background: rgba(139, 124, 255, 0.15);
          border-color: var(--accent-violet);
          color: #DDD6FE;
          font-weight: 600;
        }

        /* Settings options list */
        .settings-options-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
        }

        .setting-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          display: block;
        }

        .setting-desc {
          font-size: 12.5px;
          color: var(--text-muted);
          margin: 0.15rem 0 0 0;
        }

        .toggle-pill-group {
          display: flex;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 2px;
        }

        .toggle-pill {
          font-size: 12px;
          padding: 0.3rem 0.75rem;
          border-radius: 4px;
          color: var(--text-muted);
          transition: all 0.15s ease;
        }

        .toggle-pill.active {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          font-weight: 600;
        }

        .switch-toggle {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.12);
          position: relative;
          padding: 2px;
          transition: background 0.2s ease;
        }

        .switch-toggle.on {
          background: var(--accent-green);
        }

        .switch-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFF;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .switch-toggle.on .switch-thumb {
          transform: translateX(20px);
        }

        .btn-replay-intro {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.95rem;
          background: rgba(91, 140, 255, 0.12);
          border: 1px solid rgba(91, 140, 255, 0.3);
          border-radius: var(--radius-md);
          color: var(--accent-blue);
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-replay-intro:hover {
          background: rgba(91, 140, 255, 0.22);
          border-color: var(--accent-blue);
          transform: translateY(-1px);
        }

        /* Profiles Grid */
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .profile-card {
          padding: 1.15rem 1rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          position: relative;
        }

        .profile-card.active {
          border-color: var(--accent-blue);
          background: rgba(91, 140, 255, 0.08);
        }

        .profile-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .profile-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.45;
          margin: 0;
        }

        .text-blue { color: var(--accent-blue); }
        .text-violet { color: var(--accent-violet); }
        .text-green { color: var(--accent-green); }
        .text-cyan { color: var(--accent-cyan); }

        /* Gemini API Configuration */
        .api-config-container {
          margin-top: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .api-status-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .status-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .status-pill.active {
          background: rgba(52, 211, 153, 0.12);
          color: #34D399;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .status-pill.fallback {
          background: rgba(245, 158, 11, 0.12);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .api-input-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .input-group-wrapper {
          flex: 1;
          min-width: 280px;
          display: flex;
          align-items: center;
          background: rgba(6, 8, 13, 0.75);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.85rem;
          gap: 0.5rem;
        }

        .api-key-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
        }

        .show-hide-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
        }

        .show-hide-btn:hover {
          color: var(--text-primary);
        }

        .api-guidance-footer {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .guidance-link {
          color: var(--accent-amber);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .guidance-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .theme-options-grid,
          .source-toggles-grid,
          .profiles-grid {
            grid-template-columns: 1fr;
          }
          .api-input-row {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};
