import React, { useEffect, useRef } from 'react';

export const SpatialAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle particles: soft scientific research nodes
    const particleCount = Math.min(36, Math.floor(width / 35));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(245, 158, 11, ', // amber gold
      'rgba(251, 191, 36, ', // warm gold
      'rgba(217, 119, 6, ',  // deep gold
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.3 + 0.12,
        color: colors[i % colors.length]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connective filaments between nearby floating nodes
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Update positions smoothly
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        else if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        else if (p1.y > height) p1.y = 0;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${p1.alpha})`;
        ctx.shadowColor = p1.color.replace(', ', ')');
        ctx.shadowBlur = 8;
        ctx.fill();

        // Connect nearby points
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.08;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="spatial-atmosphere-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="spatial-canvas" />
      <div className="spatial-radial-lighting" />
      <style>{`
        .spatial-atmosphere-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .spatial-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.75;
        }

        .spatial-radial-lighting {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle 650px at 50% 15%, rgba(245, 158, 11, 0.06) 0%, transparent 80%),
            radial-gradient(circle 500px at 85% 75%, rgba(217, 119, 6, 0.04) 0%, transparent 75%),
            radial-gradient(circle 450px at 15% 85%, rgba(251, 191, 36, 0.03) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
};
