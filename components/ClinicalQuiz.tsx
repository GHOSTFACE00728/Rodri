import React, { useState, useEffect } from 'react';
import { generateClinicalScenario } from '../services/geminiService';
import { CRANIAL_NERVES } from '../constants';
import { CranialNerve } from '../types';
import { Stethoscope, Check, X, Loader2, Heart, Trophy, BarChart3 } from 'lucide-react';
import { playSuccess, playError } from '../services/audioService';
import { saveGameResult, getBestScore, getHistory } from '../services/statsService';
import { StatsModal } from './StatsModal';

export const ClinicalQuiz: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<string | null>(null);
  const [targetNerveId, setTargetNerveId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<CranialNerve[]>([]);
  
  // Stats
  const [showStats, setShowStats] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    setBestScore(getBestScore('CLINICAL'));
  }, []);

  const handleExit = () => {
    if (score > 0) {
      saveGameResult('CLINICAL', score);
    }
    onBack();
  };

  const loadNewScenario = async () => {
    setLoading(true);
    setAnswered(false);
    setSelectedId(null);
    setScenario(null);

    try {
      const data = await generateClinicalScenario();
      setScenario(data.scenario);
      setTargetNerveId(data.nerveId);

      // Create options: Correct answer + 3 random distractors
      const correct = CRANIAL_NERVES.find(n => n.id === data.nerveId)!;
      const others = CRANIAL_NERVES.filter(n => n.id !== data.nerveId)
                                   .sort(() => Math.random() - 0.5)
                                   .slice(0, 3);
      
      const choices = [correct, ...others].sort(() => Math.random() - 0.5);
      setOptions(choices);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewScenario();
  }, []);

  const handleSelect = (id: number) => {
    if (answered) return;
    setSelectedId(id);
    setAnswered(true);
    if (id === targetNerveId) {
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
        data={getHistory('CLINICAL')}
        best={bestScore}
        unit="pts"
        color="text-purple-400"
      />

      <div className="flex justify-between items-center mb-6">
        <button onClick={handleExit} className="text-slate-400 hover:text-purple-400 transition">
          &larr; Sair e Salvar
        </button>
        
        <div className="flex items-center gap-4">
           <button 
            onClick={() => setShowStats(true)}
            className="flex items-center gap-2 bg-surface hover:bg-white/10 px-4 py-1 rounded-lg border border-white/10 text-slate-300 transition-all group"
          >
             <Trophy className="w-4 h-4 text-yellow-400" />
             <span className="text-sm font-bold">Recorde: {bestScore}</span>
             <BarChart3 className="w-4 h-4 text-purple-500 opacity-50 group-hover:opacity-100" />
          </button>
          
          <div className="bg-purple-900/30 border border-purple-500/50 text-purple-300 px-4 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            Pontuação: {score}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-xl overflow-hidden border border-white/10 min-h-[400px] flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-8 h-8 animate-pulse text-purple-200" />
            <h2 className="text-2xl font-bold text-white neon-text">Diagnóstico Clínico AI</h2>
          </div>
          <p className="text-purple-200">Identifique o nervo afetado com base nos sintomas do paciente.</p>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col justify-center relative">
          {loading ? (
            <div className="flex flex-col items-center text-slate-500">
              <div className="relative mb-4">
                 <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-25"></div>
                 <Loader2 className="relative w-12 h-12 animate-spin text-purple-500" />
              </div>
              <p className="animate-pulse text-purple-400">Consultando banco de dados clínico (Gemini AI)...</p>
            </div>
          ) : (
            <>
              <div className="mb-8 animate-fade-in">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Relato do Caso</h3>
                <div className="bg-black/20 p-6 rounded-xl border border-white/5 text-lg text-slate-200 font-medium leading-relaxed shadow-inner">
                  "{scenario}"
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((nerve) => {
                  let btnClass = "border-2 border-white/5 bg-white/5 hover:border-purple-500 hover:bg-white/10";
                  let icon = null;
                  
                  if (answered) {
                    if (nerve.id === targetNerveId) {
                      btnClass = "bg-green-900/30 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)] transform scale-[1.02]"; // Correct
                      icon = <Check className="w-6 h-6 text-green-400" />;
                    } else if (nerve.id === selectedId) {
                      btnClass = "bg-red-900/30 border-red-500 text-red-300 animate-shake"; // Wrong selected
                      icon = <X className="w-6 h-6 text-red-400" />;
                    } else {
                      btnClass = "opacity-30 border-white/5 grayscale"; // Others
                    }
                  } else if (selectedId === nerve.id) {
                     btnClass = "border-purple-500 bg-purple-900/20";
                  }

                  return (
                    <button
                      key={nerve.id}
                      onClick={() => handleSelect(nerve.id)}
                      disabled={answered}
                      className={`p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between group ${btnClass}`}
                    >
                      <div>
                        <span className="font-bold block text-lg text-white group-hover:text-purple-300 transition-colors">{nerve.roman} - {nerve.name}</span>
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
                   {selectedId === targetNerveId && (
                      <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3 text-pink-300 text-sm italic flex items-center gap-2">
                         <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                         "Te amo muito viu, assinado Rodrigo, o amor da sua vida"
                      </div>
                   )}
                  
                  <button
                    onClick={loadNewScenario}
                    className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 shadow-[0_0_20px_rgba(147,51,234,0.4)] transform hover:-translate-y-1 transition-all flex items-center gap-2 ml-auto"
                  >
                    Próximo Caso <span className="text-xl">&rarr;</span>
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