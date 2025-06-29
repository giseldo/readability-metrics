import React from 'react';
import { ReadabilityMetrics } from '../types/readability';
import MetricCard from './MetricCard';
import MetricExplanation from './MetricExplanation';

interface ResultsDisplayProps {
  metrics: ReadabilityMetrics;
  showAdvanced?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ metrics, showAdvanced = true }) => {
  const basicMetrics = [
    {
      title: "Gunning Fog Index",
      value: metrics.gunningFog,
      interpretation: getGunningFogInterpretation(metrics.gunningFog),
      colorClass: getGunningFogColorClass(metrics.gunningFog)
    },
    {
      title: "Flesch Reading Ease",
      value: metrics.fleschReadingEase,
      interpretation: getFleschReadingEaseInterpretation(metrics.fleschReadingEase),
      colorClass: getFleschReadingEaseColorClass(metrics.fleschReadingEase),
      higherIsBetter: true
    },
    {
      title: "Flesch-Kincaid Grade",
      value: metrics.fleschKincaidGrade,
      interpretation: `Grade ${metrics.fleschKincaidGrade.toFixed(1)} level`,
      colorClass: getGradeColorClass(metrics.fleschKincaidGrade)
    }
  ];

  const advancedMetrics = [
    {
      title: "SMOG Index",
      value: metrics.smogIndex,
      interpretation: `Grade ${metrics.smogIndex.toFixed(1)} level`,
      colorClass: getGradeColorClass(metrics.smogIndex)
    },
    {
      title: "Coleman-Liau Index",
      value: metrics.colemanLiauIndex,
      interpretation: `Grade ${metrics.colemanLiauIndex.toFixed(1)} level`,
      colorClass: getGradeColorClass(metrics.colemanLiauIndex)
    },
    {
      title: "Automated Readability Index",
      value: metrics.automatedReadabilityIndex,
      interpretation: `Grade ${metrics.automatedReadabilityIndex.toFixed(1)} level`,
      colorClass: getGradeColorClass(metrics.automatedReadabilityIndex)
    },
    {
      title: "Dale-Chall Score",
      value: metrics.daleChallReadabilityScore,
      interpretation: getDaleChallInterpretation(metrics.daleChallReadabilityScore),
      colorClass: getDaleChallColorClass(metrics.daleChallReadabilityScore)
    },
    {
      title: "Linsear Write Formula",
      value: metrics.linsearWriteFormula,
      interpretation: `Grade ${metrics.linsearWriteFormula.toFixed(1)} level`,
      colorClass: getGradeColorClass(metrics.linsearWriteFormula)
    },
    {
      title: "Difficult Words",
      value: metrics.difficultWords,
      interpretation: `${metrics.difficultWords} complex words found`,
      colorClass: getDifficultWordsColorClass(metrics.difficultWords),
      isCount: true
    }
  ];

  const metricsToShow = showAdvanced ? [...basicMetrics, ...advancedMetrics] : basicMetrics;

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados da Legibilidade</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metricsToShow.map((metric, index) => (
          <MetricCard 
            key={index}
            title={metric.title}
            value={metric.value}
            interpretation={metric.interpretation}
            colorClass={metric.colorClass}
            higherIsBetter={metric.higherIsBetter}
            isCount={metric.isCount}
          />
        ))}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-semibold text-gray-700 mb-2">Estatísticas do Texto</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Palavras</p>
            <p className="text-xl font-medium">{metrics.wordCount}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Frases</p>
            <p className="text-xl font-medium">{metrics.sentenceCount}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Palavras por Frase</p>
            <p className="text-xl font-medium">{(metrics.wordCount / metrics.sentenceCount).toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Sílabas</p>
            <p className="text-xl font-medium">{metrics.syllableCount}</p>
          </div>
        </div>
      </div>
      
      {showAdvanced && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Entendendo as Métricas de Legibilidade</h3>
          <div className="space-y-4">
            <MetricExplanation 
              title="Gunning Fog Index" 
              description="Estima os anos de educação formal necessários para entender o texto na primeira leitura. Uma pontuação de 12 requer nível de ensino médio. Pontuações ideais: 7-8 para ficção popular, 10-11 para textos acadêmicos, 15-20 para artigos científicos."
            />
            <MetricExplanation 
              title="Flesch Reading Ease" 
              description="Pontuações mais altas indicam texto mais fácil de ler. 90-100: Muito fácil (5ª série). 80-89: Fácil (6ª série). 70-79: Razoavelmente fácil (7ª série). 60-69: Padrão (8ª-9ª série). 50-59: Razoavelmente difícil (ensino médio). 30-49: Difícil (faculdade). Abaixo de 30: Muito confuso."
            />
            <MetricExplanation 
              title="Flesch-Kincaid Grade Level" 
              description="Traduz para um nível de série brasileiro. Uma pontuação de 8,0 significa que o texto é compreensível por um aluno da 8ª série. Recomendado para público geral: 7-8."
            />
            <MetricExplanation 
              title="SMOG Index" 
              description="Prevê o nível de série necessário para entender o texto. Frequentemente usado para materiais de saúde, com pontuação recomendada de nível da 6ª série para informações de saúde pública."
            />
            <MetricExplanation 
              title="Coleman-Liau Index" 
              description="Usa caracteres em vez de sílabas, fornecendo o nível de série aproximado necessário para compreender o texto."
            />
            <MetricExplanation 
              title="Automated Readability Index" 
              description="Como o Coleman-Liau, baseia-se na contagem de caracteres em vez de sílabas. Fornece o nível de série aproximado necessário para entender o texto."
            />
            <MetricExplanation 
              title="Dale-Chall Readability Score" 
              description="Baseado em uma lista de 3.000 palavras que 80% dos alunos da 4ª série entendem. Pontuações: 4,9 ou menor: facilmente entendido pela 4ª série. 5,0-5,9: 5ª-6ª série. 6,0-6,9: 7ª-8ª série. 7,0-7,9: 9ª-10ª série. 8,0-8,9: ensino médio. 9,0-9,9: estudante universitário. 10+: graduado universitário."
            />
            <MetricExplanation 
              title="Linsear Write Formula" 
              description="Desenvolvida para calcular a legibilidade de manuais técnicos. A pontuação corresponde aproximadamente a um nível de série."
            />
            <MetricExplanation 
              title="Difficult Words" 
              description="Contagem de palavras não encontradas na lista Dale-Chall de 3.000 palavras familiares. Essas palavras podem ser mais difíceis para os leitores entenderem."
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for interpretations and color classes
const getGunningFogInterpretation = (score: number): string => {
  if (score < 8) return 'Leitura fácil';
  if (score < 12) return 'Leitura confortável';
  if (score < 17) return 'Leitura difícil';
  return 'Muito difícil';
};

const getGunningFogColorClass = (score: number): string => {
  if (score < 8) return 'bg-green-100 text-green-800';
  if (score < 12) return 'bg-blue-100 text-blue-800';
  if (score < 17) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getFleschReadingEaseInterpretation = (score: number): string => {
  if (score >= 90) return 'Muito fácil';
  if (score >= 80) return 'Fácil';
  if (score >= 70) return 'Razoavelmente fácil';
  if (score >= 60) return 'Padrão';
  if (score >= 50) return 'Razoavelmente difícil';
  if (score >= 30) return 'Difícil';
  return 'Muito confuso';
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
  if (score <= 4.9) return 'Fácil (4ª série)';
  if (score <= 5.9) return '5ª-6ª série';
  if (score <= 6.9) return '7ª-8ª série';
  if (score <= 7.9) return '9ª-10ª série';
  if (score <= 8.9) return 'Ensino médio';
  if (score <= 9.9) return 'Universitário';
  return 'Pós-graduação';
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