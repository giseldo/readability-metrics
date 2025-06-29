import React from 'react';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
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
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Recursos
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;