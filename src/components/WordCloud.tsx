import React, { useEffect, useRef, useState } from 'react';
import cloud from 'd3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { RefreshCw, Download } from 'lucide-react';

interface WordCloudProps {
  text: string;
}

interface WordData {
  text: string;
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ text }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [words, setWords] = useState<WordData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [minWords, setMinWords] = useState(3);
  const [maxWords, setMaxWords] = useState(50);

  const colorScale = scaleOrdinal(schemeCategory10);

  const generateWordFrequency = (inputText: string): WordData[] => {
    // Clean and split text into words
    const cleanText = inputText
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanText.split(' ').filter(word => word.length > 2);
    
    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Filter out common stop words
    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
    ]);

    // Convert to array and filter
    const wordArray = Object.entries(wordCount)
      .filter(([word, count]) => !stopWords.has(word) && count >= minWords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxWords)
      .map(([word, count]) => ({
        text: word,
        size: Math.max(12, Math.min(60, count * 8))
      }));

    return wordArray;
  };

  const generateWordCloud = () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    const wordData = generateWordFrequency(text);

    if (wordData.length === 0) {
      setWords([]);
      setIsGenerating(false);
      return;
    }

    const layout = cloud()
      .size([600, 400])
      .words(wordData)
      .padding(5)
      .rotate(() => (Math.random() - 0.5) * 60)
      .font('Inter, system-ui, sans-serif')
      .fontSize(d => d.size)
      .on('end', (words: WordData[]) => {
        setWords(words);
        setIsGenerating(false);
      });

    layout.start();
  };

  const downloadWordCloud = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 400;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'word-cloud.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  useEffect(() => {
    if (text.trim()) {
      generateWordCloud();
    }
  }, [text, minWords, maxWords]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Nuvem de Palavras</h3>
          <div className="flex gap-2">
            <button
              onClick={generateWordCloud}
              disabled={isGenerating || !text.trim()}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Gerando...' : 'Atualizar'}
            </button>
            {words.length > 0 && (
              <button
                onClick={downloadWordCloud}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="min-words" className="text-sm font-medium text-gray-700">
              Freq. Mínima:
            </label>
            <input
              id="min-words"
              type="number"
              min="1"
              max="10"
              value={minWords}
              onChange={(e) => setMinWords(parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="max-words" className="text-sm font-medium text-gray-700">
              Máx. Palavras:
            </label>
            <input
              id="max-words"
              type="number"
              min="10"
              max="100"
              value={maxWords}
              onChange={(e) => setMaxWords(parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {isGenerating ? (
              <div className="flex items-center justify-center w-[600px] h-[400px]">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Gerando nuvem de palavras...</p>
                </div>
              </div>
            ) : words.length > 0 ? (
              <svg
                ref={svgRef}
                width="600"
                height="400"
                className="bg-white"
              >
                <g transform="translate(300,200)">
                  {words.map((word, index) => (
                    <text
                      key={index}
                      x={word.x}
                      y={word.y}
                      fontSize={word.size}
                      fill={colorScale(index.toString())}
                      textAnchor="middle"
                      transform={`rotate(${word.rotate || 0}, ${word.x}, ${word.y})`}
                      className="font-medium cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {word.text}
                    </text>
                  ))}
                </g>
              </svg>
            ) : (
              <div className="flex items-center justify-center w-[600px] h-[400px]">
                <div className="text-center text-gray-500">
                  <p className="mb-2">Nenhuma palavra encontrada</p>
                  <p className="text-sm">Tente diminuir a frequência mínima ou adicionar mais texto</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {words.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> As palavras maiores aparecem com mais frequência no texto. 
              Você pode ajustar a frequência mínima e o número máximo de palavras para personalizar a visualização.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCloud;