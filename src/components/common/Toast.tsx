import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useResearch();

  if (toasts.length === 0) return null;

  return (
    <div className="nexa-toast-viewport">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={18} className="toast-icon text-emerald" />;
            case 'warning':
              return <AlertCircle size={18} className="toast-icon text-amber" />;
            case 'error':
              return <AlertCircle size={18} className="toast-icon text-rose" />;
            default:
              return <Info size={18} className="toast-icon text-cyan" />;
          }
        };

        return (
          <div key={toast.id} className={`nexa-toast toast-${toast.type}`}>
            <div className="toast-icon-wrapper">
              {getIcon()}
            </div>
            <div className="toast-content">
              <span className="toast-title">{toast.title}</span>
              <p className="toast-message">{toast.message}</p>
            </div>
            <button 
              type="button" 
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        .nexa-toast-viewport {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-width: 380px;
          pointer-events: none;
        }

        .nexa-toast {
          pointer-events: auto;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: rgba(14, 21, 36, 0.96);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.7);
          animation: slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-success {
          border-left: 3px solid var(--accent-emerald);
        }
        .toast-info {
          border-left: 3px solid var(--accent-cyan);
        }
        .toast-warning {
          border-left: 3px solid var(--accent-amber);
        }
        .toast-error {
          border-left: 3px solid var(--accent-rose);
        }

        .toast-icon-wrapper {
          padding-top: 1px;
        }

        .text-emerald { color: var(--accent-emerald); }
        .text-cyan { color: var(--accent-cyan); }
        .text-amber { color: var(--accent-amber); }
        .text-rose { color: var(--accent-rose); }

        .toast-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .toast-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .toast-message {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
        }

        .toast-close {
          color: var(--text-dim);
          padding: 2px;
          border-radius: 4px;
          transition: color 0.15s ease;
        }

        .toast-close:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
