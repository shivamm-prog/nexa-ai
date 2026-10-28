import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Landmark, BarChart3, Newspaper, Sparkles, ShieldCheck } from 'lucide-react';

interface FloatingNode {
  id: string;
  title: string;
  type: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  xPercent: number;
  yPercent: number;
  color: string;
  tag: string;
}

export const SpatialCore: React.FC<{ isConverging?: boolean }> = ({ isConverging = false }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10 to +10 px
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const nodes: FloatingNode[] = [
    {
      id: 'node-paper',
      title: 'Peer-Reviewed Literature',
      type: 'Research Paper',
      icon: BookOpen,
      xPercent: 12,
      yPercent: 20,
      color: '#4CC9F0',
      tag: 'n = 4,210 RCT'
    },
    {
      id: 'node-gov',
      title: 'Federal Policy Directives',
      type: 'Government Report',
      icon: Landmark,
      xPercent: 82,
      yPercent: 18,
      color: '#5B8CFF',
      tag: 'NIST Standards'
    },
    {
      id: 'node-acad',
      title: 'Epistemic Critiques',
      type: 'Academic Article',
      icon: FileText,
      xPercent: 14,
      yPercent: 74,
      color: '#8B7CFF',
      tag: 'Oxford Review'
    },
    {
      id: 'node-ind',
      title: 'Telemetry & Adaptive Systems',
      type: 'Industry Report',
      icon: BarChart3,
      xPercent: 80,
      yPercent: 72,
      color: '#37D996',
      tag: '85k Accounts'
    },
    {
      id: 'node-news',
      title: 'Clinical Case Audits',
      type: 'News Article',
      icon: Newspaper,
      xPercent: 48,
      yPercent: 86,
      color: '#F6B94A',
      tag: 'Field Audits'
    }
  ];

  return (
    <div className="spatial-core-wrapper">
      <div 
        className="spatial-scene"
        style={{
          transform: `rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`
        }}
      >
        {/* Central Scientific NEXA Core */}
        <div className={`central-nexa-core ${isConverging ? 'converging' : ''}`}>
          <div className="core-outer-gyro" />
          <div className="core-inner-ring" />
          <div className="core-nucleus">
            <div className="nucleus-inner-glow" />
            <div className="nucleus-brand-lock">
              <Sparkles size={22} className="core-sparkle" />
              <span className="core-brand-name">NEXA</span>
              <span className="core-status-text">INTELLIGENCE CORE</span>
            </div>
            <div className="core-status-pill">
              <ShieldCheck size={11} className="text-cyan" />
              <span>Epistemic Analyzer</span>
            </div>
          </div>
        </div>

        {/* Floating Source Nodes & Animated SVG Filaments */}
        <svg className="filaments-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="filament-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#4CC9F0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {nodes.map(node => (
            <line
              key={`line-${node.id}`}
              x1={node.xPercent}
              y1={node.yPercent}
              x2={50}
              y2={50}
              stroke="url(#filament-grad)"
              strokeWidth="0.35"
              strokeDasharray="2, 2"
              className="animated-filament"
            />
          ))}
        </svg>

        {nodes.map(node => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className={`floating-source-node ${isConverging ? 'node-converging' : ''}`}
              style={{
                left: `${node.xPercent}%`,
                top: `${node.yPercent}%`,
                transform: `translate(-50%, -50%) translate3d(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px, 20px)`
              }}
            >
              <div className="node-icon-bubble" style={{ borderColor: `${node.color}50` }}>
                <Icon size={14} style={{ color: node.color }} />
              </div>
              <div className="node-text-lock">
                <span className="node-source-type">{node.type}</span>
                <span className="node-source-title">{node.title}</span>
                <span className="node-metric-tag font-mono">{node.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .spatial-core-wrapper {
          position: relative;
          width: 100%;
          height: 380px;
          margin: 1rem 0 1.5rem;
          perspective: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .spatial-scene {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out;
        }

        .filaments-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        .animated-filament {
          stroke-dashoffset: 40;
          animation: dashFlow 20s linear infinite;
        }

        /* Central Core */
        .central-nexa-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .central-nexa-core.converging {
          transform: translate(-50%, -50%) scale(1.15);
          box-shadow: 0 0 80px rgba(91, 140, 255, 0.6);
        }

        .core-outer-gyro {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          border: 1px dashed rgba(91, 140, 255, 0.3);
          animation: spinGyro 24s linear infinite;
        }

        .core-inner-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid rgba(245, 158, 11, 0.35);
          animation: pulseGlow 4s ease-in-out infinite;
        }

        @keyframes spinGyro {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .core-nucleus {
          position: relative;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 35%, #2A1D07 0%, #0F0B04 80%);
          border: 1.5px solid rgba(245, 158, 11, 0.55);
          box-shadow: 0 0 45px rgba(245, 158, 11, 0.35), inset 0 0 25px rgba(251, 191, 36, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          text-align: center;
          padding: 1rem;
          animation: corePulse 5s ease-in-out infinite;
        }

        .nucleus-inner-glow {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%);
          pointer-events: none;
        }

        .nucleus-brand-lock {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }

        .core-sparkle {
          color: var(--accent-amber);
          filter: drop-shadow(0 0 6px var(--accent-amber));
          margin-bottom: 2px;
        }

        .core-brand-name {
          font-family: var(--font-family);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #FFF;
        }

        .core-status-text {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--accent-cyan);
          letter-spacing: 0.09em;
        }

        .core-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          padding: 0.15rem 0.5rem;
          font-size: 0.65rem;
          color: var(--text-secondary);
          z-index: 2;
        }

        /* Floating Source Nodes */
        .floating-source-node {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(14, 20, 36, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: 0.55rem 0.85rem;
          box-shadow: 0 8px 24px -2px rgba(0, 0, 0, 0.55);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 15;
          animation: spatialFloat 7s ease-in-out infinite;
        }

        .floating-source-node:hover {
          border-color: rgba(91, 140, 255, 0.45);
          transform: translate(-50%, -50%) scale(1.05) !important;
          box-shadow: 0 12px 30px rgba(91, 140, 255, 0.25);
        }

        .node-converging {
          top: 50% !important;
          left: 50% !important;
          opacity: 0.2;
          transform: translate(-50%, -50%) scale(0.6) !important;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .node-icon-bubble {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .node-text-lock {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .node-source-type {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .node-source-title {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .node-metric-tag {
          font-size: 0.65rem;
          color: var(--accent-cyan);
        }

        @media (max-width: 900px) {
          .spatial-core-wrapper {
            height: 300px;
          }
          .floating-source-node {
            display: none;
          }
          .filaments-svg {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
