
import React from 'react';
import { COLLABORATION } from '../constants';

interface CollaborationModalProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({ onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className={`rounded-[2rem] md:rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="bg-indigo-600 p-8 text-center text-white">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Hamkorlik</h2>
          <p className="text-indigo-100 text-[10px] md:text-xs mt-2 font-medium">Biz bilan bog'laning va loyihani rivojlantiring</p>
        </div>
        
        <div className="p-6 md:p-8 space-y-4">
          <a href={`tel:${COLLABORATION.phone}`} className={`flex items-center p-4 rounded-2xl border transition-all group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-slate-50 border-slate-100 hover:border-indigo-500'}`}>
            <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center mr-4 transition-all ${isDarkMode ? 'bg-slate-700 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-white text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-black uppercase">Telefon</p>
              <p className={`text-xs md:text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{COLLABORATION.phone}</p>
            </div>
          </a>

          <a href={COLLABORATION.telegramUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center p-4 rounded-2xl border transition-all group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-sky-500' : 'bg-slate-50 border-slate-100 hover:border-sky-500'}`}>
            <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center mr-4 transition-all ${isDarkMode ? 'bg-slate-700 text-sky-400 group-hover:bg-sky-500 group-hover:text-white' : 'bg-white text-sky-500 group-hover:bg-sky-500 group-hover:text-white'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.88.03-.24.37-.48 1.02-.73 4-.1.73 7.5-3.53 13.17-1.1-2.34-.83-4.47-.52-5.41-.03-.1-.08-.18-.16-.23-.08-.05-.18-.07-.27-.07-.13.01-.26.07-.35.17-.09.1-.14.22-.13.35.13.81.48 2.33 1.03 3.91.55 1.58 1.51 3.19 2.87 4.1.6.4 1.27.6 1.95.6.84 0 1.63-.31 2.21-.86 1.08-1.02 1.64-2.5 1.63-4.14 0-1.64-.56-3.12-1.63-4.14-.58-.55-1.37-.86-2.21-.86z"/></svg>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-black uppercase">Telegram</p>
              <p className={`text-xs md:text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{COLLABORATION.telegram}</p>
            </div>
          </a>

          <button onClick={onClose} className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors">Yopish</button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationModal;
