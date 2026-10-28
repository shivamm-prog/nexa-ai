import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvestigationData, Source, SavedItem } from '../types';
import { LiteratureSurveyData } from './geminiService';
import { PaperComparisonData } from './paperComparisonService';

// Styling tokens for Light Academic Theme with Luxury Gold accents
const PRIMARY_COLOR = [26, 32, 44];       // Dark charcoal / slate text
const SECONDARY_COLOR = [74, 85, 104];    // Subdued gray text
const GOLD_ACCENT = [217, 119, 6];        // Warm amber / gold #D97706
const BORDER_COLOR = [226, 232, 240];     // Subtle light border

// Safe wrapper to get Y position after an autoTable call
function getTableFinalY(doc: jsPDF, fallback: number): number {
  return (doc as any).lastAutoTable?.finalY ?? fallback;
}

// Helper to draw standard academic header on first page
function drawReportHeader(doc: jsPDF, title: string, topic: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Top gold accent band
  doc.setFillColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Brand Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('NEXA AI', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text('Academic Research Intelligence & Epistemic Synthesis', 42, 18);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text(title, 14, 28);

  // Topic & Timestamp Meta — clamp topic to prevent overflow
  const maxTopicWidth = pageWidth - 56;
  const clampedTopic = doc.splitTextToSize(topic, maxTopicWidth)[0];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text(`Research Topic: `, 14, 35);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text(clampedTopic, 42, 35);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} | Standard: APA 7th / IEEE Verified`, 14, 41);

  // Divider Line
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.5);
  doc.line(14, 45, pageWidth - 14, 45);

  return 52;
}

// Add page numbering & footer across all pages
function applyPageNumbers(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);

    // Bottom footer line
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    // Left metadata, right page number
    doc.text('NEXA AI Academic Research Platform — Verified Scientific Synthesis', 14, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 32, pageHeight - 7);
  }
}

// 1. Export Research Analysis PDF
export function exportResearchAnalysisPdf(investigation: InvestigationData): void {
  const doc = new jsPDF();
  let y = drawReportHeader(doc, 'Research Analysis & Evidence Dossier', investigation.topic);

  // Section 1: Executive Overview
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('1. Executive Literature Overview', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  const splitSummary = doc.splitTextToSize(investigation.summary, 180);
  doc.text(splitSummary, 14, y);
  y += splitSummary.length * 5 + 6;

  // Section 2: Core Claims Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('2. Extracted Empirical Claims', 14, y);
  y += 4;

  const claimsData = investigation.claims.map((c, i) => [
    `#${i + 1}`,
    c.category,
    c.text,
    c.status,
    c.evidenceSummary
  ]);

  autoTable(doc, {
    startY: y,
    head: [['ID', 'Category', 'Claim Statement', 'Status', 'Evidence Synthesis']],
    body: claimsData,
    theme: 'grid',
    headStyles: {
      fillColor: GOLD_ACCENT,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: PRIMARY_COLOR
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 26 },
      2: { cellWidth: 55 },
      3: { cellWidth: 20 },
      4: { cellWidth: 70 }
    }
  });

  y = getTableFinalY(doc, y) + 10;

  // Section 3: Consensus Points (Agreements)
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('3. Consensus Points & Common Ground', 14, y);
  y += 6;

  investigation.agreements.forEach((agr, idx) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`[Consensus ${idx + 1}] ${agr.title} (${agr.confidence})`, 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    const splitAgr = doc.splitTextToSize(agr.statement, 180);
    doc.text(splitAgr, 14, y);
    y += splitAgr.length * 4.5 + 4;
  });

  // Section 4: Conflicting Literature
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('4. Contradictions & Methodological Divergences', 14, y);
  y += 6;

  investigation.disagreements.forEach((dis, idx) => {
    if (y > 235) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`Debate ${idx + 1}: ${dis.question}`, 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`• Side A (${dis.sourceA.sourceTitle}): ${dis.sourceA.claimSnippet}`, 16, y);
    y += 5;
    doc.text(`• Side B (${dis.sourceB.sourceTitle}): ${dis.sourceB.claimSnippet}`, 16, y);
    y += 5;

    if (dis.whyDifferentFactors?.[0]) {
      doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
      doc.text(`• Root Cause (${dis.whyDifferentFactors[0].factor}): ${dis.whyDifferentFactors[0].analysis}`, 16, y);
      doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      y += 6;
    }
    y += 2;
  });

  applyPageNumbers(doc);
  doc.save('NEXA_AI_Research_Analysis.pdf');
}

// 2. Export Paper Comparison PDF
export function exportPaperComparisonPdf(comparison: PaperComparisonData, topic: string): void {
  const doc = new jsPDF('landscape');
  let y = drawReportHeader(doc, 'Comparative Literature Analysis', topic);

  // Summary section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('Comparative Synthesis Summary', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  const splitSummary = doc.splitTextToSize(comparison.comparativeSummary, 265);
  doc.text(splitSummary, 14, y);
  y += splitSummary.length * 4.5 + 6;

  // Comparison Matrix Table
  const tableRows = comparison.papers.map(p => [
    p.title,
    `${p.authors} (${p.year})`,
    p.methodology,
    p.sampleOrDataset,
    p.keyFindings,
    p.contributions,
    p.limitations
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Paper Title', 'Authors & Year', 'Methodology', 'Sample / Data', 'Key Findings', 'Contributions', 'Limitations']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: GOLD_ACCENT,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: PRIMARY_COLOR
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: 45 },
      5: { cellWidth: 35 },
      6: { cellWidth: 35 }
    }
  });

  y = getTableFinalY(doc, y) + 8;

  if (y > 165) {
    doc.addPage();
    y = 20;
  }

  // Cross-Cutting Findings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('Cross-Cutting Similarities & Empirical Differences', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  comparison.similarities.forEach(s => {
    doc.text(`[Similarity] ${s}`, 14, y);
    y += 4.5;
  });
  comparison.differences.forEach(d => {
    doc.text(`[Divergence] ${d}`, 14, y);
    y += 4.5;
  });

  applyPageNumbers(doc);
  doc.save('NEXA_AI_Paper_Comparison.pdf');
}

// 3. Export Literature Survey PDF
export function exportLiteratureSurveyPdf(survey: LiteratureSurveyData): void {
  const doc = new jsPDF();
  let y = drawReportHeader(doc, 'Structured Academic Literature Survey', survey.topic);

  // 1. Executive Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('1. Executive Summary', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  const splitExec = doc.splitTextToSize(survey.executiveSummary, 180);
  doc.text(splitExec, 14, y);
  y += splitExec.length * 4.5 + 6;

  // 2. Background and Scope
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('2. Background and Theoretical Scope', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  const splitBg = doc.splitTextToSize(survey.backgroundAndScope, 180);
  doc.text(splitBg, 14, y);
  y += splitBg.length * 4.5 + 6;

  // 3. Thematic Analysis
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('3. Major Thematic Classifications', 14, y);
  y += 5;

  survey.thematicAnalysis.forEach((t, i) => {
    if (y > 255) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`Theme ${i + 1}: ${t.themeTitle}`, 14, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    const splitDesc = doc.splitTextToSize(t.description, 180);
    doc.text(splitDesc, 14, y);
    y += splitDesc.length * 4 + 2;

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
    doc.text(`Consensus: ${t.consensusFinding}`, 14, y);
    y += 6;
  });

  // 4. Paper-by-Paper Comparative Matrix Table
  if (y > 220) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('4. Systematic Paper-by-Paper Comparative Matrix', 14, y);
  y += 4;

  const matrixRows = survey.comparativeMatrix.map(m => [
    m.paperTitle,
    `${m.authors} (${m.year})`,
    m.methodology,
    m.sampleOrContext,
    m.keyContribution,
    m.limitation
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Paper Title', 'Authors & Year', 'Methodology', 'Sample Context', 'Key Contribution', 'Limitation']],
    body: matrixRows,
    theme: 'grid',
    headStyles: { fillColor: GOLD_ACCENT, textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2, textColor: PRIMARY_COLOR },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { cellWidth: 28 },
      3: { cellWidth: 26 },
      4: { cellWidth: 32 },
      5: { cellWidth: 25 }
    }
  });

  y = getTableFinalY(doc, y) + 8;

  // 5. Critical Synthesis
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('5. Critical Synthesis of the Literature', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  const splitCrit = doc.splitTextToSize(survey.criticalSynthesis, 180);
  doc.text(splitCrit, 14, y);
  y += splitCrit.length * 4.5 + 6;

  // 6. Conflicting Findings
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('6. Conflicting Findings & Scholarly Debates', 14, y);
  y += 5;

  survey.conflictingFindings.forEach((cf, idx) => {
    if (y > 245) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`Debate ${idx + 1}: ${cf.tensionPoint}`, 14, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    doc.text(`• Perspective A: ${cf.perspectiveA}`, 16, y);
    y += 4;
    doc.text(`• Perspective B: ${cf.perspectiveB}`, 16, y);
    y += 4;
    doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
    doc.text(`• Root Cause: ${cf.methodologicalRootCause}`, 16, y);
    y += 6;
  });

  // 7. Research Gaps & Future Directions
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('7. Identified Research Gaps & Future Directions', 14, y);
  y += 5;

  survey.researchGaps.forEach(g => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`[Gap] ${g.gapTitle}`, 14, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${g.currentLimitation} (Impact: ${g.impactOnField})`, 16, y);
    y += 5;
  });

  survey.futureDirections.forEach((fd, i) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
    doc.text(`${i + 1}. ${fd}`, 14, y);
    y += 4.5;
  });

  // 8. References (APA 7th)
  doc.addPage();
  y = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('8. Formal Bibliographic References (APA 7th Edition)', 14, y);
  y += 6;

  survey.apaReferences.forEach((ref, idx) => {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    const splitRef = doc.splitTextToSize(`[${idx + 1}] ${ref}`, 180);
    doc.text(splitRef, 14, y);
    y += splitRef.length * 4 + 2;
  });

  applyPageNumbers(doc);
  doc.save('NEXA_AI_Literature_Survey.pdf');
}

// 4. Export Citation Intelligence Report PDF
export function exportCitationReportPdf(sources: Source[], claims: any[], topic: string): void {
  const doc = new jsPDF();
  let y = drawReportHeader(doc, 'Citation Intelligence & Verification Report', topic);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('1. Bibliographic Citation Registry (APA 7th & IEEE)', 14, y);
  y += 5;

  const refRows = sources.map((s, idx) => [
    `[${idx + 1}]`,
    s.authors,
    s.year.toString(),
    s.title,
    s.publisher,
    s.doi ? `https://doi.org/${s.doi}` : 'Indexed'
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Authors', 'Year', 'Work Title', 'Journal / Venue', 'DOI / Resolver']],
    body: refRows,
    theme: 'grid',
    headStyles: { fillColor: GOLD_ACCENT, textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2.5, textColor: PRIMARY_COLOR },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 40 },
      2: { cellWidth: 14 },
      3: { cellWidth: 50 },
      4: { cellWidth: 35 },
      5: { cellWidth: 35 }
    }
  });

  y = getTableFinalY(doc, y) + 10;

  if (y > 220) { doc.addPage(); y = 20; }

  // Claim-to-Citation Grounding Map
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('2. Claim-to-Citation Grounding & Rationale', 14, y);
  y += 6;

  claims.forEach((clm, i) => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(`Claim ${i + 1}: "${clm.text}"`, 14, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    doc.text(`• Status: ${clm.status} | Grounding: ${clm.evidenceSummary}`, 16, y);
    y += 4.5;

    doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
    doc.text(`• Verification Rationale: ${clm.whyAmISeeingThis}`, 16, y);
    y += 6;
  });

  applyPageNumbers(doc);
  doc.save('NEXA_AI_Citation_Report.pdf');
}

// 5. Export Evidence Map PDF
export function exportEvidenceMapPdf(investigation: InvestigationData): void {
  const doc = new jsPDF();
  let y = drawReportHeader(doc, 'Visual Evidence Map Topology', investigation.topic);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('Evidence Relational Graph Summary', 14, y);
  y += 6;

  const topologyRows = [
    ['Indexed Scholarly Sources', investigation.overviewStats.sourcesCount.toString()],
    ['Extracted Core Claims', investigation.overviewStats.claimsCount.toString()],
    ['Consensus Points (Agreements)', investigation.overviewStats.agreementsCount.toString()],
    ['Empirical Contradictions (Disagreements)', investigation.overviewStats.disagreementsCount.toString()],
    ['Explore Next Frontiers', investigation.overviewStats.exploreNextCount.toString()]
  ];

  autoTable(doc, {
    startY: y,
    head: [['Relational Dimension', 'Node Count in Graph']],
    body: topologyRows,
    theme: 'grid',
    headStyles: { fillColor: GOLD_ACCENT, textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  y = getTableFinalY(doc, y) + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('Graph Nodes & Inferred Stances', 14, y);
  y += 5;

  const nodeDetails = investigation.sources.map(s => [
    s.title,
    s.type,
    s.stance,
    `${s.relevance}%`,
    s.claimIds.join(', ')
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Source Node', 'Type', 'Stance', 'Relevance', 'Connected Claims']],
    body: nodeDetails,
    theme: 'grid',
    headStyles: { fillColor: GOLD_ACCENT, textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 }
  });

  applyPageNumbers(doc);
  doc.save('NEXA_AI_Evidence_Map.pdf');
}

// 6. Export Research Gaps PDF
export function exportResearchGapsPdf(exploreNext: any, topic: string): void {
  const doc = new jsPDF();
  let y = drawReportHeader(doc, 'Research Gaps & Frontier Inquiry Agenda', topic);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('Primary Underexplored Research Gap', 14, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  const splitTitle = doc.splitTextToSize(`"${exploreNext.underexploredArea}"`, 180);
  doc.text(splitTitle, 14, y);
  y += splitTitle.length * 5 + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.text(`Surfacing Rationale: ${exploreNext.whyThisSurfaced}`, 14, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('Methodological Gap Across Evaluated Corpus', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  const splitGap = doc.splitTextToSize(exploreNext.methodologyGap, 180);
  doc.text(splitGap, 14, y);
  y += splitGap.length * 4.5 + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text('Suggested High-Impact Research Directions', 14, y);
  y += 5;

  exploreNext.suggestedResearchDirections.forEach((dir: string, i: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    const splitDir = doc.splitTextToSize(`${i + 1}. ${dir}`, 180);
    doc.text(splitDir, 14, y);
    y += splitDir.length * 4.5 + 3;
  });

  applyPageNumbers(doc);
  doc.save('NEXA_AI_Research_Gaps.pdf');
}

// 7. Export Saved Research PDF
export function exportSavedResearchPdf(items: SavedItem[]): void {
  const doc = new jsPDF();
  let y = drawReportHeader(doc, 'Research Notebook & Saved Dossier', 'Compiled Research Collection');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
  doc.text(`Saved Research Collection (${items.length} Items)`, 14, y);
  y += 5;

  const rows = items.map((item, idx) => [
    `#${idx + 1}`,
    item.type.toUpperCase(),
    item.topic,
    item.title,
    item.preview
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Type', 'Topic', 'Title', 'Synthesis Preview']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: GOLD_ACCENT, textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2.5, textColor: PRIMARY_COLOR },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 22 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 },
      4: { cellWidth: 70 }
    }
  });

  applyPageNumbers(doc);
  doc.save('NEXA_AI_Saved_Research.pdf');
}
