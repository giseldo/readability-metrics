import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  interpretation: string;
  colorClass: string;
  higherIsBetter?: boolean;
  isCount?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  interpretation, 
  colorClass,
  higherIsBetter = false,
  isCount = false
}) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
        <p className="text-2xl font-bold">{isCount ? value : value.toFixed(1)}</p>
        <div className={`mt-2 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full ${colorClass}`}>
          {interpretation}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressBarColor(colorClass)}`}
              style={{ 
                width: `${getProgressBarWidth(value, title, higherIsBetter, isCount)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get progress bar color based on metric color class
const getProgressBarColor = (colorClass: string): string => {
  if (colorClass.includes('green')) return 'bg-green-500';
  if (colorClass.includes('blue')) return 'bg-blue-500';
  if (colorClass.includes('yellow')) return 'bg-yellow-500';
  if (colorClass.includes('red')) return 'bg-red-500';
  return 'bg-gray-500';
};

// Helper function to calculate progress bar width based on metric type
const getProgressBarWidth = (
  value: number, 
  metricType: string, 
  higherIsBetter: boolean,
  isCount: boolean
): number => {
  if (isCount) {
    // For difficult words count
    return Math.min(100, (value / 30) * 100);
  }
  
  if (metricType === 'Flesch Reading Ease') {
    // Higher is better, scale is 0-100
    return value;
  }
  
  if (metricType === 'Dale-Chall Score') {
    // Scale typically from 4-10
    return Math.min(100, ((value - 4) / 6) * 100);
  }
  
  // For grade-level metrics (Gunning Fog, Flesch-Kincaid, etc.)
  // Most are on a scale where lower is easier, from about 0-20
  // Invert if higher is better
  const basePercentage = Math.min(100, (value / 20) * 100);
  return higherIsBetter ? 100 - basePercentage : basePercentage;
};

export default MetricCard;