import React, { useState, useEffect, useCallback } from 'react';
import { CRANIAL_NERVES } from '../constants';
import { CranialNerve } from '../types';
import { RotateCcw, Trophy, Heart, BarChart3 } from 'lucide-react';
import { playSuccess, playError, playWin } from '../services/audioService';
import { saveGameResult, getBestScore, getHistory } from '../services/statsService';
import { StatsModal } from './StatsModal';

export const OrderingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [shuffledNerves, setShuffledNerves] = useState<CranialNerve[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [errorId, setErrorId] = useState<number | null>(null);
  
  // Stats State
  const [showStats, setShowStats] = useState(false);
  const [bestTime, setBestTime] = useState(0);

  useEffect(() => {
    setBestTime(getBestScore('ORDERING'));
  }, []);

  const startGame = useCallback(() => {
    const shuffled = [...CRANIAL_NERVES].sort(() => Math.random() - 0.5);
    setShuffledNerves(shuffled);
    setCurrentStep(1);
    setGameWon(false);
    setTimer(0);
    setIsActive(true);
    setErrorId(null);
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    let interval: any;
    if (isActive && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, gameWon]);

  const handleCardClick = (nerveId: number) => {
    if (gameWon) return;

    if (nerveId === currentStep) {
      if (currentStep === 12) {
        setGameWon(true);
        setIsActive(false);
        playWin();
        
        // Save score logic
        const finalTime = timer / 10;
        saveGameResult('ORDERING', finalTime);
        setBestTime(getBestScore('ORDERING')); // Update local best display
      } else {
        playSuccess();
        setCurrentStep(prev => prev + 1);
      }
    } else {
      playError();
      setErrorId(nerveId);
      setTimeout(() => setErrorId(null), 500);
    }
  };

  const formatTime = (t: number) => (t / 10).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <StatsModal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        title="Tempo de Conclusão"
        data={getHistory('ORDERING')}
        best={bestTime}
        unit="s"
        color="text-fuchsia-400"
        lowerIsBetter={true}
      />

      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-fuchsia-400 transition">
          &larr; Voltar ao Menu
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowStats(true)}
            className="flex items-center gap-2 bg-surface hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-slate-300 transition-all group"
          >
             <Trophy className="w-4 h-4 text-yellow-400" />
             <span className="text-sm font-bold">Recorde: {bestTime > 0 ? `${bestTime}s` : '--'}</span>
             <BarChart3 className="w-4 h-4 text-fuchsia-500 opacity-50 group-hover:opacity-100" />
          </button>

          <div className="bg-surface px-4 py-2 rounded-lg border border-fuchsia-500/30 text-xl font-bold text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.2)]">
            Tempo: {formatTime(timer)}s
          </div>
        </div>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-4xl font-extrabold mb-2 neon-text text-white">Ordene os Nervos</h2>
        <p className="text-slate-400">Selecione os nervos na ordem anatômica correta (I &rarr; XII).</p>
      </div>

      {gameWon ? (
        <div className="text-center py-12 bg-surface rounded-2xl shadow-[0_0_40px_rgba(217,70,239,0.15)] border border-fuchsia-500/40 animate-pop relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-block p-4 rounded-full bg-yellow-500/20 mb-4 border border-yellow-500/50">
               <Trophy className="w-20 h-20 text-yellow-400 animate-bounce" />
            </div>
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2">Excelente!</h2>
            <p className="text-xl text-slate-300 mb-8">
              Você completou a sequência em <span className="font-bold text-fuchsia-400 text-2xl">{formatTime(timer)}s</span>.
            </p>

            {/* Special Message */}
            <div className="mb-10 p-6 bg-black/20 backdrop-blur-sm rounded-xl inline-block border-l-4 border-fuchsia-500 max-w-lg mx-auto">
              <p className="text-lg font-medium text-pink-200 italic flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500 animate-pulse" />
                "Te amo muito viu, assinado Rodrigo, o amor da sua vida"
                <Heart className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500 animate-pulse" />
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowStats(true)}
                className="inline-flex items-center px-6 py-4 bg-surface text-white font-bold rounded-full hover:bg-white/10 transition border border-white/10"
              >
                <BarChart3 className="w-5 h-5 mr-2" /> Ver Evolução
              </button>
              <button 
                onClick={startGame}
                className="inline-flex items-center px-8 py-4 bg-fuchsia-600 text-white font-bold rounded-full hover:bg-fuchsia-700 transition shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] transform hover:-translate-y-1"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Jogar Novamente
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shuffledNerves.map((nerve) => {
            const isCompleted = nerve.id < currentStep;
            const isHidden = isCompleted; 
            const isError = errorId === nerve.id;
            
            if (isHidden) return <div key={nerve.id} className="h-32 opacity-0 pointer-events-none transition-opacity duration-300"></div>;

            return (
              <button
                key={nerve.id}
                onClick={() => handleCardClick(nerve.id)}
                className={`
                  relative h-32 rounded-xl p-4 flex flex-col items-center justify-center gap-2
                  transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
                  border 
                  ${isError 
                    ? 'animate-shake bg-red-900/50 border-red-500 text-red-200' 
                    : 'bg-surface border-white/10 hover:border-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                  }
                `}
              >
                <span className="text-lg font-bold text-white text-center leading-tight">
                  {nerve.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold border ${
                    nerve.functionType === 'Motor' ? 'bg-red-900/30 text-red-300 border-red-500/30' :
                    nerve.functionType === 'Sensorial' ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' :
                    'bg-purple-900/30 text-purple-300 border-purple-500/30'
                }`}>
                  {nerve.functionType}
                </span>
                <span className="text-xs text-center text-slate-400 mt-1 italic">
                  {nerve.keyFunction}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};