import React from 'react';
import { CRANIAL_NERVES } from '../constants';

export const Reference: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
       <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition">
          &larr; Voltar
        </button>
        <h2 className="text-3xl font-bold text-white neon-text">Referência Anatômica</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CRANIAL_NERVES.map((nerve) => (
            <div key={nerve.id} className="bg-surface p-6 rounded-xl border border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition duration-300">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">
                        <span className="text-cyan-400 mr-2">{nerve.roman}</span>
                        {nerve.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase border ${
                        nerve.functionType === 'Motor' ? 'bg-red-900/20 text-red-300 border-red-500/30' :
                        nerve.functionType === 'Sensorial' ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' :
                        'bg-purple-900/20 text-purple-300 border-purple-500/30'
                    }`}>
                        {nerve.functionType}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mb-3 leading-relaxed">{nerve.description}</p>
                <div className="text-xs font-semibold text-cyan-300/80 bg-cyan-900/10 p-2 rounded border border-cyan-500/20 inline-block">
                    Principal: {nerve.keyFunction}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};