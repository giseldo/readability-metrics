import React, { useState, useEffect } from 'react';
import { Calculator, Copy, RotateCcw, Cloud } from 'lucide-react';
import { calculateReadabilityMetrics } from '../utils/readabilityCalculator';
import ResultsDisplay from './ResultsDisplay';
import WordCloud from './WordCloud';
import { ReadabilityMetrics } from '../types/readability';

interface SettingsConfig {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  autoAnalyze: boolean;
  analysisDelay: number;
  showAdvancedMetrics: boolean;
  defaultSampleText: string;
  wordCloudMaxWords: number;
  wordCloudMinFreq: number;
  wordCloudColors: string;
  excludeStopWords: boolean;
  exportFormat: 'json' | 'csv' | 'txt';
  includeStatistics: boolean;
  showNotifications: boolean;
  notifyOnComplete: boolean;
}

interface TextAnalyzerProps {
  settings?: SettingsConfig | null;
}

const defaultSampleText = 
`The quick brown fox jumps over the lazy dog. This is a simple sentence to demonstrate text analysis. 
Readability metrics help writers understand how easy or difficult their text is to read. 
They consider factors like sentence length, word complexity, and syllable count. 
By analyzing these elements, authors can adjust their writing to better reach their target audience.`;

const TextAnalyzer: React.FC<TextAnalyzerProps> = ({ settings }) => {
  const [text, setText] = useState(settings?.defaultSampleText || defaultSampleText);
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<Array<{text: string, metrics: ReadabilityMetrics}>>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'wordcloud'>('metrics');

  useEffect(() => {
    if (text.trim()) {
      if (settings?.autoAnalyze) {
        const timeoutId = setTimeout(() => {
          analyzeText();
        }, settings.analysisDelay || 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [text, settings?.autoAnalyze, settings?.analysisDelay]);

  useEffect(() => {
    if (text.trim() && !settings?.autoAnalyze) {
      analyzeText();
    }
  }, []);

  const analyzeText = () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const results = calculateReadabilityMetrics(text);
      setMetrics(results);
      
      // Add to history if not already there
      const existingEntry = history.find(entry => entry.text === text);
      if (!existingEntry) {
        setHistory(prev => [...prev, { text, metrics: results }].slice(-5)); // Keep last 5
      }
      
      setIsAnalyzing(false);
      
      // Show completion notification if enabled
      if (settings?.notifyOnComplete && settings?.showNotifications) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all';
        notification.textContent = 'Análise concluída!';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    }, 600);
  };

  const handleClear = () => {
    setText('');
    setMetrics(null);
  };

  const handleCopy = () => {
    if (!metrics) return;
    
    const format = settings?.exportFormat || 'json';
    let resultsText = '';
    
    if (format === 'json') {
      const exportData = {
        text: text.substring(0, 100) + '...',
        metrics,
        timestamp: new Date().toISOString(),
        ...(settings?.includeStatistics && {
          statistics: {
            avgWordsPerSentence: metrics.wordCount / metrics.sentenceCount,
            avgSyllablesPerWord: metrics.syllableCount / metrics.wordCount,
            complexWordPercentage: (metrics.difficultWords / metrics.wordCount) * 100
          }
        })
      };
      resultsText = JSON.stringify(exportData, null, 2);
    } else if (format === 'csv') {
      resultsText = [
        'Metric,Value',
        `Gunning Fog,${metrics.gunningFog.toFixed(1)}`,
        `Flesch Reading Ease,${metrics.fleschReadingEase.toFixed(1)}`,
        `Flesch-Kincaid Grade,${metrics.fleschKincaidGrade.toFixed(1)}`,
        `SMOG Index,${metrics.smogIndex.toFixed(1)}`,
        `Coleman-Liau Index,${metrics.colemanLiauIndex.toFixed(1)}`,
        `Automated Readability Index,${metrics.automatedReadabilityIndex.toFixed(1)}`,
        `Dale-Chall Score,${metrics.daleChallReadabilityScore.toFixed(1)}`,
        `Linsear Write Formula,${metrics.linsearWriteFormula.toFixed(1)}`,
        `Difficult Words,${metrics.difficultWords}`,
        `Word Count,${metrics.wordCount}`,
        `Sentence Count,${metrics.sentenceCount}`,
        `Syllable Count,${metrics.syllableCount}`
      ].join('\n');
    } else {
      resultsText = [
        `Resultados da Análise de Legibilidade:`,
        `- Gunning Fog: ${metrics.gunningFog.toFixed(1)} (${getReadabilityLevel(metrics.gunningFog)})`,
        `- Flesch Reading Ease: ${metrics.fleschReadingEase.toFixed(1)} (${getFleschReadingEaseLevel(metrics.fleschReadingEase)})`,
        `- Flesch-Kincaid Grade: ${metrics.fleschKincaidGrade.toFixed(1)}`,
        `- SMOG Index: ${metrics.smogIndex.toFixed(1)}`,
        `- Coleman-Liau Index: ${metrics.colemanLiauIndex.toFixed(1)}`,
        `- Automated Readability Index: ${metrics.automatedReadabilityIndex.toFixed(1)}`,
        `- Dale-Chall Score: ${metrics.daleChallReadabilityScore.toFixed(1)}`,
        `- Linsear Write Formula: ${metrics.linsearWriteFormula.toFixed(1)}`,
        `- Difficult Words: ${metrics.difficultWords}`,
        `\nAnalisado por Analisador de Legibilidade`
      ].join('\n');
    }
    
    navigator.clipboard.writeText(resultsText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const getReadabilityLevel = (score: number): string => {
    if (score < 8) return 'Fácil';
    if (score < 12) return 'Médio';
    if (score < 17) return 'Difícil';
    return 'Muito Difícil';
  };
  
  const getFleschReadingEaseLevel = (score: number): string => {
    if (score >= 90) return 'Muito Fácil';
    if (score >= 80) return 'Fácil';
    if (score >= 70) return 'Razoavelmente Fácil';
    if (score >= 60) return 'Padrão';
    if (score >= 50) return 'Razoavelmente Difícil';
    if (score >= 30) return 'Difícil';
    return 'Muito Confuso';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analisador de Legibilidade de Texto</h2>
          
          <div className="mb-6">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Digite ou cole seu texto
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Digite seu texto aqui para analisar sua legibilidade..."
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {!settings?.autoAnalyze && (
              <button
                onClick={analyzeText}
                disabled={!text.trim() || isAnalyzing}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
                  !text.trim() || isAnalyzing 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                <Calculator className="h-4 w-4" />
                {isAnalyzing ? 'Analisando...' : 'Analisar Texto'}
              </button>
            )}
            
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Limpar
            </button>
            
            {metrics && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors ml-auto"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copiado!' : `Copiar (${settings?.exportFormat?.toUpperCase() || 'JSON'})`}
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          {text.trim() && (
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'metrics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Métricas de Legibilidade
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('wordcloud')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'wordcloud'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4" />
                      Nuvem de Palavras
                    </div>
                  </button>
                </nav>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'metrics' && metrics && (
            <ResultsDisplay 
              metrics={metrics} 
              showAdvanced={settings?.showAdvancedMetrics !== false}
            />
          )}
          {activeTab === 'wordcloud' && text.trim() && (
            <WordCloud 
              text={text} 
              maxWords={settings?.wordCloudMaxWords || 50}
              minFreq={settings?.wordCloudMinFreq || 3}
              colorScheme={settings?.wordCloudColors || 'category10'}
              excludeStopWords={settings?.excludeStopWords !== false}
            />
          )}
        </div>
      </div>
      
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Análises Recentes</h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {history.map((entry, index) => (
                <li 
                  key={index} 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setText(entry.text)}
                >
                  <p className="text-sm text-gray-600 line-clamp-1">{entry.text}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Gunning Fog: {entry.metrics.gunningFog.toFixed(1)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Flesch: {entry.metrics.fleschReadingEase.toFixed(1)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      Nível: {entry.metrics.fleschKincaidGrade.toFixed(1)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;