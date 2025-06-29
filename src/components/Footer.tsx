import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Analisador de Legibilidade. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Termos de Serviço
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;