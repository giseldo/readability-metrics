export interface ReadabilityMetrics {
  gunningFog: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  smogIndex: number;
  colemanLiauIndex: number;
  automatedReadabilityIndex: number;
  daleChallReadabilityScore: number;
  difficultWords: number;
  linsearWriteFormula: number;
  
  // Additional metrics for display
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  characterCount: number;
}