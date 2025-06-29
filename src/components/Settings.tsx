import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, Palette, Type, Eye, Download, Bell } from 'lucide-react';

interface SettingsConfig {
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  
  // Analysis
  autoAnalyze: boolean;
  analysisDelay: number;
  showAdvancedMetrics: boolean;
  defaultSampleText: string;
  
  // Word Cloud
  wordCloudMaxWords: number;
  wordCloudMinFreq: number;
  wordCloudColors: string;
  excludeStopWords: boolean;
  
  // Export
  exportFormat: 'json' | 'csv' | 'txt';
  includeStatistics: boolean;
  
  // Notifications
  showNotifications: boolean;
  notifyOnComplete: boolean;
}

const defaultSettings: SettingsConfig = {
  theme: 'light',
  fontSize: 'medium',
  colorScheme: 'blue',
  autoAnalyze: true,
  analysisDelay: 500,
  showAdvancedMetrics: true,
  defaultSampleText: '',
  wordCloudMaxWords: 50,
  wordCloudMinFreq: 3,
  wordCloudColors: 'category10',
  excludeStopWords: true,
  exportFormat: 'json',
  includeStatistics: true,
  showNotifications: true,
  notifyOnComplete: false
};

interface SettingsProps {
  onSettingsChange: (settings: SettingsConfig) => void;
  currentSettings?: SettingsConfig;
}

const Settings: React.FC<SettingsProps> = ({ onSettingsChange, currentSettings }) => {
  const [settings, setSettings] = useState<SettingsConfig>(currentSettings || defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<'appearance' | 'analysis' | 'wordcloud' | 'export' | 'notifications'>('appearance');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('readability-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key: keyof SettingsConfig, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('readability-settings', JSON.stringify(settings));
    onSettingsChange(settings);
    setHasChanges(false);
    
    if (settings.showNotifications) {
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all';
      notification.textContent = 'Configurações salvas com sucesso!';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'readability-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
          setHasChanges(true);
        } catch (error) {
          alert('Erro ao importar configurações. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const sections = [
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'analysis', label: 'Análise', icon: SettingsIcon },
    { id: 'wordcloud', label: 'Nuvem de Palavras', icon: Eye },
    { id: 'export', label: 'Exportação', icon: Download },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Restaurar Padrões
              </button>
              <button
                onClick={saveSettings}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition-colors ${
                  hasChanges 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                <Save className="h-4 w-4" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4">
              <ul className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Configurações de Aparência</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tema
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanho da Fonte
                    </label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="small">Pequena</option>
                      <option value="medium">Média</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Esquema de Cores
                    </label>
                    <select
                      value={settings.colorScheme}
                      onChange={(e) => handleSettingChange('colorScheme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="blue">Azul</option>
                      <option value="green">Verde</option>
                      <option value="purple">Roxo</option>
                      <option value="orange">Laranja</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'analysis' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Configurações de Análise</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Análise Automática
                      </label>
                      <p className="text-xs text-gray-500">
                        Analisa o texto automaticamente enquanto você digita
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoAnalyze}
                        onChange={(e) => handleSettingChange('autoAnalyze', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atraso da Análise (ms)
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={settings.analysisDelay}
                      onChange={(e) => handleSettingChange('analysisDelay', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>100ms</span>
                      <span>{settings.analysisDelay}ms</span>
                      <span>2000ms</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Mostrar Métricas Avançadas
                      </label>
                      <p className="text-xs text-gray-500">
                        Exibe métricas adicionais de legibilidade
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showAdvancedMetrics}
                        onChange={(e) => handleSettingChange('showAdvancedMetrics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto de Exemplo Padrão
                    </label>
                    <textarea
                      value={settings.defaultSampleText}
                      onChange={(e) => handleSettingChange('defaultSampleText', e.target.value)}
                      placeholder="Digite um texto que será usado como exemplo padrão..."
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'wordcloud' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Configurações da Nuvem de Palavras</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Máximo de Palavras
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={settings.wordCloudMaxWords}
                      onChange={(e) => handleSettingChange('wordCloudMaxWords', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência Mínima
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.wordCloudMinFreq}
                      onChange={(e) => handleSettingChange('wordCloudMinFreq', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paleta de Cores
                    </label>
                    <select
                      value={settings.wordCloudColors}
                      onChange={(e) => handleSettingChange('wordCloudColors', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="category10">Categoria 10</option>
                      <option value="category20">Categoria 20</option>
                      <option value="blues">Azuis</option>
                      <option value="greens">Verdes</option>
                      <option value="warm">Cores Quentes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Excluir Stop Words
                      </label>
                      <p className="text-xs text-gray-500">
                        Remove palavras comuns como "o", "a", "de", etc.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.excludeStopWords}
                        onChange={(e) => handleSettingChange('excludeStopWords', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'export' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Configurações de Exportação</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato de Exportação
                    </label>
                    <select
                      value={settings.exportFormat}
                      onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="txt">Texto</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Incluir Estatísticas
                      </label>
                      <p className="text-xs text-gray-500">
                        Inclui estatísticas detalhadas na exportação
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.includeStatistics}
                        onChange={(e) => handleSettingChange('includeStatistics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">Backup das Configurações</h4>
                  <div className="flex gap-4">
                    <button
                      onClick={exportSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Exportar Configurações
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                      <Type className="h-4 w-4" />
                      Importar Configurações
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Configurações de Notificações</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Mostrar Notificações
                      </label>
                      <p className="text-xs text-gray-500">
                        Exibe notificações do sistema
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showNotifications}
                        onChange={(e) => handleSettingChange('showNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Notificar ao Completar Análise
                      </label>
                      <p className="text-xs text-gray-500">
                        Mostra notificação quando a análise for concluída
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifyOnComplete}
                        onChange={(e) => handleSettingChange('notifyOnComplete', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;