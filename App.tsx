import React, { useState } from 'react';
import { GameState } from './types';
import { OrderingGame } from './components/OrderingGame';
import { ClinicalQuiz } from './components/ClinicalQuiz';
import { VisualQuiz } from './components/VisualQuiz';
import { Reference } from './components/Reference';
import { Brain, Activity, BookOpen, Play, Eye, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);

  const renderContent = () => {
    switch (gameState) {
      case GameState.ORDERING:
        return <OrderingGame onBack={() => setGameState(GameState.MENU)} />;
      case GameState.CLINICAL:
        return <ClinicalQuiz onBack={() => setGameState(GameState.MENU)} />;
      case GameState.VISUAL:
        return <VisualQuiz onBack={() => setGameState(GameState.MENU)} />;
      case GameState.REFERENCE:
        return <Reference onBack={() => setGameState(GameState.MENU)} />;
      default:
        return (
          <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-block p-4 bg-surface rounded-full mb-6 border border-primary/30 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
                <Brain className="w-16 h-16 text-primary animate-pulse-slow" />
              </div>
              <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight neon-text">
                Neuro<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">Master</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Domine os 12 Nervos Cranianos.
                <span className="block mt-2 text-fuchsia-300/80 text-sm font-light tracking-widest uppercase">Memória • Diagnóstico • Visualização</span>
              </p>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              
              {/* Card 1: Speed Run */}
              <button
                onClick={() => setGameState(GameState.ORDERING)}
                className="group relative bg-surface p-6 rounded-2xl border border-white/10 hover:border-fuchsia-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] text-left flex flex-col"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                   <Play className="w-24 h-24 text-fuchsia-500" />
                </div>
                <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-fuchsia-500 transition-colors">
                  <Activity className="w-6 h-6 text-fuchsia-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">Ordenação Rápida</h3>
                <p className="text-slate-400 text-sm">
                  Corra contra o relógio para identificar os nervos na ordem correta de I a XII.
                </p>
              </button>

              {/* Card 2: AI Clinical */}
              <button
                onClick={() => setGameState(GameState.CLINICAL)}
                className="group relative bg-surface p-6 rounded-2xl border border-white/10 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] text-left flex flex-col"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                   <Brain className="w-24 h-24 text-purple-500" />
                </div>
                <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                  <Brain className="w-6 h-6 text-purple-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Desafio Clínico AI</h3>
                <p className="text-slate-400 text-sm">
                  Diagnostique casos clínicos gerados por Inteligência Artificial em tempo real.
                </p>
                <span className="absolute bottom-4 right-4 bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">
                  Gemini AI
                </span>
              </button>

              {/* Card 3: Visual Challenge */}
              <button
                onClick={() => setGameState(GameState.VISUAL)}
                className="group relative bg-surface p-6 rounded-2xl border border-white/10 hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] text-left flex flex-col"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                   <Eye className="w-24 h-24 text-pink-500" />
                </div>
                <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors">
                  <Eye className="w-6 h-6 text-pink-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">Desafio Visual AI</h3>
                <p className="text-slate-400 text-sm">
                  Identifique o nervo correto através de ilustrações anatômicas geradas por IA.
                </p>
                <span className="absolute bottom-4 right-4 bg-pink-500/20 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded border border-pink-500/30">
                  Gemini Image
                </span>
              </button>

              {/* Card 4: Reference */}
              <button
                onClick={() => setGameState(GameState.REFERENCE)}
                className="group relative bg-surface p-6 rounded-2xl border border-white/10 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] text-left flex flex-col"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                   <BookOpen className="w-24 h-24 text-cyan-500" />
                </div>
                <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500 transition-colors">
                  <BookOpen className="w-6 h-6 text-cyan-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Referência</h3>
                <p className="text-slate-400 text-sm">
                  Estude as funções, classificações e detalhes de cada um dos 12 nervos.
                </p>
              </button>

            </div>

            <footer className="mt-20 text-slate-600 text-sm flex flex-col items-center">
              <span className="mb-2">© {new Date().getFullYear()} NeuroMaster</span>
              <div className="flex items-center gap-1 text-xs text-fuchsia-500/50">
                 Feito com <Heart className="w-3 h-3 text-fuchsia-500 animate-pulse" /> por você
              </div>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-slate-100 selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <nav className="bg-surface/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => setGameState(GameState.MENU)}>
              <Brain className="w-8 h-8 text-fuchsia-500 mr-2 group-hover:animate-spin" />
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-fuchsia-400 transition">NeuroMaster</span>
            </div>
            <div className="text-sm text-slate-400 hidden md:block border border-white/10 px-3 py-1 rounded-full bg-white/5">
              Estudo Interativo de Anatomia
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-8 pb-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;