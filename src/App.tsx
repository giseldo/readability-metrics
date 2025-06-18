import React from 'react';
import { BookOpen } from 'lucide-react';
import TextAnalyzer from './components/TextAnalyzer';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <TextAnalyzer />
      </main>
      <Footer />
    </div>
  );
}

export default App;