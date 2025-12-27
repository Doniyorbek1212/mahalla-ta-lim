
import React, { useState } from 'react';
import { SUPPORT_INFO } from '../constants';

interface SupportModalProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose, isDarkMode }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SUPPORT_INFO.card);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className={`rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
            <span className="text-3xl md:text-4xl">💎</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 uppercase tracking-tight">Hissa qo‘shing</h2>
          <p className="text-indigo-100 text-[11px] md:text-sm leading-relaxed font-medium">
            Bilimli avlod kamoloti yo‘lidagi loyihamizni qo‘llab-quvvatlashingiz mumkin.
          </p>
        </div>
        
        <div className="p-6 md:p-8">
          <div className={`border rounded-2xl p-5 md:p-6 mb-6 relative overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <svg className="w-20 h-20 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.61-.26-3.15-1.07-4.11-2.29l1.45-1.45c.7.83 1.83 1.41 2.66 1.55v-2.92c-1.74-.47-4.48-1.16-4.48-3.95 0-1.89 1.41-3.3 3.4-3.66V4h2.82v1.9c1.38.21 2.58.83 3.39 1.84l-1.45 1.45c-.48-.65-1.23-1.07-1.94-1.2v2.73c1.94.55 4.48 1.34 4.48 4.07 0 1.94-1.41 3.44-3.4 3.9z"/></svg>
            </div>
            <div className={`flex justify-between items-center mb-4 border-b pb-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{SUPPORT_INFO.bank}</span>
              <span className="text-[10px] font-black text-indigo-400">O‘ZBEKISTON</span>
            </div>
            
            <div className="flex flex-col mb-4">
              <span className="text-[10px] text-slate-400 mb-1 font-black uppercase">Karta raqami:</span>
              <div className={`flex items-center justify-between p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                <span className={`text-sm md:text-lg font-mono font-bold tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {SUPPORT_INFO.formattedCard}
                </span>
                <button 
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-all group ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-indigo-50'}`}
                >
                  {copied ? (
                    <span className="text-[9px] font-black text-emerald-500 uppercase">OK!</span>
                  ) : (
                    <svg className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 mb-1 font-black uppercase">Qabul qiluvchi:</span>
              <span className={`text-xs md:text-sm font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{SUPPORT_INFO.owner}</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] uppercase text-[10px] tracking-widest ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            Tushunarli, davom etamiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
