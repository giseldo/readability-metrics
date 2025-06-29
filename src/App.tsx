import React, { useState } from 'react';
import TextAnalyzer from './components/TextAnalyzer';
import Settings from './components/Settings';
import Header from './components/Header';
import Footer from './components/Footer';

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

function App() {
  const [currentPage, setCurrentPage] = useState<'analyzer' | 'settings'>('analyzer');
  const [settings, setSettings] = useState<SettingsConfig | null>(null);

  const handleSettingsChange = (newSettings: SettingsConfig) => {
    setSettings(newSettings);
    
    // Apply theme changes
    const root = document.documentElement;
    if (newSettings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply font size changes
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (newSettings.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }
    
    // Apply color scheme
    root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange');
    root.classList.add(`theme-${newSettings.colorScheme}`);
  };

  const getThemeClasses = () => {
    if (!settings) return 'bg-gradient-to-br from-slate-50 to-slate-100';
    
    const colorSchemes = {
      blue: 'bg-gradient-to-br from-blue-50 to-slate-100',
      green: 'bg-gradient-to-br from-green-50 to-slate-100',
      purple: 'bg-gradient-to-br from-purple-50 to-slate-100',
      orange: 'bg-gradient-to-br from-orange-50 to-slate-100'
    };
    
    return colorSchemes[settings.colorScheme] || colorSchemes.blue;
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} flex flex-col`}>
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {currentPage === 'analyzer' ? (
          <TextAnalyzer settings={settings} />
        ) : (
          <Settings 
            onSettingsChange={handleSettingsChange}
            currentSettings={settings || undefined}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;