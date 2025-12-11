import React, { useState, useEffect } from 'react';
import { generateNerveIllustration } from '../services/geminiService';
import { CRANIAL_NERVES } from '../constants';
import { CranialNerve } from '../types';
import { Eye, Check, X, Loader2, Image as ImageIcon, Heart, Trophy, BarChart3 } from 'lucide-react';
import { playSuccess, playError } from '../services/audioService';
import { saveGameResult, getBestScore, getHistory } from '../services/statsService';
import { StatsModal } from './StatsModal';

export const VisualQuiz: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [targetNerve, setTargetNerve] = useState<CranialNerve | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<CranialNerve[]>([]);
  
  // Stats
  const [showStats, setShowStats] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    setBestScore(getBestScore('VISUAL'));
  }, []);

  const handleExit = () => {
    if (score > 0) {
      saveGameResult('VISUAL', score);
    }
    onBack();
  };
  
  const loadNewRound = async () => {
    setLoading(true);
    setAnswered(false);
    setSelectedId(null);
    setImageUrl(null);
    setTargetNerve(null);

    try {
      const correct = CRANIAL_NERVES[Math.floor(Math.random() * CRANIAL_NERVES.length)];
      setTargetNerve(correct);

      const others = CRANIAL_NERVES.filter(n => n.id !== correct.id)
                                   .sort(() => Math.random() - 0.5)
                                   .slice(0, 3);
      
      const choices = [correct, ...others].sort(() => Math.random() - 0.5);
      setOptions(choices);

      const generatedImage = await generateNerveIllustration(correct);
      setImageUrl(generatedImage);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewRound();
  }, []);

  const handleSelect = (id: number) => {
    if (answered) return;
    setSelectedId(id);
    setAnswered(true);
    if (id === targetNerve?.id) {
      setScore(s => s + 1);
      playSuccess();
    } else {
      playError();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <StatsModal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        title="Acertos por Sessão"
        data={getHistory('VISUAL')}
        best={bestScore}
        unit="pts"
        color="text-pink-400"
      />

      <div className="flex justify-between items-center mb-6">
        <button onClick={handleExit} className="text-slate-400 hover:text-pink-400 transition">
          &larr; Sair e Salvar
        </button>

        <div className="flex items-center gap-4">
           <button 
            onClick={() => setShowStats(true)}
            className="flex items-center gap-2 bg-surface hover:bg-white/10 px-4 py-1 rounded-lg border border-white/10 text-slate-300 transition-all group"
          >
             <Trophy className="w-4 h-4 text-yellow-400" />
             <span className="text-sm font-bold">Recorde: {bestScore}</span>
             <BarChart3 className="w-4 h-4 text-pink-500 opacity-50 group-hover:opacity-100" />
          </button>
          
          <div className="bg-pink-900/30 border border-pink-500/50 text-pink-300 px-4 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(236,72,153,0.3)]">
            Pontuação: {score}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-xl overflow-hidden border border-white/10 min-h-[500px] flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-8 h-8 animate-pulse text-pink-200" />
            <h2 className="text-2xl font-bold neon-text">Desafio Visual AI</h2>
          </div>
          <p className="text-pink-200">Identifique o nervo baseado na ilustração anatômica gerada.</p>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center text-slate-500 py-12">
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-25"></div>
                 <Loader2 className="relative w-16 h-16 animate-spin text-pink-500" />
              </div>
              <p className="font-medium text-lg text-pink-400">Gerando ilustração anatômica exclusiva...</p>
              <p className="text-sm opacity-50 mt-2 text-slate-400">Isso pode levar alguns segundos (Gemini AI)</p>
            </div>
          ) : (
            <>
              {/* Image Container */}
              <div className="w-full max-w-lg aspect-square bg-white rounded-xl border-4 border-slate-800 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden mb-8 relative group">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Ilustração do Nervo" 
                    className="w-full h-full object-contain p-2 transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span>Imagem indisponível</span>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {options.map((nerve) => {
                  let btnClass = "border-2 border-white/5 bg-white/5 hover:border-pink-500 hover:bg-white/10";
                  let icon = null;
                  
                  if (answered) {
                    if (nerve.id === targetNerve?.id) {
                      btnClass = "bg-green-900/30 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)] transform scale-[1.02]"; // Correct
                      icon = <Check className="w-6 h-6 text-green-400" />;
                    } else if (nerve.id === selectedId) {
                      btnClass = "bg-red-900/30 border-red-500 text-red-300 animate-shake"; // Wrong selected
                      icon = <X className="w-6 h-6 text-red-400" />;
                    } else {
                      btnClass = "opacity-30 border-white/5 grayscale"; // Others
                    }
                  } else if (selectedId === nerve.id) {
                     btnClass = "border-pink-500 bg-pink-900/20";
                  }

                  return (
                    <button
                      key={nerve.id}
                      onClick={() => handleSelect(nerve.id)}
                      disabled={answered}
                      className={`p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between group ${btnClass}`}
                    >
                      <div>
                        <span className="font-bold block text-lg text-white group-hover:text-pink-300 transition-colors">{nerve.roman} - {nerve.name}</span>
                        <span className="text-sm opacity-60 text-slate-300">{nerve.functionType}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between w-full animate-pop gap-4">
                  {/* Romantic Message on Correct Answer */}
                   {selectedId === targetNerve?.id && (
                      <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg p-3 text-fuchsia-300 text-sm italic flex items-center gap-2">
                         <Heart className="w-4 h-4 fill-fuchsia-500 text-fuchsia-500" />
                         "Te amo muito viu, assinado Rodrigo, o amor da sua vida"
                      </div>
                   )}

                  <button
                    onClick={loadNewRound}
                    className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-700 shadow-[0_0_20px_rgba(236,72,153,0.4)] transform hover:-translate-y-1 transition-all flex items-center gap-2 ml-auto"
                  >
                    Próxima Imagem <span className="text-xl">&rarr;</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};