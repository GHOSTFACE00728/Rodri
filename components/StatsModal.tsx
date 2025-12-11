import React from 'react';
import { X, TrendingUp, Trophy } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: number[];
  best: number;
  unit: string;
  color: string; // e.g., 'text-fuchsia-500'
  lowerIsBetter?: boolean;
}

export const StatsModal: React.FC<StatsModalProps> = ({ 
  isOpen, onClose, title, data, best, unit, color, lowerIsBetter = false 
}) => {
  if (!isOpen) return null;

  // Graph Logic
  const width = 500;
  const height = 200;
  const padding = 20;
  
  const safeData = data.length > 0 ? data : [0];
  const maxVal = Math.max(...safeData) * 1.1 || 10;
  const minVal = lowerIsBetter ? Math.max(0, Math.min(...safeData) * 0.9) : 0;
  const range = maxVal - minVal;

  const points = safeData.map((val, index) => {
    const x = (index / (Math.max(1, safeData.length - 1))) * (width - 2 * padding) + padding;
    // Invert Y for SVG (0 is top)
    const normalizedVal = (val - minVal) / (range || 1);
    const y = height - (normalizedVal * (height - 2 * padding) + padding);
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = color.includes('fuchsia') ? '#d946ef' : 
                      color.includes('purple') ? '#a855f7' : '#ec4899';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e1b2e] border border-white/10 w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative animate-pop">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-6 h-6 ${color}`} />
            <h3 className="text-xl font-bold text-white">Sua Evolução</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-6">
             <div>
               <p className="text-slate-400 text-sm uppercase tracking-wider">{title}</p>
               <p className="text-3xl font-bold text-white mt-1">{safeData[safeData.length - 1]} <span className="text-base font-normal opacity-50">{unit}</span></p>
               <p className="text-xs text-slate-500 mt-1">Última tentativa</p>
             </div>
             <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-yellow-400 mb-1">
                   <Trophy className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase">Recorde Pessoal</span>
                </div>
                <p className={`text-2xl font-bold ${color}`}>{best} <span className="text-sm font-normal text-white opacity-50">{unit}</span></p>
             </div>
          </div>

          {/* Graph Container */}
          <div className="relative h-48 bg-black/20 rounded-lg border border-white/5 overflow-hidden">
             {data.length < 2 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                   Jogue mais vezes para gerar o gráfico
                </div>
             ) : (
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                   {/* Gradient Defs */}
                   <defs>
                      <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                         <stop offset="0%" stopColor={strokeColor} stopOpacity="0.5" />
                         <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                      </linearGradient>
                   </defs>
                   
                   {/* Area under curve */}
                   <path 
                      d={`M ${padding},${height} L ${points.split(' ')[0]} ${points.replace(/,/g, ' ').split(' ').slice(1).join(' ')} L ${width - padding},${height} Z`} 
                      fill="url(#gradient)" 
                   />

                   {/* Line */}
                   <polyline 
                      fill="none" 
                      stroke={strokeColor} 
                      strokeWidth="3" 
                      points={points} 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                   />
                   
                   {/* Dots */}
                   {points.split(' ').map((point, i) => {
                      const [cx, cy] = point.split(',');
                      return (
                         <circle 
                            key={i} 
                            cx={cx} 
                            cy={cy} 
                            r="4" 
                            fill="#1e1b2e" 
                            stroke={strokeColor} 
                            strokeWidth="2"
                         />
                      );
                   })}
                </svg>
             )}
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">Histórico das últimas 20 partidas</p>
        </div>
      </div>
    </div>
  );
};