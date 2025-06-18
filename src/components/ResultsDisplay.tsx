import React from 'react';
import { ReadabilityMetrics } from '../types/readability';
import MetricCard from './MetricCard';
import MetricExplanation from './MetricExplanation';

interface ResultsDisplayProps {
  metrics: ReadabilityMetrics;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ metrics }) => {
  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Readability Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <MetricCard 
          title="Gunning Fog Index" 
          value={metrics.gunningFog} 
          interpretation={getGunningFogInterpretation(metrics.gunningFog)}
          colorClass={getGunningFogColorClass(metrics.gunningFog)}
        />
        
        <MetricCard 
          title="Flesch Reading Ease" 
          value={metrics.fleschReadingEase} 
          interpretation={getFleschReadingEaseInterpretation(metrics.fleschReadingEase)}
          colorClass={getFleschReadingEaseColorClass(metrics.fleschReadingEase)}
          higherIsBetter={true}
        />
        
        <MetricCard 
          title="Flesch-Kincaid Grade" 
          value={metrics.fleschKincaidGrade} 
          interpretation={`Grade ${metrics.fleschKincaidGrade.toFixed(1)} level`}
          colorClass={getGradeColorClass(metrics.fleschKincaidGrade)}
        />
        
        <MetricCard 
          title="SMOG Index" 
          value={metrics.smogIndex} 
          interpretation={`Grade ${metrics.smogIndex.toFixed(1)} level`}
          colorClass={getGradeColorClass(metrics.smogIndex)}
        />
        
        <MetricCard 
          title="Coleman-Liau Index" 
          value={metrics.colemanLiauIndex} 
          interpretation={`Grade ${metrics.colemanLiauIndex.toFixed(1)} level`}
          colorClass={getGradeColorClass(metrics.colemanLiauIndex)}
        />
        
        <MetricCard 
          title="Automated Readability Index" 
          value={metrics.automatedReadabilityIndex} 
          interpretation={`Grade ${metrics.automatedReadabilityIndex.toFixed(1)} level`}
          colorClass={getGradeColorClass(metrics.automatedReadabilityIndex)}
        />
        
        <MetricCard 
          title="Dale-Chall Score" 
          value={metrics.daleChallReadabilityScore} 
          interpretation={getDaleChallInterpretation(metrics.daleChallReadabilityScore)}
          colorClass={getDaleChallColorClass(metrics.daleChallReadabilityScore)}
        />
        
        <MetricCard 
          title="Linsear Write Formula" 
          value={metrics.linsearWriteFormula} 
          interpretation={`Grade ${metrics.linsearWriteFormula.toFixed(1)} level`}
          colorClass={getGradeColorClass(metrics.linsearWriteFormula)}
        />
        
        <MetricCard 
          title="Difficult Words" 
          value={metrics.difficultWords} 
          interpretation={`${metrics.difficultWords} complex words found`}
          colorClass={getDifficultWordsColorClass(metrics.difficultWords)}
          isCount={true}
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-semibold text-gray-700 mb-2">Text Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Words</p>
            <p className="text-xl font-medium">{metrics.wordCount}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Sentences</p>
            <p className="text-xl font-medium">{metrics.sentenceCount}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Avg. Words Per Sentence</p>
            <p className="text-xl font-medium">{(metrics.wordCount / metrics.sentenceCount).toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Syllables</p>
            <p className="text-xl font-medium">{metrics.syllableCount}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Readability Metrics</h3>
        <div className="space-y-4">
          <MetricExplanation 
            title="Gunning Fog Index" 
            description="Estimates the years of formal education needed to understand the text on first reading. A score of 12 requires a high school graduate level. Ideal scores: 7-8 for popular fiction, 10-11 for academic texts, 15-20 for scientific papers."
          />
          <MetricExplanation 
            title="Flesch Reading Ease" 
            description="Higher scores indicate text that is easier to read. 90-100: Very easy (5th grade). 80-89: Easy (6th grade). 70-79: Fairly easy (7th grade). 60-69: Standard (8th-9th grade). 50-59: Fairly difficult (10th-12th grade). 30-49: Difficult (college). Below 30: Very confusing."
          />
          <MetricExplanation 
            title="Flesch-Kincaid Grade Level" 
            description="Translates to a U.S. grade level. A score of 8.0 means the text is understandable by an 8th grader. Recommended for general audience: 7-8."
          />
          <MetricExplanation 
            title="SMOG Index" 
            description="Predicts the grade level needed to understand the text. Often used for healthcare materials, with a recommended score of 6th grade level for public health information."
          />
          <MetricExplanation 
            title="Coleman-Liau Index" 
            description="Uses characters instead of syllables, giving the approximate U.S. grade level required to comprehend the text."
          />
          <MetricExplanation 
            title="Automated Readability Index" 
            description="Like the Coleman-Liau, it relies on character count rather than syllables. It provides the approximate grade level needed to understand the text."
          />
          <MetricExplanation 
            title="Dale-Chall Readability Score" 
            description="Based on a list of 3,000 words that 80% of 4th-grade students understand. Scores: 4.9 or lower: easily understood by 4th grade. 5.0-5.9: 5th-6th grade. 6.0-6.9: 7th-8th grade. 7.0-7.9: 9th-10th grade. 8.0-8.9: 11th-12th grade. 9.0-9.9: college student. 10+: college graduate."
          />
          <MetricExplanation 
            title="Linsear Write Formula" 
            description="Developed for the U.S. Air Force to calculate the readability of technical manuals. The score roughly corresponds to a U.S. grade level."
          />
          <MetricExplanation 
            title="Difficult Words" 
            description="Count of words not found on the Dale-Chall list of 3,000 familiar words. These words may be harder for readers to understand."
          />
        </div>
      </div>
    </div>
  );
};

// Helper functions for interpretations and color classes
const getGunningFogInterpretation = (score: number): string => {
  if (score < 8) return 'Easy reading';
  if (score < 12) return 'Comfortable reading';
  if (score < 17) return 'Difficult reading';
  return 'Very difficult';
};

const getGunningFogColorClass = (score: number): string => {
  if (score < 8) return 'bg-green-100 text-green-800';
  if (score < 12) return 'bg-blue-100 text-blue-800';
  if (score < 17) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getFleschReadingEaseInterpretation = (score: number): string => {
  if (score >= 90) return 'Very easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly difficult';
  if (score >= 30) return 'Difficult';
  return 'Very confusing';
};

const getFleschReadingEaseColorClass = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getGradeColorClass = (score: number): string => {
  if (score <= 6) return 'bg-green-100 text-green-800';
  if (score <= 9) return 'bg-blue-100 text-blue-800';
  if (score <= 12) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getDaleChallInterpretation = (score: number): string => {
  if (score <= 4.9) return 'Easy (4th grade)';
  if (score <= 5.9) return '5th-6th grade';
  if (score <= 6.9) return '7th-8th grade';
  if (score <= 7.9) return '9th-10th grade';
  if (score <= 8.9) return '11th-12th grade';
  if (score <= 9.9) return 'College student';
  return 'College graduate';
};

const getDaleChallColorClass = (score: number): string => {
  if (score <= 5.9) return 'bg-green-100 text-green-800';
  if (score <= 7.9) return 'bg-blue-100 text-blue-800';
  if (score <= 8.9) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getDifficultWordsColorClass = (count: number): string => {
  if (count <= 5) return 'bg-green-100 text-green-800';
  if (count <= 10) return 'bg-blue-100 text-blue-800';
  if (count <= 20) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export default ResultsDisplay;