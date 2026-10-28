import React, { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  GitCompare, 
  Compass, 
  ShieldCheck, 
  Play,
  RotateCcw,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isWarpingOut, setIsWarpingOut] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle keyboard shortcuts (Enter or Space to enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnterApp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Stage progression timer for cinematic narrative
  useEffect(() => {
    const stageTimer1 = setTimeout(() => setActiveStage(1), 1800);
    const stageTimer2 = setTimeout(() => setActiveStage(2), 3600);
    return () => {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
    };
  }, []);

  // Interactive 3D Constellation Sphere Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Generate 3D spherical point cloud
    const count = 120;
    const radius = Math.min(width, height) * 0.32;
    const points: Array<{
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      color: string;
      size: number;
    }> = [];

    const colorPalette = [
      'rgba(91, 140, 255, ',  // Electric Blue
      'rgba(76, 201, 240, ',  // Cyan
      'rgba(139, 124, 255, ', // Violet
      'rgba(55, 217, 150, ',  // Green
      'rgba(246, 185, 74, ',  // Amber
    ];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: colorPalette[i % colorPalette.length],
        size: Math.random() * 2 + 1
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate sphere continuously + mouse tilt
      angleY += 0.003 + mousePos.x * 0.0001;
      angleX += 0.0015 + mousePos.y * 0.0001;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const fov = 450;
      const projected: Array<{ x: number; y: number; scale: number; alpha: number; color: string; size: number }> = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // 3D rotation matrix
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;
        const y1 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        const scale = fov / (fov + z2);
        const alpha = Math.max(0.1, (z2 + radius) / (2 * radius));
        const projX = x1 * scale + width / 2;
        const projY = y1 * scale + height / 2;

        projected.push({ x: projX, y: projY, scale, alpha, color: p.color, size: p.size });
      }

      // Draw connective lines between nearby 3D points
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            const lineAlpha = (1 - dist / 65) * 0.15 * ((p1.alpha + p2.alpha) / 2);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(91, 140, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw projected nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = p.color.replace(', ', ')');
        ctx.shadowBlur = p.scale * 8;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX / innerWidth - 0.5) * 15,
      y: (e.clientY / innerHeight - 0.5) * 15
    });
  };

  const handleEnterApp = () => {
    setIsWarpingOut(true);
    setTimeout(() => {
      onEnter();
    }, 650);
  };

  return (
    <div 
      className={`cinematic-intro-wrapper ${isWarpingOut ? 'warp-out' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* 3D Particle Constellation Canvas */}
      <canvas ref={canvasRef} className="intro-canvas" />

      {/* Atmospheric Vignette Gradients */}
      <div className="intro-vignette" />

      {/* Top Header Controls: Skip & Brand */}
      <div className="intro-topbar">
        <div className="intro-brand-chip">
          <div className="brand-dot" />
          <span className="brand-name font-mono">NEXA // SPATIAL RESEARCH CORE</span>
        </div>

        <button 
          type="button" 
          className="skip-intro-btn"
          onClick={handleEnterApp}
          title="Directly enter workspace"
        >
          <span>Skip Introduction</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Central Cinematic Stage Content */}
      <div className="intro-central-stage">
        {/* Monogram Badge */}
        <div className="intro-core-badge">
          <div className="core-beacon-ring" />
          <div className="core-icon-box">
            <Layers size={26} className="core-icon" />
          </div>
        </div>

        {/* Narrative Title */}
        <div className="narrative-block">
          <div className="narrative-kicker font-mono">
            <Sparkles size={13} className="text-cyan" />
            <span>AI EVIDENCE &amp; INSIGHT NAVIGATOR</span>
          </div>

          <h1 className="cinematic-title">
            Students don't have a shortage of information.
            <br />
            <span className="gradient-highlight">They have a shortage of structured understanding.</span>
          </h1>

          <p className="cinematic-subtitle">
            NEXA transforms fragmented literature into an interactive relational topology.
            Compare consensus, isolate empirical contradictions, and discover candidate research frontiers.
          </p>
        </div>

        {/* 4 Pillars of NEXA Architecture */}
        <div className="pillars-grid">
          <div className={`pillar-card ${activeStage >= 0 ? 'visible' : ''}`}>
            <div className="pillar-num font-mono">01</div>
            <div className="pillar-icon text-cyan"><BookOpen size={16} /></div>
            <div className="pillar-name">Sources</div>
            <p className="pillar-desc">Multi-sector literature indexing with citation transparency</p>
          </div>

          <div className={`pillar-card ${activeStage >= 1 ? 'visible' : ''}`}>
            <div className="pillar-num font-mono">02</div>
            <div className="pillar-icon text-blue"><Layers size={16} /></div>
            <div className="pillar-name">Analyze</div>
            <p className="pillar-desc">Discrete empirical claim &amp; methodology parameter parsing</p>
          </div>

          <div className={`pillar-card ${activeStage >= 1 ? 'visible' : ''}`}>
            <div className="pillar-num font-mono">03</div>
            <div className="pillar-icon text-green"><GitCompare size={16} /></div>
            <div className="pillar-name">Compare</div>
            <p className="pillar-desc">Common Ground consensus separated from contextual conflicts</p>
          </div>

          <div className={`pillar-card ${activeStage >= 2 ? 'visible' : ''}`}>
            <div className="pillar-num font-mono">04</div>
            <div className="pillar-icon text-amber"><Compass size={16} /></div>
            <div className="pillar-name">Discover</div>
            <p className="pillar-desc">Candidate Explore Next frontiers for original student inquiry</p>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="cta-cluster">
          <button 
            type="button" 
            className="enter-nexa-btn"
            onClick={handleEnterApp}
          >
            <span>Enter NEXA Research Intelligence</span>
            <div className="btn-arrow-box">
              <ArrowRight size={17} />
            </div>
          </button>

          <div className="cta-meta font-mono">
            <span>Press Enter ↵ or Click to Launch</span>
            <span className="dot-sep">•</span>
            <span className="text-cyan">Zero Synthetic Certainty Protocol</span>
          </div>
        </div>
      </div>

      {/* Bottom Protocol Strip */}
      <div className="intro-footer-strip font-mono">
        <div className="footer-left-status">
          <ShieldCheck size={14} className="text-green" />
          <span>AUTONOMOUS ACADEMIC ENGINE // BROWSER-SIDE LOCAL TOPOLOGY</span>
        </div>
        <div className="footer-right-version">
          <span>NEXA SYSTEM v2.5 // READY</span>
        </div>
      </div>

      <style>{`
        .cinematic-intro-wrapper {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: #050810;
          color: #F8FAFC;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cinematic-intro-wrapper.warp-out {
          opacity: 0;
          transform: scale(1.08);
          pointer-events: none;
        }

        .intro-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .intro-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, rgba(5, 8, 16, 0.85) 90%),
                      linear-gradient(180deg, rgba(5, 8, 16, 0.7) 0%, transparent 40%, rgba(5, 8, 16, 0.85) 100%);
          pointer-events: none;
          z-index: 3;
        }

        .intro-topbar {
          position: relative;
          z-index: 10;
          padding: 1.75rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .intro-brand-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #BAE6FD;
        }

        .brand-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4CC9F0;
          box-shadow: 0 0 10px #4CC9F0;
        }

        .skip-intro-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 13px;
          color: #94A3B8;
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
        }

        .skip-intro-btn:hover {
          color: #FFF;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .intro-central-stage {
          position: relative;
          z-index: 10;
          max-width: 960px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2rem;
        }

        .intro-core-badge {
          position: relative;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .core-beacon-ring {
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          border: 1.5px dashed rgba(91, 140, 255, 0.35);
          animation: spin 16s linear infinite;
        }

        .core-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(91, 140, 255, 0.25) 0%, rgba(76, 201, 240, 0.3) 100%);
          border: 1.5px solid rgba(91, 140, 255, 0.5);
          box-shadow: 0 0 35px rgba(91, 140, 255, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7AA2FF;
        }

        .narrative-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-width: 860px;
        }

        .narrative-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #7AA2FF;
          background: rgba(91, 140, 255, 0.1);
          border: 1px solid rgba(91, 140, 255, 0.25);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .cinematic-title {
          font-size: clamp(2rem, 3.8vw, 2.85rem);
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.03em;
          color: #FFF;
          margin: 0;
        }

        .gradient-highlight {
          background: linear-gradient(135deg, #FFF 10%, #7AA2FF 55%, #4CC9F0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cinematic-subtitle {
          font-size: 16px;
          color: #94A3B8;
          line-height: 1.6;
          max-width: 680px;
          margin: 0;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          width: 100%;
        }

        .pillar-card {
          background: rgba(14, 20, 36, 0.65);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.15rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.4rem;
          position: relative;
          opacity: 0;
          transform: translateY(12px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pillar-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .pillar-num {
          position: absolute;
          top: 0.65rem;
          right: 0.75rem;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.25);
        }

        .pillar-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pillar-name {
          font-size: 14px;
          font-weight: 700;
          color: #FFF;
        }

        .pillar-desc {
          font-size: 12px;
          color: #64748B;
          line-height: 1.45;
          margin: 0;
        }

        .cta-cluster {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .enter-nexa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1.85rem;
          background: linear-gradient(135deg, #5B8CFF 0%, #3B6EE8 100%);
          color: #FFF;
          font-size: 15px;
          font-weight: 600;
          border-radius: var(--radius-md);
          box-shadow: 0 4px 30px rgba(91, 140, 255, 0.5);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .enter-nexa-btn:hover {
          background: linear-gradient(135deg, #6E9BFF 0%, #4778F5 100%);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 40px rgba(91, 140, 255, 0.65);
        }

        .btn-arrow-box {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 11.5px;
          color: #64748B;
        }

        .dot-sep {
          color: rgba(255, 255, 255, 0.2);
        }

        .intro-footer-strip {
          position: relative;
          z-index: 10;
          padding: 1.25rem 2.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #64748B;
        }

        .footer-left-status {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .text-cyan { color: #4CC9F0; }
        .text-blue { color: #5B8CFF; }
        .text-green { color: #37D996; }
        .text-amber { color: #F6B94A; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .cinematic-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
};
