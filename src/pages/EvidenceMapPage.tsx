import React from 'react';
import { EvidenceMap } from '../components/evidence-map/EvidenceMap';

export const EvidenceMapPage: React.FC = () => {
  return (
    <div className="evidence-map-page-wrapper animate-fade-in">
      <EvidenceMap />
      
      <style>{`
        .evidence-map-page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - var(--topbar-height));
          background: #06090E;
        }
      `}</style>
    </div>
  );
};
