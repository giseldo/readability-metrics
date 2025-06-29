import React from 'react';
import { BookOpen, Settings as SettingsIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'analyzer' | 'settings') => void;
  currentPage: 'analyzer' | 'settings';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">Analisador de Legibilidade</h1>
        </div>
        <nav>
          <ul className="flex gap-4">
            <li>
              <button
                onClick={() => onNavigate('analyzer')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPage === 'analyzer'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Analisador
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('settings')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  currentPage === 'settings'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <SettingsIcon className="h-4 w-4" />
                Configurações
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;