
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  isDarkMode?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isDarkMode }) => {
  const isUser = message.role === 'user';

  const formatContent = (text: string) => {
    const youtubeMatch = text.match(/\[YOUTUBE:\s*(.*?)\]/);
    const certMatch = text.match(/\[CERTIFICATE:\s*(.*?),\s*(.*?)\]/);
    
    let cleanText = text
      .replace(/\[YOUTUBE:\s*.*?\]/g, '')
      .replace(/\[CERTIFICATE:\s*.*?\]/g, '')
      .replace(/[#*]/g, '')
      .trim();
    
    return (
      <div className="space-y-4">
        <p className="whitespace-pre-wrap leading-relaxed tracking-tight">{cleanText}</p>
        
        {youtubeMatch && (
          <div className={`mt-5 p-6 rounded-[2rem] border flex items-center space-x-5 group cursor-pointer overflow-hidden transition-all shadow-sm ${isDarkMode ? 'bg-red-900/20 border-red-900/30 hover:bg-red-900/30' : 'bg-red-50 border-red-100 hover:bg-red-100'}`}>
            <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div className="flex-1">
              <p className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${isDarkMode ? 'text-red-400/80' : 'text-red-400'}`}>DARSLIK VIDEOSI</p>
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeMatch[1])}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-xs font-black block truncate leading-none uppercase ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}
              >
                KO'RISH: {youtubeMatch[1]}
              </a>
            </div>
          </div>
        )}

        {certMatch && (
          <div className="mt-8 p-1 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-[3rem] shadow-2xl animate-in zoom-in duration-700 overflow-hidden">
            <div className={`rounded-[2.8rem] p-6 md:p-10 text-center border-4 border-white/50 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="mb-6 relative">
                 <div className="text-5xl md:text-6xl mb-4">📜</div>
                 <h2 className="text-amber-600 font-black text-xl md:text-2xl tracking-tighter uppercase">SERTIFIKAT</h2>
              </div>
              <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2">Ushbu hujjat tasdiqlaydiki,</p>
              <h3 className={`text-xl md:text-2xl font-black mb-2 border-b-2 pb-2 inline-block px-4 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-800 border-slate-100'}`}>{certMatch[1]}</h3>
              <p className={`text-xs md:text-sm font-bold mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="text-indigo-400">MAHALLA TA’LIM AI</span> platformasida <br/>
                <span className={`uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{certMatch[2]}</span> <br/>
                kursini 30 dars davomida muvaffaqiyatli tamomladi.
              </p>
              <div className="flex justify-between items-end mt-10">
                <div className="text-left">
                  <p className="text-[7px] md:text-[8px] text-slate-400 font-black uppercase">Platforma rahbari:</p>
                  <p className={`text-[9px] md:text-[10px] font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>D. Abdujabborov</p>
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full border-2 border-amber-500/30 flex items-center justify-center opacity-50">
                   <div className="text-[6px] md:text-[8px] font-black text-amber-600 rotate-12">TASDIQLANGAN</div>
                </div>
                <div className="text-right">
                  <p className="text-[7px] md:text-[8px] text-slate-400 font-black uppercase">Sana:</p>
                  <p className={`text-[9px] md:text-[10px] font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex w-full mb-6 md:mb-8 ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] lg:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-9 w-9 md:h-12 md:w-12 rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center shadow-xl ${isUser ? 'bg-indigo-600 ml-2 md:ml-4' : (isDarkMode ? 'bg-slate-800 border border-slate-700 mr-2 md:mr-4' : 'bg-white border border-slate-100 mr-2 md:mr-4')}`}>
          {isUser ? (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          ) : (
            <span className="text-xl md:text-2xl">🎓</span>
          )}
        </div>
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative rounded-[1.5rem] md:rounded-[2.5rem] px-5 md:px-7 py-4 md:py-6 shadow-sm text-xs md:text-base ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none font-bold' 
              : (isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none font-black' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-black shadow-indigo-100/30')
          }`}>
            {message.image && (
              <img src={message.image} alt="Tasvir" className="rounded-2xl md:rounded-3xl mb-4 md:mb-5 max-w-full border-2 md:border-4 border-white/10 shadow-2xl" />
            )}
            <div className="tracking-tight leading-relaxed">
              {formatContent(message.content)}
            </div>
          </div>
          <span className="text-[8px] md:text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest opacity-60 px-2 md:px-4">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
